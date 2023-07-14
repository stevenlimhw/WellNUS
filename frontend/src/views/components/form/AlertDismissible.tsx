import React, { Fragment } from "react";
import { Alert } from "react-bootstrap";

type Props = {
    msg: string;
    display: boolean;
    onClose: () => void;
    success: boolean;
}

function AlertDismissible(props: Props): React.ReactElement {
    const { msg, display, onClose, success } = props
    if (display) {
        return  <Alert 
                    className="alert_dismissable"
                    variant={success ? "success" : "danger"}
                    onClose={onClose}
                    dismissible
                >
                    {msg}
                </Alert>
    }
    return <Fragment />
}

export default AlertDismissible;