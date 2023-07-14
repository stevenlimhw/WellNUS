import React from "react";
import { NavLink, Link } from "react-router-dom";
import "./navbar.css";
// import logo from "../../../static/icon/navIcons/logo2.png";
import logo from "../../../static/icon/navIcons/logo.png";
import bell from "../../../static/icon/navIcons/bell.png";
import exit from "../../../static/icon/navIcons/exit.png";
import profile from "../../../static/icon/navIcons/profile.png";
import { useSelector } from "react-redux";
import LogoutModal from "../../pages/authentication/Logout";
import ProfileModal from "../profile/Profile";
import NavbarCollapsed from "./NavbarCollapsed";

const Navbar = (props : { hideTop : boolean }) => {
    const { hideTop } = props;
    const { details, loggedIn } = useSelector((state: any) => state.user);
    return <NavbarCollapsed />;
}

export default Navbar;