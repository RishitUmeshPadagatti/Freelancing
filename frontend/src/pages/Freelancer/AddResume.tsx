import React, { useEffect, useState } from 'react'
import { ErrorToast, ToastContainerWrap } from '../../utils/toastify'
import UnauthorizedNavbar from '../../components/SignUpAndSignIn/UnauthorizedNavbar'
import axios from 'axios'
import { add_resume, details_about_you_freelancer, upload_pdf_url } from '../../utils/requestAddresses'
import ResumeImage from "../../assets/Resume Image.png"
import { whereToNavigateTo } from '../../utils/functions'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { talentResumeBuilder } from '../../utils/frontendRoutes'

const FreelancerAddResume = () => {
    const navigate = useNavigate()
    const { t } = useTranslation()
    const [file, setFile] = useState<File | null>(null)
    const [pdfUrl, setPdfUrl] = useState<string | null>(null)

    useEffect(() => {
        try {
            axios.get(details_about_you_freelancer, { withCredentials: true })
                .then(result => {
                    setPdfUrl(result.data.freelancer.resume)
                })
        } catch (error) {
            console.log(error)
        }
    }, [])


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0])
        }
    }

    const handleUpload = async () => {
        if (!file) return

        const formData = new FormData();
        formData.append('resume', file)

        try {
            const response = await axios.post(upload_pdf_url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true
            })
            const pdfUrl = response.data.url
            setPdfUrl(pdfUrl)
        } catch (error) {
            ErrorToast("Couldn't upload the image")
            console.error("Error uploading the image", error)
        }
    }

    const handleNext = async () => {
        try {
            const result = await axios.put(add_resume, {
                url: pdfUrl
            }, { withCredentials: true })

            navigate(whereToNavigateTo(await result.data.freelancer))
        } catch (error) {
            console.log(error)
            ErrorToast("Something went wrong")
        }
    }

    return (<>
        <ToastContainerWrap />
        <UnauthorizedNavbar />
        <div className=' min-h-[95vh] bg-defaultGray flex justify-center items-center'>
            <div className='flex flex-col gap-3'>
                <div className="flex flex-grow items-center justify-center h-[490px]">
                    {pdfUrl ? <iframe
                        src={pdfUrl}
                        className=" h-full"
                        style={{ border: 'none' }}
                        title="PDF Preview"
                    /> :
                        <img className='w-20' src={ResumeImage} />}
                </div>

                <input type="file" onChange={handleFileChange} className="file-input file-input-bordered w-full max-w-xs" accept="application/pdf" />

                <div className='text-[11px] mt-3 cursor-pointer hover:underline text-center'
                    onClick={() => navigate(talentResumeBuilder)}>
                    {t("dont-have-a-resume?")}
                </div>

                <button className="btn w-full" onClick={handleUpload} disabled={(file) ? false : true}>{t("upload")}</button>

                <hr className='my-3' />

                <button className="btn w-full" onClick={handleNext} disabled={(pdfUrl) ? false : true}>{t("next")}</button>
            </div>
        </div>
    </>
    )
}

export default FreelancerAddResume
