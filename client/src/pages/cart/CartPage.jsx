import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  // 🔥 Load cart từ DB
  useEffect(() => {
  const savedCart = JSON.parse(localStorage.getItem("cart")) || [];

  const normalized = savedCart.map(item => ({
    ...item,
    price: Number(item.price) || 0,
    qty: Number(item.qty) || 1,
  }));

  setCart(normalized);
}, []);


  // Tăng / giảm số lượng
  const updateQty = (id, type) => {
  const newCart = cart.map((item) => {
    if (item.id === id) {
      let newQty = Number(item.qty);

      if (type === "increase") newQty++;
      if (type === "decrease") newQty = newQty > 1 ? newQty - 1 : 1;

      return { ...item, qty: newQty };
    }
    return item;
  });

  setCart(newCart);
  localStorage.setItem("cart", JSON.stringify(newCart));
};

  // Xóa sp
  const removeItem = (id) => {
    const newCart = cart.filter((item) => item.id !== id);
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  // 🔥 Tính tổng tiền
  const subtotal = cart.reduce(
  (sum, item) => sum + (Number(item.price) || 0) * (Number(item.qty) || 1),
  0
);

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Giỏ hàng đang trống!");
      return;
    }
    navigate("/checkout");
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white py-2 px-10 mt-4 text-sm">
        <span>Trang Chủ</span> &gt;{" "}
        <span className="text-yellow-600">Giỏ hàng</span>
      </div>

      <div className="container mx-auto mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6 px-10 pb-20">
        {/* LEFT */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Sản phẩm</h2>

          {cart.length === 0 ? (
            <p className="text-gray-500">Giỏ hàng của bạn đang trống.</p>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex items-center justify-between border-b py-4">
                <div className="flex items-center gap-3">
                  <img src={item.anh} alt={item.ten} className="w-20 h-20 object-cover rounded" />
                  <div>
                    <p className="font-medium text-yellow-700">{item.ten}</p>
                    <p className="text-xs text-yellow-900">{item.bienthe}</p>
                     <p className="font-semibold">{item.price.toLocaleString()} ₫</p>
                    
                  </div>
                </div>
                <div className="text-center">
                   
                  <div className="flex items-center mt-2">
                    <button className="px-3 border" onClick={() => updateQty(item.id, "decrease")}>
                      -
                    </button>

                    <input
                      type="text"
                      value={item.qty}
                      className="w-10 text-center border-t border-b"
                    />

                    <button className="px-3 border" onClick={() => updateQty(item.id, "increase")}>
                      +
                    </button>
                  </div>
                </div>

                <div className="text-right">

                  <p className="font-semibold mt-2 text-yellow-700">
                    {(item.price * item.qty).toLocaleString()} ₫
                  </p>

                  <button
                      className="w-full mt-6 bg-red-500 text-white py-1.5 rounded hover:bg-red-900 "
                      onClick={() => removeItem(item.id)}
                    >
                      Xóa
                    </button>
                </div>
              </div>
            ))
          )}

          <Link
            to="/"
            className="mt-6 inline-block bg-transparent border border-yellow-600 text-yellow-600 px-4 py-2 rounded hover:bg-yellow-600 hover:text-white"
          >
            ← Tiếp tục xem sản phẩm
          </Link>
        </div>

        {/* RIGHT */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Tổng cộng giỏ hàng</h2>

          <div className="flex justify-between border-b pb-2">
            <span>Tạm tính</span>
            <span className="font-medium">{subtotal.toLocaleString()} ₫</span>
          </div>

          <div className="flex justify-between border-b py-2">
            <span>Vận chuyển</span>
            <span className="text-gray-500 text-sm">Miễn phí vận chuyển</span>
          </div>

          <div className="flex justify-between mt-3">
            <span className="text-lg font-semibold">Tổng</span>
            <span className="text-lg font-semibold text-yellow-600">
              {subtotal.toLocaleString()} ₫
            </span>
          </div>

          <button
            className="w-full mt-6 bg-yellow-600 text-white py-2 rounded hover:bg-yellow-700"
            onClick={handleCheckout}
          >
            Tiến hành thanh toán
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
