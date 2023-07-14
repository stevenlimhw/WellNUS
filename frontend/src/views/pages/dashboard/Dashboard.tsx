import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import Navbar from "../../components/navbar/Navbar";
import Home from "../home/Home";
import Board from "./Board";
import "./dashboard.css";

const Dashboard = () => {
    const { details, loggedIn } = useSelector((state: any) => state.user);

    // render home page if no user is logged in
    if (!loggedIn) {
        return (
            <div>
                You are not logged in.
                <Home />
            </div>
        )
    }

    return <div>
        <Navbar hideTop={false}/>
        <div className="dashboard_title">Welcome back, {details.first_name}!</div>
        <div className="dashboard_boards">
            <Board title="Announcements" flexDirection="row"/>
            <div className="upcoming_appointments">
                <Board title="Upcoming Appointments" flexDirection="column"/>
            </div>
        </div>
    </div>
}

export default Dashboard;