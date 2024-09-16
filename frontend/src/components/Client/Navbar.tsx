import PurpleLogo from "../../assets/logo_purple.svg"
import { useNavigate } from 'react-router-dom';
import { clientExploreRoute, clientMessages, clientMyJobs, clientProfile, createJob, homeRoute } from '../../utils/frontendRoutes';
import LanguageDropdown from '../Common/LanguageDropdown';
import CreateResumeLogo from "../../assets/add.png"

const ClientNavbar = () => {
    const navigate = useNavigate()

    return (
        <div className="bg-defaultGray flex sm:p-3.5 px-2 py-3 items-center justify-between gap-2">
            <div className="cursor-pointer hover:scale-105" onClick={() => navigate(homeRoute)}>
                <img src={PurpleLogo} alt="Logo" className="sm:w-9 w-5" />
            </div>

            <div className="sm:font-semibold sm:text-[15px] font-bold text-[10px] flex sm:gap-16 gap-3">
                <div className="sm:cursor-pointer text-center hover:scale-105 " onClick={() => navigate(clientExploreRoute)}>Explore Jobs</div>

                <div className="cursor-pointer text-center hover:scale-105" onClick={() => navigate(clientMyJobs)}>My Jobs</div>

                <div className="cursor-pointer text-center hover:scale-105" onClick={() => navigate(clientMessages)}>Messages</div>
            </div>

            <div className="flex items-center sm:gap-7 gap-4">
                <div
                    className="sm:w-7 w-4 cursor-pointer hover:scale-110"
                    onClick={() => navigate(createJob)}>
                    <img src={CreateResumeLogo} alt="Create Job Logo" />
                </div>
                <div className="flex items-stretch">
                    <LanguageDropdown showIcon={true} />
                </div>

                {/* TODO: change routing. Maybe add a component */}
                <div className="avatar cursor-pointer" onClick={() => navigate(clientProfile)}>
                    <div className="sm:w-9 w-5 rounded-full hover:scale-110">
                        <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ClientNavbar
