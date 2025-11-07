import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faCalendarDays, faUser } from "@fortawesome/free-solid-svg-icons";
import "./css/news.css";
// import "./../../data/news.json"
function News() {
  const [newsList, setNewsList] = useState([]);

  // ✅ Lấy dữ liệu từ file JSON thay vì mảng cứng
  useEffect(() => {
    fetch("./data/news.json") 
      .then((res) => res.json())
      .then((data) => setNewsList(data))
      .catch((err) => console.error("Lỗi tải tin tức:", err));
  }, []);

  return (
    <div className="Container-News">
      {/* Banner */}
      <div className="ProductSmartLock-BannerPage">
        <img src="/productpage/banner-page/banner-pages.png" alt="Banner" />
      </div>

      {/* Breadcrumb */}
      <div className="ProductSmartLock-Content">
        <nav className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base" aria-label="Breadcrumb">
          <Link to="/" className="PSL-crumb"><span>Trang Chủ</span></Link>
          <FontAwesomeIcon icon={faAngleRight} className="PSL-sep" />
          <Link to="/tin-tuc" className="PSL-crumb PSL-crumb-active"><span>Tin Tức</span></Link>
        </nav>
      </div>

      {/* Nội dung */}
      <div className="new-contai">
        <div className="News-Content">
          <section className="News-Main">
            <h1>Tin tức & Bài viết mới nhất</h1>
            <div className="News-Grid">
              {newsList.map((item) => (
                <article key={item.id} className="News-Card">
                  <div className="News-Image">
                    <img src={item.image} alt={item.title} />
                  </div>

                  <div className="News-Body">
                    <h2><Link to={`/tin-tuc/${item.id}`}>{item.title}</Link></h2>

                    <div className="News-Meta">
                      <span><FontAwesomeIcon icon={faCalendarDays} /> {item.date}</span>
                      <span><FontAwesomeIcon icon={faUser} /> {item.author}</span>
                    </div>

                    <p>{item.desc}</p>

                    <Link to={`/tin-tuc/${item.id}`} className="News-ReadMore">
                      Đọc thêm →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Sidebar */}
          <aside className="News-Sidebar">
            <div className="Sidebar-Box">
              <h3>Bài viết nổi bật</h3>
              <ul>
                <li><Link to="#">Cách chọn khóa cửa phù hợp cho nhà chung cư</Link></li>
                <li><Link to="#">Giải pháp an ninh toàn diện</Link></li>
                <li><Link to="#">Xu hướng nhà thông minh 2025</Link></li>
              </ul>
            </div>

            <div className="Sidebar-Box">
              <h3>Đăng ký nhận tin</h3>
              <p>Nhận tin tức mới nhất về sản phẩm & khuyến mãi.</p>
              <form>
                <input type="email" placeholder="Nhập email của bạn" />
                <button type="submit">Đăng ký</button>
              </form>
            </div>
          </aside>
        </div>
      </div>

      {/* CTA */}
      <section className="Contact-CTA">
        <div className="CTA-inner">
          <h3>Luôn cập nhật công nghệ mới nhất?</h3>
          <p>Theo dõi chúng tôi để không bỏ lỡ xu hướng khóa cửa thông minh.</p>
          <a className="CTA-btn" href="tel:0900000000">Liên hệ tư vấn ngay</a>
        </div>
      </section>
    </div>
  );
}

export default News;
