import React from "react";

const OrderHistoryPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white py-2 px-10 mt-4 text-sm">
        <span>Trang Chủ</span> &gt; <span className="text-yellow-600">Lịch sử đơn hàng</span>
      </div>

      {/* Main Content */}
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 px-10 pb-20">
        {/* Bảng lịch sử đơn hàng */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Lịch sử đơn hàng</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3">Mã đơn hàng</th>
                <th className="p-3">Ngày đặt</th>
                <th className="p-3">Sản phẩm</th>
                <th className="p-3">Tổng tiền</th>
                <th className="p-3">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-3 font-medium">#DH00123</td>
                <td className="p-3">19/10/2025</td>
                <td className="p-3">Khóa Cửa Vân Tay L770</td>
                <td className="p-3">3.490.000 ₫</td>
                <td className="p-3">
                  <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded">
                    Đang giao
                  </span>
                </td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-medium">#DH00122</td>
                <td className="p-3">16/10/2025</td>
                <td className="p-3">Khóa Thông Minh Ezviz DL08</td>
                <td className="p-3">2.490.000 ₫</td>
                <td className="p-3">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded">
                    Hoàn tất
                  </span>
                </td>
              </tr>
              <tr>
                <td className="p-3 font-medium">#DH00121</td>
                <td className="p-3">16/10/2025</td>
                <td className="p-3">Khóa Vân Tay 2 Màu Ezviz DL08 Pro</td>
                <td className="p-3">4.490.000 ₫</td>
                <td className="p-3">
                  <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded">
                    Đã hủy
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Chi tiết đơn hàng */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Chi tiết đơn hàng</h2>
          <div className="space-y-3 text-sm">
            <p>
              <strong>Mã đơn hàng:</strong> #DH00123
            </p>
            <p>
              <strong>Ngày đặt:</strong> 19/10/2025
            </p>
            <p>
              <strong>Trạng thái:</strong>{" "}
              <span className="text-yellow-600 font-medium">Đang giao</span>
            </p>
            <p>
              <strong>Phương thức thanh toán:</strong> COD
            </p>
            <p>
              <strong>Địa chỉ nhận hàng:</strong> 123 Tô Ký, Q.12, TP. HCM
            </p>
          </div>

          <table className="w-full mt-6 border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3">Sản phẩm</th>
                <th className="p-3">Số lượng</th>
                <th className="p-3">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3">Khóa cửa vân tay L770</td>
                <td className="p-3">1</td>
                <td className="p-3">3.490.000 ₫</td>
              </tr>
            </tbody>
          </table>

          <div className="text-right mt-4 font-semibold">
            Tổng cộng: <span className="text-yellow-600">3.490.000 ₫</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryPage;
