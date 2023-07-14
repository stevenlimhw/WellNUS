import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "./home.css";
import logo from "../../../static/icon/navIcons/logo.png"

const HomeNav = () => {
    const { loggedIn } = useSelector((state: any): any => state.user);
    if (loggedIn) {
        return <Link to="/dashboard" className="btn">Go To Dashboard</Link>
    } 
    return <div className="homenav">
        <div>
            <img src={logo} className="homenav_logo"/>
            {/* <div className="homenav_logotext">WellNUS</div> */}
        </div>
        <div className="homenav_buttons">
            <Link to="/login" className="homenav_btn btn">Login</Link>
        </div>
    </div>
}

export default HomeNav;