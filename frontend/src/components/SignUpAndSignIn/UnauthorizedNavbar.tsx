import PurpleLogo from "../../assets/logo_purple.svg"
import { useNavigate } from "react-router-dom";
import { homeRoute } from "../../utils/frontendRoutes";
import LanguageDropdown from "../Common/LanguageDropdown";

const UnauthorizedNavbar = () => {
    const navigate = useNavigate()

    return (
        <div className=" navbar bg-defaultGray">
            <div className="flex-1 px-2 lg:flex-none cursor-default" onClick={() => navigate(homeRoute)}>
                <img src={PurpleLogo} alt="Logo" className="w-9" />
            </div>
            <div className="flex flex-1 justify-end px-2">
                <div className="flex items-stretch">
                    <LanguageDropdown/>
                </div>
            </div>
        </div>
    )
}

export default UnauthorizedNavbar