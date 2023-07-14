import { Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router";
import Navbar from "../../components/navbar/Navbar";
import BookingModal from "../booking/BookingModal";
import BookingRequests from "./member/BookingRequests";
import CounselGrid from "../booking/CounselGrid";
import CounselModal from "../booking/CounselModal";
import ProviderBookingRequests from "./provider/ProviderBookingRequests";

const Requests = () => {
    const { details } = useSelector((state: any) => state.user);

    // if (details.user_role !== "MEMBER") {
    //     // navigate("/");
    //     return <Navigate to="/dashboard" />
    // }

    return (
        <div className="layout_container">
            <Navbar hideTop={false} />
            <div className="layout_heading_container">
                {/* <div className="layout_heading_title">Form a counselling group with a counsellor</div> */}
                <div className="layout_heading_title">{details.user_role === "MEMBER" ? "Sent Requests" : "Inbox"}</div>
                <div className="layout_heading_buttons">
                    {/* <CounselModal /> */}
                    {/* <BookingModal /> */}
                </div>
            </div>
            {
                details.user_role === "MEMBER"
                ? <BookingRequests />
                : <ProviderBookingRequests />
            }
            {/* <CounselGrid /> */}
            {/* <BookingRequests /> */}
        </div>
    )
}

export default Requests;