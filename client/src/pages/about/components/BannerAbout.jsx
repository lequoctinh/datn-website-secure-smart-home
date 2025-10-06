import React from "react";
import "swiper/css";
import "swiper/css/pagination";
import "./css/BannerAbout.css";
import { Link } from "react-router-dom";

function BannerAbout() {

return (
    <div className="container-about">
    <div className="bg-black relative w-full">
        {/* Hình Banner */}
        <img
        className="
                w-full 
                h-[250px] sm:h-[350px] md:h-[500px] lg:h-[600px] 
                object-cover 
                opacity-50
                "
        src="/BannerAbout/banner-1.png"
        alt="Banner giới thiệu"
        />

        {/* Text Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
            <h2 className="text_banner text-2xl sm:text-3xl md:text-5xl lg:text-6xl 
                            font-bold text-white drop-shadow-lg text-center px-4">
                <Link to="/lien-he" className="hover:text-amber-400 transition-colors duration-300">
                    Giới thiệu
                </Link>
            </h2>
        </div>
    </div>
    </div>
);
}

export default BannerAbout;