import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function OrderDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE || "http://localhost:5000"}/api/orders/${id}`)
      .then(res => res.json())
      .then(json => setData(json))
      .catch(err => console.error(err));
  }, [id]);

  if (!data) return <div className="p-6 text-center">Đang tải...</div>;

  const { order, items, address } = data;

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-2xl font-semibold mb-6">Chi tiết đơn {order.order_code}</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm">
            <h3 className="font-semibold mb-4">Sản phẩm</h3>
            {items.map(it => (
              <div key={it.id} className="flex items-center justify-between border-b py-3">
                <div className="flex items-center gap-4">
                  <img src={it.product_image || 'https://via.placeholder.com/80'} className="w-20 h-20 rounded" />
                  <div>
                    <div className="font-medium">{it.product_name}</div>
                    <div className="text-sm text-gray-500">SL: {it.quantity}</div>
                  </div>
                </div>
                <div className="font-semibold">{Number(it.total_price).toLocaleString()} đ</div>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h3 className="font-semibold mb-4">Thông tin đơn</h3>
            <div className="text-sm text-gray-700 space-y-2">
              <div><strong>Trạng thái:</strong> {order.status}</div>
              <div><strong>Thanh toán:</strong> {order.payment_method}</div>
              <div><strong>Tổng:</strong> {Number(order.total).toLocaleString()} đ</div>
              <div><strong>Ngày đặt:</strong> {new Date(order.created_at).toLocaleString()}</div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold">Địa chỉ giao hàng</h4>
              {address ? (
                <div className="text-sm text-gray-700 space-y-1">
                  <div>{address.fullname} • {address.phone}</div>
                  <div>{address.address_line}, {address.ward}, {address.district}, {address.province}</div>
                </div>
              ) : <div className="text-gray-500">Không có địa chỉ</div>}
            </div>

            <Link to="/orders" className="inline-block mt-6 text-blue-600 hover:underline">Quay lại lịch sử đơn</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
