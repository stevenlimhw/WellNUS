package ws

import (
	"wellnus/backend/db/model"
	"database/sql"
	"fmt"
	"time"
	"sort"
)

type User = model.User
type Message = model.Message
type MessagePayload = model.MessagePayload
type ChatStatusPayload = model.ChatStatusPayload

// Hub maintains the set of active clients and broadcasts messages to the
// clients.
type Hub struct {
	// Connected DB.
	DB			*sql.DB

	// Registered clients.
	Clients 	map[*Client]bool

	// Inbound messages from the clients.
	Broadcast 	chan Message

	// Register requests from the clients.
	Register 	chan *Client

	// Unregister requests from clients.
	Unregister 	chan *Client
}

func NewHub(db *sql.DB) *Hub {
	return &Hub{
		DB:			db,
		Clients:    make(map[*Client]bool),
		Broadcast:  make(chan Message),
		Register:   make(chan *Client),
		Unregister: make(chan *Client),
	}
}

func (h *Hub) ChatStatusPayload(groupID int64) (ChatStatusPayload, error) {
	group, err := model.GetGroup(h.DB, groupID)
	if err != nil { return ChatStatusPayload{}, err }
	usersInGroup, err := model.GetAllUsersOfGroup(h.DB, groupID)
	if err != nil { return ChatStatusPayload{}, err }

	usersInGroupMap := make(map[int64]User)
	for _, user := range usersInGroup {
		usersInGroupMap[user.ID] = user
	}

	MakeLess := func(users []User) func(int, int) bool {
		return func(i, j int) bool {
			return users[i].ID < users[j].ID
		}
	}
	inChatMembers := make([]User, 0) 
	onlineMembers := make([]User, 0)	
	offlineMembers := make([]User, 0)
	fmt.Printf("Websocket Clients UserID: [")
	for client := range h.Clients {
		fmt.Printf("%d, ", client.UserID)
		user, ok := usersInGroupMap[client.UserID]
		if ok {
			if client.GroupID == groupID {
				inChatMembers = append(inChatMembers, user)
			} else {
				onlineMembers = append(onlineMembers, user)
			}
			delete(usersInGroupMap, client.UserID)
		}
	}
	fmt.Println("]")
	for _, user  := range usersInGroupMap {
		offlineMembers = append(offlineMembers, user)
	}
	sort.Slice(inChatMembers, MakeLess(inChatMembers))
	sort.Slice(onlineMembers, MakeLess(onlineMembers))
	sort.Slice(offlineMembers, MakeLess(offlineMembers))

	return ChatStatusPayload{
		Tag: model.ChatStatusTag, 
		GroupID: groupID,
		GroupName: group.GroupName, 
		SortedInChatMembers: inChatMembers,
		SortedOnlineMembers: onlineMembers,
		SortedOfflineMembers: offlineMembers,
	}, nil
}

// Members are in only 1 of 3 states (in chat, online or offline)
// inChat means the member is on the given chat page
// online means the member is connected but on some other chat page
// offline means the member is not connected

// toOnline = true 		means to send to clients in chat or online
// toOnline = false 	means to send to clients in chat
func (h *Hub) SendOutToGroup(groupID int64, payload interface{}, toOnline bool) error {
	recipients, err := model.GetAllUsersOfGroup(h.DB, groupID)
	if err != nil { return err }
	recipientsMap := make(map[int64]bool)
	for _, user := range recipients {
		recipientsMap[user.ID] = true
	}
	if err != nil { return err }
	for client := range h.Clients {
		if recipientsMap[client.UserID] {
			if !toOnline && client.GroupID != groupID { continue }
			select {
				case client.Send <- payload:
				default:
					close(client.Send)
					delete(h.Clients, client)
			}
		}
	}
	return nil
}

func (h *Hub) SendOutChatStatus(userID int64) error {
	// userID is of user that induce the change in chat status
	groups, err := model.GetAllGroupsOfUser(h.DB, userID)
	if err != nil { return err }
	for _, group := range groups {
		chatStatusPayload, err := h.ChatStatusPayload(group.ID)
		if err != nil { return err }
		err = h.SendOutToGroup(group.ID, chatStatusPayload, false)
		if err != nil { return err }
	}
	return nil
}

func (h *Hub) Run() {
	for {
		select {
		case client := <-h.Register:
			h.Clients[client] = true
			
			err := h.SendOutChatStatus(client.UserID)
			if err != nil {
				fmt.Printf("An error occured during sending chat status payload. %v \n", err)
				continue
			}

			clientName, err := client.UserName(h.DB)
			if err != nil {
				fmt.Printf("An error occured during retrieving first name of client. %v \n", err)
				continue
			}
			serverMessagePayload, err := Message{
				UserID: model.ServerUserID, 
				GroupID: client.GroupID,
				TimeAdded: time.Now(),
				Msg: fmt.Sprintf("%s has joined the chat.", clientName),
			}.Payload(h.DB)
			if err != nil {
				fmt.Printf("An error occured during creating server message payload. %v \n", err)
				continue
			}
			h.SendOutToGroup(client.GroupID, serverMessagePayload, false)
		case client := <-h.Unregister:
			if _, ok := h.Clients[client]; ok {
				delete(h.Clients, client)
				close(client.Send)

				err := h.SendOutChatStatus(client.UserID)
				if err != nil {
					fmt.Printf("An error occured during sending chat status payload. %v \n", err)
					continue
				}
				
				clientName, err := client.UserName(h.DB)
				if err != nil {
					fmt.Printf("An error occured during retrieving first name of client. %v \n", err)
					continue
				}
				serverMessagePayload, err := Message{
					UserID: model.ServerUserID, 
					GroupID: client.GroupID,
					TimeAdded: time.Now(),
					Msg: fmt.Sprintf("%s has left the chat.", clientName),
				}.Payload(h.DB)
				if err != nil {
					fmt.Printf("An error occured during creating server message payload. %v \n", err)
					continue
				}
				h.SendOutToGroup(client.GroupID, serverMessagePayload, false)
			}
		case message := <-h.Broadcast:
			if !message.IsServerMessage() {
				if err := model.AddMessage(h.DB, message); err != nil {
					fmt.Printf("An error occured during adding to database. %v \n", err)
					continue
				}
			}
			
			messagePayload, err := message.Payload(h.DB)
			if err != nil {
				fmt.Printf("An error occured during loading. %v \n", err)
				continue
			}
			
			err = h.SendOutToGroup(message.GroupID, messagePayload, true)
			if err != nil {
				fmt.Printf("An error occured while getting recipient set. %v \n", err)
				continue
			}
		}
	}
}