import { FormEvent, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { WebSocketUnit } from "../../../api/websocketunit/websocketunit";
import sendIcon from "../../../static/icon/send.png";

type Props = {
    socket: WebSocketUnit;
}

const ChatInput = (props: Props) => {
    const { socket } = props;
    const [message, setMessage] = useState("");

    const handleChange = (e: any) => setMessage(e.target.value);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        socket.sendMsg(message);
        setMessage("");
    }
    
    return (
        <div>
            <form onSubmit={handleSubmit} className="chatinput_wrapper">
                <input placeholder="Write your message..." type="text" value={message} onChange={handleChange} className="chatinput_input" />
                <Button type="submit" className="chatinput_send"><img src={sendIcon} alt={"send"}/></Button>
            </form>
        </div>
    )
}

export default ChatInput;