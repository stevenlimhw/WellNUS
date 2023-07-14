import React from "react";
import "./home.css";

const Footer = () => {
    return <div className="home_footer">
        <div className="home_footer_left">
            <div className="home_footer_heading">
                WellNUS
            </div>
            <div className="home_footer_subheading">
                Copyright © 2022 Team State            
            </div>
        </div>
        <div className="home_footer_right">
            <div className="home_footer_heading">Community</div>
            <div className="home_footer_subheading">About Us</div>
            <div className="home_footer_subheading">Contact Us</div>
            <br/>
            <br/>
            <div className="home_footer_heading">Legal</div>
            <div className="home_footer_subheading">Terms and Conditions</div>
            <div className="home_footer_subheading">Privacy Policy</div>
        </div>
    </div>
}

export default Footer;