# [WellNUS backend](https://wellnus-backend.herokuapp.com/testing)

## Now deployed on heroku
You can access the frontend repository [here](https://github.com/WellNUS/frontend).

You can access the testing GUI environment backend deployed on heroku [here](https://wellnus-backend.herokuapp.com/testing).

## Installation and Setup
**IMPORTANT**: Ensure the database port is available before following any of the instructions below

### Running with docker compose
1. Get docker desktop on your machine
2. clone repository to you machine and cd into the folder
3. run `cp example.env .env`
4. go into .env file and update the configurations within the file
    - Set `RUN_WITH_DOCKER_COMPOSE=TRUE`
5. run `make composeup`

After you are done with the webserver, you may want to clean up.
1. run `make composedown` to clean up containers to make the database ports available again

### Running without docker compose
1. Get docker desktop on your machine
2. Clone repository to you machine and cd into the folder
3. Run `cp example.env .env`
4. Go into .env file and update the configurations within the file
    - Set `RUN_WITH_DOCKER_COMPOSE=FALSE`
5. Run the following commands to setup database (Skip if database has been setuped)
```
$ make initpg
$ make createdb
$ make migrateup
```
6. Run `go run .` to start the web server

After you are done with the webserver, you may want to clean up.
1. run the following to clean up containers to make the database ports available again
```
$ make stopdb
$ make deinitpg
```

### Deploying with Heroku
1. Heroku sets environment variables on their end, hence, set `IGNORE=TRUE` in the .env file
2. Heroku also does not use docker compose. Hence, set `RUN_WITH_DOCKER_COMPOSE=FALSE` in the .env file
2. Follow instructions on Heroku with Deployment method as Container Registry

### Running Unit Tests
Unit tests are only available without docker compose.
To run unit tests, run the following:
1. set `RUN_WITH_DOCKER_COMPOSE=FALSE` in the .env file
2. Run the following commands to setup database (Skp)
```
$ make initpg
$ make createdb
$ make migrateup
```
3. Run `make unittest` to run all unittest
    - Alternatively you may choose to cd to /unit_test/(feature) and run `go test` to run unit_test for a particular feature

### Notes to connect frontend to backend

> All Request made should have **credentials: "include"** so that cookies can be accessed and modified by backend

## Features

### Entity Relation Diagram
![WellNUS ERD](./blob/WellNUS%20ERD.svg)

### User

> #### Users Details
> 
>> Handles CRUD on users
>> 
>> User = { id, first_name, last_name, gender, faculty, email, user_role, password, password_hash }
>>
>>> User field specifications
>>> - gender = 1 of ('M', 'F')
>>> - faculty = 1 of ('CHS', 'BUSINESS', 'COMPUTING', 'DENTISTRY', 'CDE', 'LAW', 'MEDICINE', 'NURSING', 'PHARMACY', 'MUSIC')
>>> - email = ending with '@u.nus.edu'
>>> - user_role = 1 of ('MEMBER', 'VOLUNTEER', 'COUNSELLOR')
>>
>> UserWithGroups = { user: User, groups: Group[] }
> 
> #### User Routes
> 
>> ##### /user - GET
>>
>>> Description: Get all users
>>> 
>>> Query Params: 
>>> - ?role=MEMBER : Specify to only retrieve users who are members
>>> - ?role=VOLUNTEER : Specify to only retrieve users who are student volunteers
>>> - ?role=COUNSELLOR : Specify to only retrieve users who are counsellors
>>> - ?role=PROVIDER : Specify to retrieve users who are either student volunteers or counsellors
>>> - no query params : Retrieves all users
>>>
>>> Request Body : None
>>> 
>>> Response Body : User[]
>>
>> ##### /user - POST
>> 
>>> Description : Create a new user and logins as that
>>>
>>> Request Body : { first_name, last_name, gender, faculty, email, user_role, password }
>>>
>>> Response Body : User
>>
>> ##### /user/:id - GET
>> 
>>> Description : Gets user with given id and the user's corresponding groups 
>>>
>>> Request Body : None
>>>
>>> Response Body : UserWithGroups
>>
>> ##### /user/:id - PATCH
>> 
>>> Description : Update user with given id with updates, if the user is logged in
>>>
>>> Request Body : { first_name?, last_name?, gender?, faculty?, email?, user_role?, password? }
>>>
>>> Response Body : User
>>
>> ##### /user/:id - DELETE
>> 
>>> Description : Delete a user with given id, if the user is logged in
>>>
>>> Request Body : None
>>>
>>> Response Body : { id }

### Session

> #### Session Details
> 
>> Handles user authentication for registered users
> 
> #### Session Routes
> 
>> ##### /session - POST
>> 
>>> Description : Login to appropriate user
>>>
>>> Request Body : { email, password }
>>> 
>>> Response Body : { logged_in, user: User }
>> 
>> ##### /session - DELETE
>> 
>>> Description : Logout of any user
>>> 
>>> Request Body : None
>>> 
>>> Response Body : { logged_in, user: User }

### Group

> #### Group Details
> 
>> Handles creation, and joining of groups.
>> 
>> Each group must have at least an owner present in said group.
>>
>> Group = { id, group_name, group_description, category, owner_id } 
>>
>>> Group field specifications
>>> - category = 1 of ('COUNSEL', 'SUPPORT', 'CUSTOM')
>>
>> GroupWithUsers = { group: Group, users: User[] }
> 
> #### Group Routes
> 
>> ##### /group - GET
>> 
>>> Description : Get all groups that the user is in if the user is logged in.
>>> 
>>> Request Body : None
>>>
>>> Response Body : Group[]
>> 
>> ##### /group - POST
>> 
>>> Description : Creates a new custom group if user is logged in
>>>
>>> Request Body : { group_name, group_description? }
>>>
>>> Response Body : GroupWithUsers
>> 
>> ##### /group - DELETE
>>
>>> Description : Leave all groups, transferring ownership of group to a random user in each group if necessary. If it is the last user of a group, the group is deleted
>>> 
>>> Request Body : None
>>>
>>> Response Body : GroupWithUsers[]
>>
>> ##### /group/:id - GET
>> 
>>> Description : Get a group with given id and the users within the group
>>>
>>> Request Body : None
>>>
>>> Response Body : GroupWithUsers
>> 
>> ##### /group/:id - DELETE
>> 
>>> Description : Leaves the group, transferring ownership of group to a random user in group if necessary. If the last user leaves, the group is deleted.
>>>
>>> Request Body : None
>>>
>>> Response Body : GroupWithUsers
>>
>> ##### /group/:id - PATCH
>> 
>>> Description : Updates the information of the group if user is the owner of the given group
>>> 
>>> Request Body : { group_name?, group_description?, category?, owner_id? } 
>>>
>>> Response Body : Group

### Join

> #### Join Details
>
>> Handles CRUD on group join requests
>>
>> JoinRequest = { id, user_id, group_id }
>>
>> LoadedJoinRequest = { join_request: JoinRequest, user: User, group: Group }
>>
>> JoinRequestRespond = { approve }
>
> #### Join Routes
>
>> ##### /join - GET
>>
>>> Description : Get all loaded join requests sent by user or directed at user. Query params used to indicate what join request to retrieve.
>>>
>>> Query Params:
>>> - ?request=SENT : will get all join request sent by user
>>> - ?request=RECEIVED : will get all join request directed at user
>>> - no query params : will get all join request sent by and directed at user
>>> 
>>> Request Body : None
>>> 
>>> Response Body : LoadedJoinRequest[]
>>
>> ##### /join - POST
>>
>>> Description : Creates new join request to a certain group if the user is logged in.
>>>
>>> Request Body : { group_id }
>>> 
>>> Response Body : JoinRequest
>>
>> ##### /join/:id - GET
>>
>>> Description : Gets loaded join request with the given id (id refer to join request id)
>>>
>>> Request Body : None
>>>
>>> Response Body : LoadedJoinRequest
>>
>> ##### /join/:id - PATCH
>>
>>> Description : Approve or reject a particular join request with the given id if the user is the owner of the particular group (id refer to join request id)
>>>
>>> Request Body : JoinRequestRespond
>>>
>>> Response Body : JoinRequestRespond
>>
>> ##### /join/:id - DELETE
>>
>>> Description : Deletes the join request if the user is the owner of the request.
>>>
>>> Request Body : None
>>>
>>> Response Body : { id }

### Message

> #### Message Details
>
>> Handles the retrieval of past messages in groups. 
>>
>> The API takes in query params to indicate the limit and the latest message to load in. This is to enable dynamic loading of messages so that not all the chat history is loaded in at once. Refer to /template/chat/chat.html for reference on how to do this
>>
>> Message = { user_id, group_id, time_added, msg }
>>
>> MessagePayload = { tag=0, sender_name, group_name, message: Message }
>>
>> MessagesChunk = { earliest_time, latest_time, message_payloads: message_payload[] }
>
> #### Message Routes
>
>> ##### /message/:id - GET
>>
>>> Description : Gets messages chunk sent in the group of given id in ascending time sent.
>>>
>>> Query Params:
>>> - ?limit=(int) : Specify how many messages to load in. If unspecified or <= 0, will load all past messages
>>> - ?latest=(time) : Specify the latest time sent of the retrieved messages. If unspecified, will take current time as latest time. Note: Time specified must be in RFC3339Nano format. Example: "2006-01-02T15:04:05.999999999Z07:00"
>>>
>>> Request Body : None
>>>
>>> Response Body : MessagesChunk

### Websocket for chats

> #### Websocket details
>
>> Allows client to obtain a websocket connection to the server.
>>
>> The following is an example from /template/chat/chat.html on how to connect to the websocket with vanilla javascript. Head over to /template/chat/chat.html to see the full code
```
conn = new WebSocket("ws://" + document.location.host + "/ws/" + groupID);
conn.onclose = function (evt) {
    var item = document.createElement("div");
    item.innerHTML = "<b>Connection closed.</b>";
    appendLog(item);
};
conn.onmessage = function (evt) {
    var payload = JSON.parse(evt.data)
    handlePayload(payload)
};
```
>> Sending data to server:
>>
>>> The data sent to the server through the **conn** instance has a format of **Message** = { user_id, group_id, time_added and msg }.
>>
>> Receiving data from server:
>>
>>> The data received from the server through the **conn** instance is what we will call a **Payload**.
>>>
>>> A Payload always comprise of a **tag** field to indicate what kind of data has been passed through.
>>>
>>> Tag Reference sheet:
>>> - tag == 0 **MessagePayload**
>>>     - **MessagePayload** = { tag, sender_name, group_name, message: Message }
>>>         - If the **message.user_id == -1**, the message a Server Message and is not saved on database.
>>> - tag == 1 **ChatStatusPayload**
>>>     - **ChatStatusPayload** = { tag, group_id, group_name, sorted_in_chat_members, sorted_online_members, sorted_offline_members }
>>>         - Members of a group are in only 1 of 3 states
>>>             - in chat : Member is connected through websocket and is on chat page of the given group
>>>             - online : Member is connected through websocket and is on chat page of some other group
>>>             - offline : Member is not connected through websocket
>>>         - Union of **sorted_in_chat_members**, **sorted_online_members**, and **sorted_offline_members** form all group members of given group
>>> 
>>> These data sent from the server is sufficient to create the following chat features:
>>> - Live messages from users
>>> - Live messages from server
>>> - Notifications of users joining the chat
>>> - Notifications of users leaving the chat
>>> - Live updates of what users are online in a given group
>>> - Live updates of what users are in chat of the given group
>> 
>> Refer to /templates/chat/chat.html for reference on how to implement the chat feature
>
> #### Websocket Routes
>
>> ##### /ws/:group_id - GET
>>
>>> Description : Create a websocket connection with the url of "ws://(domain_name)/ws/(group_id)" which will return a connection object. Incoming payloads and outgoing messages will come and go through this connection object.
>>> 
>>> Request Body : None
>>>
>>> Response Body : None

### Match Setting

> #### Match Setting Details
>
>> Defines the match preferences for matching.
>>
>> Users can indicate
>> - Faculty Preferences
>> - Hobbies
>> - MBTI type
>>
>> These factors are considered during matching
>> 
>> MatchSetting = { user_id, faculty_preference, hobbies[], mbti }
>>
>>> MatchSetting field specifications
>>> - faculty_preference = 1 of ('MIX', 'SAME', 'NONE')
>>> - hobbies = at most 4 of ('GAMING', 'SINGING', 'DANCING', 'MUSIC', 'SPORTS', 'OUTDOOR', 'BOOK', 'ANIME', 'MOVIES', 'TV', 'ART', 'STUDY')
>>> - mbti = 1 of ('ISTJ','ISFJ','INFJ','INTJ','ISTP','ISFP','INFP','INTP','ESTP','ESFP','ENFP','ENTP','ESTJ','ESFJ','ENFJ','ENTJ')
>
> #### Match Setting Routes
>
>> ##### /setting - GET
>>
>>> Description : Get Match setting of the user if the user is logged in.
>>>
>>> Request Body : None
>>> 
>>> Response Body : MatchSetting
>> 
>> ##### /setting - POST
>>
>>> Description : Creates / Updates match setting of the user if the user is logged in.
>>>
>>> Request Body : { faculty_preference, hobbies[], mbti }
>>>
>>> Response Body : MatchSetting
>>
>> #### /setting - DELETE
>>
>>> Description : Deletes the match setting of user if user is logged in
>>>
>>> Request Body : None
>>>
>>> Response Body : { user_id }

### Match Request

> #### Match Request Details
> 
>> All matches are made when a certain number of match requests are present.
>> 
>> Current matching algorithm: (Subject to change)
>> 
>> 1. Randomly choose a match request
>> 2. Set requestee as the owner of the group
>> 3. Greedily satisfy a compatibility comparative function with other requests
>> 4. Form group users and remove their requests
>> 5. Repeat steps 1 to 5 till either all requests are fulfiled or there are not sufficient users
>> 
>> Compatability function:
>> - Compatibility function will give a score from 0 - 12 between 2 match request.
>> - Function will score according to
>>      - Faculty Preference (0 - 4 points)
>>      - MBTI compatibility (0 - 4 points)
>>      - Hobbies similarity (0 - 4 points)
>>
>> MatchRequest = { user_id, time_added }
>> LoadedMatchRequest = { match_request: MatchRequest, user: User, match_setting: MatchSetting }
> 
> #### Match Request Routes
> 
>> ##### /match - GET
>> 
>>> Description : Gets the number of match request
>>>
>>> Request Body : None
>>>
>>> Response Body : int64
>> 
>> ##### /match - POST
>> 
>>> Description : Creates a new match request of the user if user is loggedIn and has set up their match setting
>>>
>>> Request Body : None
>>>
>>> Response Body : MatchRequest
>> 
>> ##### /match - DELETE
>>
>>> Description : Deletes the match request of the user if the user is loggedIn
>>>
>>> Request Body : None
>>>
>>> Response Body : { user_id }
>>
>> ##### /match/:id - GET
>>
>>> Description : Gets the loaded match request of the user if the user 
>>>
>>> Request Body : None
>>>
>>> Response Body : LoadedMatchRequest

### Provider

> #### Provider Details
>
>> Handles CRUD for providers. A Provider refers to either a User with a **user_role = COUNSEL** or **user_role = VOLUNTEER**
>>
>> A provider can provide infomation about
>> - self-introduction
>> - topics
>>
>> ProviderSetting = { user_id, intro, topics[] }
>>
>>> ProviderSetting field specification
>>> - topics[] = at least 1 number of ('Anxiety', 'OffMyChest', 'SelfHarm', 'Depression', 'SelfEsteem', 'Stress', 'Casual', 'Therapy', 'BadHabits', 'Rehabilitation', 'Addiction', 'Family', 'Trauma', 'Career', 'Abandonment', 'Relationships', 'Identity', 'LGBT')
>>
>> Provider = { user: User, setting: ProviderSetting }
>>
>> ProviderWithEvents = { provider: Provider, events: Event[] }
>
> #### Provider Routes
>
>> ##### /provider - GET
>> 
>>> Description : Gets all providers with settings.
>>>
>>> Query Params:
>>> - ?topic=(topic) : filters counsel request by topic. Multiple topics can be used to filter by repeating the query params.
>>>
>>> Request Body : None
>>>
>>> Response Body : Provider[]
>>
>> ##### /provider - POST
>>
>>> Description : Creates / Updates provider setting of the user if the user is logged in and user is a provider
>>>
>>> Request Body : { available, topics[] }
>>>
>>> Response Body : ProviderSetting
>>
>> ##### /provider - DELETE
>>
>>> Description : Deletes provider setting of user if the user is logged in and user is a provider
>>>
>>> Request Body : None
>>>
>>> Response Body : { user_id }
>>
>> ##### /provider/:id - GET
>>
>>> Description : Gets providerWithSetting with given id.
>>>
>>> Request Body : None
>>>
>>> Response Body : ProviderWithEvents

### Counsel

> #### Counsel Details
> 
>> Similar to a job listing site. Users can create counsel request which will be listed to all providers.
>>
>> Providers can view these requests and filter with topics, before accepting a counsel request which will make a room.
>>
>> CounselRequest = { user_id, nickname, details, topics[], last_updated }
>>
>>> CounselRequest field specification
>>> - topics = at least 1 number of ('Anxiety', 'OffMyChest', 'SelfHarm', 'Depression', 'SelfEsteem', 'Stress', 'Casual', 'Therapy', 'BadHabits', 'Rehabilitation', 'Addiction', 'Family', 'Trauma', 'Career', 'Abandonment', 'Relationships', 'Identity', 'LGBT')
> 
> #### Counsel Routes
> 
>> ##### /counsel - GET
>> 
>>> Description : Gets all counsel request if the user is logged in and is a provider
>>>
>>> Query Params:
>>> - ?topic=(topic) : filters counsel request by topic. Multiple topics can be used to filter by repeating the query params.
>>>
>>> Request Body : None
>>>
>>> Response Body : CounselRequest[]
>> 
>> ##### /counsel - POST
>> 
>>> Description : Create / Updates the counsel request if user is logged in
>>>
>>> Request Body : { details, topics[] }
>>>
>>> Response Body : CounselRequest
>> 
>> ##### /counsel - DELETE
>> 
>>> Description : Deletes a counsel request if user is logged in and has a counsel request
>>>
>>> Request Body : None
>>>
>>> Response Body : { user_id }
>> 
>> ##### /counsel/:id - GET
>> 
>>> Description : Gets counsel request of user id if user is logged in and either the owner or a provider
>>>
>>> Request Body : None
>>>
>>> Response Body : CounselRequest
>> 
>> ##### /counsel/:id - POST
>> 
>>> Description : Accepts a counsel request if the user is a provider and creates a private room for the 2 users
>>>
>>> Request Body : None
>>>
>>> Response Body : GroupWithUsers

### Event

> #### Event Details
>
>> Handles CRUD for events. Used for managing events that become relevant at certain time.
>>
>> Event = { id, owner_id, event_name, event_description, start_time, end_time, access, category }
>>
>>> Event field specification:
>>> - start_time, end_time = Time specified must be in RFC3339 format. Example: "2006-01-02T15:04:05+07:00"
>>> - access = 1 of ('PUBLIC', 'PRIVATE')
>>> - category = 1 of ('COUNSEL', 'SUPPORT', 'CUSTOM')
>>
>> EventWithUsers = { event: Event, users: User[] }
>
> #### Event Routes
>
>> ##### /event - GET
>>
>>> Description: Gets all Event the user is involved in if the user is logged in
>>>
>>> Request Body: None
>>>
>>> Response Body: Event[]
>>
>> ##### /event - POST
>>
>>> Description: Creates new event and set the owner as the user who created the event, if the user is logged in.
>>>
>>> Request Body: { event_name, event_description, start_time, end_time, access, category }
>>>
>>> Response Body: EventWithUsers
>>
>> ##### /event - DELETE
>>
>>> Description: Removes all events from user if user is logged in. If user is the owner of the event, event is deleted.
>>>
>>> Request Body: None
>>>
>>> Response Body: EventWithUsers[]
>>
>> ##### /event/:id - GET
>>
>>> Description: Gets EventWithUsers with the given id if the user is logged in.
>>>
>>> Request Body: None
>>>
>>> Response Body: EventWithUsers
>>
>> ##### /event/:id - POST
>>
>>> Description: Add user to event. If event is public, operation can be done by any user, otherwise, can only be done by owner.
>>>
>>> Request Body: { user_id }
>>>
>>> Response Body: EventWithUsers
>>
>> ##### /event/:id - PATCH
>>
>>> Description: Update the event if user is the owner of the event.
>>> 
>>> Request Body: { event_name?, event_description?, start_time?, end_time?, access? }
>>>
>>> Response Body: Event
>>
>> ##### /event/:id - DELETE
>>
>>> Description: Deletes the event if the user is the owner of the event. Otherwise, leaves the event.
>>>
>>> Request Body: None
>>>
>>> Response Body: { id }
>>
>> ##### /event/:id/start - POST
>>
>>> Description: Creates a new room with all users involved and deletes the event
>>>
>>> Request Body: None
>>>
>>> Response Body: GroupWithUsers

### Booking

> #### Booking Details
>
>> Handles CRUD for Bookings. Used for booking counsel sessions.
>>
>> Booking = { id, recipient_id, provider_id, approve_by, nickname, details, start_time, end_time }
>>
>>> Booking field specification:
>>> - approve_by = user_id of user who is to approve booking. one of (recipient_id, provider_id)
>>> - start_time, end_time = Time specified must be in RFC3339 format. Example: "2006-01-02T15:04:05+07:00"
>>
>> BookingUser = { booking: Booking, user: User }
>>
>>> BookingUser field specification:
>>> - user refers to the user providing the counselling service
>>
>> BookingProvider = { booking: Booking, provider: Provider }
>>
>> BookingRespond = { approve, booking: Booking }
>
> #### Booking Routes
>
>> ##### /booking - GET
>>
>>> Description: Gets all bookingUsers of user if the user is logged in
>>> 
>>> Query Params:
>>> - ?booking=SENT : will get all bookings sent by user
>>> - ?booking=RECEIVED : will get all bookings directed at user
>>> - ?booking=REQUIRED : will get all bookings requiring approval of user
>>> - no query params : will get all join request sent by and directed at user
>>>
>>> Request Body: None
>>>
>>> Response Body: BookingUser[]
>>
>> ##### /booking - POST
>>
>>> Description: Creates new booking if user is logged in
>>>
>>> Request Body: { provider_id, nickname, details, start_time, end_time }
>>>
>>> Response Body: Booking
>>
>> ##### /booking/:id - GET
>> 
>>> Description: Gets bookingProvider of given id
>>>
>>> Request Body: None
>>>
>>> Response Body: BookingProvider
>>
>> ##### /booking/:id - POST
>>
>>> Description: Respond to booking request if user is logged in and authorised to respond
>>>
>>> Request Body: BookingRespond
>>>
>>> Response Body: BookingRespond if approve == false, EventWithUsers if approve == true
>>
>> ##### /booking/:id - PATCH
>>
>>> Description: Updates booking request if user is logged in and is the user who created the booking
>>>
>>> Request Body: { recipient_id?, provider_id?, approve_by?, nickname?, details?, start_time?, end_time? }
>>>
>>> Response Body: Booking
>>
>> ##### /booking/:id - DELETE
>>
>>> Description: Deletes booking request if user is logged in and is the user who created the booking
>>>
>>> Request Body: None
>>>
>>> Response Body: { id }

## Things to do
- [x] CRUD on Users
- [x] CRUD on Sessions
- [x] Unit testing for Users Querying
- [x] Unit testing for Users Handlers
- [x] Unit testing for Sessions
- [x] CRUD on Groups
- [x] Unit testing for Groups Handlers
- [x] CRUD on Join_Request
- [x] Unit testing for Join_Request
- [x] Configure database migration
- [x] Restructured file structure
- [ ] Support forget password feature
- [x] Rework join request for better usability (prevent request to alrdy joined group, allow automatic deletion)
- [x] Rewrite README.MD
- [x] Implement Websockets for Groups
- [x] Add dynamic loading for past messages
- [x] Added notifications to testing chat
- [x] Complete restructuring of code for hopefully better scalability
- [x] Generalised the websocket connection to enable chat status data and messages as payloads
- [x] Secured message loading with cookie
- [x] Added session authorisation with session database
- [x] Rewrite testcases for change
- [x] CRUD on match setting and match request
- [x] Unit testing for match setting and match request
- [x] Implement Matching
- [x] Unit testing for matching
- [x] Implement Counsel Request
- [x] Unit testing for Counsel Request
- [x] Restructure getting of errormessages in unit tests
- [x] Update Unit test for group to include checks for owner's membership on update
- [x] Implement Event
- [x] Unit testing for Event
- [x] Implement Provider
- [x] Unit testing for Provider
- [x] Implement Booking
- [x] Unit testing for Provider