import React from "react";
import BannerAbout from "../about/components/BannerAbout"
import IntroducingTheCompany from "./components/IntroducingTheCompany"; 
import AboutTeam from './components/AboutTeam';
import PartnerSlider from'./components/PartnerSlider';
import CompanyVideo from "./components/CompanyVideo";

function About() {
    return(
        <div className="Container-About">
            <div className="Container-About_banner">
                <BannerAbout />
            </div>
            <div className="Container-About_main">
                <IntroducingTheCompany />
                <PartnerSlider/>
                <CompanyVideo/>
                <AboutTeam/>
                
            </div> 
        </div>
    );
}
export default About;