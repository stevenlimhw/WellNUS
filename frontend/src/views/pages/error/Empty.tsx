import "./empty.css";
import empty from "../../../static/icon/empty.png";

const Empty = ({ message } : { message: string }) => {
    return (
        <div className="empty-container">
            <img src={empty} alt="empty"/>
            <div className="empty-wrapper">
                <div className="empty-message">{message}</div>
            </div>
        </div>
    )
}

export default Empty;