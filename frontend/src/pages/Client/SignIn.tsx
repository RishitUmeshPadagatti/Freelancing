import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { signinSchema } from "../../utils/zodSchemas"
import { ErrorToast, ToastContainerWrap } from "../../utils/toastify"
import EmailInput from "../../components/SignUpAndSignIn/EmailInput"
import PasswordInput from "../../components/SignUpAndSignIn/PasswordInput"
import { GoogleSvg } from "../../assets/MultipleSvgs"
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth"
import { firebaseAuth, googleProvider } from "../../utils/firebase-config"
import UnauthorizedNavbar from "../../components/SignUpAndSignIn/UnauthorizedNavbar"
import { useTranslation } from "react-i18next"
import axios from "axios"
import { sign_in_client, sign_up_client } from "../../utils/requestAddresses"
import { whereToNavigateTo } from "../../utils/functions"
import { clientSignUp } from "../../utils/frontendRoutes"

interface FirebaseError extends Error {
    code: string;
    message: string;
}

const ClientSignIn = () => {
    const navigate = useNavigate()

    const [emailInput, setEmailInput] = useState("")
    const [passwordInput, setPasswordInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const { t } = useTranslation()

    const handleSubmit = async () => {
        const receivedObject = { email: emailInput, password: passwordInput }
        const parsingResult = signinSchema.safeParse(receivedObject)
        if (parsingResult.error) {
            parsingResult.error?.errors.map(e => {
                ErrorToast(e.message)
            })
        }
        else if (parsingResult.success) {
            try {
                setIsLoading(true)

                // FIREBASE
                await signInWithEmailAndPassword(firebaseAuth, emailInput, passwordInput)

                // HIT OUR SERVER (add withCredentials)
                const result2 = await axios.post(sign_in_client, {
                    email: emailInput
                }, { withCredentials: true })

                // NAVIGATE THE CLIENT
                if (result2.data.success) {
                    navigate(whereToNavigateTo(result2.data.client))
                }
            } catch (error: unknown) {
                if (error instanceof Error) {
                    const firebaseError = error as FirebaseError;
                    if (firebaseError.code === 'auth/invalid-credential') {
                        ErrorToast("Invalid Credentials");
                    } else {
                        ErrorToast("An error occurred: " + firebaseError.message);
                    }
                } else {
                    ErrorToast("An unknown error occurred.");
                }
            } finally {
                setIsLoading(false)
            }
        }
    }

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(firebaseAuth, googleProvider)
            const user = result.user

            const email = user.email
            const fullName = user.displayName
            const profilePicture = user.photoURL

            // HIT THE BACKEND WITH THE ABOVE INFORMATION
            try {
                const result2 = await axios.post(sign_in_client, {
                    email: email
                }, { withCredentials: true })

                if (result2.data.success) {
                    navigate(whereToNavigateTo(result2.data.client))
                }
            } catch (error) {
                const result2 = await axios.post(sign_up_client, {
                    fullName: fullName,
                    email: email,
                    profilePicture: profilePicture
                }, { withCredentials: true })
                
                if (result2.data.success){
                    navigate(whereToNavigateTo(result2.data.client))
                }
            }
        } catch (error) {
            console.log(error)
            ErrorToast("Error during signing in")
        }
    }

    return (<>
        <ToastContainerWrap />
        <UnauthorizedNavbar />
        <div className="min-h-[93vh] bg-defaultGray flex justify-center items-center">
            <div className="flex flex-col gap-3 5">
                <h1 className="my-5 text-3xl font-semibold text-center text-purple-900 cursor-default">
                    {t('client-signin')}
                </h1>

                <form onSubmit={(e) => {
                    e.preventDefault()
                    if (!isLoading) { handleSubmit() }
                }} className="flex flex-col gap-3.5">

                    <EmailInput emailInput={emailInput} setEmailInput={setEmailInput} />

                    <PasswordInput passwordInput={passwordInput} setPasswordInput={setPasswordInput} autocomplete="current-password"/>

                    <div onClick={() => { navigate(clientSignUp) }} className='text-[11px] cursor-pointer hover:underline'>{t('dont-have-an-account')}</div>

                    <div className='tooltip tooltip-bottom' data-tip={isLoading ? t("signing-in") : t("sign-in")}>
                        <input type="submit" value={isLoading ? t("signing-in") : t("sign-in")} className="btn btn-block" />
                    </div>
                </form>

                <hr />

                <div className="flex justify-center items-center gap-3">
                    <button onClick={() => {
                        if (!isLoading) { handleGoogleLogin() }
                    }} className="border hover:bg-gray-200 rounded-full p-1.5 tooltip tooltip-bottom" data-tip={t("sign-in-with-google")}>
                        <GoogleSvg />
                    </button>
                </div>
            </div>
        </div>

    </>)
}

export default ClientSignIn