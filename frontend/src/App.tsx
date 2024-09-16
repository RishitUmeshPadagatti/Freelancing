import { Route, Routes } from 'react-router-dom'
import './App.css'
import Temp from './pages/Temp'
import ClientSignUp from './pages/Client/SignUp'
import ClientSignIn from './pages/Client/SignIn'
import SelectAvatar from './pages/common/SelectAvatar'
import FreelancerSignUp from './pages/Freelancer/SignUp'
import FreelancerSignIn from './pages/Freelancer/SignIn'
import FreelancerAddBioAndSkills from './pages/Freelancer/AddBioAndSkills'
import FreelancerAddResume from './pages/Freelancer/AddResume'
import FreelancerBuildResume from './pages/Freelancer/BuildResume'
import { clientExploreRoute, clientMessages, clientMyJobs, clientProfile, clientSignIn, clientSignUp, createJob, dashboardRoute, homeRoute, selectAvatarRoute, talentAddBioAndSkills, talentAddResume, talentResumeBuilder, talentSignIn, talentSignUp, tempRoute } from './utils/frontendRoutes'
import { useEffect, useState } from 'react'
import { onAuthStateChanged, User } from 'firebase/auth'
import { firebaseAuth } from './utils/firebase-config'
import PrivateRoute from './utils/PrivateRoute'
import CreateJob from './pages/Client/CreateJob'

function App() {
	const [user, setUser] = useState<User | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
			setUser(user)
			setLoading(false)
		})

		return () => unsubscribe()
	}, [])

	if (loading){
		return <div className='bg-defaultGray w-screen h-screen flex justify-center items-center'>
			<span className="loading loading-spinner loading-lg"></span>
		</div>
	}

	return (
		<Routes>
			<Route path={homeRoute} element={<Temp />} />
			<Route path={tempRoute} element={<Temp />} />

			{/* Client Init */}
			<Route path={clientSignIn} element={<ClientSignIn />} />
			<Route path={clientSignUp} element={<ClientSignUp />} />

			{/* Freelancer Init */}
			<Route path={talentSignIn} element={<FreelancerSignIn />} />
			<Route path={talentSignUp} element={<FreelancerSignUp />} />
			<Route path={talentAddBioAndSkills} element={<PrivateRoute user={user}><FreelancerAddBioAndSkills /></PrivateRoute>} />
			<Route path={talentAddResume} element={<PrivateRoute user={user}><FreelancerAddResume /></PrivateRoute>} />
			<Route path={talentResumeBuilder} element={<PrivateRoute user={user}><FreelancerBuildResume /></PrivateRoute>} />

			{/* Avatar Selection */}
			<Route path={selectAvatarRoute} element={<PrivateRoute user={user}><SelectAvatar /></PrivateRoute>} />

			{/* Main */}
			<Route path={dashboardRoute} element={<Temp />} />
			<Route path={clientExploreRoute} element={<Temp />} />
			<Route path={clientMyJobs} element={<Temp />} />
			<Route path={clientMessages} element={<Temp />} />
			<Route path={createJob} element={<CreateJob />} />
			<Route path={clientProfile} element={<Temp />} />
		</Routes>
	)
}

export default App
