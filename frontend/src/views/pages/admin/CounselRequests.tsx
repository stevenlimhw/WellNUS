import { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { deleteRequestOptions, getRequestOptions, postRequestOptions } from "../../../api/fetch/requestOptions";
import { config } from "../../../config";

const CounselRequests = () => {

    const { details } = useSelector((state: any) => state.user);
    const [requests, setRequests] = useState<any[]>([]);

    const handleDelete =  async () => {
        await fetch(config.API_URL + "/counsel/" + details.id, deleteRequestOptions)
            .then(response => response.json())
            .then(data => window.location.reload())
            .catch(err => console.log(err));
    }

    const handleApprove = async (user_id: string) => {
        await fetch(config.API_URL + "/counsel/" + user_id, postRequestOptions)
            .then(response => response.json())
            .then(data => {
                window.location.reload();
            })
            .catch(err => console.log(err));
    }

    // const handleReject = (x: any) => {

    // }

    const getCounselRequests = async () => {
        await fetch(config.API_URL + "/counsel", getRequestOptions)
            .then(response => response.json())
            .then(data => {
                setRequests(data);
                // console.log(data);
            })
    }

    useEffect(() => {
        getCounselRequests();
    }, []);

    return (
        <div>
            <h2>Group Counsel Requests</h2>
            <div><b>Note: </b>Once you accepted a request, you will be added into an automatically generated group with the applicant.</div>
            <br />
            <Table className="joinGroup_table" size="lg" width={100} hover>
                <thead>
                    <tr className="">
                        {/* <th className="display-none">Request ID</th> */}
                        <th>Applicant</th>
                        <th>Details</th>
                        <th>Topics</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map((request, id) => {
                        const topicArray = request.topics.map((topic: any) => topic + ", ");
                        // remove comma from last topic
                        topicArray[topicArray.length - 1] = topicArray[topicArray.length - 1].slice(0, -2);
                        return (
                            <tr key={id} className="">
                                {/* <td className="display-none">{request.join_request.id}</td> */}
                                {
                                    request.user_id === details.id
                                    ? <td>You</td>
                                    : <td>{request.nickname}</td>
                                }
                                <td>{request.details}</td>
                                <td>
                                    {topicArray}
                                </td>
                                <td className="request_action_buttons">
                                    {
                                        <Button onClick={() => handleApprove(request.user_id)} className="request_approve">Accept</Button>
                                    }
                                    {
                                        request.user_id === details.id &&
                                        <Button onClick={handleDelete} className="request_delete">Delete</Button>
                                    }
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
        </div>
    )
}

export default CounselRequests;