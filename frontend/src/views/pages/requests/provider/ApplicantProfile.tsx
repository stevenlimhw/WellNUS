import { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import DateTimePicker from "react-datetime-picker";
import { patchRequestOptions, postRequestOptions } from "../../../../api/fetch/requestOptions";
import { config } from "../../../../config";
import { Applicant, Booking } from "../types";

const ApplicantProfile = ({ applicant, booking } : { applicant: Applicant, booking: Booking }) => {

    // Modal
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // Revised timing
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());

    const getOriginalTiming = (booking: Booking) => {
        if (!booking) {
            setStartTime(new Date());
            setEndTime(new Date());
        } else {
            setStartTime(new Date(booking.start_time));
            setEndTime(new Date(booking.end_time));
        }
    }

    useEffect(() => {
        booking?.start_time && booking?.end_time && getOriginalTiming(booking);
    }, []);

    const handleApprove = async () => {
        const requestOptions = {
            ...postRequestOptions,
            body: JSON.stringify({
                "approve": true,
                "booking": booking
            })
        }
        await fetch(config.API_URL + "/booking/" + booking?.id, requestOptions)
            .then(response => response.json())
            .then(data => window.location.reload())
            .catch(err => console.log(err));
    }

    const handleModifyTiming = async () => {
        const requestOptions = {
            ...postRequestOptions,
            body: JSON.stringify({
                "approve": false,
                "booking": {
                    ...booking,
                    "approve_by": applicant?.user.id,
                    "start_time": startTime,
                    "end_time": endTime
                }
            })
        }
        await fetch(config.API_URL + "/booking/" + booking?.id, requestOptions)
            .then(res => res.json())
            .then(data => console.log(data))
            .catch(err => console.log(err));
    }

    return (
        <div>
            <Button onClick={handleShow} className="bookingRequest_button">View Applicant</Button>
            <Modal show={show} onHide={handleClose} className="create_group_modal">
                <Modal.Header closeButton>
                <Modal.Title>Applicant Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <div>{booking?.details}</div>
                        <hr />
                        <div><b>Name: </b>{applicant?.user.first_name} {applicant?.user.last_name}</div>
                        <div><b>Email: </b>{applicant?.user.email}</div>
                        <div><b>Faculty: </b>{applicant?.user.faculty}</div>
                        <div><b>Gender: </b>{applicant?.user.gender === "M" ? "Male" : "Female"}</div>
                        <br />
                        <div><b>Timing:</b></div>
                        <DateTimePicker onChange={setStartTime} value={startTime} className="bookingModal-datetime"/>
                        <DateTimePicker onChange={setEndTime} value={endTime} className="bookingModal-datetime"/>
                        <div className="button-centralised">
                            <Button className="modal_btn" onClick={handleModifyTiming}>
                                Change Timing
                            </Button>
                        </div>
                        <hr />
                        <div>Once you approve the applicant's booking request, you will be added into an automatically-generated group with that applicant.</div>
                        <div className="button-centralised">
                            <Button className="modal_btn" onClick={handleApprove}>
                                Approve
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default ApplicantProfile;