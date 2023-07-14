import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import DateTimePicker from "react-datetime-picker";
import { useSelector } from "react-redux";
import { deleteRequestOptions, getRequestOptions } from "../../../../api/fetch/requestOptions";
import { config } from "../../../../config";
import Empty from "../../error/Empty";
import { Booking } from "../types";
import "./bookingRequests.css";
import ChangeTiming from "./ChangeTiming";

type BookingsProp = {
    user: {
        first_name: string,
        last_name: string,
        id: number
    },
    booking: Booking
}

const BookingRequests = () => {

    const { details } = useSelector((state: any) => state.user);
    const [bookings, setBookings] = useState<BookingsProp[]>([]);


    const getBookings = async () => {
        await fetch(config.API_URL + "/booking", getRequestOptions)
            .then(response => response.json())
            .then(data => {
                // console.log(data);
                setBookings(data);
            })
    }

    useEffect(() => {
        getBookings();
    }, []);

    const handleDelete =  async (booking_id: number) => {
        await fetch(config.API_URL + "/booking/" + booking_id, deleteRequestOptions)
            .then(response => response.json())
            .then(data => {
                window.location.reload();
            })
            .catch(err => console.log(err));
    }
    
    return (
        <div className="">
            <h2 className="bookingRequest_subheading">Pending booking requests you sent</h2>
            <div className="layout_content_container_grid">
                {
                    bookings.length === 0 &&
                    <Empty message={"You have no pending requests."}/>
                }
                {
                    bookings.map((obj, id) => {
                        return (
                            <div key={id} className="bookingRequest">
                                {
                                    obj && obj.booking &&
                                    <div>
                                        <div className="bookingRequest_heading">To: {obj.user.first_name} {obj.user.last_name}</div>
                                        <div>{obj.booking.details}</div>
                                        <br />
                                        <div><b>Start: </b>{new Date(obj.booking.start_time).toLocaleString()}</div>
                                        <div><b>End: </b>{new Date(obj.booking.end_time).toLocaleString()}</div>
                                        <br />
                                        <div className="flex-around">
                                            {
                                                obj.booking && obj.booking.start_time && obj.booking.end_time &&
                                                <ChangeTiming start_time={obj.booking.start_time} end_time={obj.booking.end_time} booking={obj.booking} providerID={obj.user.id}/>
                                            }
                                            <Button className="request_delete" onClick={() => {
                                                if (obj?.booking?.id === undefined) {
                                                    window.location.reload();
                                                    return;
                                                }
                                                handleDelete(obj?.booking?.id);
                                            }}>Delete</Button>
                                        </div>
                                    </div>
                                }
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default BookingRequests;