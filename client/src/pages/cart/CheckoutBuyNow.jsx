import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CheckoutBuyNow() {
  const navigate = useNavigate();

  // ====== STATE ======
  const [item, setItem] = useState(null);
  const [shipping, setShipping] = useState("standard");
  const [payment, setPayment] = useState("cod");

  const [form, setForm] = useState({
    fullname: "",
    phone: "",
    email: "",
    province: "",
    district: "",
    ward: "",
    address_line: "",
    note: "",
  });

  // ====== LOAD BUY NOW DATA ======
  useEffect(() => {
    const data = localStorage.getItem("buy_now");

    if (!data) {
      navigate("/");
      return;
    }

    try {
      setItem(JSON.parse(data));
    } catch {
      localStorage.removeItem("buy_now");
      navigate("/");
    }
  }, [navigate]);

  if (!item) return null;

  // ====== PRICE ======
  const subtotal = item.price * item.quantity;

  const shippingFee =
    shipping === "standard" ? 30000 :
    shipping === "fast" ? 60000 : 0;

  const total = subtotal + shippingFee;

  // ====== CHECKOUT ======
  const handleCheckout = async () => {
    if (!form.fullname || !form.phone || !form.address_line) {
      alert("Vui lòng nhập đầy đủ thông tin giao hàng");
      return;
    }

    const payload = {
      user_id: null,
      payment_method: payment,
      shipping_fee: shippingFee,
      discount: 0,
      note: form.note,
      address: form,
      items: [
        {
          product_id: item.product_id,
          product_name: item.name,
          product_image: item.image,
          unit_price: item.price,
          quantity: item.quantity,
        },
      ],
    };

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE || "http://localhost:5000"}/api/orders/create`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Tạo đơn thất bại");
        return;
      }

      localStorage.removeItem("buy_now");
      alert(`Đặt hàng thành công! Mã đơn: ${data.order.order_code}`);
      navigate("/order-success");
    } catch (err) {
      console.error(err);
      alert("Lỗi kết nối server");
    }
  };

  // ====== UI ======
  return (
    <div className="max-w-6xl mx-auto py-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* SHIPPING INFO */}
      <div className="bg-white p-8 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Thông tin giao hàng</h2>

        <input className="border p-3 w-full mb-3" placeholder="Họ tên"
          onChange={e => setForm({ ...form, fullname: e.target.value })} />

        <input className="border p-3 w-full mb-3" placeholder="SĐT"
          onChange={e => setForm({ ...form, phone: e.target.value })} />

        <input className="border p-3 w-full mb-3" placeholder="Email"
          onChange={e => setForm({ ...form, email: e.target.value })} />

        <input className="border p-3 w-full mb-3" placeholder="Địa chỉ"
          onChange={e => setForm({ ...form, address_line: e.target.value })} />

        <textarea className="border p-3 w-full" placeholder="Ghi chú"
          onChange={e => setForm({ ...form, note: e.target.value })} />
      </div>

      {/* ORDER SUMMARY */}
      <div className="bg-white p-8 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Đơn hàng</h2>

        <div className="flex gap-4 mb-4">
          <img src={item.image} className="w-20 h-20 rounded" />
          <div>
            <p className="font-semibold">{item.name}</p>
            <p>Số lượng: {item.quantity}</p>
            <p>{item.price.toLocaleString()} đ</p>
          </div>
        </div>

        <div className="space-y-2 border-t pt-4">
          <div className="flex justify-between">
            <span>Tạm tính</span>
            <span>{subtotal.toLocaleString()} đ</span>
          </div>
          <div className="flex justify-between">
            <span>Vận chuyển</span>
            <span>{shippingFee.toLocaleString()} đ</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Tổng cộng</span>
            <span>{total.toLocaleString()} đ</span>
          </div>
        </div>

        <button
          onClick={handleCheckout}
          className="mt-6 w-full bg-yellow-600 text-white py-3 rounded hover:bg-yellow-700"
        >
          Đặt hàng
        </button>
      </div>
    </div>
  );
}
