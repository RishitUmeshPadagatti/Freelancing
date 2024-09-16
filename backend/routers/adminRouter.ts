import express from "express"
import {authMiddleware} from "../middlewares/middleware"
import {addSkillsAdmin} from "../controllers/addSkillsController"

const adminRouter = express.Router()

adminRouter.put("/add-skills", authMiddleware, addSkillsAdmin)

export default adminRouter