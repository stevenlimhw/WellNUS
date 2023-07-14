import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { postRequestOptions, patchRequestOptions } from "../../../api/fetch/requestOptions";
import { config } from "../../../config";
import "./updateGroup.css";

type Props = { group_id: string | undefined, group_description: string | undefined, group_name: string | undefined };

const UpdateGroup = ({ group_id, group_description, group_name } : Props) => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [group, setGroup] = useState({
        name: group_name,
        description: group_description
    })

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setGroup(prev => ({
            ...prev,
           [name]: value 
        }))
    }

    const handleUpdateGroup = async () => {
        console.log(group)
        const requestOptions = {
            ...patchRequestOptions,
            body: JSON.stringify({
                group_name: group.name,
                group_description: group.description
            })
        }
        await fetch(config.API_URL + "/group/" + group_id, requestOptions)
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(err => console.log(err));
        window.location.reload();
    }

    return (
        <div>
            <Button className="groupRoom_button_exit" onClick={handleShow}>Update</Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Update Group</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form>
                    <Form.Group className="updateGroup-form-group">
                        <Form.Control type="text" placeholder="Enter group name..." name="name" onChange={handleChange} value={group.name} className="updateGroup-form-control"/>
                    </Form.Group>
                    <Form.Group className="updateGroup-form-group">
                        <Form.Control type="text" placeholder="Enter group description..." name="description" onChange={handleChange} value={group.description} className="updateGroup-form-control"/>
                    </Form.Group>
                </Form>
                </Modal.Body>
                <div className="button-centralised">
                    <Button className="modal_btn" onClick={handleUpdateGroup}>
                        Save Changes
                    </Button>
                </div>
            </Modal>
        </div>
    )
}

export default UpdateGroup;