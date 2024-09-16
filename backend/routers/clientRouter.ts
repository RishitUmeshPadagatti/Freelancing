import express from "express"
import { createJob, generateDescriptionAI, signInClient, signUpNewClient } from "../controllers/clientController"
import { authMiddleware } from "../middlewares/middleware"
// import {authMiddleware} from "../middlewares/middleware"

const clientRouter = express.Router()

clientRouter.post("/signup", signUpNewClient)
clientRouter.post("/signin", signInClient)
clientRouter.post("/generate-description-ai", authMiddleware, generateDescriptionAI)
clientRouter.post("/create-job", authMiddleware, createJob)

export default clientRouter