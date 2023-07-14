import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import GeneralForm from "../../components/form/GeneralForm";
import "../meet/group.css";
import { postRequestOptions } from "../../../api/fetch/requestOptions";
import { config } from "../../../config";

const JoinModal = () => {
    const [errMsg, setErrMsg] = useState("");
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

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

    return (
        <div>
            <Button variant="primary" onClick={handleShow} className="layout_heading_button">
                Join Group
            </Button>
            <Modal show={show} onHide={handleClose} className="create_group_modal">
                <Modal.Header closeButton>
                <Modal.Title>Join Group</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <GeneralForm 
                        onSubmit={handleJoin}
                        fields={[
                            {
                                id: "id",
                                type: "text",
                                label: "id",
                                placeholder: "Enter the group id...",
                                notes: ""
                            }
                        ]}
                        error={errMsg}
                        displayError={errMsg !== ""}
                        closeError={() => setErrMsg("")}
                        hideSubmit={true}
                    />
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default JoinModal;