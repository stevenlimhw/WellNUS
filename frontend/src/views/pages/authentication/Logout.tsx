import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import userSlice from "../../../state/slices/user";
import { Button, Modal } from "react-bootstrap";
import exit from "../../../static/icon/navIcons/exit.png";
import { config } from "../../../config";
import { deleteRequestOptions } from "../../../api/fetch/requestOptions";
import "./authentication.css";

const LogoutModal = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state: any) => state.user);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleLogout = async () => {
        await fetch(config.API_URL + "/session", deleteRequestOptions);
        const logout = userSlice.actions.logout;
        dispatch(logout(user));
        navigate("/");
        window.location.reload();
    }

    return (
        <div>
            <Button variant="primary" onClick={handleShow} className="logout_button">
                <img src={exit} alt="exit"/>
            </Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Confirm Logout</Modal.Title>
                </Modal.Header>
                <Modal.Body>Click on the Log out button below.</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleLogout} className="layout_heading_button">
                        Log out
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default LogoutModal;