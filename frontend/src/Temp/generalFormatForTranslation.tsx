import './App.css'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../hooks/useLanguage'

function translationSomethingTemp() {
	const { t } = useTranslation()
	const { changeLanguage, language } = useLanguage()

	return (<>
		<h1 className='text-3xl bg-red-600'>{t('title')}</h1>
		<div>{t('description')}</div>
		<div>
			<h1>Change languages</h1>

			<button className='border bg-blue-500' onClick={() => {
				changeLanguage('en');
			}}>English</button>
			<button className='border bg-green-500' onClick={() => {
				changeLanguage('hn');
			}}>Hindi</button>
			<button className='border bg-yellow-500' onClick={() => {
				changeLanguage('kn');
			}}>Kannada</button>
		</div>
	</>
	)
}

export default translationSomethingTemp
