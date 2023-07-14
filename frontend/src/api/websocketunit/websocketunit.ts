export type User = {
    id: number;
    first_name: string;
    last_name: string;
    gender: string;
    faculty: string;
    email: string;
    user_role: string;
    password_hash: string;
}

export type MessagePayload = {
    tag: number;
    sender_name: string;
    group_name: string;
    message: {
        user_id: number;
        group_id: number;
        time_added: string;
        msg: string;
    }
}

export type ChatStatusPayload = {
    tag: number;
    group_id: number;
    group_name: string;
    sorted_in_chat_members: User[];
    sorted_online_members: User[];
    sorted_offline_members: User[];
}

export type Payload = MessagePayload | ChatStatusPayload;

export class WebSocketUnit {
    socket: WebSocket;
    messageHandlers: Map<string, (payload: MessagePayload)=>void>;
    chatStatusHandlers: Map<string, (payload: ChatStatusPayload)=>void>;

    constructor(url: string) {
        // Setting fields
        this.socket = new WebSocket(url);
        this.messageHandlers = new Map<string, (payload: MessagePayload)=>void>();
        this.chatStatusHandlers = new Map<string, (payload: ChatStatusPayload)=>void>();

        // Setting socket
        this.socket.onopen = () => {
            console.log("Successfully Connected");
        };
    
        this.socket.onmessage = (msgEvent: MessageEvent<string>) => {
            const payload = JSON.parse(msgEvent.data);
            const { tag } = payload;
            switch(tag) {
                case 0:
                    this.messageHandlers.forEach(handler => {
                        handler(payload as MessagePayload);
                    });
                    return;
                case 1:
                    this.chatStatusHandlers.forEach(handler => {
                        handler(payload as ChatStatusPayload);
                    });
                    return;
                default:
                    console.log("Payload had unrecognised tag. Payload: ", payload);
                    return;
            }
        };
    
        this.socket.onclose = (event: any) => {
            console.log("Socket Closed Connection: ", event);
        };
    
        this.socket.onerror = (error: any) => {
            console.log("Socket Error: ", error);
        };
    }

    addMessageHandler(identifier: string, handler: (payload: MessagePayload) => void): void {
        this.messageHandlers.set(identifier, handler);
    }

    removeMessageHandler(identifier: string): void {
        this.messageHandlers.delete(identifier);
    }

    addChatStatusHandler(identifier: string, handler: (payload: ChatStatusPayload) => void): void {
        this.chatStatusHandlers.set(identifier, handler);
    }
    
    removeChatStatusHandler(identifier: string): void {
        this.chatStatusHandlers.delete(identifier);
    }

    sendMsg(msg: string) {
        console.log("Sending msg: ", msg);
        this.socket.send(msg);
    }

    close(): void {
        this.socket.close()
    }
}