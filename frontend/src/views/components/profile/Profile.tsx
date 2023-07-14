import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useSelector } from "react-redux";
import { getRequestOptions } from "../../../api/fetch/requestOptions";
import { config } from "../../../config";
import profile from "../../../static/icon/navIcons/profile.png";
import { MatchSetting as MatchSettingType } from "../../../types/match/types";
import "./profile.css";

const ProfileModal = () => {
    const { details } = useSelector((state: any) => state.user);
    const [show, setShow] = useState(false);
    const [matchDetails, setMatchDetails] = useState<MatchSettingType>();

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const getSetting = async () => {
      await fetch(config.API_URL + "/setting", getRequestOptions)
          .then(response => {
              if (!response.ok) {
                throw new Error("Setting has not been initialised by the user.");
              }
              return response.json();
          })
          .then(data => {
              setMatchDetails(data);
          })
          .catch(err => {
              console.log(err);
          });
    }

    useEffect(() => {
      details.user_role === "MEMBER" && getSetting();
    }, []);
    
    return (
      <div>
        <Button variant="primary" onClick={handleShow} className="profile_button">
            <div className="profile">
                <img src={profile} alt="Profile" />
                <p className="profile_button_name">{details.first_name} {details.last_name}</p>
            </div>
        </Button>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Your Profile</Modal.Title>
          </Modal.Header>
          <Modal.Body className="profile_content">
            <div className="profile_content_left">
              USER PHOTO
            </div>
            <div className="profile_content_right">
              <div className="profile_name">{details.first_name} {details.last_name}</div>
              <div className="profile_detail">User ID: <div className="profile_value">{details.id}</div></div>
              <div className="profile_detail">Gender: <div className="profile_value">{details.gender === "F" ? "Female" : "Male"}</div></div>
              <div className="profile_detail">Email: <div className="profile_value">{details.email}</div></div>
              <div className="profile_detail">Faculty: <div className="profile_value">{details.faculty}</div></div>
              {
                details.user_role === "MEMBER" &&
                matchDetails &&
                <div>
                  <div className="profile_detail">Faculty Preference: <div className="profile_value">{matchDetails.faculty_preference || "NA"}</div></div>
                  <div className="profile_detail">MBTI Type: <div className="profile_value">{matchDetails.mbti || "NA"}</div></div>
                  <div className="profile_detail">Hobbies:</div>
                  <div className="profile_hobbies">
                      {
                        (matchDetails.hobbies && matchDetails.hobbies.map((hobby, key) => {
                          return (
                            <div className="profile_value" key={key}>
                              {hobby}
                            </div>
                          )
                        })) || <div className="profile_value">NA</div>
                      }
                    </div>
                </div>
              }
            </div>
          </Modal.Body>
          <Modal.Footer className="profile_footer">
            <Button variant="primary" onClick={handleClose} className="layout_heading_button">
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
}
  
export default ProfileModal;