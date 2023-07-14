import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { abortableGetRequestOptions } from "../../../api/fetch/requestOptions";
import { MessagePayload, WebSocketUnit } from "../../../api/websocketunit/websocketunit";
import { config } from "../../../config";
import "./chat.css";
import { ChatMessage } from "./ChatMessage";

type Props = {
    socket: WebSocketUnit;
    groupId: number;
};

enum ScrollAction {
    ToEnd = "toEnd",
    Hold = "hold"
}

type ScrollAdjustment = {
    scrollTop: number;
    scrollHeight: number;
    clientHeight: number;
    action: ScrollAction;
}

const ChatLog = (props: Props) => {
    const { groupId, socket } = props;
    const { details } = useSelector((state: any) => state.user);
    const { id } = details;

    const messageLog = useRef<HTMLDivElement>(null);    
    
    const [messagePayloads, setMessagePayloads] = useState<MessagePayload[]>([]);
    const [scrollAdjustment, setScrollAdjustment ] = useState<ScrollAdjustment>({
        scrollTop: 0, 
        scrollHeight: 0, 
        clientHeight: 0, 
        action: ScrollAction.ToEnd
    }) //Used to memorise scroll state of previous render and signal how to adjust scroll in the subsequent render;

    useEffect(() => {
        if (messageLog.current === null) return;
        const log = messageLog.current;
        let messageLoader: NodeJS.Timeout;
        let abortController = new AbortController();
        let earliestTime = "";
        messageLoader = setInterval(async () => {
            if (log.scrollTop === 0) {
                const ext = `/message/${groupId}?latest=${earliestTime}&limit=5`
                const resp = await fetch(config.API_URL + ext, abortableGetRequestOptions(abortController.signal));
                const data = await resp.json();
                try {
                    if (resp.status === 200 ) {
                        const { earliest_time, message_payloads } = data;
                        if (message_payloads.length <= 0) {
                            clearTimeout(messageLoader);
                            return;
                        }
                        earliestTime = earliest_time;
                        setMessagePayloads(prev => [...message_payloads, ...prev]);
                        setScrollAdjustment({
                            scrollTop: log.scrollTop,
                            scrollHeight: log.scrollHeight,
                            clientHeight: log.clientHeight,
                            action: ScrollAction.Hold
                        });
                    } else {
                        clearInterval(messageLoader);
                        throw new Error(data.toString());
                    }
                } catch (err) {
                    clearInterval(messageLoader);
                    console.error(err);
                }
            }
        }, 100);
            
        socket.addMessageHandler("sameGroupMessages", (payload: MessagePayload): void => {
            if (payload.message.group_id === groupId) {
                setMessagePayloads(prev => [...prev, payload]);
                setScrollAdjustment({ 
                    scrollTop: log.scrollTop,
                    scrollHeight: log.scrollHeight,
                    clientHeight: log.clientHeight,
                    action: ScrollAction.ToEnd 
                })
            }
        })

        return () => {
            abortController.abort();
            clearInterval(messageLoader);
        };
    }, [])

    useLayoutEffect(() => {
        // scroll states from log are of new render
        // scroll states from scrollAdjustment are from previous render
        if (messageLog.current === null) return;
        const log = messageLog.current;
        const { action, scrollTop, scrollHeight, clientHeight } = scrollAdjustment
        switch (action) {
            case ScrollAction.ToEnd:
                if (scrollTop < scrollHeight - clientHeight - 2) return;
                log.scrollTop = log.scrollHeight;
                return;
            case ScrollAction.Hold:
                log.scrollTop = log.scrollHeight - (scrollHeight - scrollTop);
                return;
        }
    }, [scrollAdjustment]);

    return (
        <div className="messages_wrapper" ref={messageLog}>
            {
                messagePayloads?.map((messagePayload, i) => {
                    return <ChatMessage 
                        key={i}
                        ownMessage={messagePayload.message.user_id === id}
                        messagePayload={messagePayload} 
                    />
                })
            }
        </div>
    );
}

export default ChatLog;