import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { GroupDetails as GroupDetailsType } from "../../../types/group/types";
import "./groupRoom.css";

type Props = {
    group: GroupDetailsType
}

const GroupDetails = (props : Props) => {
    const { group } = props;
    // console.log(group)
    return (
        <div className="groupDetails">
            <div className="">
                <div className="groupRoom_title">{group.group_name}</div>
                <div className="groupRoom_detail"><b>Group ID: #{group.id}</b></div>
            </div>
            <br className="no-display"/>
            <div className="groupRoom_detail no-display">{group.group_description}</div>
            <div className="groupRoom_category no-display">{group.category}</div>
        </div>
    )
}

export default GroupDetails;