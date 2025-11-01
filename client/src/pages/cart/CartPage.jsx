import React from "react";
import { Link } from "react-router-dom";

const CartPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white py-2 px-10 mt-4 text-sm">
        <span>Trang Chủ</span> &gt; <span className="text-yellow-600">Giỏ hàng</span>
      </div>

      {/* Main Content */}
      <div className="container mx-auto mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6 px-10 pb-20">
        {/* Left */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Sản phẩm</h2>
          <div className="flex items-center justify-between border-b py-4">
            <div className="flex items-center gap-3">
              <img
                src="client/src/assets/images/products/smart-lock-1.jpg"
                alt="product"
                className="w-20 h-20 object-cover rounded"
              />
              <div>
                <Link to="#" className="text-yellow-700 font-medium hover:underline">
                  Khóa Cửa Vân Tay L770
                </Link>
                <p className="text-gray-500 text-sm">Hãng: Ezviz</p>
                <p className="text-gray-500 text-sm">Màu: Đen</p>
              </div>
            </div>

            <div className="text-right">
              <p className="font-semibold">3.490.000 ₫</p>
              <div className="flex items-center mt-2">
                <button className="px-2 border">-</button>
                <input
                  type="text"
                  value="1"
                  className="w-10 text-center border-t border-b"
                  readOnly
                />
                <button className="px-2 border">+</button>
              </div>
              <p className="font-semibold mt-2">3.490.000 ₫</p>
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <Link
              to="/"
              className="bg-transparent border border-yellow-600 text-yellow-600 px-4 py-2 rounded hover:bg-yellow-600 hover:text-white"
            >
              ← Tiếp tục xem sản phẩm
            </Link>
            <button className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">
              Cập nhật giỏ hàng
            </button>
          </div>
        </div>

        {/* Right */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Tổng cộng giỏ hàng</h2>
          <div className="flex justify-between border-b pb-2">
            <span>Tạm tính</span>
            <span className="font-medium">3.490.000 ₫</span>
          </div>
          <div className="flex justify-between border-b py-2">
            <span>Vận chuyển</span>
            <span className="text-gray-500 text-sm">
              Miễn phí vận chuyển<br />
              <em>(Tính phí nếu có)</em>
            </span>
          </div>
          <div className="flex justify-between mt-3">
            <span className="text-lg font-semibold">Tổng</span>
            <span className="text-lg font-semibold text-yellow-600">3.490.000 ₫</span>
          </div>

          <button className="w-full mt-6 bg-yellow-600 text-white py-2 rounded hover:bg-yellow-700">
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
