import React, { useState } from 'react';
import ClientNavbar from '../../components/Client/Navbar'
import { ErrorToast, ToastContainerWrap } from '../../utils/toastify'
import { formatDateTime, getCurrencySymbol } from '../../utils/functions';
import { BioSection } from '../../components/Common/BioSection';
import { create_job, generate_description_ai } from '../../utils/requestAddresses';
import { useTranslation } from 'react-i18next';
import { useServerSkill } from '../../hooks/useServerSkill';
import { SkillsSection } from '../../components/Common/SkillsSection';
import { acceptedCurrencies, paymentTypeEnum, skillInterface } from '../../utils/interfaces';
import DatePicker from '@/components/Client/DatePicker';
import { createJobSchema } from '@/utils/zodSchemas';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { dashboardRoute } from '@/utils/frontendRoutes';
import { convertNumber } from '@/i18n';

const CreateJob: React.FC = () => {
	const [title, setTitle] = useState<string>("")
	const [description, setDescription] = useState<string>("")
	const [skills, setSkills] = useState<skillInterface[]>([])
	const [connectsNum, setconnectsNum] = useState<number>(1)
	const [currency, setCurrency] = useState<string>(acceptedCurrencies.inr)
	const [approxAmount, setApproxAmount] = useState<number>(0)
	const [maxAmount, setMaxAmount] = useState<number>(0)
	const [paymentType, setPaymentType] = useState<paymentTypeEnum>(paymentTypeEnum.full)
	const [deadlineDate, setDeadlineDate] = useState<Date | undefined>(() => {
		const today = new Date();
		const nextWeek = new Date(today);
		nextWeek.setDate(today.getDate() + 7);
		return nextWeek;
	});
	const [deadlineTime, setDeadlineTime] = useState<string>("12:00")

	const { t } = useTranslation()
	const connects = [1, 2, 3, 5, 8]
	const predefinedSkills: skillInterface[] = useServerSkill()
	const [isLoading, setIsLoading] = useState(false)
	const navigate = useNavigate()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		const dateTimeObject = {
			year: deadlineDate?.getFullYear() ?? 2024,
			month: (deadlineDate?.getMonth() ?? 0) + 1,
			date: deadlineDate?.getDate() ?? 1,
			time: deadlineTime
		};
		const deadlineValue = formatDateTime(dateTimeObject)

		const receivedObj = { title, description, skills, connectsNum, currency, approxAmount, maxAmount, paymentType, deadlineValue }
		const parsingResult = createJobSchema.safeParse(receivedObj)
		if (parsingResult.error) {
			parsingResult.error?.errors.map(e => {
				ErrorToast(e.message)
			})
		}
		if (maxAmount < approxAmount) {
			ErrorToast("Maximum Amount should be greater than Approximate Amount ")
		}
		else if (parsingResult.success) {
			setIsLoading(true)

			// HIT THE SERVER
			try {
				const result = await axios.post(create_job, receivedObj, { withCredentials: true })

				if (result.data.success) {
					navigate(dashboardRoute)
				}
			} catch (error) {
				ErrorToast("Something went wrong")
			} finally {
				setIsLoading(false)
			}
		}
	}

	return (<>
		<ToastContainerWrap />
		<ClientNavbar />
		<form onSubmit={(e) => e.preventDefault()} className='min-h-[93vh] bg-defaultGray sm:px-5 sm:py-3 p-2 flex flex-col gap-5'>
			<div>
				<label htmlFor="title" className='font-bold sm:text-3xl text-xl'>{t("title")}</label>
				<input
					id="title"
					type='text'
					placeholder={t("enter-title")}
					value={title}
					onChange={e => setTitle(e.target.value)}
					className="input input-bordered w-full text-base mt-4 font-serif"
				/>
			</div>

			<div className='mt-4'>
				<BioSection bio={description} setBio={setDescription} backendAddress={generate_description_ai} titleText={t("description")} placeholder={t("enter-description-ai")} />
			</div>

			<div>
				<SkillsSection skills={skills} setSkills={setSkills} predefinedSkills={predefinedSkills} />
			</div>

			<div className='flex gap-4 flex-col'>
				<label htmlFor="connectsNum" className='font-bold sm:text-3xl text-xl'>{t("connects-required")}</label>
				<div id="connectsNum" className='flex justify-around'>
					{connects.map(c => (
						<div
							key={c}
							className={`btn btn-circle btn-outline hover:scale-110 ${connectsNum === c ? "bg-black text-white" : ""}`}
							onClick={() => setconnectsNum(c)}>{convertNumber(c)}</div>
					))}
				</div>
			</div>

			<div className='flex flex-col gap-4 mt-4'>
				<label className='font-bold sm:text-3xl text-xl'>{t("application-deadline")}</label>
				<DatePicker date={deadlineDate} setDate={setDeadlineDate} time={deadlineTime} setTime={setDeadlineTime} />
			</div>

			<div className='flex gap-4 flex-col mt-4'>
				<label className='font-bold sm:text-3xl text-xl'>{t("budget")}</label>
				<div className='join w-full'>
					<select
						className="select select-bordered join-item w-1/6"
						value={currency}
						onChange={(e) => setCurrency(e.target.value)}>
						<option value={acceptedCurrencies.inr}>{getCurrencySymbol(acceptedCurrencies.inr)}</option>
						<option value={acceptedCurrencies.usd}>{getCurrencySymbol(acceptedCurrencies.usd)}</option>
						<option value={acceptedCurrencies.eur}>{getCurrencySymbol(acceptedCurrencies.eur)}</option>
					</select>
					<div className='w-full font-serif'>
						<input
							type='number'
							min={0}
							value={approxAmount === 0 ? "" : approxAmount}
							onChange={(e) => setApproxAmount(parseFloat(e.target.value))}
							className="input input-bordered join-item w-full"
							placeholder={t("approximate-amount")}
							id='approxAmount'
							required={true}
						/>
					</div>
					<div className='w-full font-serif'>
						<input
							type='number'
							min={0}
							value={maxAmount === 0 ? "" : maxAmount}
							onChange={(e) => setMaxAmount(parseFloat(e.target.value))}
							className="input input-bordered join-item w-full"
							placeholder={t("maximum-amount")}
							id='maxAmount'
							required={true}
						/>
					</div>
				</div>

				<div className='flex flex-col gap-2'>
					<div className='flex gap-2'>
						<input
							type="radio"
							value={paymentTypeEnum.full}
							onChange={() => setPaymentType(paymentTypeEnum.full)}
							name="radio-1"
							id='option1'
							className="radio"
							defaultChecked />
						<label htmlFor='option1' className='cursor-pointer font-serif'>Full Payment</label>
					</div>
					<div className='flex gap-2'>
						<input
							type="radio"
							value={paymentTypeEnum.hourly}
							onChange={() => setPaymentType(paymentTypeEnum.hourly)}
							name="radio-1"
							id='option2'
							className="radio" />
						<label htmlFor="option2" className='cursor-pointer font-serif'>Hourly Rate</label>
					</div>
				</div>
			</div>

			<div className='my-10'>
				<button
					className="btn btn-wide border-gray-300 font-bold"
					disabled={isLoading}
					onClick={handleSubmit}
					style={{ width: "100%" }}>
					{isLoading ? t("loading") : t('next')}
				</button>
			</div>
		</form>
	</>
	)
}

export default CreateJob
