import React from "react"
import { EmailSvg } from "../../assets/MultipleSvgs"
import { useTranslation } from "react-i18next"

interface EmailInputProps {
    emailInput: string,
    setEmailInput: (value: string) => void
}

const EmailInput: React.FC<EmailInputProps> = ({emailInput, setEmailInput}) => {
    const {t} = useTranslation()
    return (<label className=" input input-bordered flex items-center gap-2">
        <EmailSvg />
        <input value={emailInput} onChange={(e) => setEmailInput(e.target.value)} type="email" className="grow" placeholder={t('email')} required autoComplete="email" />
    </label>)
}

export default EmailInput