import React, { useEffect } from "react";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import "./css/IntroducingTheCompany.css";
import "./css/AboutTeam.css";

function AboutUs() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
    });
  }, []);

  // Hiệu ứng khi cuộn
  const fadeUp = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.6, ease: "easeOut" },
  };

  // Avatar thành viên
  const Avatar = ({ name = "", role = "" }) => {
    const initial = (name?.trim?.()[0] || "?").toUpperCase();
    return (
      <div className="text-center w-full">
        <div className="mx-auto mb-3 h-20 w-20 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-2xl font-bold text-white shadow-md">
          {initial}
        </div>
        <h3 className="font-semibold text-gray-800">{name}</h3>
        <p className="text-sm text-gray-500">{role}</p>
      </div>
    );
  };

  const members = [
    { name: "Nguyễn Văn A", role: "Giám đốc điều hành (CEO)" },
    { name: "Nguyễn Văn B", role: "Giám đốc kỹ thuật (CTO)" },
    { name: "Nguyễn Văn C", role: "Giám đốc marketing (CMO)" },
    { name: "Nguyễn Văn D", role: "Giám đốc vận hành (COO)" },
  ];

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white">
      {/* 1️ Giới thiệu công ty */}
      <section className="py-20 px-6 md:px-12 text-center" id="about-company">
        <motion.h2
          {...fadeUp}
          className="text-3xl md:text-4xl font-bold text-amber-600 mb-6"
        >
          Giới thiệu về chúng tôi
        </motion.h2>
        <motion.p
          {...fadeUp}
          className="max-w-3xl mx-auto text-gray-600 leading-relaxed"
        >
          Secure Smart Home là đơn vị tiên phong trong lĩnh vực cung cấp giải pháp
          khóa cửa thông minh tại Việt Nam. Với sứ mệnh mang đến sự an toàn và tiện nghi
          cho mọi gia đình, chúng tôi cam kết cung cấp các sản phẩm chất lượng cao, 
          tích hợp công nghệ tiên tiến nhất để bảo vệ tổ ấm của bạn.
        </motion.p>
      </section>

      {/* 2️ Tầm nhìn & Sứ mệnh */}
      <section className="py-20 bg-amber-50 px-6 md:px-12 text-center">
        <motion.h2
          {...fadeUp}
          className="text-3xl md:text-4xl font-bold text-amber-700 mb-10"
        >
          Tầm nhìn & Sứ mệnh
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <motion.div
            {...fadeUp}
            className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold text-amber-600 mb-2">🌟 Tầm nhìn</h3>
            <p className="text-gray-600 leading-relaxed">
              Trở thành thương hiệu hàng đầu trong lĩnh vực thiết bị khóa cửa thông minh,
              mang lại sự an tâm và hiện đại cho mọi ngôi nhà Việt.
            </p>
          </motion.div>
          <motion.div
            {...fadeUp}
            className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold text-amber-600 mb-2">🎯 Sứ mệnh</h3>
            <p className="text-gray-600 leading-relaxed">
              Không ngừng đổi mới và ứng dụng công nghệ thông minh để cung cấp sản phẩm
              tiện ích, bền bỉ, giúp khách hàng sống an toàn và tiện nghi hơn.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 3️ Giá trị cốt lõi */}
      <section className="py-20 px-6 md:px-12 text-center">
        <motion.h2
          {...fadeUp}
          className="text-3xl md:text-4xl font-bold text-amber-600 mb-10"
        >
          Giá trị cốt lõi
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <motion.div
            {...fadeUp}
            className="p-6 border border-amber-300 rounded-2xl shadow hover:shadow-lg bg-white"
          >
            <h3 className="text-lg font-semibold text-amber-700 mb-2">💡 Sáng tạo</h3>
            <p className="text-gray-600">
              Luôn đổi mới và tìm kiếm giải pháp tối ưu để mang đến trải nghiệm tốt nhất cho khách hàng.
            </p>
          </motion.div>
          <motion.div
            {...fadeUp}
            className="p-6 border border-amber-300 rounded-2xl shadow hover:shadow-lg bg-white"
          >
            <h3 className="text-lg font-semibold text-amber-700 mb-2">🤝 Tận tâm</h3>
            <p className="text-gray-600">
              Đặt lợi ích và sự hài lòng của khách hàng lên hàng đầu trong mọi hoạt động.
            </p>
          </motion.div>
          <motion.div
            {...fadeUp}
            className="p-6 border border-amber-300 rounded-2xl shadow hover:shadow-lg bg-white"
          >
            <h3 className="text-lg font-semibold text-amber-700 mb-2">🔒 An toàn</h3>
            <p className="text-gray-600">
              Cung cấp những sản phẩm đạt chuẩn bảo mật cao, giúp bảo vệ an toàn tuyệt đối cho ngôi nhà của bạn.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 4️ Đội ngũ của chúng tôi */}
      <section className="py-20 bg-gradient-to-b from-gray-100 to-white" id="about-team">
        <div className="container mx-auto px-4">
          <motion.h2
            {...fadeUp}
            className="text-center text-3xl md:text-4xl font-bold text-amber-600"
          >
            Đội ngũ của chúng tôi
          </motion.h2>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {members.map((member, index) => (
              <motion.div
                key={index}
                {...fadeUp}
                data-aos="zoom-in"
                className="flex items-center justify-center rounded-2xl border border-gray-200 bg-white p-6 shadow-md transition-all duration-300 hover:shadow-xl hover:border-amber-500 hover:bg-amber-50"
              >
                <Avatar name={member.name} role={member.role} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutUs;
