import calendar from "../../../static/icon/homeIcons/calendar.png";
import group from "../../../static/icon/homeIcons/group.png"
import counsellor from "../../../static/icon/homeIcons/online-counselling.png";
import volunteer from "../../../static/icon/homeIcons/volunteer.png";
import HomeNav from "./HomeNav";
import { Carousel } from "react-bootstrap";
import "./home.css";
import nuhImage from "../../../static/icon/homeIcons/nuh-building.png";
import Footer from "./Footer";
import { Link } from "react-router-dom";
import { useEffect } from "react";

const Home = () => {
    return <div className="home">
        <div>
            <HomeNav />
        </div>
        <div className="home_top_row">
            <div className="home_top_row_left_col">
                <p>Managing <span>mental wellness</span> for a <span>happier NUS.</span></p>
                {/* <p className="home_top_row_left_col_subheading">Founded by the community for the community.</p> */}
                <div className="homenav_buttons">
                    <Link to="/register" className="homenav_btn btn hero_btn">Join Us Now!</Link>
                </div>
            </div>
            <div className="home_top_row_right_col">
                <Carousel className="home_carousel" indicators={false}>
                    <Carousel.Item>
                        <img
                        className="home_carousel_img"
                        src={calendar}
                        alt="First slide"
                        />
                        <div className="home_carousel_caption">
                            <h3>Book a Session</h3>
                            <p>Make an appointment with a particular counsellor easily.</p>
                        </div>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                        className="home_carousel_img"
                        src={group}
                        alt="Second slide"
                        />
                        <div className="home_carousel_caption">
                            <h3>Group Matching</h3>
                            <p>Find a group of like-minded peers to go through thick and thin together.</p>
                        </div>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                        className="home_carousel_img"
                        src={counsellor}
                        alt="Third slide"
                        />
                        <div className="home_carousel_caption">
                            <h3>On-Demand Counselling</h3>
                            <p>Get matched with an available counsellor immediately.</p>
                        </div>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                        className="home_carousel_img"
                        src={volunteer}
                        alt="Fourth slide"
                        />
                        <div className="home_carousel_caption">
                            <h3>Volunteer to help others</h3>
                            <p>Choose to lend a helping hand by training to be a student volunteer counsellor.</p>
                        </div>
                    </Carousel.Item>
                </Carousel>
            </div>
        </div>
        <div className="home_second_row">
            <div className="home_second_row_container">
                <div className="home_second_row_header">About WellNUS</div>
                <div className="home_second_row_content">
                    WellNUS supports the friend making process and provide on-demand mental health support provided by student volunteers and mental health professionals.
                </div>
                <div className="home_second_row_content no-display-mobile">
                    In 2022, researchers at NUHS Mind Science Centre found that 3 in 4 NUS students are at risk of depression due to the pandemic and restrictions imposed to curb the spread of Covid-19. These restrictions hampered opportunities for students to meet new people of common interests that can share their hardships they might face. One can argue that NUS has many CCAs and holds many events that offer great opportunities to make new friends. However, many of these events are shared through word of mouth and students who do participate in these events do so with their friends. The result is that it is easier to make friends when you have friends to begin with.
                    WellNUS jump starts the friend making process and provide on-demand mental health support provided by student volunteers and mental health professionals.
                </div>
            </div>
            {/* <img src={nuhImage} className="home_second_row_img" alt="NUH"/> */}
        </div>
        <div className="home_third_row">
            <div className="home_third_row_header">Core Features</div>
            <div className="home_cards">
                <div className="home_card">
                    <img src={calendar} className="home_card_img" alt="calendar" />
                    <h4>Book a Session</h4>
                    <p className="home_card_caption">Make an appointment with a particular counsellor easily.</p>
                </div>
                <div className="home_card">
                    <img src={group} className="home_card_img" alt="group"/>
                    <h4>Group Matching</h4>
                    <p className="home_card_caption">Find a group of like-minded peers to go through thick and thin together.</p>
                </div>
                <div className="home_card">
                    <img src={counsellor} className="home_card_img" alt="counsellor"/>
                    <h4>On-Demand Counselling</h4>
                    <p className="home_card_caption">Get matched with an available counsellor immediately.</p>
                </div>
                <div className="home_card">
                    <img src={volunteer} className="home_card_img" alt="volunteer"/>
                    <h4>Volunteer to help others</h4>
                    <p className="home_card_caption">Choose to lend a helping hand by training to be a student volunteer counsellor.</p>
                </div>
            </div>
        </div>
        <div className="home_fourth_row">
            <Footer />
        </div>
    </div>
}

export default Home;