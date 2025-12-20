import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faCalendarDays, faUser } from "@fortawesome/free-solid-svg-icons";
import "./../../news/controller/css/newsDetail.css";





function NewsDetail() {
  const { slug } = useParams(); 
  const [post, setPost] = useState(null);
  const [ relatedPosts, setRelatedPosts] = useState([]);
  

  useEffect(() => {
    // Lấy bài viết hiện tại
    fetch(`http://localhost:5000/news/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) setPost(data.data);
      });
  }, [slug]);

 useEffect(() => {
  fetch("http://localhost:5000/news/latest")
    .then((res) => res.json())
    .then((data) => {
      if (data.ok) {
        const filtered = data.data
          .filter((p) => p.slug !== slug)
          .slice(0, 3); // ✅ chỉ lấy 2 bài

        setRelatedPosts(filtered);
      }
    });
}, [slug]);


  if (!post) return <div className="loading">Đang tải...</div>;

  return (
    <div className="NewsDetail-Container">
      {/* Banner */}
      <div className="ProductSmartLock-BannerPage">
        <img src="/productpage/banner-page/banner-pages.png" alt="Banner" />
      </div>

      {/* Breadcrumb */}
      <nav className="ProductSmartLock-Content md:mx-5 sm:mx-5 max-sm:mx-3 lg:mx-auto">
        <Link to="/" className="PSL-crumb"><span>Trang Chủ</span></Link>
        <FontAwesomeIcon icon={faAngleRight} className="PSL-sep"/>
        <Link to="/tin-tuc" className="PSL-crumb"><span>Tin Tức</span></Link>
        <FontAwesomeIcon icon={faAngleRight} className="PSL-sep"/>
        <span className=" PSL-crumb-active active">{post.tieu_de}</span>
      </nav>

      {/* Nội dung */}
      <div className="NewsDetail-Content">
        <h1>{post.tieu_de}</h1>

        <div className="NewsDetail-Meta">
          <span>
            <FontAwesomeIcon icon={faCalendarDays} /> {post.ngay_tao}
          </span>
          <span>
            <FontAwesomeIcon icon={faUser} /> {post.danh_muc}
          </span>
        </div>

        <div className="NewsDetail-Image">
          <img src={post.anh_dai_dien} alt={post.tieu_de} />
        </div>

        <article
          className="NewsDetail-Body"
          dangerouslySetInnerHTML={{ __html: post.noi_dung }}
        />    

        {/* Bài viết liên quan */}
         


      </div>
      <div className="NewDetail-News">
        {relatedPosts.length > 0 && (
         <div className="News-Grid modern">
              {relatedPosts.map((item) => (
              <article key={item.id} className="News-Card modern">
                <div className="News-Image">
                  <img src={item.anh_dai_dien} alt={item.tieu_de} />
                </div>

                <div className="News-Body">
                  <h2>
                    <Link to={`/tin-tuc/${item.duong_dan_ten_seo}`}>
                      {item.tieu_de}
                    </Link>
                  </h2>

                  <div className="News-Meta">
                    <span>
                      <FontAwesomeIcon icon={faCalendarDays} />{" "}
                      {new Date(item.ngay_tao).toLocaleDateString("vi-VN")}
                    </span>
                    <span>
                      <FontAwesomeIcon icon={faUser} /> Admin
                    </span>
                  </div>

                  <p>{item.tom_tat}</p>

                  <Link
                    to={`/tin-tuc/${item.duong_dan_ten_seo}`}
                    className="News-ReadMore"
                  >
                    Đọc thêm →
                  </Link>
                </div>
              </article>
            ))}
          </div>
            )}
      </div>

    </div>
  );
}

export default NewsDetail;
