import { useEffect, useState } from "react";
import { Button, OverlayTrigger, Popover, Table, Tooltip } from "react-bootstrap";
import { FiStar, FiUser } from "react-icons/fi";
import { useSelector } from "react-redux";
import { getRequestOptions } from "../../../api/fetch/requestOptions";
import { config } from "../../../config";
import { Event } from "./types";
import "./eventTable.css";
import EventModal from "./EventModal";
import Empty from "../error/Empty";

const EventTable = () => {
    
    const { details } = useSelector((state: any) => state.user);

    const [events, setEvents] = useState<Event[]>([]);

    const getEvents = async () => {
        await fetch(config.API_URL + "/event", getRequestOptions)
            .then(response => response.json())
            .then(data => {
                setEvents(data);
            })
            .catch(err => console.log(err));
    }

    useEffect(() => {
        getEvents();
    }, []);


    const popover = (
        <Popover id="popover-basic">
          <Popover.Header as="h3">Popover right</Popover.Header>
          <Popover.Body>
            And here's some <strong>amazing</strong> content. It's very engaging.
            right?
          </Popover.Body>
        </Popover>
    );

    return (
        <div className="layout_content_container_columns">
            {
                events.length === 0
                ? <Empty message={"You currently have no upcoming events."}/>
                : <Table hover>
                    <thead>
                        <tr>
                            <th>Event Name</th>
                            <th className="no-display-mobile">Start Time</th>
                            <th className="no-display-mobile">End Time</th>
                            <th className="no-display-mobile">Access</th>
                            <th className="no-display-mobile">Category</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            events &&
                            events.map((event, id) => {
                                return (
                                    <tr key={id}>
                                        <td>
                                            {event.owner_id === details.id && 
                                                <FiUser />
                                            } {event.event_name}
                                        </td>
                                        <td className="no-display-mobile">{new Date(event.start_time).toLocaleString()}</td>
                                        <td className="no-display-mobile">{new Date(event.end_time).toLocaleString()}</td>
                                        <td className="no-display-mobile">{event.access}</td>
                                        <td className="no-display-mobile">{event.category}</td>
                                        <td><EventModal event={event}/></td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </Table>
            }
        </div>
    )
}

export default EventTable;