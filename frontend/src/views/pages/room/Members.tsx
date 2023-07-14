import React, { useEffect, useState } from "react";
import { ChatStatusPayload, User, WebSocketUnit } from "../../../api/websocketunit/websocketunit";
import "../meet/group.css";
import "./members.css";

type Props = {
    socket: WebSocketUnit;
}

const Members = (props: Props) => {
    const { socket } = props;
    const [inChatMembers, setInChatMembers] = useState<User[]>([]);
    const [onlineMembers, setOnlineMembers] = useState<User[]>([]);
    const [offlineMembers, setOfflineMembers] = useState<User[]>([]);

    useEffect(() => {
        socket.addChatStatusHandler("chatStatusHandler", (payload: ChatStatusPayload): void => {
            const { sorted_in_chat_members, sorted_online_members, sorted_offline_members } = payload;
            setInChatMembers(sorted_in_chat_members);
            setOnlineMembers(sorted_online_members);
            setOfflineMembers(sorted_offline_members);
        });
    }, [inChatMembers, onlineMembers, offlineMembers]);

    return <div className="members no-display">
        <div>
             <div>In Chat</div>
            {inChatMembers?.map((member, key) => {
                return (
                    <div key={key} className="member">{member.first_name}</div>
                )
            })}
        </div>
        <div>
            <div>Online</div>
            {onlineMembers?.map((member, key) => {
                return (
                    <div key={key} className="member">{member.first_name}</div>
                )
            })}
        </div>
        <div>
            <div>Offline</div>
            {offlineMembers?.map((member, key) => {
                return (
                    <div key={key} className="member">{member.first_name}</div>
                )
            })}
        </div>
    </div>
}

export default Members;