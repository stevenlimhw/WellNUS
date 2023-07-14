import { useSelector } from "react-redux";
import Navbar from "../../components/navbar/Navbar";
import CounselRequests from "./CounselRequests";
import ProviderSettings from "./ProviderSettings";

const Admin = () => {
    const { details } = useSelector((state: any) => state.user);
    return (
        <div className="layout_container">
            <Navbar hideTop={false}/>
            <div className="layout_heading_container">
                <div className="layout_heading_title">{details.user_role === "MEMBER" ? "Join a group" : "Provider Admin Panel"}</div>
            </div>
            <div className="layout_content_container_rows">
                <div className="join_content_container_left">
                    <ProviderSettings />
                </div>
                <div className="join_content_container_right">
                    <CounselRequests />
                </div>
            </div>
        </div>
    )
}

export default Admin;