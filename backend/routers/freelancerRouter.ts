import express from "express"
import {aboutMe, addBioAndSkills, addResume, generateBioAI, getSkills, signInFreelancer, signUpNewFreelancer} from "../controllers/freelancerController"
import { authMiddleware } from "../middlewares/middleware"

const freelancerRouter = express.Router()

freelancerRouter.post("/signup", signUpNewFreelancer)
freelancerRouter.post("/signin", signInFreelancer)
freelancerRouter.get("/getSkills", authMiddleware, getSkills)
freelancerRouter.get("/me", authMiddleware, aboutMe)
freelancerRouter.post("/generate-bio-ai", authMiddleware, generateBioAI)
freelancerRouter.put("/add-bio-and-skills", authMiddleware, addBioAndSkills)
freelancerRouter.put("/add-resume", authMiddleware, addResume)

export default freelancerRouter