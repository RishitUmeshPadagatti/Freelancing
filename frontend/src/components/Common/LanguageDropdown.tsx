import { useTranslation } from 'react-i18next'
import { useLanguage } from '../../hooks/useLanguage'
import { languages } from '../../i18n'
import React from 'react';
import LanguageLogo from "../../assets/Language.png"

type LanguageKeys = keyof typeof languages;

const LanguageDropdown: React.FC<{showIcon?: boolean}> = ({ showIcon=false }) => {
    const { t } = useTranslation()
    const { changeLanguage, language } = useLanguage()

    return (
        <div className="dropdown dropdown-end">
            {!showIcon && <div tabIndex={0} role="button" className="btn btn-ghost font-semibold rounded-btn border-gray-200">
                {t("language")}
            </div>}
            {showIcon && <div className='sm:w-6 w-4 hover:scale-110'>
                <img tabIndex={0} role="button" src={LanguageLogo} alt="Language Logo" />    
            </div>}

            <ul tabIndex={0} className="menu dropdown-content bg-base-100 rounded-box z-[1] mt-4 w-52 p-2 shadow">
                {Object.keys(languages).map(c => {
                    const key = c as LanguageKeys;
                    return (
                        <li onClick={() => { changeLanguage(key) }} key={key}>
                            <a className={`flex justify-between font-semibold ${key === language ? "text-purple-700" : ""}`}>
                                <span>{languages[key]}</span>
                                <span>{key}</span>
                            </a>
                        </li>
                    );
                })}
            </ul>
        </div>
    )
}

export default LanguageDropdown
