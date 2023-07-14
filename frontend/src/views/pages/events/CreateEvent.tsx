import { useState } from "react";
import { Button, Form, Modal, Tooltip } from "react-bootstrap";
import DateTimePicker from "react-datetime-picker";
import { MultiSelect } from "react-multi-select-component";
import { postRequestOptions } from "../../../api/fetch/requestOptions";
import { config } from "../../../config";


const availableAccess = [
    { label: "Public", value: "PUBLIC" },
    { label: "Private", value: "PRIVATE" },
]

const availableCategory = [
    { label: "Counsel", value: "COUNSEL" },
    { label: "Support", value: "SUPPORT" },
    { label: "Custom", value: "CUSTOM" },
]

const CreateEvent = () => {

    // Modal
    const [errMsg, setErrMsg] = useState("");
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // Event Fields
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const [access, setAccess] = useState("PUBLIC");
    const [category, setCategory] = useState("COUNSEL");

    const handleCreateEvent = async () => {
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
            ...postRequestOptions,
            body: JSON.stringify(eventDetails)
        }
        await fetch(config.API_URL + "/event", requestOptions)
            .then(response => response.json())
            .then(data => {
                window.location.reload();
            })
            .catch(err => console.log(err));
    }

    return (
        <div>
            <Button variant="primary" onClick={handleShow} className="layout_heading_button">
                Create Event
            </Button>
            <Modal show={show} onHide={handleClose} className="create_group_modal">
                <Modal.Header closeButton className="create_group_modal_header">
                <Modal.Title>Create Event</Modal.Title>
                </Modal.Header>
                <Modal.Body className="create_group_modal_body">
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
                    <div className="button-position">
                        <Button className="modal_btn" onClick={handleCreateEvent}>Create Event</Button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default CreateEvent;