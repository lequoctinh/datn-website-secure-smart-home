// server/controllers/orderController.js
const pool = require("../config/db");
const crypto = require("crypto");

/**
 * Helper: Tạo mã đơn hàng duy nhất
 * Format: DH + YYMMDD + Random
 */
function generateOrderCode() {
  const date = new Date();
  const y = String(date.getFullYear()).slice(-2);
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const rand = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `DH${y}${m}${d}${rand}`; 
}

// 1. TẠO ĐƠN HÀNG (POST /api/orders/create)
exports.createOrder = async (req, res) => {
  const {
    user_id = null,
    dia_chi_id = null,
    items = [],
    shipping_fee = 0,
    discount = 0
  } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Giỏ hàng rỗng" });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Tính tổng tiền hàng
    let totalItems = 0;
    for (const it of items) {
      const qty = parseInt(it.quantity) || 0;
      const price = parseFloat(it.unit_price) || 0;
      totalItems += qty * price;
    }

    // Tổng tiền thanh toán
    const ship = parseFloat(shipping_fee) || 0;
    const disc = parseFloat(discount) || 0;
    const grandTotal = parseFloat((totalItems + ship - disc).toFixed(2));

    // Tạo mã đơn
    const ma_don = generateOrderCode();

    // INSERT vào bảng 'don_hang'
    // Trạng thái mặc định: "dang_xu_ly"
    const insertOrderSql = `
      INSERT INTO don_hang (ma_don, nguoi_dung_id, dia_chi_id, tong_tien, giam_gia, trang_thai, ngay_tao, ngay_cap_nhat)
      VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;

    const [orderResult] = await conn.query(insertOrderSql, [
      ma_don,
      user_id,
      dia_chi_id,
      grandTotal,
      disc,
      "dang_xu_ly" 
    ]);
    const donHangId = orderResult.insertId;

    // INSERT vào bảng 'don_hang_chi_tiet'
    const insertItemSql = `
      INSERT INTO don_hang_chi_tiet (don_hang_id, bien_the_id, so_luong, don_gia, ngay_tao, ngay_cap_nhat)
      VALUES (?, ?, ?, ?, NOW(), NOW())
    `;

    for (const it of items) {
      const qty = parseInt(it.quantity) || 0;
      const price = parseFloat(it.unit_price) || 0;
      const bienTheId = it.product_id; 

      await conn.query(insertItemSql, [
        donHangId,
        bienTheId,
        qty,
        price
      ]);
    }

    await conn.commit();

    res.status(201).json({
      ok: true,
      message: "Tạo đơn hàng thành công",
      order: {
        id: donHangId,
        ma_don: ma_don,
        tong_tien: grandTotal,
        trang_thai: "dang_xu_ly"
      }
    });

  } catch (err) {
    await conn.rollback();
    console.error("createOrder error:", err);
    res.status(500).json({ message: "Lỗi tạo đơn hàng", error: err.message });
  } finally {
    conn.release();
  }
};

// 2. LẤY DANH SÁCH ĐƠN HÀNG CỦA TÔI (GET /api/orders/my-orders)
exports.getMyOrders = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ ok: false, message: "Chưa đăng nhập" });
    const userId = req.user.id;

    const [orders] = await pool.query(
      `SELECT id, ma_don, ngay_tao, trang_thai, tong_tien 
       FROM don_hang 
       WHERE nguoi_dung_id = ? 
       ORDER BY id DESC`,
      [userId]
    );

    if (orders.length === 0) {
      return res.json({ ok: true, data: [] });
    }

    // Lấy chi tiết sản phẩm để hiển thị ảnh
    const fullOrders = await Promise.all(orders.map(async (order) => {
      const [items] = await pool.query(
        `SELECT 
            dhct.so_luong, 
            dhct.don_gia, 
            bt.ten_bien_the,
            sp.ten_san_pham,
            -- Cột đúng: duong_dan_anh
            (SELECT duong_dan_anh FROM hinh_anh_san_pham ha WHERE ha.san_pham_id = sp.id LIMIT 1) as hinh_anh
         FROM don_hang_chi_tiet dhct
         JOIN bien_the bt ON dhct.bien_the_id = bt.id
         JOIN san_pham sp ON bt.san_pham_id = sp.id
         WHERE dhct.don_hang_id = ?`,
        [order.id]
      );

      return {
        id: order.id,
        order_code: order.ma_don,
        date: order.ngay_tao,
        status: order.trang_thai,
        total: order.tong_tien,
        items: items.map(item => ({
          name: item.ten_san_pham,
          variant: item.ten_bien_the,
          price: item.don_gia,
          quantity: item.so_luong,
          // Nếu database lưu đường dẫn tương đối, cần thêm domain
          // Nếu lưu full url (http...) thì để nguyên. 
          // Ở đây giả sử bạn lưu đường dẫn tương đối (vd: /uploads/...)
          image: item.hinh_anh ? `http://localhost:5000${item.hinh_anh}` : "https://via.placeholder.com/150"
        }))
      };
    }));

    res.json({ ok: true, data: fullOrders });
  } catch (err) {
    console.error("getMyOrders error:", err);
    res.status(500).json({ ok: false, message: "Lỗi server" });
  }
};

