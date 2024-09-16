import { NextFunction, Request, Response } from "express"
import { ResponseStatus } from "../utils/values"
import jwt, {JwtPayload} from "jsonwebtoken"
import {Client, Freelancer} from "../ts interfaces/interfaces"

interface CustomJwtPayload extends JwtPayload {
    result: Client | Freelancer; // You can have either Client or Freelancer in the payload
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const receivedToken = req.cookies.user_details
        if (!receivedToken){
            return res.status(ResponseStatus.clientError).json({msg: "Doesn't have a token", success: false})
        }

        const decoded = jwt.verify(receivedToken, String(process.env.JWT_PASSWORD))
        const user = (decoded as CustomJwtPayload).result
        req.headers.id = String(user.id)
        req.headers.accountType = user.accountType

        next()
    } catch (error) {
        console.log(error)
        return res.status(ResponseStatus.internalServerError).json({ msg: "Internal Server Error", success: false })
    }
}