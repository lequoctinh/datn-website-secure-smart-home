import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faShoppingCart } from "@fortawesome/free-solid-svg-icons"
import {
    faFacebookF,
    faYoutube,
    faTiktok,
    } from "@fortawesome/free-brands-svg-icons";
import './css/contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [successMessage, setSuccessMessage] = useState(""); // state để lưu thông báo

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMessage(`🎉 Cảm ơn ${formData.name}, chúng tôi đã nhận được thông tin của bạn! Chúng tôi sẽ liên hệ với bạn sớm nhất.`);

    // reset form sau khi gửi
    setFormData({
      name: "",
      email: "",
      phone: "",
      message: "",
    });
  };

  return (
    <div className="Container-Contact">
         <div className="ProductSmartLock-BannerPage">
            <img src="/productpage/banner-page/banner-pages.png" alt="" />
        </div>

        <div className="ProductSmartLock-Content">
            <nav className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base" aria-label="Breadcrumb">
                <Link to="/" className="PSL-crumb">
                    <span>Trang Chủ</span>
                </Link>
                <FontAwesomeIcon icon={faAngleRight} className="PSL-sep" />
                <Link to="/lien-he" className="PSL-crumb PSL-crumb-active">
                    <span>Liên hệ</span>
                </Link>
            </nav>
        </div>

        <div className="contact-content p-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        
            

            <div className="contact-infor ">
                <h2 className="text-2xl font-bold mb-6 text-center">
                    SECURE SMART HOME – AN TOÀN & ĐẲNG CẤP CHUẨN HÀN
                </h2>
                <p>📍 Địa chỉ: 123 Đường ABC, xxx, xxx, TP.HCM</p>
                <p>📞 Hotline: 0123 456 789</p>
                <p>📞 Hotline: 0098 765 432</p>
                <p>📧 Email: securesmarthome@gmail.com</p>
            </div>

            <div className="over-Contact_social-links flex flex-col items-center gap-4">
                <div className="logo-contact">
                    <img src="/SecureHome.png" alt="Logo footer" className="h-14" />
                </div>
                <h2 className="text-2xl font-bold mb-6 text-center">
                    Liên kết với chúng tôi
                </h2>
                <div className="social-links_item flex gap-4 text-xl" id="contact-item">
                    <div className="contact-item-Facebook text-[#3b5998]">
                        <a href="https://www.facebook.com/Lequoctinh2512/" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faFacebookF} />
                        </a>
                    </div>
                    <div className="contact-item-TikTok text-black">
                        <a href="https://www.tiktok.com/" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faTiktok} />
                        </a>
                    </div>
                    <div className="contact-item-YouTube text-[#ff0000]">
                        <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faYoutube} />
                        </a>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="contact-form flex flex-col gap-4">
                <h2 className="text-2xl font-bold mb-6 text-center">
                    Liên hệ với chúng tôi
                </h2>
                <input
                type="text"
                name="name"
                placeholder="Họ và tên"
                className="border p-2 rounded"
                value={formData.name}
                onChange={handleChange}
                required
                />
                <input
                type="email"
                name="email"
                placeholder="Email"
                className="border p-2 rounded"
                value={formData.email}
                onChange={handleChange}
                required
                />
                <input
                type="tel"
                name="phone"
                placeholder="Số điện thoại"
                className="border p-2 rounded"
                value={formData.phone}
                onChange={handleChange}
                required
                pattern="0[0-9]{9}"
                title="Số điện thoại phải gồm 10 chữ số"
                />
                <textarea
                name="message"
                placeholder="Nội dung"
                className="border p-2 rounded"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                required
                ></textarea>

                <button
                type="submit"
                className="text-white p-2 rounded "
                >
                Gửi liên hệ
                </button>
                {successMessage && (
                    <p className="text-green-600 font-semibold mt-4">{successMessage}</p>
                )}
            </form>
        </div>
    </div>
  );
}

export default Contact;




{/* <div className="contact-map mb-8">
                <iframe
                title="Google Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.4355252855394!2d106.6248237114372!3d10.854441557703524!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752bee0b0ef9e5%3A0x5b4da59e47aa97a8!2zQ8O0bmcgVmnDqm4gUGjhuqduIE3hu4FtIFF1YW5nIFRydW5n!5e0!3m2!1svi!2s!4v1755657555973!5m2!1svi!2s"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            </div> */}