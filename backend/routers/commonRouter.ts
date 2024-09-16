import express from "express"
import { authMiddleware } from "../middlewares/middleware"
import {addProfilePicture, getConversionRates} from "../controllers/commonController"

const commonRouter = express.Router()

commonRouter.put("/add-profile-picture", authMiddleware, addProfilePicture)
commonRouter.post("/conversion-rates", authMiddleware, getConversionRates)

export default commonRouter