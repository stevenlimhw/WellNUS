type Props = {
    ownMessage: boolean;
    messagePayload: any;
}

export const ChatMessage = (props: Props) => {
    const { ownMessage, messagePayload} = props
    const { sender_name, message } = messagePayload
    const messageTime = new Date(message.time_added).toTimeString().slice(0, 5);

    if (ownMessage) {
        return (
            <div className="message_wrapper_self">
                <div className="message_sender_self">{sender_name}</div>
                <div className="message_content_self">{message.msg}</div>
                <div className="message_time_self">{messageTime}</div>
            </div>
        )
    }

    return (
        <div className="message_wrapper">
            <div className="message_sender">{sender_name}</div>
            <div className="message_content">{message.msg}</div>
            <div className="message_time">{messageTime}</div>
        </div> 
    )
}