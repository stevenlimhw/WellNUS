import Navbar from "../../components/navbar/Navbar";
import CreateGroup from "./CreateGroup";
import GroupsGrid from "./GroupsGrid";
import "./group.css";
import { useSelector } from "react-redux";

const Groups = () => {
    const { user_role } = useSelector((state: any) => state.user.details);
    return (
        <div className="layout_container">
            <Navbar hideTop={false}/>
            <div className="layout_heading_container">
                <div className="layout_heading_title">{user_role === "MEMBER" ? "Meet your friends in your counselling groups" : "Meet your students" }</div>
                <div className="layout_heading_buttons">
                    <CreateGroup />
                </div>
            </div>
            <GroupsGrid />
        </div>
    );
}

export default Groups;