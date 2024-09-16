import { Dispatch, memo, SetStateAction, useState } from "react";
import { useTranslation } from "react-i18next";
import { IoMdClose } from "react-icons/io";
import { skillInterface } from "../../utils/interfaces";

interface SkillsSectionsProps {
    skills: skillInterface[];
    setSkills: Dispatch<SetStateAction<skillInterface[]>>;
    predefinedSkills: skillInterface[];
}

export const SkillsSection = memo(({ skills, setSkills, predefinedSkills }: SkillsSectionsProps) => {
    const { t } = useTranslation()
    const [skillsInput, setSkillsInput] = useState<string>("")

    const [filteredSkills, setFilteredSkills] = useState<skillInterface[]>([])
    const [showSuggestions, setShowSuggestions] = useState<boolean>(false)

    const handleSkillInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const currentInput = e.target.value
        setSkillsInput(currentInput)

        const filtered = predefinedSkills
            .filter(skill =>
                skill.name.toLowerCase().includes(currentInput.toLowerCase()) &&
                !skills.some(existingSkill => existingSkill.name === skill.name)
            )
        setFilteredSkills(filtered)
        setShowSuggestions(true)
    }

    const handleSkillTagClickFromSuggestions = (obj: skillInterface) => {
        setSkills([...skills, obj])
        setSkillsInput("")
        setFilteredSkills([])
        setShowSuggestions(false)
    }

    const removeSkillTag = (id: number) => {
        setSkills(skills.filter((skill) => skill.id !== id))
    }

    return (<div className='flex flex-col gap-2 mt-2 '>
        <div>
            <label htmlFor="textareaSkills" className='font-bold sm:text-3xl text-xl'>{t("select-skills")}</label>
        </div>
        <div className='relative py-2 flex gap-3 flex-col'>
            {/* Capsules */}
            <div className='flex gap-2 flex-wrap'>
                {skills.map(skillObj => (
                    <Capsule key={skillObj.id} name={skillObj.name} id={skillObj.id} removeSkillTag={removeSkillTag} />
                ))}
            </div>

            {/* Skills Input */}
            <input
                type="text"
                placeholder={t("type-here")}
                id='textareaSkills'
                className="input input-bordered w-full font-serif text-base"
                value={skillsInput}
                onChange={handleSkillInputChange}
            />

            {/* Filtered Skills Suggestions */}
            {showSuggestions && skillsInput && (
                <div className="relative z-10 bg-white border shadow-md">
                    {filteredSkills.map(skillObj => (
                        <div
                            key={skillObj.id}
                            className="p-2 cursor-pointer hover:bg-gray-200"
                            onClick={() => handleSkillTagClickFromSuggestions(skillObj)}>
                            {skillObj.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div>)
})
const Capsule: React.FC<{ name: string, id: number, removeSkillTag: Function }> = ({ name, id, removeSkillTag }) => {
    return <div className="px-3 py-1 rounded-full cursor-default whitespace-nowrap bg-gray-200 text-gray-800 text-sm flex justify-center font-serif items-center">
        {name}
        <button onClick={() => removeSkillTag(id)} className="rounded-full ml-2 w-[20px] h-[20px] cursor-pointer hover:bg-gray-300 flex justify-center items-center"><IoMdClose /></button>
    </div>
}