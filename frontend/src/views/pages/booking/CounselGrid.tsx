import "./counselGrid.css";
import { FiUserCheck, FiUserPlus, FiUserX } from "react-icons/fi";
import { useEffect, useState } from "react";
import { config } from "../../../config";
import { getRequestOptions, postRequestOptions } from "../../../api/fetch/requestOptions";
import { Button } from "react-bootstrap";
import BookingModal from "./BookingModal";
import Empty from "../error/Empty";

const CounselGrid = () => {

    // { id, first_name, last_name, gender, faculty, email, user_role, password, password_hash }
    const [counsellors, setCounsellors] = useState([{
        setting: {
            intro: "",
            topics: [],
            user_id: ""
        },
        user: {
            first_name: "",
            last_name: "",
            user_role: "",
            gender: "",
            id: ""
        }
    }]);

    const getCounsellors = async () => {
        await fetch(config.API_URL + "/provider", getRequestOptions)
            .then(response => response.json())
            .then(data => {
                setCounsellors(data);
            });
    }

    useEffect(() => {
        getCounsellors();
    }, []);

    // const [details, setDetails] = useState();
    // const [startTime, setStartTime] = useState();
    // const [endTime, setEndTime] = useState();

    // const handleBooking = async (provider_id: string) => {
    //     const requestOptions = {
    //         ...postRequestOptions,
    //         body: JSON.stringify({
    //             provider_id: provider_id,
    //             details: details,
    //             start_time: startTime,
    //             end_time: endTime
    //         })
    //     }
    //     await fetch(config.API_URL + "/booking", requestOptions)
    //         .then(response => response.json())
    //         .then(data => console.log(data));
    // }

    return (
        <div className="layout_content_container_grid">
            {
                counsellors.length === 0 &&
                <Empty message={"There are no counsellors or volunteers currently available."}/>
            }
            {
                counsellors &&
                counsellors.map((counsellor, index) => {
                    return (
                        <div key={index} className="counsellor_card">
                            <div className="counsellor_card_heading">
                                <div className="counsellor_name">{
                                    // counsellor.setting.available 
                                    true
                                    ? <FiUserCheck /> : <FiUserX />} {counsellor.user.first_name} {counsellor.user.last_name}</div>
                                <div className={counsellor.user.gender === "M" ? "counsellor_male" : "counsellor_female"}>{counsellor.user.gender}</div>
                            </div>
                            <div className={counsellor.user.user_role === "COUNSELLOR" ? "counsellor_counsellor": "counsellor_volunteer"}>{counsellor.user.user_role}</div>
                            <div>{counsellor.setting.intro}</div>
                            <div className="counsellor_specialities">
                                {
                                    counsellor.setting.topics.map((topic, i) => {
                                        return (
                                            <div key={i} className="counsellor_speciality">
                                                {topic}
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <BookingModal provider_id={counsellor.user.id}/>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default CounselGrid;