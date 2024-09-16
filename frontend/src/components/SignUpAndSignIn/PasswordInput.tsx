import React from "react"
import { PasswordSvg } from "../../assets/MultipleSvgs"
import { useTranslation } from "react-i18next"

interface PasswordInputProps {
    passwordInput: string,
    setPasswordInput: (value: string) => void,
    autocomplete: string
}

const PasswordInput: React.FC<PasswordInputProps> = ({passwordInput, setPasswordInput, autocomplete}) => {
    const { t } = useTranslation()

    return (<label className=" input input-bordered flex items-center gap-2">
        <PasswordSvg />
        <input value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} type="password" className="grow" placeholder={t('password')} required autoComplete={autocomplete}/>
    </label>)
}

export default PasswordInput