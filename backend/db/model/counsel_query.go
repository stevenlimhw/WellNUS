package model

import (
	"wellnus/backend/router/http_helper/http_error"

	"log"
	"fmt"
	"database/sql"
	"time"

	"github.com/lib/pq"
)

func ReadCounselRequests(rows *sql.Rows) ([]CounselRequest, error) {
	counselRequests := make([]CounselRequest, 0)
	for rows.Next() {
		var counselRequest CounselRequest
		if err := rows.Scan(
			&counselRequest.UserID,
			&counselRequest.Nickname,
			&counselRequest.Details, 
			pq.Array(&counselRequest.Topics),
			&counselRequest.LastUpdated);
			err != nil {
				return nil, err
			}
		counselRequests = append(counselRequests, counselRequest)
	}
	return counselRequests, nil
}

func CheckCounselRequest(db *sql.DB, userID int64) (bool, error) {
	row, err := db.Query("SELECT COUNT(*) != 0 FROM wn_counsel_request WHERE user_id = $1", userID)
	if err != nil { return false, err }
	defer row.Close()
	row.Next()
	var present bool
	if err := row.Scan(&present); err != nil {
		return false, err
	}
	return present, nil
}

// Main functions

func GetAllCounselRequests(db *sql.DB, topics []string, userID int64) ([]CounselRequest, error) {
	authorized := AuthoriseProvider(db, userID)
	if !authorized { return nil, http_error.UnauthorizedError }
	var rows *sql.Rows
	var err error
	if topics == nil {
		rows, err = db.Query("SELECT * FROM wn_counsel_request")
	} else {
		rows, err = db.Query("SELECT * FROM wn_counsel_request WHERE $1 <@ topics", pq.Array(topics))
	}
	if err != nil { return nil, err }
	defer rows.Close()
	counselRequests, err := ReadCounselRequests(rows)
	if err != nil { return nil, err }
	return counselRequests, nil
}

func GetCounselRequest(db *sql.DB, recipientUserID int64, userID int64) (CounselRequest, error) {
	authorized := recipientUserID == userID || AuthoriseProvider(db, userID)
	if !authorized { return CounselRequest{}, http_error.UnauthorizedError }
	rows, err := db.Query("SELECT * FROM wn_counsel_request WHERE user_id = $1", recipientUserID)
	if err != nil { return CounselRequest{}, err }
	defer rows.Close()
	counselRequests, err := ReadCounselRequests(rows)
	if err != nil { return CounselRequest{}, err }
	if len(counselRequests) == 0 { return CounselRequest{}, http_error.NotFoundError }
	return counselRequests[0], nil
}

func AddUpdateCounselRequest(db *sql.DB, counselRequest CounselRequest, userID int64) (CounselRequest, error) {
	counselRequest.UserID = userID
	counselRequest.LastUpdated = time.Now()
	_, err := db.Exec(
		`INSERT INTO wn_counsel_request (
			user_id,
			nickname,
			details,
			topics,
			last_updated
		) VALUES ($1, $2, $3, $4, $5)
		ON CONFLICT (user_id)
		DO UPDATE SET
			user_id = EXCLUDED.user_id,
			nickname = EXCLUDED.nickname,
			details = EXCLUDED.details,
			topics = EXCLUDED.topics,
			last_updated = EXCLUDED.last_updated`,
		counselRequest.UserID,
		counselRequest.Nickname,
		counselRequest.Details,
		pq.Array(counselRequest.Topics),
		counselRequest.LastUpdated)
	if err != nil { return CounselRequest{}, err }
	return counselRequest, nil
}

func DeleteCounselRequest(db *sql.DB, userID int64) (CounselRequest, error) {
	_, err := db.Exec(`DELETE FROM wn_counsel_request WHERE user_id = $1`, userID)
	if err != nil { return CounselRequest{}, err }
	return CounselRequest{ UserID: userID }, nil
}

func AcceptCounselRequest(db *sql.DB, recipientUserID int64, providerUserID int64) (GroupWithUsers, error) {
	authorized := AuthoriseProvider(db, providerUserID)
	if !authorized { return GroupWithUsers{}, http_error.UnauthorizedError }
	present, err := CheckCounselRequest(db, recipientUserID)
	if err != nil { return GroupWithUsers{}, err }
	if !present { return GroupWithUsers{}, http_error.NotFoundError }
	user, err := GetUser(db, providerUserID)
	if err != nil { return GroupWithUsers{}, err }
	if !IsProvider(user) { return GroupWithUsers{}, http_error.UnauthorizedError }
	group := Group{
		GroupName: "Counsel Room",
		GroupDescription: "Welcome to your new Counsel Room",
		Category: "COUNSEL",
	}
	groupWithUsers, err := AddGroupWithUserIDs(db, group, []int64{providerUserID, recipientUserID})
	if err != nil { return GroupWithUsers{}, err }
	if _, fatal := DeleteCounselRequest(db, recipientUserID); fatal != nil {
		log.Fatal(fmt.Sprintf("Failed to remove counsel request after creating group. Fatal: %v", fatal))
	}
	return groupWithUsers, nil
}