// 3. LẤY LỊCH SỬ ĐƠN HÀNG THEO USER ID (GET /api/orders/user/:userId)
exports.getOrdersByUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    const [orders] = await pool.query(
      `SELECT id, ma_don, ngay_tao, trang_thai, tong_tien 
       FROM don_hang 
       WHERE nguoi_dung_id = ? 
       ORDER BY id DESC`,
      [userId]
    );
    res.json(orders);
  } catch (err) {
    console.error("getOrdersByUser:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// 4. CHI TIẾT ĐƠN HÀNG (GET /api/orders/:id)
exports.getOrderById = async (req, res) => {
  const orderId = req.params.id;

  try {
    const [[order]] = await pool.query(
      `SELECT * FROM don_hang WHERE id = ?`,
      [orderId]
    );

    if (!order) {
      return res.status(404).json({ ok: false, message: "Không tìm thấy đơn hàng" });
    }

    const [items] = await pool.query(
      `SELECT 
          dhct.*,
          bt.ten_bien_the,
          sp.ten_san_pham,
          -- Cột đúng: duong_dan_anh
          (SELECT duong_dan_anh FROM hinh_anh_san_pham ha WHERE ha.san_pham_id = sp.id LIMIT 1) as hinh_anh
       FROM don_hang_chi_tiet dhct
       JOIN bien_the bt ON dhct.bien_the_id = bt.id
       JOIN san_pham sp ON bt.san_pham_id = sp.id
       WHERE dhct.don_hang_id = ?`,
      [orderId]
    );

    let address = null;
    if (order.dia_chi_id) {
        const [[addr]] = await pool.query(`SELECT * FROM dia_chi WHERE id = ?`, [order.dia_chi_id]);
        address = addr;
    }

    res.json({
      ok: true,
      data: {
        order: {
           ...order,
           order_code: order.ma_don,
           total: order.tong_tien,
           status: order.trang_thai
        },
        items,
        address
      }
    });
  } catch (err) {
    console.error("getOrderById error:", err);
    res.status(500).json({ ok: false, message: "Lỗi server" });
  }
};

// 5. CẬP NHẬT TRẠNG THÁI (PUT /api/orders/:id/status)
exports.updateOrderStatus = async (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body; 
  try {
    const [result] = await pool.query(
        `UPDATE don_hang SET trang_thai = ?, ngay_cap_nhat = NOW() WHERE id = ?`, 
        [status, orderId]
    );
    if (result.affectedRows === 0) return res.status(404).json({ ok: false, message: "Không tìm thấy đơn" });
    res.json({ ok: true, message: "Cập nhật trạng thái thành công" });
  } catch (err) {
    console.error("updateOrderStatus error:", err);
    res.status(500).json({ ok: false, message: "Lỗi server" });
  }
};

// 6. LẤY TẤT CẢ ĐƠN HÀNG - ADMIN (GET /api/admin/orders)
exports.getAllOrders = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT id, ma_don, nguoi_dung_id, tong_tien, giam_gia, trang_thai, ngay_tao
      FROM don_hang
      ORDER BY ngay_tao DESC
    `);
    
    const mappedRows = rows.map(r => ({
        id: r.id,
        order_code: r.ma_don,
        user_id: r.nguoi_dung_id,
        total: r.tong_tien,
        status: r.trang_thai,
        created_at: r.ngay_tao
    }));

    res.json(mappedRows);
  } catch (err) {
    console.error("getAllOrders error:", err);
    res.status(500).json({ ok: false, message: "Lỗi server" });
  }
};

// 7. XÓA ĐƠN HÀNG (DELETE /api/orders/:id)
exports.deleteOrder = async (req, res) => {
  const orderId = req.params.id;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // 1. Kiểm tra đơn có tồn tại không
    const [[order]] = await conn.query("SELECT id FROM don_hang WHERE id = ?", [orderId]);
    if (!order) {
        await conn.release();
        return res.status(404).json({ ok: false, message: "Đơn hàng không tồn tại" });
    }

    // 2. Xóa chi tiết đơn hàng trước
    await conn.query("DELETE FROM don_hang_chi_tiet WHERE don_hang_id = ?", [orderId]);

    // 3. Xóa đơn hàng chính
    await conn.query("DELETE FROM don_hang WHERE id = ?", [orderId]);

    await conn.commit();
    res.json({ ok: true, message: "Đã hủy và xóa đơn hàng thành công" });

  } catch (err) {
    await conn.rollback();
    console.error("deleteOrder error:", err);
    res.status(500).json({ ok: false, message: "Lỗi xóa đơn hàng" });
  } finally {
    conn.release();
  }
};

exports.checkout = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Chưa đăng nhập" });
    }

    const userId = req.user.id;
    const {  quantity, ten_nguoi_nhan, sdt, dia_chi } = req.body;
    const variantId = req.body.variantId ?? req.body.productId;

    if (!variantId || !quantity) {
      return res.status(400).json({ message: "Thiếu variantId hoặc quantity" });
    }

    if (!ten_nguoi_nhan || !sdt || !dia_chi) {
      return res.status(400).json({ message: "Thiếu thông tin người nhận" });
    }

    const [[variant]] = await pool.execute(
      `SELECT gia FROM bien_the WHERE id = ?`,
      [variantId]
    );

    if (!variant) {
      return res.status(400).json({ message: "Biến thể không tồn tại" });
    }

    const total = Number(variant.gia) * Number(quantity);

    const [order] = await pool.execute(
      `INSERT INTO don_hang 
       (nguoi_dung_id, tong_tien, ten_nguoi_nhan, sdt, dia_chi, trang_thai)
       VALUES (?, ?, ?, ?, ?, 'pending')`,
      [
        userId,
        total,
        ten_nguoi_nhan ?? null,
        sdt ?? null,
        dia_chi ?? null
      ]
    );

    await pool.execute(
      `INSERT INTO don_hang_chi_tiet
       (don_hang_id, bien_the_id, so_luong, don_gia)
       VALUES (?, ?, ?, ?)`,
      [order.insertId, variantId, quantity, variant.gia]
    );

    res.json({ ok: true, orderId: order.insertId });
  } catch (err) {
    console.error("CHECKOUT ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

