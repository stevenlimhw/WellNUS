import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { MultiSelect } from "react-multi-select-component";
import { useSelector } from "react-redux";
import { deleteRequestOptions, getRequestOptions, postRequestOptions } from "../../../api/fetch/requestOptions";
import { config } from "../../../config";
import GeneralForm from "../../components/form/GeneralForm";
import "./providerSettings.css";

const availableTopics = [
    { label: "Anxiety", value: "Anxiety" },
    { label: "Off My Chest", value: "OffMyChest" },
    { label: "Self Harm", value: "SelfHarm" },
    { label: "Depression", value: "Depression" },
    { label: "Self Esteem", value: "SelfEsteem" },
    { label: "Stress", value: "Stress" },
    { label: "Casual", value: "Casual" },
    { label: "Therapy", value: "Therapy" },
    { label: "Bad Habits", value: "BadHabits" },
    { label: "Rehabilitation", value: "Rehabilitation" },
];

const ProviderSettings = () => {
    const [errMsg, setErrMsg] = useState("");
    const [provider, setProvider] = useState({ setting: { intro: "not yet added", topics: ["not yet added"] }, user: {}});
    const { details } = useSelector((state: any) => state.user);
    const [selectedOptions, setSelectedOptions] = useState<any[]>([]);
    const [intro, setIntro] = useState("");
    
    const getProvider = async () => {
        await fetch(config.API_URL + "/provider/" + details.id, getRequestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Provider details have not been initialised.")
                }
                return response.json();
            })
            .then(data => {
                setProvider(data.provider);
            })
            .catch(err => console.log(err));
    }
    useEffect(() => {
        getProvider();
    }, []);

    const handleIntroChange = (e: any) => {
        setIntro(e.target.value);
    }

    const postSetting = async (e: any) => {
        e.preventDefault();
        const topics = selectedOptions.map(option => option.value);
        const requestOptions = {
            ...postRequestOptions,
            body: JSON.stringify({
                "intro": intro,
                "topics": topics
            })
        }
        await fetch(config.API_URL + "/provider", requestOptions)
            .then(response => response.json())
            .then(data => {
                window.location.reload();
            })
            .catch(err => console.log(err));
    }

    const clearSetting = async () => {
        await fetch(config.API_URL + "/provider", deleteRequestOptions)
            .then(response => response.json())
            .then(data => {
                window.location.reload();
            })
            .catch(err => console.log(err));
    }
    
    return (
        <div className="providerSettings">
            <h2>Provider Settings</h2>
            <div>
                <div><b>Important: </b>You need to initialise your provider settings for your profile to be visible by others.</div>
                <br />
                <b>Introduction: </b>
                <div>{provider?.setting.intro}</div>
                <br />
                <div>
                    <b>Topics:</b>
                    <ol>
                    {
                        provider?.setting.topics.map((topic, id) => {
                            return <li key={id}>
                                {topic}
                            </li>
                        })
                    }
                    </ol>
                </div>
            </div>
            <br />
            <Form.Group className="mb-3" onChange={handleIntroChange}>
                <Form.Control type="text" placeholder="Enter a brief intro about yourself..." />
            </Form.Group>
            <MultiSelect
                options={availableTopics}
                value={selectedOptions}
                onChange={setSelectedOptions}
                labelledBy="Select"
                hasSelectAll={false}
                className="match_form"
            />
            <br/>
            <div className="providerSettings_buttons">
                <Button onClick={postSetting} className="layout_heading_button match_submit_btn">Save</Button>
                <Button onClick={clearSetting} className="layout_heading_button match_submit_btn">Remove</Button>
            </div>
        </div>
    )
}

export default ProviderSettings;