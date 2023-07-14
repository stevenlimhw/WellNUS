import React, { useEffect, useState } from "react";
import { Button, Table, Container, Row, Col, Dropdown, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getRequestOptions, postRequestOptions } from "../../../../api/fetch/requestOptions";
import { config } from "../../../../config";
import Navbar from "../../../components/navbar/Navbar";
import CreateGroup from "../../meet/CreateGroup";
import "./match.css";
import { MatchSetting as MatchSettingType } from "../../../../types/match/types";
import GeneralForm from "../../../components/form/GeneralForm";
import { MultiSelect } from "react-multi-select-component";
import { useSelector } from "react-redux";

const Match = () => {
    const mbtiList = ["ISTJ", "ISFJ", "INFJ", "INTJ", "ISTP", "ISFP", "INFP", "INTP", "ESTP", "ESFP", "ENFP", "ENTP", "ESTJ", "ESFJ", "ENFJ", "ENTJ"];
    const hobbies = [
        { label: "Gaming", value: "GAMING" },
        { label: "Singing", value: "SINGING" },
        { label: "Dancing", value: "DANCING" },
        { label: "Music", value: "MUSIC" },
        { label: "Sports", value: "SPORTS" },
        { label: "Outdoor", value: "OUTDOOR" },
        { label: "Book", value: "BOOK" },
        { label: "Anime", value: "ANIME" },
        { label: "Movies", value: "MOVIES" },
        { label: "TV", value: "TV" },
        { label: "Art", value: "ART" },
        { label: "Study", value: "STUDY" }
    ];
    const [errMsg, setErrMsg] = useState("");
    const [setting, setSetting] = useState<MatchSettingType>();

    const { details } = useSelector((state: any) => state.user);
    
    const [preference, setPreference] = useState("");
    const [mbti, setMbti] = useState("");
    // hobbies selected
    const [selectedOptions, setSelectedOptions] = useState<any[]>([]);

    const handleChangeFaculty = (e: any) => {
        const value = e.target.options[e.target.selectedIndex].value;
        setPreference(value);
    }

    const handleChangeMBTI = (e: any) => {
        const value = e.target.options[e.target.selectedIndex].value;
        setMbti(value);
    }

    const getSetting = async () => {
        await fetch(config.API_URL + "/setting", getRequestOptions)
            .then(response => {
                if (response.status === 404) return null;
                return response.json();
            })
            .then(data => {
                if (data !== null) {
                    setSetting(data);
                }
            })
            .catch(err => {
                console.log("Match settings have not been filled in for this user.");
                console.log(err);
            });
    }

    const postSetting = async (e: any) => {
        e.preventDefault();
        const requestOptions = {
            ...postRequestOptions,
            body: JSON.stringify({
                "faculty_preference": preference,
                "hobbies": selectedOptions.map(item => item.value),
                "mbti": mbti
            })
        }
        await fetch(config.API_URL + "/setting", requestOptions)
            .then(response => response.json())
            .then(data => console.log(data));
        window.location.reload();
    }

    useEffect(() => {
        getSetting();
    }, []);

    return (
        <div className="match">
            <Container fluid className="match_container">
                <Row>
                    <Col>
                        <h2>Match Preferences</h2>
                        <Form.Select onChange={handleChangeFaculty} className="match_form">
                            <option value={"NONE"}>Enter your faculty preference...</option>
                            <option value={"MIX"}>Mixed</option>
                            <option value={"SAME"}>Same</option>
                            <option value={"NONE"}>No Preference</option>
                        </Form.Select>
                        <Form.Select onChange={handleChangeMBTI} className="match_form">
                            <option value={""}>Enter your MBTI type...</option>
                            {
                                mbtiList.map((mbti, key) => {
                                    return (
                                        <option key={key} value={mbti}>{mbti}</option>
                                    )
                                })
                            }
                        </Form.Select>
                        <MultiSelect
                            options={hobbies}
                            value={selectedOptions}
                            onChange={setSelectedOptions}
                            labelledBy="Select"
                            hasSelectAll={false}
                            className="match_form"
                        />
                        <small>Select at most 4 hobbies.</small>
                        <br/>
                        <Button onClick={postSetting} className="layout_heading_button match_submit_btn">Save Preferences</Button>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Match;