import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  // Load cart khi vào trang
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

  // Tổng tiền
  const subtotal = cart.reduce(
  (sum, item) => sum + (Number(item.price) || 0) * (Number(item.qty) || 1),
  0
);

  // Nút thanh toán
  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Giỏ hàng đang trống!");
      return;
    }
    navigate("/checkout");
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white py-2 px-10 mt-4 text-sm">
        <span>Trang Chủ</span> &gt;{" "}
        <span className="text-yellow-600">Giỏ hàng</span>
      </div>

      <div className="container mx-auto mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6 px-10 pb-20">
        {/* ---------- LEFT SIDE ---------- */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Sản phẩm</h2>

          {cart.length === 0 ? (
            <p className="text-gray-500">Giỏ hàng của bạn đang trống.</p>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b py-4"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div>
                    <Link
                      to={`/product/${item.id}`}
                      className="text-yellow-700 font-medium hover:underline"
                    >
                      {item.name}
                    </Link>
                    <p className="text-gray-500 text-sm">{item.brand}</p>
                    <p className="text-gray-500 text-sm">{item.color}</p>
                    <button
                      className="text-red-500 text-sm mt-1 hover:underline"
                      onClick={() => removeItem(item.id)}
                    >
                      Xóa
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-semibold">
                    {item.price.toLocaleString()} ₫
                  </p>

                  <div className="flex items-center mt-2">
                    <button
                      className="px-3 border"
                      onClick={() => updateQty(item.id, "decrease")}
                    >
                      -
                    </button>

                    <input
                      type="text"
                      value={item.qty}
                      className="w-10 text-center border-t border-b"
                      readOnly
                    />

                    <button
                      className="px-3 border"
                      onClick={() => updateQty(item.id, "increase")}
                    >
                      +
                    </button>
                  </div>

                  <p className="font-semibold mt-2 text-yellow-700">
                    {(item.price * item.qty).toLocaleString()} ₫
                  </p>
                </div>
              </div>
            ))
          )}

          <div className="flex justify-between mt-6">
            <Link
              to="/"
              className="bg-transparent border border-yellow-600 text-yellow-600 px-4 py-2 rounded hover:bg-yellow-600 hover:text-white"
            >
              ← Tiếp tục xem sản phẩm
            </Link>

            <button
              className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
              onClick={() =>
                localStorage.setItem("cart", JSON.stringify(cart))
              }
            >
              Cập nhật giỏ hàng
            </button>
          </div>
        </div>

        {/* ---------- RIGHT SIDE ---------- */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Tổng cộng giỏ hàng</h2>

          <div className="flex justify-between border-b pb-2">
            <span>Tạm tính</span>
            <span className="font-medium">
              {subtotal.toLocaleString()} ₫
            </span>
          </div>

          <div className="flex justify-between border-b py-2">
            <span>Vận chuyển</span>
            <span className="text-gray-500 text-sm">
              Miễn phí vận chuyển <br />
              <em>(Tính phí nếu có)</em>
            </span>
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

          <div className="mt-6">
            <h3 className="font-semibold mb-2">Mã ưu đãi</h3>
            <div className="flex">
              <input
                type="text"
                placeholder="Nhập mã giảm giá"
                className="border p-2 rounded-l w-full outline-none"
              />
              <button className="bg-gray-800 text-white px-4 rounded-r hover:bg-yellow-700">
                Áp dụng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
