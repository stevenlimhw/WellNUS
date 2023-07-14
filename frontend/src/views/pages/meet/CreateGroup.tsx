import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import userSlice from "../../../state/slices/user";
import { Button, Modal } from "react-bootstrap";
import exit from "../../../static/icon/navIcons/exit.png";
import GeneralForm from "../../components/form/GeneralForm";
import "./group.css";
import { postRequestOptions } from "../../../api/fetch/requestOptions";
import { config } from "../../../config";

const CreateGroup = () => {
    const [errMsg, setErrMsg] = useState("");
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleCreate = async (e: any) => {
        e.preventDefault();
        const groupDetails = {
            "group_name": e.target[0].value,
            "group_description": e.target[1].value,
            // "category": e.target[2].value
        }
        const requestOptions = {
            ...postRequestOptions,
            body: JSON.stringify(groupDetails)
        }
        await fetch(config.API_URL + "/group", requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                handleClose();
            });
        window.location.reload();
    }

    return (
        <div>
            <Button variant="primary" onClick={handleShow} className="layout_heading_button">
                Create Group
            </Button>
            <Modal show={show} onHide={handleClose} className="create_group_modal">
                <Modal.Header closeButton className="create_group_modal_header">
                <Modal.Title>Create Group</Modal.Title>
                </Modal.Header>
                <Modal.Body className="create_group_modal_body">
                    <GeneralForm 
                        onSubmit={handleCreate}
                        fields={[
                            {
                                id: "name",
                                type: "text",
                                label: "Name",
                                placeholder: "Enter group name...",
                                notes: ""
                            },
                            {
                                id: "description",
                                type: "text",
                                label: "Description",
                                placeholder: "Enter group description...",
                                notes: "This field is optional."
                            },
                            // {
                            //     id: "category",
                            //     type: "select",
                            //     label: "Category",
                            //     placeholder: "Enter group category...",
                            //     notes: "",
                            //     choices: [
                            //         "Enter group category...",
                            //         "SUPPORT",
                            //         "COUNSEL"
                            //     ]
                            // },
                        ]}
                        error={errMsg}
                        displayError={errMsg !== ""}
                        closeError={() => setErrMsg("")}
                        hideSubmit={true}/>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default CreateGroup;