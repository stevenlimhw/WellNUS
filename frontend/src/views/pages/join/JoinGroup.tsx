import React, { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import GeneralForm from "../../components/form/GeneralForm";
import "../meet/group.css";
import Navbar from "../../components/navbar/Navbar";
import { abortableGetRequestOptions, deleteRequestOptions, getRequestOptions, patchRequestOptions, postRequestOptions } from "../../../api/fetch/requestOptions";
import { config } from "../../../config";
import JoinModal from "./JoinModal";
import { useSelector } from "react-redux";
import "./join.css";
import Match from "./match/Match";
import AlertDismissible from "../../components/form/AlertDismissible";
// import ProviderSettings from "./ProviderSettings";
import CounselRequests from "../admin/CounselRequests";
import JoinGroupRequests from "./JoinGroupRequests";

const JoinGroup = () => {
    const { details } = useSelector((state: any) => state.user);
    const [requests, setRequests] = useState<any[]>([]);
    const [errMsg, setErrMsg] = useState("");
    const [showErr, setShowErr] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);

    const handleFetch = (): AbortController => {
        const abortController = new AbortController();
        fetch(config.API_URL + "/join", abortableGetRequestOptions(abortController.signal))
            .then(response => response.json())
            .then(data => {
                console.log(data)
                setRequests(data);
            })
            .catch(err => console.log(err));
        return abortController;
    }

    const handleJoin = async (e: any) => {
        e.preventDefault();
        const requestOptions = {
            ...postRequestOptions,
            body: JSON.stringify({
                "group_id": parseInt(e.target[0].value, 10),
            })
        }
        await fetch(config.API_URL + "/join", requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log(data);
            });
        window.location.reload();
    }

    const handleMatching = async () => {
        await fetch(config.API_URL + "/match", postRequestOptions)
        .then(response => {
            if (!response.ok) {
                setErrMsg("You have already made a match request. You will be informed of the group you are matched to once the system finishes its allocation.");
                setShowErr(true);
                throw new Error("You have already made a match request.");
            }
            return response.json()
        })
        .then(data => {
            setSuccessMsg("Matching process started. The system will inform you once you have been matched to a suitable group.");
            setShowSuccess(true);
        })
        .catch(err => console.log(err));
    }

    useEffect(() => {
        const abortController = handleFetch();
        return () => {
            abortController.abort();
        }
    }, []);

    return (
        <div className="layout_container">
            <Navbar hideTop={false}/>
            <div className="layout_heading_container">
                <div className="layout_heading_title">{details.user_role === "MEMBER" ? "Join an existing counselling group" : "Provider Admin Panel"}</div>
                <div className="layout_heading_buttons">
                    <JoinModal />
                    <Button className="layout_heading_button" onClick={handleMatching}>Get Matched</Button>
                </div>
            </div>
            <div className="layout_content_container_rows">
                <div className="join_content_container_left">
                    {
                        details.user_role === "MEMBER" &&
                        <div>
                            <Match />
                        </div>
                    }
                    {
                        showErr && <AlertDismissible msg={errMsg} display={showErr} onClose={() => setShowErr(false)} success={false}/>
                    }
                    {
                        showSuccess && <AlertDismissible msg={successMsg} display={showSuccess} onClose={() => setShowSuccess(false)} success={true} />
                    }
                </div>
                <div className="join_content_container_right">
                        {
                            details.user_role === "MEMBER" &&
                            <div>
                            <h2>Group Requests</h2>
                                <JoinGroupRequests requests={requests} details={details} />
                            </div>
                        }
                </div>
            </div>
        </div>
    )
}

export default JoinGroup;