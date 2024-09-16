import { ErrorToast, ToastContainerWrap } from '../../utils/toastify'
import UnauthorizedNavbar from '../../components/SignUpAndSignIn/UnauthorizedNavbar'
import React, { useEffect, useState } from 'react';
import { skillInterface } from '../../utils/interfaces';
import { addBioAndSkillsSchema } from '../../utils/zodSchemas';
import { useTranslation } from 'react-i18next';
import { BioSection } from '../../components/Common/BioSection';
import { SkillsSection } from '../../components/Common/SkillsSection';
import { useNavigate } from 'react-router-dom';
import { whereToNavigateTo } from '../../utils/functions';
import axios from 'axios';
import { add_bio_and_skills, details_about_you_freelancer, generate_bio_ai } from '../../utils/requestAddresses';
import { useServerSkill } from '../../hooks/useServerSkill';

interface FreelancerSkill {
    skillId: number; // assuming skillId is a number
}

interface Skill {
    id: number;
    name: string;
}

const FreelancerAddBioAndSkills: React.FC = () => {
    const { t } = useTranslation()
    const [bio, setBio] = useState<string>("")
    const [skills, setSkills] = useState<skillInterface[]>([])
    const navigate = useNavigate()
    
    const { success: isUploadable } = addBioAndSkillsSchema.safeParse({ bio: bio, skills: skills })
    const predefinedSkills: skillInterface[] = useServerSkill()

    useEffect(() => {
        try {
            axios.get(details_about_you_freelancer, { withCredentials: true })
                .then(result => {
                    const freelancer = result.data.freelancer
                    const dbBio = freelancer.bio ? freelancer.bio : ""
                    setBio(dbBio)

                    const commonObjects = freelancer.skills.map((skillObj1: FreelancerSkill) => {
                        const matchedSkill = predefinedSkills.find((skillObj2: Skill) => skillObj2.id === skillObj1.skillId);
                        return matchedSkill ? { id: matchedSkill.id, name: matchedSkill.name } : null;
                    }).filter(Boolean);

                    setSkills(commonObjects)
                })
        } catch (error) {
            console.log(error)
        }
    }, [predefinedSkills])

    const handleNext = async () => {
        try {
            const result = await axios.put(add_bio_and_skills, {
                bioInput: bio,
                skillsInput: skills
            }, { withCredentials: true })

            navigate(whereToNavigateTo(result.data.freelancer))
        } catch (error) {
            console.log(error)
            ErrorToast("Something went wrong")
        }
    }

    return (<>
        <ToastContainerWrap />
        <UnauthorizedNavbar />
        <div className=' min-h-[93vh] bg-defaultGray px-5 py-3'>
            <BioSection bio={bio} setBio={setBio} backendAddress={generate_bio_ai} titleText={t("bio")} placeholder={t("bio-placeholder")} />

            <SkillsSection skills={skills} setSkills={setSkills} predefinedSkills={predefinedSkills} />

            <div className='mt-10 '>
                <button
                    className="btn btn-wide border-gray-300 font-bold"
                    style={{ width: "100%" }}
                    onClick={handleNext}
                    disabled={!isUploadable}>{t('next')}</button>
            </div>
        </div>
    </>
    )
}

export default FreelancerAddBioAndSkills
