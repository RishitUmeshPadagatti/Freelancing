import React from "react"
import { FullNameSvg } from "../../assets/MultipleSvgs"
import { useTranslation } from "react-i18next";

interface FullNameInputProps {
    fullNameInput: string;
    setFullNameInput: (value: string) => void;
}

const FullNameInput: React.FC<FullNameInputProps> = ({fullNameInput, setFullNameInput}) => {
    const {t} = useTranslation()
    return (<label className=" input input-bordered flex items-center gap-2">
        <FullNameSvg />
        <input value={fullNameInput} onChange={(e) => setFullNameInput(e.target.value)} type="text" className="grow" placeholder={t('full-name')} required/>
    </label>)
}
export default FullNameInput