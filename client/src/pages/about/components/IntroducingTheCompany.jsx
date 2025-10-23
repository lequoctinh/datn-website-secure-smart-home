import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./css/IntroducingTheCompany.css";

function IntroducingTheCompany() {
  useEffect(() => {
    AOS.init({
      duration: 900,
      once: true,
      offset: 60,
      easing: "ease-out",
    });
  }, []);

  return (
    <section className=" py-20 bg-white">
      <div className="container max-w-[1200px] mx-auto px-6 md:px-12 lg:px-20">
        {/* Tiêu đề */}
        <div data-aos="fade-up" className="text-center mb-12">
          <h2 className="text_top text-3xl md:text-4xl font-bold text-gray-800">
            Giới thiệu về công ty
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Chúng tôi là công ty công nghệ hàng đầu trong lĩnh vực nhà thông minh,
            chuyên cung cấp các giải pháp bảo mật, điều khiển và tự động hóa cho không gian sống hiện đại.
          </p>
        </div>

        {/* Nội dung chính */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Hình minh họa */}
          <div data-aos="fade-right" className="flex justify-center">
            <img
              src="/BannerAbout/banner2.webp"
              alt="Giới thiệu công ty"
              className="rounded-2xl shadow-lg max-w-md"
            />
          </div>

          {/* Nội dung chi tiết */}
          <div data-aos="fade-left">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">
              Sứ mệnh & Tầm nhìn
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Chúng tôi mong muốn mang đến cuộc sống tiện nghi, an toàn và thân thiện với môi trường thông qua
              các sản phẩm nhà thông minh. Mỗi giải pháp của chúng tôi đều được nghiên cứu kỹ lưỡng để đáp ứng
              nhu cầu ngày càng cao của khách hàng.
            </p>

            <h3 className="text-2xl font-semibold mb-4 text-gray-800">
              Giá trị cốt lõi
            </h3>
            <ul className="space-y-2 text-gray-600 list-disc list-inside">
              <li> Sáng tạo trong từng sản phẩm</li>
              <li> An toàn và bảo mật tuyệt đối</li>
              <li> Hợp tác bền vững với khách hàng và đối tác</li>
              <li> Phát triển thân thiện với môi trường</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default IntroducingTheCompany;
