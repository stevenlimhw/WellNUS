import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import DateTimePicker from "react-datetime-picker";
import { postRequestOptions } from "../../../../api/fetch/requestOptions";
import { config } from "../../../../config";
import { Booking } from "../types";

type Props = {
    start_time: string,
    end_time: string,
    booking: Booking,
    providerID: number
}

const ChangeTiming = ({ start_time, end_time, booking, providerID } : Props) => {

    // Modal
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // booking timing
    const [startTime, setStartTime] = useState(new Date(start_time));
    const [endTime, setEndTime] = useState(new Date(end_time));

    const handleModifyTiming = async () => {
        const requestOptions = {
            ...postRequestOptions,
            body: JSON.stringify({
                "approve": false,
                "booking": {
                    ...booking,
                    "approve_by": providerID,
                    "start_time": startTime,
                    "end_time": endTime
                }
            })
        }
        await fetch(config.API_URL + "/booking/" + booking?.id, requestOptions)
            .then(res => res.json())
            .then(data => {
                window.location.reload();
            })
            .catch(err => console.log(err));
    }

    return (
        <div>
            <Button className="bookingRequest_button" onClick={handleShow}>
                Edit Timing
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Change Booking Timing</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <DateTimePicker onChange={setStartTime} value={startTime} className="bookingModal-datetime"/>
                    <DateTimePicker onChange={setEndTime} value={endTime} className="bookingModal-datetime"/>
                </Modal.Body>
                <div className="button-centralised">
                    <Button className="modal_btn" onClick={handleModifyTiming}>
                        Save Changes
                    </Button>
                </div>
            </Modal>
            
        </div>
    )
}

export default ChangeTiming;