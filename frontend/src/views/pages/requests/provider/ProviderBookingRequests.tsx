import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { getRequestOptions } from "../../../../api/fetch/requestOptions";
import { config } from "../../../../config";
import Empty from "../../error/Empty";
import { Applicant, BookingUser } from "../types";
import ApplicantProfile from "./ApplicantProfile";
import "./providerBookingRequests.css";

const ProviderBookingRequests = () => {
    const {details} = useSelector((state: any) => state.user);
    const [bookings, setBookings] = useState<BookingUser[]>([]);
    const [applicants, setApplicants] = useState<any[]>([]);

    const getBookings = async () => {
        await fetch(config.API_URL + "/booking", getRequestOptions)
            .then(response => response.json())
            .then(data => {
                setBookings(data);
            })
    }

    useEffect(() => {
        getBookings();
    }, []);

    const getApplicants = () => {
        bookings.map(async (obj) => {
            await fetch(config.API_URL + "/user/" + obj?.booking?.recipient_id, getRequestOptions)
            .then(response => response.json())
            .then(result => {
                // console.log(data);
                // if (applicant !== null) return;
                setApplicants(prev => ([
                    ...prev, { applicant: result, booking: obj }
                ]));
            })
            .catch(err => console.log(err))
        });
    }

    useEffect(() => {
        bookings.length > 0 && getApplicants();
    }, [bookings.length]);
    
    return (
        <div>
            {
                bookings &&
                <div className="">
                    <h2 className="bookingRequest_subheading">Booking Requests</h2>
                    <div className="layout_content_container_grid">
                        {
                            bookings.length === 0 &&
                            <Empty message={"You have no pending requests."}/>
                        }
                        {
                            applicants.map((appl, id) => {
                                return (
                                    // applicants &&
                                    <div key={id} className="bookingRequest">
                                        <div className="bookingRequest_heading">From: {appl.applicant.user.first_name} {appl.applicant.user.last_name}</div>
                                        <br />
                                        <div><b>Start: </b>{new Date(appl.booking.booking.start_time).toLocaleString()}</div>
                                        <div><b>End: </b>{new Date(appl.booking.booking.end_time).toLocaleString()}</div>
                                        <br />
                                        <div>
                                            <ApplicantProfile applicant={appl.applicant} booking={appl.booking.booking}/>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            }
        </div>
    )
}

export default ProviderBookingRequests;