import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./css/ProductDetail.css";
import { faShoppingCart, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import axios from "axios";

const BACKEND_URL = "http://localhost:5000";

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [related, setRelated] = useState([]);

  // Biến thể
  const [variants, setVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);

  // Reviews
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([]);

  const formatted = (v) =>
    Number(v || 0).toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  // Lấy product + variants + related
  useEffect(() => {
    if (!slug) return;

    // fetch product (includes variants in your backend controller)
    fetch(`${BACKEND_URL}/products/slug/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        // backend previously returns { product, variants }
        const prod = data.product || data;
        setProduct(prod);

        if (data.variants && Array.isArray(data.variants) && data.variants.length > 0) {
          setVariants(data.variants);
        } else if (prod && prod.variants && Array.isArray(prod.variants)) {
          setVariants(prod.variants);
        } else {
          setVariants([]);
        }

        // load reviews for this product (do it here, when we have product id)
        const productId = prod?.id;
        if (productId) {
          loadReviews(productId);
        }
      })
      .catch((err) => {
        console.error("Error loading product:", err);
      });

    // related products
    fetch(`${BACKEND_URL}/products/slug/${slug}/related`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.ok && Array.isArray(data.data)) setRelated(data.data);
      })
      .catch((err) => console.error("Error loading related:", err));
  }, [slug]);

  // Helper để build image url
  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    // your backend serves /uploads via static; support both "uploads/..." and "/uploads/..."
    if (path.startsWith("uploads") || path.startsWith("/uploads")) {
      return `${BACKEND_URL}${path.startsWith("/") ? path : "/" + path}`;
    }
    return path;
  };

  // Chọn biến thể
  const handleSelectVariant = (variant) => {
    if (selectedVariant && selectedVariant.id === variant.id) {
      // nếu muốn toggle off, uncomment:
      // setSelectedVariant(null);
      return;
    }
    setSelectedVariant(variant);
  };

  // Add to cart
  const handleAddToCart = async () => {
    if (variants.length > 0 && !selectedVariant) {
      toast.error("Vui lòng chọn màu sắc sản phẩm!");
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/api/cart/add`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          quantity,
          variantId: selectedVariant ? selectedVariant.id : null,
          color: selectedVariant ? (selectedVariant.ten_mau || selectedVariant.ten_bien_the) : null,
        }),
      });
      const data = await res.json();
      if (data.ok) toast.success(data.message || "Đã thêm vào giỏ hàng");
      else toast.error(data.message || "Thêm vào giỏ thất bại");
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi thêm vào giỏ");
    }
  };

  // Buy now
  const handleBuyNow = async () => {
    if (variants.length > 0 && !selectedVariant) {
      toast.error("Vui lòng chọn màu sắc sản phẩm!");
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/api/cart/buy-now`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          quantity,
          variantId: selectedVariant ? selectedVariant.id : null,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        toast.success("Đặt hàng thành công!");
        setTimeout(() => navigate(`/checkout/${data.orderId}`), 1200);
      } else {
        toast.error(data.message || "Đặt hàng thất bại!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi đặt hàng");
    }
  };

  // Reviews: load for a productId
  const loadReviews = async (productId) => {
    if (!productId) return;
    try {
      const res = await axios.get(`${BACKEND_URL}/api/reviews/${productId}`);
      if (res.data && res.data.reviews) setReviews(res.data.reviews);
      else setReviews([]);
    } catch (err) {
      console.error("Lỗi load reviews:", err);
      setReviews([]);
    }
  };

  // Submit review
//   const submitReview = async () => {
//   if (!rating) {
//     toast.error("Hãy chọn số sao!");
//     return;
//   }

//   const token = localStorage.getItem("token"); // kiểm tra đúng KEY

//   if (!token) {
//     toast.error("Bạn chưa đăng nhập!");
//     return;
//   }

//   try {
//     await axios.post(
//       `${BACKEND_URL}/api/reviews`,
//       {
//         productId: product.id,
//         so_sao: rating,
//         noi_dung: comment,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         withCredentials: true,
//       }
//     );

//     toast.success("Đánh giá thành công");
//     loadReviews(product.id);
//     setRating(0);
//     setComment("");

//   } catch (err) {
//     console.error("Lỗi submit:", err.response?.data || err);
//     toast.error(err.response?.data?.message || "Lỗi khi gửi đánh giá");
//   }
// };
const submitReview = async () => {
  if (!rating) {
    toast.error("Hãy chọn số sao!");
    return;
  }

  const token = localStorage.getItem("token");

  if (!token) {
    toast.error("Bạn chưa đăng nhập!");
    return;
  }

  try {
    await axios.post(
      `${BACKEND_URL}/api/reviews`,
      {
        productId: product.id,
        so_sao: rating,
        noi_dung: comment,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success("Đánh giá thành công");
    loadReviews(product.id);
    setRating(0);
    setComment("");
  } catch (err) {
    console.error("Lỗi submit:", err.response?.data || err);
    toast.error(err.response?.data?.message || "Lỗi khi gửi đánh giá");
  }
};


  if (!product) return <p>Đang tải...</p>;

  const currentPrice = selectedVariant ? selectedVariant.gia : product.gia_khuyen_mai;
  const currentImage = (selectedVariant && selectedVariant.anh) ? selectedVariant.anh : product.anh_dai_dien;


  return (
    <div className="pd-container">
      {/* ... Breadcrumb giữ nguyên ... */}
      <div className="container col-span-full">
        <div className="ProductSmartLock-BannerPage">
                  <img src="/productpage/banner-page/banner-pages.png" alt="" />
              </div>
      
            {/* === PHẦN 2: THANH BREADCRUMB NỔI (Code của bạn) === */}
            <div className="container mx-auto px-4 relative z-10">
              <div className="w-6xl flex justify-center mt-[-40px] mb-10">
                  <div className="bg-white w-5/6 shadow-lg rounded-2xl px-8 py-4 flex items-center gap-3 text-gray-700 text-base border border-gray-100">
                      <Link to="/" className="hover:text-[#C9AC68] font-medium transition-colors">
                          Trang Chủ
                      </Link>
                       <FontAwesomeIcon icon={faAngleRight} className="text-gray-400 text-xs" />
      

                      <span
                        className="crumb-link"
                        onClick={() => navigate(`/danh-muc/${product?.danh_muc_id || ""}`)}
                      >
                        {product?.danh_muc_ten || "Danh mục"}
                      </span>
      
                      <FontAwesomeIcon icon={faAngleRight} className="text-gray-400 text-xs" />
      
                      <span className="text-[#C9AC68] font-semibold">
                          {product?.ten_san_pham}
                      </span>
                  </div>
              </div>
            </div>
      </div>
      {/* <div className="breadcrumb">  
         <span className="crumb-link" onClick={() => navigate("/")}>
           Trang chủ
         </span>
         <span className="separator">/</span>
         <span
          className="crumb-link"
          onClick={() => navigate(`/danh-muc/${product?.danh_muc_id || ""}`)}
        >
          {product?.danh_muc_ten || "Danh mục"}
        </span>
        <span className="separator">/</span>
        <span className="current">{product?.ten_san_pham}</span>
      </div> */}
      {/* MEDIA: Cập nhật src ảnh theo biến thể */}
      <div className="pd-container-2">
        <div className="pd-media">
        <img
          className="pd-main-img"
          src={getImageUrl(currentImage)} 
          alt={product.ten_san_pham}
        />
        
        <div className="pd-thumbs">
          <img
            src={
            product.anh_dai_dien.startsWith("http")
                ? product.anh_dai_dien
                : product.anh_dai_dien
            }
            alt=""
          />
        </div>
      </div>

      {/* INFO */}
      <div className="pd-right">
        <h1 className="pd-title">{product.ten_san_pham}</h1>

        <div className="pd-rating-box">
          <span className="pd-star">⭐ 4.7</span>
          <span className="pd-review">(27 đánh giá)</span>
          <span className="pd-sold">Đã bán 52.1k</span>
        </div>

        {/* GIÁ: Cập nhật hiển thị giá theo biến thể */}
        <div className="pd-price-box">
          {!selectedVariant && <del className="pd-old">{formatted(product.gia_goc)}</del>}
          <span className="pd-new">{formatted(currentPrice)}</span>
        </div>

        {/* --- PHẦN CHỌN MÀU SẮC (MỚI) --- */}
        {variants.length > 0 && (
            <div className="pd-variants-section">
                <span className="pd-label">Màu sắc: </span>
                <div className="pd-variant-options">
                    {variants.map((v) => (
                        <button
                            key={v.id}
                            className={`pd-variant-btn ${selectedVariant?.id === v.id ? 'active' : ''}`}
                            onClick={() => handleSelectVariant(v)}
                        >
                            {/* Nếu muốn hiện chấm tròn màu */}
                            {/* <span className="color-dot" style={{backgroundColor: v.ma_mau_css}}></span> */}
                            {v.ten_bien_the}
                        </button>
                    ))}
                </div>
                {selectedVariant && (
                    <div className="pd-variant-stock">
                        Kho: {selectedVariant.so_luong_ton || "Sẵn hàng"}
                    </div>
                )}
            </div>
        )}
        <ul className="pd-features">
          <li>✔ Bật tắt và điều khiển đèn từ xa dù ở bất kỳ nơi nào</li>
          <li>✔ Hẹn giờ bật tắt thiết bị qua điện thoại</li>
          <li>✔ Có khả năng chia sẻ ra mọi thành viên gia đình dùng chung</li>
          <li>✔ Lắp đặt cực kỳ dễ dàng, chỉ mất 2-3 phút</li>
          <li>✔ Hotline 24/7: 0983.988.828</li>
          <li>✔ HÀNG VIỆT NAM – CHẤT LƯỢNG CAO</li>
        </ul>

        {/* Quantity */}
        <div className="pd-qty-box">
          <button onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}>
            -
          </button>
          <span>{quantity}</span>
          <button onClick={() => setQuantity(quantity + 1)}>+</button>
        </div>

        {/* Buttons */}
        <div className="pd-btn-group">
          <button className="pd-btn-add" onClick={handleAddToCart}>Thêm vào giỏ</button>

          <button className="pd-btn-buy" onClick={handleBuyNow}>Đặt mua ngay</button>
        </div>

        {/* Secure Message */}
        <div className="pd-secure-box">
          Cam kết các sản phẩm đang bán trên website là sản phẩm chính hãng.
          Tất cả sản phẩm đều có bảo hành.
        </div>

        {/* Product Meta */}
        <p className="pd-meta">
          <strong>Mã sản phẩm:</strong> {product.ma_san_pham || "ĐTBS01"}
        </p>
        <p className="pd-meta">
          <strong>Danh mục:</strong> Công Tắc Điều Khiển Từ Xa, Thiết Bị Điện
          Thông Minh
        </p>
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

      {/* RELATED */}
      {/* <h3 className="pd-related-title">Sản phẩm liên quan</h3>

      <div className="pd-related-list">
        {related.map((p) => (
          <div key={p.id} className="pd-related-card">
            <a href={`/san-pham/${p.duong_dan_ten_seo}`}>
              <img
                src={getImageUrl(p.anh_dai_dien)}
                alt={p.ten_san_pham}
                className="pd-related-img"
              />
            </a>
            <p>{p.ten_san_pham}</p>
            <strong>{Number(p.gia_khuyen_mai).toLocaleString("vi-VN")} đ</strong>
          </div>
        ))}
      </div> */}

    <div style={{ marginTop: 20 }}>
        <div style={{ marginBottom: 8, fontWeight: 700 }}>Viết đánh giá</div>
        <div>
          {[1, 2, 3, 4, 5].map((num) => (
            <span
              key={num}
              onClick={() => setRating(num)}
              style={{
                fontSize: 28,
                color: num <= rating ? "#FFD700" : "#ccc",
                cursor: "pointer",
                marginRight: 6,
              }}
            >
              ★
            </span>
          ))}
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Hãy chia sẻ cảm nhận của bạn..."
          className="border p-3 w-full rounded"
          style={{ marginTop: 12 }}
        />

        <div style={{ marginTop: 8 }}>
          <button onClick={submitReview} className="mt-3 px-4 py-2 bg-orange-500 text-white rounded">
            Gửi đánh giá
          </button>
        </div>
      </div>


          <div className="mt-6">
        <h3 className="text-xl font-bold">Đánh giá sản phẩm</h3>

        {reviews.length === 0 && <p>Chưa có đánh giá nào</p>}

        {/* {reviews.map((r) => (
          <div key={r.id || r.review_id} className="border-b py-3">
            <div className="font-semibold">{r.user_name || r.name}</div>
            <div style={{ color: "#f6c945" }}>{Array.from({ length: r.rating }).map(() => "★").join("")}{Array.from({ length: 5 - r.rating }).map(() => "☆").join("")}</div>
            <div>{r.comment}</div>
            <div className="text-gray-500 text-sm">{new Date(r.created_at || r.createdAt).toLocaleDateString()}</div>
          </div>
        ))} */}
        {reviews.map((r) => (
          <div key={r.id} className="border-b py-3">
            <div className="font-semibold">{r.user_name}</div>

            <div style={{ color: "#f6c945", fontSize: 20 }}>
              {"★".repeat(r.so_sao)}{"☆".repeat(5 - r.so_sao)}
            </div>

            <div>{r.noi_dung}</div>

            <div className="text-gray-500 text-sm">
              {new Date(r.ngay_tao).toLocaleDateString("vi-VN")}
            </div>
          </div>
        ))}

      </div>


      {/* RELATED */}
<h3 className="pd-related-title">Sản phẩm liên quan</h3>

<div className="related-grid">
  {related.map((p) => (
    <div key={p.id} className="related-card">
      <a href={`/san-pham/${p.duong_dan_ten_seo}`}>
        <div className="related-img-wrapper">
          <img
            src={getImageUrl(p.anh_dai_dien)}
            alt={p.ten_san_pham}
          />
        </div>
      </a>

      <p className="related-name">{p.ten_san_pham}</p>

      <div className="related-price">
        <del>{Number(p.gia_goc).toLocaleString("vi-VN")} đ</del>
        <span className="new-price">
          {Number(p.gia_khuyen_mai).toLocaleString("vi-VN")} đ
        </span>
      </div>

      <div className="related-btn-box">
        <button className="btn-compare">So sánh</button>
        <button type="button" className="SLP-cart" aria-label="Thêm vào giỏ">
          <FontAwesomeIcon icon={faShoppingCart} />
        </button>
      </div>
    </div>
  ))}
</div>
      </div>

    </div>
  );
};

export default ProductDetail;
