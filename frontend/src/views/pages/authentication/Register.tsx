import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import userSlice from "../../../state/slices/user";
import GeneralForm from "../../components/form/GeneralForm";
import { UserDetails as UserDetailsType } from "../../../types/authentication/types";
import "./authentication.css"
import { postRequestOptions } from "../../../api/fetch/requestOptions";
import { config } from "../../../config";
import logo from "../../../static/icon/navIcons/logo.png";
import { Button } from "react-bootstrap";


const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loggedIn } = useSelector((state: any): any => state.user);
    const [ errMsg, setErrMsg ] = useState("");

    const onSubmit = (e: any) => {   
        e.preventDefault(); 
        const userDetails = {
            first_name: e.target[0].value,
            last_name: e.target[1].value,
            gender: e.target[2].value,
            faculty: e.target[3].value,
            email: e.target[4].value,
            password: String(e.target[5].value),
            passwordConfirmation: e.target[6].value,
            user_role: e.target[7].value
        }
        // console.log(userDetails)
        if (userDetails.passwordConfirmation !== userDetails.password) {
            return setErrMsg("Password and password confirmation does not match.")
        }
        registerBE(userDetails);
    }

    const registerBE = async (userDetails : UserDetailsType) => {
        const { first_name, last_name, gender, faculty, email, password, user_role } = userDetails;
        const requestOptions = {
            ...postRequestOptions,
            body: JSON.stringify({
                "first_name": first_name,
                "last_name": last_name,
                "gender": gender,
                "faculty": faculty,
                "email": email,
                "user_role": user_role, // default user role is member
                "password": password
            })
        }
        const response = await fetch(config.API_URL + "/user", requestOptions);
        try {
            if (response.status === 200) {
                const user = await response.json();
                // dispatch(userSlice.actions.add(userDetails)) // TODO: remove this later
                dispatch(userSlice.actions.authenticate(user)) // update redux loggedIn state
                navigate("/dashboard")
            } else {
                // TODO: Create an alert to indicate invalid input(s).
                // setErrMsg here
                setErrMsg("Invalid input(s).");
            }
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        if (loggedIn) navigate("/dashboard");
    }, []);

    return (
        <div className="auth_container auth_register">
            <div className="auth_left_col">
                <div className="auth_content_row">
                    <h1>Welcome Back!</h1>
                    <p>Click here to log in to an existing account.</p>
                    <Link to="/login" className="no-decoration">
                        <Button className="auth_btn">Login</Button>
                    </Link>
                </div>
            </div>
            <div className="auth_right_col">
                <div className="auth_logo_row">
                    <Link to="/" className="no-decoration">
                        <img src={logo} alt="Logo"/>
                    </Link>
                </div>
                <h1>Create a new account.</h1>
                <GeneralForm
                    onSubmit={onSubmit}
                    fields={[
                        {
                            id: "first_name",
                            type: "text",
                            label: "First name",
                            placeholder: "First Name",
                            notes: ""
                        },
                        {
                            id: "last_name",
                            type: "text",
                            label: "Last name",
                            placeholder: "Last Name",
                            notes: ""
                        },
                        {
                            id: "gender",
                            type: "select",
                            label: "Gender",
                            placeholder: "Gender",
                            notes: "",
                            choices: [
                                "Gender",
                                "M",
                                "F",
                            ]
                        },
                        {
                            id: "faculty",
                            type: "select",
                            label: "Faculty",
                            placeholder: "Faculty",
                            notes: "",
                            choices: [
                                "Faculty",
                                "CHS", 
                                "BUSINESS", 
                                "COMPUTING", 
                                "DENTISTRY", 
                                "CDE", 
                                "LAW", 
                                "MEDICINE", 
                                "NURSING",
                                "PHARMACY", 
                                "MUSIC"
                            ]
                        },
                        {
                            id: "email",
                            type: "email",
                            label: "Email",
                            placeholder: "Email",
                            notes: "must be a valid NUS email (e.g. e1234567@u.nus.edu)"
                        },
                        {
                            id: "password",
                            type: "password",
                            label: "Password",
                            placeholder: "Password",
                            notes: ""
                        },
                        {
                            id: "password_confirmation",
                            type: "password",
                            label: "Password confirmation",
                            placeholder: "Password Confirmation",
                            notes: ""
                        },
                        {
                            id: "user_role",
                            type: "select",
                            label: "User Role",
                            placeholder: "User Role",
                            notes: "",
                            choices: [
                                "User Role",
                                "MEMBER",
                                "COUNSELLOR",
                                "VOLUNTEER"
                            ]
                        }
                        
                    ]}
                    error={errMsg}
                    displayError={errMsg !== ""}
                    closeError={() => setErrMsg("")}
                    hideSubmit={false}
                />
            </div>
        </div>
    )

    // return <div className="background flex-wrapper">
    //     <div className="register-container">
    //         <div className="register-header">
    //             <div className="auth-title">Sign up</div>
    //             <div className="auth-links">
                    // <Link to="/login" className="no-decoration">
    //                     <button className="link-button">
    //                         Login
    //                     </button>
    //                 </Link>
                    // <Link to="/" className="no-decoration">
    //                     <button className="link-button">
    //                         Home
    //                     </button>
    //                 </Link>
    //             </div>
    //         </div>
    //         <div className="form-register">
                // <GeneralForm
                //     onSubmit={onSubmit}
                //     fields={[
                //         {
                //             id: "first_name",
                //             type: "text",
                //             label: "First name",
                //             placeholder: "Enter your first name...",
                //             notes: ""
                //         },
                //         {
                //             id: "last_name",
                //             type: "text",
                //             label: "Last name",
                //             placeholder: "Enter your last name...",
                //             notes: ""
                //         },
                //         {
                //             id: "gender",
                //             type: "select",
                //             label: "Gender",
                //             placeholder: "Enter your gender...",
                //             notes: "",
                //             choices: [
                //                 "Enter your gender...",
                //                 "M",
                //                 "F",
                //             ]
                //         },
                //         {
                //             id: "faculty",
                //             type: "select",
                //             label: "Faculty",
                //             placeholder: "Enter your faculty...",
                //             notes: "",
                //             choices: [
                //                 "Enter your faculty...",
                //                 "COMPUTING"
                //             ]
                //         },
                //         {
                //             id: "email",
                //             type: "email",
                //             label: "Email",
                //             placeholder: "Enter your email...",
                //             notes: "must be a valid NUS email (e.g. e1234567@u.nus.edu)"
                //         },
                //         {
                //             id: "password",
                //             type: "password",
                //             label: "Password",
                //             placeholder: "Enter your password...",
                //             notes: ""
                //         },
                //         {
                //             id: "password_confirmation",
                //             type: "password",
                //             label: "Password confirmation",
                //             placeholder: "Confirm your password...",
                //             notes: ""
                //         }
                        
                //     ]}
                //     error={errMsg}
                //     displayError={errMsg !== ""}
                //     closeError={() => setErrMsg("")}
                //     hideSubmit={false}
                // />
    //         </div>
    //     </div>
    // </div>
}

export default Register;