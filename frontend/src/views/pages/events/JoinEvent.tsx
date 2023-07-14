import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useSelector } from "react-redux";
import { postRequestOptions } from "../../../api/fetch/requestOptions";
import { config } from "../../../config";

const JoinEvent = () => {
    const { details } = useSelector((state: any) => state.user);
    const userID = details.id;
    // Modal
    const [errMsg, setErrMsg] = useState("");
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // Request body details
    const [eventID, setEventID] = useState("");

    const handleJoin = async () => {
        const requestOptions = {
            ...postRequestOptions,
            body: JSON.stringify({
                user_id: userID
            })
        }
        await fetch(config.API_URL + "/event/" + eventID, requestOptions)
            .then(response => response.json())
            .then(data => window.location.reload())
            .catch(err => console.log(err));
    }

    return (
        <div>
            <Button variant="primary" onClick={handleShow} className="layout_heading_button">
                Join Event
            </Button>
            <Modal show={show} onHide={handleClose} className="create_group_modal">
                <Modal.Header closeButton className="create_group_modal_header">
                <Modal.Title>Join Public Event</Modal.Title>
                </Modal.Header>
                <Modal.Body className="create_group_modal_body">
                    <div>Note: You can only join public events.</div>
                    <Form className="bookingModal-form">
                        <Form.Group className="bookingModal-form-group" onChange={(e: any) => setEventID(e.target.value)}>
                            <Form.Control type="text" placeholder="Enter event ID..." />
                        </Form.Group>
                    </Form>
                    <div className="button-position">
                        <Button className="modal_btn" onClick={handleJoin}>Join Event</Button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default JoinEvent;