import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function OrderDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/orders/${id}`)
      .then((res) => res.json())
      .then((res) => setData(res))
      .catch((e) => console.log(e));
  }, [id]);

  if (!data) return <div className="p-6">Đang tải…</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">Chi tiết đơn hàng</h2>

      <div className="space-y-2 text-gray-700">
        <p><b>Mã đơn:</b> {data.order.order_code}</p>
        <p><b>Trạng thái:</b> {data.order.status}</p>
        <p><b>Thanh toán:</b> {data.order.payment_method}</p>
      </div>

      <hr className="my-4" />

      <h3 className="font-semibold mb-2">Sản phẩm</h3>
      <div className="space-y-2">
        {data.items.map((item) => (
          <div className="flex justify-between border-b pb-2">
            <span>{item.product_name} x {item.quantity}</span>
            <span>{item.total_price.toLocaleString()} đ</span>
          </div>
        ))}
      </div>

      <hr className="my-4" />

      <h3 className="font-semibold mb-2">Địa chỉ giao hàng</h3>
      <p>
        {data.address.fullname} - {data.address.phone}<br />
        {data.address.address_line}, {data.address.ward}, {data.address.district}, {data.address.province}
      </p>

      <hr className="my-4" />

      <div className="text-xl font-bold">
        Tổng thanh toán: {data.order.total.toLocaleString()} đ
      </div>
    </div>
  );
}
