import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./css/ProductDetail.css";

const ProductDetail = () => {
  const { slug } = useParams();

  
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [related, setRelated] = useState([]);


  const formatted = (v) =>
    Number(v).toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  // Load chi tiết sản phẩm từ API
  // useEffect(() => {
  //   if (!id) return;

  //   fetch(`http://localhost:5000/api/products/${id}`)
  //     .then((res) => res.json())
  //     .then((data) => setProduct(data.product))
  //     .catch((err) => console.error(err));
  // }, [id]);

  useEffect(() => {
  if (!slug) return;

  fetch(`http://localhost:5000/api/products/slug/${slug}`)
    .then((res) => res.json())
    .then((data) => setProduct(data.product))
    .catch(console.error);
}, [slug]);


  useEffect(() => {
  if (!slug) return;

  fetch(`http://localhost:5000/api/products/${slug}/related`)
    .then((res) => res.json())
    .then((data) => {
      if (data.ok) setRelated(data.data);
    })
    .catch((err) => console.error(err));
}, [slug]);

  if (!product) return <p>Đang tải...</p>;

  return (
    <div className="pd-container">

      {/* MEDIA + THUMBNAIL */}
      <div className="pd-media">

        <div className="pd-thumbs">
          {product.images?.map((img, idx) => (
            <img key={idx} src={img} alt="" />
          ))}
        </div>
      </div>

      {/* INFO */}
      <div className="pd-info">
        <h1>{product.ten_san_pham}</h1>

        <div className="pd-price">
          {product.gia_goc && <del>{formatted(product.gia_goc)}</del>}
          <span className="pd-sale">{formatted(product.gia_khuyen_mai)}</span>
        </div>

        <div className="pd-qty">
          <button onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}>-</button>
          <span>{quantity}</span>
          <button onClick={() => setQuantity(quantity + 1)}>+</button>
        </div>

        <div className="pd-actions">
          <button className="btn-add">Thêm vào giỏ</button>
          <button className="btn-buy">Đặt mua ngay</button>
        </div>

        <p className="pd-code">
          Mã SP: <strong>{product.code}</strong>
        </p>
        <p className="pd-category">Danh mục: {product.category}</p>
      </div>

      {/* TABS */}
      <div className="pd-tabs">
        <button
          className={activeTab === "description" ? "active" : ""}
          onClick={() => setActiveTab("description")}
        >
          Mô tả
        </button>
        <button
          className={activeTab === "delivery" ? "active" : ""}
          onClick={() => setActiveTab("delivery")}
        >
          Chính Sách
        </button>
      </div>

      {/* TAB CONTENT */}
      <div className="pd-tab-content">
        {activeTab === "description" && (
          <div dangerouslySetInnerHTML={{ __html: product.mo_ta }}></div>
        )}

        {activeTab === "delivery" && (
          <div>
            <h3>Bảo hành</h3>
            <p>12 tháng đổi mới nếu lỗi kỹ thuật.</p>
          </div>
        )}
      </div>
      <h3 className="pd-related-title">Sản phẩm liên quan</h3>

      <div className="pd-related-list">
        {related.map((p) => (
          <div key={p.id} className="pd-related-card">
            <a href={`/san-pham/${p.duong_dan_ten_seo}`}>
              <img src={p.anh_dai_dien} alt={p.ten_san_pham} />
            </a>
            <p>{p.ten_san_pham}</p>

            <strong>
              {p.gia_khuyen_mai?.toLocaleString("vi-VN")} đ
            </strong>
          </div>
        ))}
      </div>  
    </div>
  );
};

export default ProductDetail;
