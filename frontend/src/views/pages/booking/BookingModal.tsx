import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { MultiSelect } from "react-multi-select-component";
import { postRequestOptions } from "../../../api/fetch/requestOptions";
import { config } from "../../../config";
import DateTimePicker from 'react-datetime-picker';
import "./bookingModal.css";
import { useSelector } from "react-redux";

const BookingModal = ({ provider_id } : { provider_id: string }) => {
    const { first_name } = useSelector((state: any) => state.user.details);
    const [errMsg, setErrMsg] = useState("");
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [details, setDetails] = useState();
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());

    const handleBooking = async (provider_id: string) => {
        const requestOptions = {
            ...postRequestOptions,
            body: JSON.stringify({
                nickname: first_name,
                provider_id: provider_id,
                details: details,
                start_time: startTime,
                end_time: endTime
            })
        }
        await fetch(config.API_URL + "/booking", requestOptions)
            .then(response => response.json())
            .then(data => {
                window.location.reload();
            });
    }

    return (
        <div>
            {/* Request Counselling Session */}
            <Button variant="primary" onClick={handleShow} className="bookingModal_request_button">
                Request Session
            </Button>
            {/* <Button onClick={() => handleBooking(counsellor.user.id)}>Request Session</Button> */}
            <Modal show={show} onHide={handleClose} className="create_group_modal">
                <Modal.Header closeButton>
                <Modal.Title>Request for On-Demand Counselling</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Your booking request will be sent to the provider you have chosen. There will be no formation of groups upon
                    approval by the chosen provider. To request for group formation with a counsellor, go to the REQUESTS page and
                    click on Request Group Counsellor.
                    <br /><br />
                    <Form className="bookingModal-form">
                        <Form.Group className="bookingModal-form-group" onChange={(e: any) => setDetails(e.target.value)}>
                            <Form.Control type="text" placeholder="Enter details..." />
                        </Form.Group>
                    </Form>
                    {/* TODO: Add start and end date here */}
                    Start Time:
                    <DateTimePicker onChange={setStartTime} value={startTime} className="bookingModal-datetime"/>
                    End Time:
                    <DateTimePicker onChange={setEndTime} value={endTime} className="bookingModal-datetime"/>
                    <br />
                    <div className="button-position">
                        <Button className="modal_btn" onClick={() => handleBooking(provider_id)}>Send Request</Button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default BookingModal;