import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { add_profile_pic, details_about_you_freelancer, upload_profile_pic_url } from '../../utils/requestAddresses';
import { ErrorToast, ToastContainerWrap } from '../../utils/toastify';
import UnauthorizedNavbar from '../../components/SignUpAndSignIn/UnauthorizedNavbar';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { whereToNavigateTo } from '../../utils/functions';


const SelectAvatar = () => {
	const { t } = useTranslation()
	const navigate = useNavigate()

	const [file, setFile] = useState<File | null>(null);
	const [imageUrl, setImageUrl] = useState<string | null>(null);

	useEffect(() => {
		try {
			axios.get(details_about_you_freelancer, { withCredentials: true })
				.then(result => {
					setImageUrl(result.data.freelancer.profilePicture)
				})
		} catch (error) {
			console.log(error)
		}
	}, [])

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			setFile(e.target.files[0]);
		}
	};

	const handleUpload = async () => {
		if (!file) return;

		const formData = new FormData();
		formData.append('profilePic', file);

		try {
			const response = await axios.post(upload_profile_pic_url, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
				withCredentials: true
			});
			const profileUrl = response.data.url
			setImageUrl(profileUrl);
		} catch (error) {
			ErrorToast("Couldn't upload the image")
			console.error('Error uploading the image', error);
		}
	};

	const handleNext = async () => {
		try {
			const result = await axios.put(add_profile_pic, {
				url: imageUrl
			}, { withCredentials: true })

			navigate(whereToNavigateTo(result.data.freelancer || result.data.client))
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
				<div className="avatar flex justify-center">
					<div className="w-24 rounded-full my-5">
						<img src={imageUrl ? imageUrl : "https://img.icons8.com/ios-filled/100/CCCCCC/user.png"} />
					</div>
				</div>

				<input type="file" onChange={handleFileChange} className="file-input file-input-bordered w-full max-w-xs" accept="image/jpeg, image/png, image/jpg" />

				<button className="btn w-full" onClick={handleUpload} disabled={(file) ? false : true}>{t("upload")}</button>

				<hr className='my-3' />

				<button className="btn w-full" onClick={handleNext} disabled={(imageUrl) ? false : true}>{t("next")}</button>
			</div>
		</div>
	</>
	);
};


export default SelectAvatar
