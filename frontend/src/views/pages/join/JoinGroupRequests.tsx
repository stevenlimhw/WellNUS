import { Table, Button } from "react-bootstrap";
import { deleteRequestOptions, patchRequestOptions } from "../../../api/fetch/requestOptions";
import { config } from "../../../config";

type Props = {
    requests: any[],
    details: any
}

const JoinGroupRequests = ({ requests, details } : Props) => {
    const handleApprove = async (requestID : number) => {
        const requestOptions = {
            ...patchRequestOptions,
            body: JSON.stringify({
                "approve": true
            })
        }
        await fetch(config.API_URL + "/join/" + requestID, requestOptions)
            .then(response => response.json())
            .then(data => console.log(data));
        window.location.reload();
    }

    const handleReject = async (requestID : number) => {
        const requestOptions = {
            ...patchRequestOptions,
            body: JSON.stringify({
                "approve": false
            })
        }
        await fetch(config.API_URL + "/join/" + requestID, requestOptions)
            .then(response => response.json())
            .then(data => console.log(data));
        window.location.reload();
    }

    const handleDelete = async (requestID : string) => {
        await fetch(config.API_URL + "/join/" + requestID, deleteRequestOptions)
            .then(response => response.json())
            .then(data => console.log(data));
        window.location.reload();
    }

    return (
        <Table className="joinGroup_table" size="lg" width={100} hover>
            <thead>
                <tr className="">
                    <th className="display-none">Request ID</th>
                    <th>Applicant</th>
                    <th>Group#ID</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {requests.map((request, id) => {
                    return (
                        <tr key={id} className="">
                            <td className="display-none" role="request_id">{request.join_request.id}</td>
                            {
                                request.user.id === details.id
                                ? <td>You</td>
                                : <td role="request_applicant">{request.user.first_name}</td>
                            }
                            <td role="request_groupWithID">{request.group.group_name}#{request.join_request.group_id}</td>
                            <td className="request_action_buttons">
                                {
                                    request.user.email === details.email
                                    ? <Button onClick={() => handleDelete(request.join_request.id)} className="request_delete">Delete</Button>
                                    : <div>
                                        <Button onClick={() => handleApprove(request.join_request.id)} className="request_approve">Approve</Button>
                                        <Button onClick={() => handleReject(request.join_request.id)} className="request_reject">Reject</Button>
                                    </div>
                                }
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        </Table>
    )
}

export default JoinGroupRequests;