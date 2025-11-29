import React from "react";

const orders = [
  {
    code: "DH251102-100019",
    date: "12:29:00 20/11/2025",
    status: "Hủy",
    statusColor: "bg-red-100 text-red-600",
    payment: "VNPAY",
    total: "19.050.000 đ",
  },
  {
    code: "DH251101-100018",
    date: "11:28:00 19/11/2025",
    status: "Hoàn thành",
    statusColor: "bg-green-100 text-green-600",
    payment: "COD",
    total: "10.150.000 đ",
  },
  {
    code: "DH251103-100017",
    date: "10:27:00 18/11/2025",
    status: "Đang giao",
    statusColor: "bg-blue-100 text-blue-600",
    payment: "MoMo",
    total: "19.080.000 đ",
  },
  {
    code: "DH251102-100016",
    date: "09:26:00 17/11/2025",
    status: "Đã xác nhận",
    statusColor: "bg-indigo-100 text-indigo-600",
    payment: "VNPAY",
    total: "10.150.000 đ",
  },
  {
    code: "DH251101-100015",
    date: "16:25:00 16/11/2025",
    status: "Chờ xử lý",
    statusColor: "bg-yellow-100 text-yellow-600",
    payment: "COD",
    total: "19.080.000 đ",
  },
  {
    code: "DH251103-100014",
    date: "15:24:00 15/11/2025",
    status: "Hủy",
    statusColor: "bg-red-100 text-red-600",
    payment: "MoMo",
    total: "10.150.000 đ",
  },
];

export default function OrderHistoryPage() {
  return (
    <div className="w-full bg-gray-100 py-10">
      <div className="max-w-7xl mx-auto bg-white p-8 rounded-2xl shadow-sm">

        {/* Title */}
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Lịch sử đơn hàng</h2>

        {/* Filters (giống bố cục mẫu, nhưng giữ màu sáng) */}
        <div className="flex flex-wrap gap-4 mb-6">
          <input
            className="border rounded-lg px-4 py-2 text-gray-700 w-60"
            placeholder="Tìm theo mã đơn"
          />

          <select className="border rounded-lg px-4 py-2 text-gray-700">
            <option>Tất cả trạng thái</option>
          </select>

          <select className="border rounded-lg px-4 py-2 text-gray-700">
            <option>Phương thức thanh toán</option>
          </select>

          <button className="border px-4 py-2 rounded-lg text-gray-600">Làm mới</button>

          <button className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700">
            Xuất CSV
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full rounded-xl overflow-hidden">
            <thead className="bg-gray-200 text-gray-600 uppercase text-sm">
              <tr>
                <th className="py-3 px-4 text-left">Mã đơn</th>
                <th className="py-3 px-4 text-left">Ngày</th>
                <th className="py-3 px-4 text-left">Trạng thái</th>
                <th className="py-3 px-4 text-left">Thanh toán</th>
                <th className="py-3 px-4 text-left">Tổng tiền</th>
                <th className="py-3 px-4 text-left">Hành động</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  {/* Mã đơn */}
                  <td className="py-3 px-4 font-semibold text-gray-700">
                    {order.code}
                    <span className="ml-3 text-sm text-blue-600 cursor-pointer">Chi tiết</span>
                  </td>

                  {/* Ngày */}
                  <td className="py-3 px-4 text-gray-600">{order.date}</td>

                  {/* Trạng thái */}
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${order.statusColor}`}>
                      {order.status}
                    </span>
                  </td>

                  {/* Payment */}
                  <td className="py-3 px-4 text-gray-700">{order.payment}</td>

                  {/* Price */}
                  <td className="py-3 px-4 font-semibold text-gray-800">{order.total}</td>

                  {/* Actions */}
                  <td className="py-3 px-4">
                    <span className="text-yellow-600 font-medium cursor-pointer mr-3 hover:underline">
                      Mua lại
                    </span>
                    <span className="text-gray-800 font-medium cursor-pointer hover:underline">
                      Hoá đơn
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6 text-gray-700">
          <p>23 đơn • Trang 1/4</p>

          <div className="flex gap-2">
            <button className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">
              Trước
            </button>
            <button className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">
              Sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
