import { useEffect, useRef, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap"
import DateTimePicker from "react-datetime-picker";
import { FiUser } from "react-icons/fi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { deleteRequestOptions, getRequestOptions, patchRequestOptions, postRequestOptions } from "../../../api/fetch/requestOptions";
import { config } from "../../../config";
import "./eventTable.css";
import "./eventModal.css";
import { Event } from "./types";

type Props = {
    event: Event
}

const EventModal = ({ event } : Props) => {
    const navigate = useNavigate();
    const { details } = useSelector((state: any) => state.user);
    // Modal
    const [errMsg, setErrMsg] = useState("");
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // Event Fields
    const [name, setName] = useState(event.event_name);
    const [description, setDescription] = useState(event.event_description);
    const [startTime, setStartTime] = useState(new Date(event.start_time));
    const [endTime, setEndTime] = useState(new Date(event.end_time));
    const [access, setAccess] = useState(event.access);
    const [category, setCategory] = useState(event.category);
    const [users, setUsers] = useState<any[]>([]);

    // Add user
    const [userID, setUserID] = useState("");

    const getUsers = async () => {
        await fetch(config.API_URL + "/event/" + event.id, getRequestOptions)
            .then(response => response.json())
            .then(data => {
                // console.log(data.users);
                setUsers(data.users);
            })
            .catch(err => console.log(err));
    }

    useEffect(() => {
        getUsers();
    }, []);

    const handleUpdateEvent = async () => {
        // Request Body: { event_name, event_description, start_time, end_time, access, category }
        const eventDetails = {
            "event_name": name,
            "event_description": description,
            "start_time": startTime,
            "end_time": endTime,
            "access": access,
            "category": category
        }
        const requestOptions = {
            ...patchRequestOptions,
            body: JSON.stringify(eventDetails)
        }
        await fetch(config.API_URL + "/event/" + event.id, requestOptions)
            .then(response => response.json())
            .then(data => {
                window.location.reload();
            })
            .catch(err => console.log(err));
    }

    const handleDeleteEvent = async () => {
        await fetch(config.API_URL + "/event/" + event.id, deleteRequestOptions)
            .then(response => response.json())
            .then(data => {
                window.location.reload();
            })
            .catch(err => console.log(err));
    }

    const handleAddUser = async () => {
        if (userID === "") return;
        const requestOptions = {
            ...postRequestOptions,
            body: JSON.stringify({
                user_id: Number(userID)
            })
        }
        await fetch(config.API_URL + "/event/" + event.id, requestOptions)
            .then(response => response.json())
            .then(data => {
                window.location.reload();
            });
    }

    const handleStartEvent = async () => {
        await fetch(config.API_URL + "/event/" + event.id + "/start", postRequestOptions)
            .then(response => response.json())
            .then(data => {
                navigate("/groups/" + data.group.id);
            })
    }

    return (
        <div>
            <Button className="eventTable-btn" onClick={handleShow}>View</Button>
            <Modal show={show} onHide={handleClose} className="create_group_modal">
                <Modal.Header closeButton className="create_group_modal_header">
                <Modal.Title>Event Details</Modal.Title>
                </Modal.Header>
                <Modal.Body className="create_group_modal_body">
                    {
                        event.access === "PUBLIC"
                        ? <div>
                            <div className="flex-around">
                                <h2>{name}</h2>
                                <div>Event ID: <b>{event.id}</b></div>
                            </div>
                            <div>Note: This is a public event. To allow someone else to join this event, send them this event's Event ID.</div>
                            <br />
                        </div>
                        : <div>
                            <h2>{name}</h2>
                        </div>
                    }
                    {
                        event.owner_id === details.id &&
                        <div className="event-owner">{event.owner_id === details.id && <div><FiUser /> You are the owner of this event.</div>}</div>
                    }
                    <div><b>Description: </b>{description}</div>
                    <div><b>Start:</b> {startTime.toLocaleString()}</div>
                    <div><b>End:</b> {endTime.toLocaleString()}</div>
                    <div><b>Access: </b>{access}</div>
                    <div><b>Category: </b>{category}</div>
                    <div>
                        <b>Members: </b>
                        <ol>
                            {
                                users && users.map((user, index) => {
                                    return (
                                        <li key={index}>{user.first_name} {user.last_name}</li>
                                    )
                                })
                            }
                        </ol>
                    </div>
                    {
                        event.owner_id === details.id &&
                        <div>
                            <div className="button-centralised">
                                <Button className="modal_btn" onClick={handleStartEvent}>Start Event</Button>
                            </div>
                            <div className="button-centralised">Once clicked, you will be redirected to a newly-generated room with all the event members. And this event will be deleted permanently.</div>
                        </div>
                    }
                    {
                        event.owner_id === details.id &&
                        <div>
                            <br />
                            <hr />
                            <br />
                            <h2>Add User to Event</h2>
                            <Form className="bookingModal-form">
                                <Form.Group className="bookingModal-form-group" onChange={(e: any) => setUserID(e.target.value)}>
                                    <Form.Control type="text" placeholder="Enter user ID..." />
                                </Form.Group>
                            </Form>
                            <div className="button-centralised">
                                <Button className="modal_btn" onClick={handleAddUser}>Add User to Event</Button>
                            </div>
                        </div>
                    }
                    {
                        event.owner_id === details.id &&
                        <div>
                            <br />
                            <hr />
                            <br />
                            <h2>Update Event Details</h2>
                            <Form className="bookingModal-form">
                                <Form.Group className="bookingModal-form-group" onChange={(e: any) => setName(e.target.value)}>
                                    <Form.Control type="text" placeholder="Enter event name..." />
                                </Form.Group>
                                <Form.Group className="bookingModal-form-group" onChange={(e: any) => setDescription(e.target.value)}>
                                    <Form.Control type="text" placeholder="Enter event description..." />
                                </Form.Group>
                            </Form>
                            {/* TODO: Add start and end date here */}
                            Start Time:
                            <DateTimePicker onChange={setStartTime} value={startTime} className="bookingModal-datetime"/>
                            End Time:
                            <DateTimePicker onChange={setEndTime} value={endTime} className="bookingModal-datetime"/>
                            <br />
                            <Form.Select onChange={(e) => setAccess(e.target.value)}>
                                <option value="PRIVATE">Select the event access...</option>
                                <option value="PUBLIC">Public</option>
                                <option value="PRIVATE">Private</option>
                            </Form.Select>
                            <Form.Select onChange={(e) => setCategory(e.target.value)}>
                                <option value="COUNSEL">Select the event category...</option>
                                <option value="COUNSEL">Counsel</option>
                                <option value="SUPPORT">Support</option>
                                <option value="CUSTOM">Custom</option>
                            </Form.Select>
                            <div className="button-centralised">
                                <Button className="modal_btn" onClick={handleUpdateEvent}>Update Event</Button>
                                <Button className="modal_btn" onClick={handleDeleteEvent}>Delete Event</Button>
                            </div>
                        </div>
                    }
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default EventModal;