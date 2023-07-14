import { WebSocketUnit } from "../../../api/websocketunit/websocketunit";
import ChatInput from "./ChatInput";
import ChatLog from "./ChatLog";
import { ChatNotification } from "./ChatNotification";

type Props = {
    socket: WebSocketUnit;
    groupId: number;
}

const Chat = (props: Props) => {    
    const { socket, groupId } = props;

    return (
        <div className="chat-wrapper">
            <ChatNotification 
                socket={socket}
                groupId={groupId} 
            />
            <ChatLog 
                socket={socket}
                groupId={groupId}
            />
            <ChatInput socket={socket}/>
        </div>
    )
}

export default Chat;