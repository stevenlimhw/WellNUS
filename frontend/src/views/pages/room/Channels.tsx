import React from "react";
import "../group.css";

const Channels = () => {
    return <div className="room-channels-wrapper">
        <div>
            <div>TEXT CHANNELS</div>
            <button className="room-channels-btn">General</button>
        </div>
        <div>
            <div>VOICE CHANNELS</div>
            <button className="room-channels-btn">Hangouts</button>
        </div>
    </div>
}

export default Channels;