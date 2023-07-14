import Navbar from "../../components/navbar/Navbar";
import CreateEvent from "./CreateEvent";
import EventTable from "./EventTable";
import JoinEvent from "./JoinEvent";

const Events = () => {
    return (
        <div className="layout_container">
            <Navbar hideTop={false}/>
            <div className="layout_heading_container">
                <div className="layout_heading_title">Upcoming Events</div>
                <div className="layout_heading_buttons">
                    <JoinEvent/>
                    <CreateEvent />
                </div>
            </div>
            <EventTable />
        </div>
    )
}

export default Events;