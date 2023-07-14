import Navbar from "../../components/navbar/Navbar";
import CounselGrid from "./CounselGrid";
import GroupsGrid from "../meet/GroupsGrid";
import CounselModal from "./CounselModal";

const Booking = () => {
    return (
        <div className="layout_container">
            <Navbar hideTop={false}/>
            <div className="layout_heading_container">
                <div className="layout_heading_title">Book On-Demand Counselling</div>
                <div className="layout_heading_buttons">
                    {/* <CreateGroup /> */}
                    <CounselModal />
                </div>
            </div>
            <CounselGrid />
        </div>
    )
}

export default Booking;