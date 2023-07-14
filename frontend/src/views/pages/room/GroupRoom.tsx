import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import Members from "./Members";
import "../meet/group.css";
import GroupDetails from "./GroupDetails";
import { GroupDetails as GroupDetailsType } from "../../../types/group/types";
import Navbar from "../../components/navbar/Navbar";
import Chat from "../../components/chat/Chat";
import { abortableGetRequestOptions, deleteRequestOptions } from "../../../api/fetch/requestOptions";
import { config } from "../../../config";
import { WebSocketUnit } from "../../../api/websocketunit/websocketunit";
import "./groupRoom.css";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import UpdateGroup from "./UpdateGroup";

const Group = () => {
    const navigate = useNavigate();
    const { details } = useSelector((state: any) => state.user);
    const { group_id } = useParams();
    const [group, setGroup] = useState<GroupDetailsType>();
    const socket = useRef<WebSocketUnit>();

    const handleDeleteGroup = async () => {
        await fetch(config.API_URL + "/group/" + group_id, deleteRequestOptions)
            .then(response => response.json())
            .then(data => {
                navigate("/groups");
            });
    }

    useEffect(() => {
        const abortController = new AbortController();
        if (group_id === undefined) {
            console.error("group_id param is undefined");
            return;
        }
        const groupId = parseInt(group_id, 10);
        if (groupId === NaN) {
            console.error("group_id param is not a number");
            return;
        }

        if (socket.current !== undefined) socket.current.close();
        socket.current = new WebSocketUnit(config.WS_API_URL + "/" + group_id);
        fetch(config.API_URL + `/group/${groupId}`, abortableGetRequestOptions(abortController.signal))
            .then(response => response.json())
            .then(data => setGroup(data.group));

        return () => {
            if (socket.current !== undefined) socket.current.close();
            abortController.abort();
        };
    }, []);

    if (socket.current === undefined || group === undefined) return null;
    return (
        <div>
            <div className="groupRoom">
                <div className="groupRoom_left">
                    <GroupDetails group={group}/>
                    <Members socket={socket.current} />
                    <br /><br />
                    <div className="groupRoom_buttons_wrapper">
                        <Link to="/groups">
                            <Button className="groupRoom_button_exit">Back</Button>
                        </Link>
                        {
                            group.owner_id === details.id &&
                            <UpdateGroup group_id={group_id} group_name={group.group_name} group_description={group.group_description} />
                        }
                        {
                            group.owner_id === details.id &&
                            <Button className="groupRoom_button_delete" onClick={handleDeleteGroup}>Leave</Button>
                        }
                    </div>
                </div>
                <div className="groupRoom_right">
                    <Chat
                        socket={socket.current}
                        groupId={group.id}
                    />
                </div>
            </div>
        </div>
    )
}

export default Group;