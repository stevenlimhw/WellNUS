import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { MultiSelect } from "react-multi-select-component";
import { useSelector } from "react-redux";
import { deleteRequestOptions, getRequestOptions, postRequestOptions } from "../../../api/fetch/requestOptions";
import { config } from "../../../config";
import GeneralForm from "../../components/form/GeneralForm";
import "./counselModal.css";

const availableTopics = [
    { label: "Anxiety", value: "Anxiety" },
    { label: "Off My Chest", value: "OffMyChest" },
    { label: "Self Harm", value: "SelfHarm" },
    { label: "Depression", value: "Depression" },
    { label: "Self Esteem", value: "SelfEsteem" },
    { label: "Stress", value: "Stress" },
    { label: "Casual", value: "Casual" },
    { label: "Therapy", value: "Therapy" },
    { label: "Bad Habits", value: "BadHabits" },
    { label: "Rehabilitation", value: "Rehabilitation" },
];

const CounselModal = () => {
    
    const { details, loggedIn } = useSelector((state: any) => state.user);
    const [counselRequest, setCounselRequest] = useState({ details: "not yet added", last_updated: "never", topics: ["not yet added"] });

    const [requestDetails, setRequestDetails] = useState("");
    // const [nickname, setNickname] = useState();
    const [selectedOptions, setSelectedOptions] = useState<any[]>([]);

    const [errMsg, setErrMsg] = useState("");
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleDetailsChange = (e: any) => {
        setRequestDetails(e.target.value);
    }

    const getCounselRequest = async () => {
        await fetch(config.API_URL + "/counsel/" + details.id, getRequestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Counsel Request has not been initialised before.");
                }
                return response.json();
            })
            .then(data => {
                setCounselRequest(data);
            })
            .catch(err => console.log(err));
    }

    useEffect(() => {
        getCounselRequest();
    }, []);

    const handleSetRequest = async () => {
        const topics = selectedOptions.map((option) => option.value);
        const requestOptions = {
            ...postRequestOptions,
            body: JSON.stringify({
                nickname: details.first_name,
                details: requestDetails,
                topics: topics
            })
        }
        await fetch(config.API_URL + "/counsel", requestOptions)
            .then(response => {
                // if (!response.ok) {
                //     throw new Error("Counsel Request has not been initialised before.");
                // }
                return response.json();
            })
            .then(data => {
                setCounselRequest(data);
                window.location.reload();
            })
            .catch(err => console.log(err));
    }

    const handleClearRequest = async () => {
        await fetch(config.API_URL + "/counsel", deleteRequestOptions)
            .then(response => response.json())
            .then(data => {
                window.location.reload();
            })
            .catch(err => {
                console.log(err);
            });
    }

    return (
        <div>
        {
            counselRequest &&
            <div>
                <Button variant="primary" onClick={handleShow} className="layout_heading_button">
                    Request Group Counsellor
                </Button>
                <Modal show={show} onHide={handleClose} className="create_group_modal">
                    <Modal.Header closeButton>
                    <Modal.Title>Counsel Request Status</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <div>Your request will be sent to all counsellors. Once accepted by a counsellor, you will be put in a group with the counsellor.</div>
                    <br/>
                    {/* Request Body : { details, topics[] } */}
                        <div>
                            <b>Details</b><br />
                            {counselRequest.details}
                            <br /><br />
                            <b>Last Updated</b><br />
                            {new Date(counselRequest.last_updated).toLocaleDateString()}
                        </div>
                        <hr />
                            <b>Topics</b><br />
                        <div className="counselRequest_topics">
                            {
                                counselRequest.topics.map((topic, id) => {
                                    return (
                                        <div key={id} className="counselRequest_topic">
                                            {topic}
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <br />
                        <hr />
                        <Form>
                            {/* <Form.Group className="mb-3 counselModal_textarea">
                                <Form.Control
                                    placeholder="Enter your nickname..."
                                    onChange={(e: any) => setNickname(e.target.value)}/>
                            </Form.Group> */}
                            <Form.Group className="mb-3 counselModal_textarea">
                                <Form.Control 
                                    as="textarea" 
                                    rows={3} 
                                    placeholder="Enter some details for the counsellor to know..."
                                    onChange={handleDetailsChange}/>
                            </Form.Group>
                        </Form>
                        <MultiSelect
                                options={availableTopics}
                                value={selectedOptions}
                                onChange={setSelectedOptions}
                                labelledBy="Select"
                                hasSelectAll={false}
                                className=""
                        />
                        <div className="centre_div">
                            <button className="modal_btn" onClick={handleSetRequest}>Set Request</button>
                        </div>
                        <div className="centre_div">
                            <Button className="modal_btn" onClick={handleClearRequest}>Clear Request</Button>
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
        }
        </div>
    );
}

export default CounselModal;