import UserAccountDropdown from "./UserAccountDropdown";
import BackIcon from "../assets/icons/ic-back.png";
import { useNavigate } from "react-router-dom";


const InnerPageTopBar = ({path="/"}) => {
    const navigate = useNavigate();
    return (
        <div className="dashboard-left-side-topbar d-flex justify-content-between">
            <div className="name-part">
                <button type="button" className="btn btn-dark black-btn" style={{ padding: "10px" }} onClick={() => navigate(path)}>
                    <img src={BackIcon} alt='Back Icon' width={"24px"} height={"24px"} loading="lazy" />
                </button>
            </div>
            <div className="button-part d-flex">
                <UserAccountDropdown />
            </div>
        </div>

    )
}

export default InnerPageTopBar;