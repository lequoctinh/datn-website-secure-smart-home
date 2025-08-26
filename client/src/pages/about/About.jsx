import React from "react";
import BannerAbout from "../about/components/BannerAbout"
import IntroducingTheCompany from "./components/IntroducingTheCompany"; 
import AboutTeam from './components/AboutTeam';

function About() {
    return(
        <div className="Container-About">
            <div className="Container-About_banner">
                <BannerAbout />
            </div>
            <div className="Container-About_main">
                <IntroducingTheCompany />
                <AboutTeam/>
            </div> 
        </div>
    );
}
export default About;