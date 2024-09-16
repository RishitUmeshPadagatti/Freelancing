import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { useState } from 'react'
import { firebaseAuth, googleProvider } from '../../utils/firebase-config'
import { GoogleSvg } from '../../assets/MultipleSvgs'
import { ErrorToast, ToastContainerWrap } from '../../utils/toastify'
import { signupSchema } from '../../utils/zodSchemas'
import FullNameInput from '../../components/SignUpAndSignIn/FullNameInput'
import EmailInput from '../../components/SignUpAndSignIn/EmailInput'
import PasswordInput from '../../components/SignUpAndSignIn/PasswordInput'
import { useNavigate } from 'react-router-dom'
import UnauthorizedNavbar from '../../components/SignUpAndSignIn/UnauthorizedNavbar'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import { sign_up_client } from '../../utils/requestAddresses'
import { clientSignIn, dashboardRoute, selectAvatarRoute } from '../../utils/frontendRoutes'

interface FirebaseError extends Error {
    code: string;
    message: string;
}

const ClientSignUp = () => {
    const navigate = useNavigate()

    const [fullNameInput, setFullNameInput] = useState("")
    const [emailInput, setEmailInput] = useState("")
    const [passwordInput, setPasswordInput] = useState("")

    const [isLoading, setIsLoading] = useState(false)

    const { t } = useTranslation()

    const handleSubmit = async () => {
        const receivedObject = { fullName: fullNameInput, email: emailInput, password: passwordInput }
        const parsingResult = signupSchema.safeParse(receivedObject)
        if (parsingResult.error) {
            parsingResult.error?.errors.map(e => {
                ErrorToast(e.message)
            })
        }
        else if (parsingResult.success) {
            try {
                setIsLoading(true)

                // FIREBASE
                await createUserWithEmailAndPassword(firebaseAuth, emailInput, passwordInput)

                // HIT OUR SERVER
                const result2 = await axios.post(sign_up_client, {
                    fullName: fullNameInput,
                    email: emailInput
                }, { withCredentials: true })

                // NAVIGATE THE CLIENT
                if (result2.data.success){
                    navigate(selectAvatarRoute)
                }

            } catch (error: unknown) {
                if (error instanceof Error) {
                    const firebaseError = error as FirebaseError;
                    if (firebaseError.code === 'auth/email-already-in-use') {
                        ErrorToast("An account with this email already exists.");
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

    const handleGoogleSignup = async () => {
        try {
            const result = await signInWithPopup(firebaseAuth, googleProvider)
            const user = result.user

            const email = user.email
            const fullName = user.displayName
            const profilePicture = user.photoURL

            // HIT THE BACKEND WITH THE ABOVE INFORMATION
            const result2 = await axios.post(sign_up_client, {
                fullName: fullName,
                email: email,
                profilePicture: profilePicture
            }, { withCredentials: true })
            
            if (result2.data.success){
                navigate(dashboardRoute)
            }
        } catch (error) {
            console.log(error)
            ErrorToast("Error during signing up")
        }
    }

    return (<>
        <ToastContainerWrap />
        <UnauthorizedNavbar />
        <div className='min-h-[93vh] bg-defaultGray flex justify-center items-center'>
            <div className='flex flex-col gap-3.5 '>
                <h1 className='my-5 text-3xl font-semibold text-center text-purple-900 cursor-default'>
                    {t("client-signup")}
                </h1>

                <form onSubmit={(e) => {
                    e.preventDefault()
                    if (!isLoading) { handleSubmit() }
                }} className='flex flex-col gap-3.5 '>

                    <FullNameInput fullNameInput={fullNameInput} setFullNameInput={setFullNameInput} />

                    <EmailInput emailInput={emailInput} setEmailInput={setEmailInput} />

                    <PasswordInput passwordInput={passwordInput} setPasswordInput={setPasswordInput} autocomplete="new-password"  />

                    <div onClick={() => { navigate(clientSignIn) }} className='text-[11px] cursor-pointer hover:underline'>{t('already-have-an-account')}</div>

                    <div className='tooltip tooltip-bottom' data-tip={isLoading ? t('signing-up') : t('sign-up')}>
                        <input type="submit" value={isLoading ? t('signing-up') : t('sign-up')} className="btn btn-block" />
                    </div>
                </form>

                <hr />

                <div className='flex justify-center items-center gap-3'>
                    <button onClick={() => {
                        if (!isLoading) { handleGoogleSignup() }
                    }} className="border hover:bg-gray-200 rounded-full p-1.5 tooltip tooltip-bottom" data-tip={t("sign-up-with-google")}>
                        <GoogleSvg />
                    </button>
                </div>
            </div>
        </div>
    </>
    )
}

export default ClientSignUp
