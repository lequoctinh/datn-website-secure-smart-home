import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./css/IntroducingTheCompany.css";
import "./css/AboutTeam.css";

function AboutTeam() {
  // Khởi tạo AOS
  useEffect(() => {
    AOS.init({
      duration: 900,
      once: true,
      offset: 60,
      easing: "ease-out",
    });
  }, []);

  // Avatar component đơn giản
  const Avatar = ({ name, role }) => (
    <div className="text-center w-full">
      <div className="mx-auto mb-3 h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center text-lg font-bold text-gray-700">
        {name.charAt(0)}
      </div>
      <h3 className="font-semibold">{name}</h3>
      <p className="text-sm text-gray-500">{role}</p>
    </div>
  );

  return (
    <section className="py-20 bg-gradient-to-b from-gray-100 to-white">
      {/* <div className="container mx-auto px-4">
        <h2
          data-aos="fade-up"
          className="text_top text-center text-3xl font-bold md:text-4xl"
        >
          Đội ngũ của chúng tôi
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { name: "Nguyễn Văn A", role: "CEO" },
            { name: "Nguyễn Văn A", role: "CTO – Security" },
            { name: "Nguyễn Văn A", role: "Head of Product" },
            { name: "Nguyễn Văn A", role: "Customer Success" },
          ].map((m, index) => (
            <div
              key={index}
              data-aos="fade-up"
              className="flex items-center justify-center rounded-2xl border border-gray-200 bg-white p-6 shadow-md 
              transition-all duration-300 hover:shadow-xl hover:border-amber-500 hover:bg-yellow-50"
            >
              <Avatar name={m.name} role={m.role} />
            </div>
          ))}
        </div>
      </div> */}
    </section>
  );
}

export default AboutTeam;
