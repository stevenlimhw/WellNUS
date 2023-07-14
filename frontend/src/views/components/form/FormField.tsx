import { Form } from "react-bootstrap";
import { Field } from "../../../types/authentication/types";
import "./form.css";

function FormField(props: Field): React.ReactElement {
    const { id, type, label, placeholder, notes, choices } = props;
    if (type === "select") {
        return (
            <Form.Select className="form_select_control" defaultValue={"DEFAULT"}>
                {
                    choices?.map((choice, key) => {
                        if (key === 0) {
                            return <option value={"DEFAULT"} disabled key={key}>{choice}</option>;
                        }
                        return <option value={choice} key={key}>{choice}</option>
                    })
                }
                <option value={"DEFAULT"} disabled></option>
            </Form.Select>
        )
    }
    return  <Form.Group className="form_field_group" controlId={id}>
                {/* <Form.Label>{label}</Form.Label> */}
                <Form.Control type={type} placeholder={placeholder} className="form_field_control"/>
                <small>{notes}</small>
            </Form.Group>
}

export default FormField;