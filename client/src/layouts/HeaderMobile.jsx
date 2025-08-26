import React, { useState } from "react";
import { useMediaQuery } from "react-responsive";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark, faUser, faShoppingCart, faMagnifyingGlass, faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import AuthOverlay from "../components/auth/AuthOverlay";
import "./css/HeaderMobile.css";

function HeaderMobile() {
const isMobile = useMediaQuery({ maxWidth: 767 });
const [menuOpen, setMenuOpen] = useState(false);
const [openDropdown1, setOpenDropdown1] = useState(false);
const [openDropdown2, setOpenDropdown2] = useState(false);
const [openDropdown3, setOpenDropdown3] = useState(false);
const [openDropdown4, setOpenDropdown4] = useState(false);
const [searchText, setSearchText] = useState("");
const [showAuth, setShowAuth] = useState(false);

if (!isMobile) return null;

const closeAll = () => 
    { 
        setMenuOpen(false); 
        setOpenDropdown1(false); 
        setOpenDropdown2(false); 
        setOpenDropdown3(false); 
        setOpenDropdown4(false); 
        setShowAuth(false); 
    };

return (
<div className="Container-headerMobile w-full fixed top-0 left-0 z-50">
    <div className="headerMobile-navbar flex justify-between items-center px-4 py-3">
        <div className="headerMobile-navbar_logo">
            <Link to="/" onClick={closeAll}>
                <img src="/SecureHome.png" alt="logo" className="h-12" />
                </Link>
        </div>
        <div className="headerMobile-navbar_menuIcon text-2xl cursor-pointer" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu" aria-expanded={menuOpen} role="button">
            <FontAwesomeIcon icon={menuOpen ? faXmark : faBars} />
        </div>
        <div className="headerMobile-navbar_item flex items-center gap-4">
            <button className="item-userMobile text-xl cursor-pointer" type="button"  aria-label="Đăng nhập/Đăng ký" title="Đăng nhập/Đăng ký" onClick={() => setShowAuth(true)}>
                <FontAwesomeIcon icon={faUser} />
            </button>
            <div className="item-cartMobile text-xl cursor-pointer"><FontAwesomeIcon icon={faShoppingCart} /></div>
        </div>
    </div>

    <div className="headerMobile-search flex px-4 pb-3">
        <input type="text" placeholder="Tìm sản phẩm..." value={searchText} onChange={(e) => setSearchText(e.target.value)} className="flex-1 px-3 py-2 text-sm rounded-l" />
        <button className="search-submit px-4 py-2 text-sm font-semibold rounded-r" type="button" aria-label="Tìm kiếm"><FontAwesomeIcon icon={faMagnifyingGlass} /></button>
    </div>

    {menuOpen && (
        <nav className="mobileMenu-dropdown px-4 py-3">
            <ul className="space-y-2">
                <li><Link to="/ve-chung-toi" onClick={closeAll}>Về chúng tôi</Link></li>

                <li className="dropdown-toggle" onClick={() => setOpenDropdown1((v) => !v)}>
                    <div className="flex justify-between items-center">
                        <span>Khóa cửa thông minh</span>
                        <FontAwesomeIcon icon={faAngleDown} className={openDropdown1 ? "rotate-180 transition" : "transition"} />
                    </div>
                    {openDropdown1 && (<ul className="dropdown-submenu mt-2 pl-3 space-y-1">
                        <li><Link to="/khoa-van-tay-bosch" onClick={closeAll}>Khóa vân tay BOSCH</Link></li>
                        <li><Link to="/khoa-cua-huyndai" onClick={closeAll}>Khóa cửa HUYNDAI</Link></li>
                        <li><Link to="/khoa-cua-hafele" onClick={closeAll}>Khóa cửa HAFELE</Link></li>
                        <li><Link to="/khoa-cua-hubert" onClick={closeAll}>Khóa cửa HUBERT</Link></li>
                        <li><Link to="/khoa-cua-ezviz" onClick={closeAll}>Khóa cửa EZVIZ</Link></li>
                        <li><Link to="/khoa-cua-kassler" onClick={closeAll}>Khóa cửa KASSLER</Link></li>
                        <li><Link to="/khoa-cua-kaadas" onClick={closeAll}>Khóa cửa KAADAS</Link></li>
                    </ul>)}
                </li>

                <li className="dropdown-toggle" onClick={() => setOpenDropdown2((v) => !v)}>
                    <div className="flex justify-between items-center">
                        <span>Cửa nhựa Composite</span>
                        <FontAwesomeIcon icon={faAngleDown} className={openDropdown2 ? "rotate-180 transition" : "transition"} />
                    </div>
                    {openDropdown2 && (<ul className="dropdown-submenu mt-2 pl-3 space-y-1">
                        <li><Link to="/cua-phang" onClick={closeAll}>Cửa phẳng</Link></li>
                        <li><Link to="/cua-nep-kim-loai" onClick={closeAll}>Cửa nẹp kim loại</Link></li>
                        <li><Link to="/cua-o-kinh" onClick={closeAll}>Cửa ô kính</Link></li>
                        <li><Link to="/cua-chi-noi" onClick={closeAll}>Cửa chỉ nổi</Link></li>
                        <li><Link to="/cua-hut-huynh" onClick={closeAll}>Cửa hút huỳnh</Link></li>
                        <li><Link to="/cua-vom" onClick={closeAll}>Cửa vòm</Link></li>
                    </ul>)}
                </li>

                <li className="dropdown-toggle" onClick={() => setOpenDropdown3((v) => !v)}>
                    <div className="flex justify-between items-center">
                        <span>Camera giám sát</span>
                        <FontAwesomeIcon icon={faAngleDown} className={openDropdown3 ? "rotate-180 transition" : "transition"} />
                    </div>
                    {openDropdown3 && (<ul className="dropdown-submenu mt-2 pl-3 space-y-1">
                        <li><Link to="/camera-wifi-imou" onClick={closeAll}>Camera Wifi Imou</Link></li>
                        <li><Link to="/camera-wifi-ezviz" onClick={closeAll}>Camera Wifi Ezviz</Link></li>
                        <li><Link to="/camera-dahua" onClick={closeAll}>Camera Dahua</Link></li>
                        <li><Link to="/camera-hikvision" onClick={closeAll}>Camera Hikvision</Link></li>
                        <li><Link to="/camera-tapo-tp-link" onClick={closeAll}>Camera Tapo-TP-Link</Link></li>
                        <li><Link to="/camera-hanh-trinh" onClick={closeAll}>Camera hành trình</Link></li>
                    </ul>)}
                </li>

                <li className="dropdown-toggle" onClick={() => setOpenDropdown4((v) => !v)}>
                    <div className="flex justify-between items-center">
                        <span>Phụ kiện</span>
                        <FontAwesomeIcon icon={faAngleDown} className={openDropdown4 ? "rotate-180 transition" : "transition"} />
                    </div>
                    {openDropdown4 && (<ul className="dropdown-submenu mt-2 pl-3 space-y-1">
                        <li><Link to="/phu-kien-khoa-van-tay" onClick={closeAll}>Phụ kiện khóa vân tay</Link></li>
                        <li><Link to="/phu-kien-camera" onClick={closeAll}>Phụ kiện camera</Link></li>
                    </ul>)}
                </li>

                <li><Link to="/lien-he" onClick={closeAll}>Liên hệ</Link></li>
            </ul>
        </nav>
    )}

    <AuthOverlay open={showAuth} onClose={() => setShowAuth(false)} defaultMode="login" />
</div>
);
}

export default HeaderMobile;
