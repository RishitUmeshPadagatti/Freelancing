import { ConnectsFibonacci, PrismaClient, SupportedCurrency } from "@prisma/client"
import { Request, Response } from "express"
import { ResponseStatus, selectClientDataPrisma } from "../utils/values"
import jwt from "jsonwebtoken"
import { definedOpenai } from "../utils/openai"
import {createJobSchema} from "../utils/zod"

const prisma = new PrismaClient()
const maxAge = 30 * 24 * 60 * 60 * 1000

export const signUpNewClient = async (req: Request, res: Response) => {
    try {
        const { fullName, email, profilePicture } = req.body

        const userExists1 = await prisma.client.findFirst({ where: { email: email } })
        const userExists2 = await prisma.freelancer.findFirst({ where: { email: email } })
        if (userExists1 || userExists2) {
            return res.status(ResponseStatus.clientError).json({ msg: "User already exists", success: false })
        }

        const clientData = {
            fullName: fullName,
            email: email,
            ...(profilePicture && { profilePicture })  // Only include profilePicture if provided
        };

        const result = await prisma.client.create({
            data: clientData,
            select: selectClientDataPrisma
        })

        if (!process.env.JWT_PASSWORD) {
            throw new Error('JWT_PASSWORD environment variable is not defined');
        }

        const jwtPayload = jwt.sign({ result }, process.env.JWT_PASSWORD)
        res.cookie("user_details", jwtPayload, {
            maxAge: maxAge,
            httpOnly: true, // Prevent JavaScript access to cookies
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none'
        })

        return res.status(ResponseStatus.success).json({ msg: "Client Created", client: result, success: true })
    } catch (error) {
        console.log(error)
        return res.status(ResponseStatus.internalServerError).json({ msg: "Internal Server Error", success: false })
    }
}

export const signInClient = async (req: Request, res: Response) => {
    try {
        const {email} = req.body

        const result = await prisma.client.findFirst({ 
            where: { email: email },
            select: selectClientDataPrisma
        })
        if (!result) {
            return res.status(ResponseStatus.clientError).json({ msg: "User doesn't exist", success: false })
        }

        if (!process.env.JWT_PASSWORD) {
            throw new Error('JWT_PASSWORD environment variable is not defined');
        }

        const jwtPayload = jwt.sign({result}, process.env.JWT_PASSWORD)
        res.cookie("user_details", jwtPayload, {
            maxAge: maxAge,
            httpOnly: true, // Prevent JavaScript access to cookies
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none'
        })

        res.status(ResponseStatus.success).json({msg: "Signed in", client: result, success: true})
    } catch (error) {
        console.log(error)
        return res.status(ResponseStatus.internalServerError).json({msg: "Internal Server Error", succes: false})
    }
}

export const generateDescriptionAI = async (req: Request, res: Response) => {
    try {
        const {prompt} = req.body

        // OPENAI
        const completion = await definedOpenai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {role: "system", content: "You are a professional description writer. You are helping a client write a clear and simple job description for freelancers. Use plain and straightforward language. Avoid fancy words, jargon, or complicated sentences. Be concise and direct, making it easy to understand the job requirements and expectations. The description should contain at least 30 characters and a maximum of 5000 characters. Directly start writing the content, do not mention any headings."},
                {
                    role: "user",
                    content: "prompt"
                }
            ]
        })

        return res.status(ResponseStatus.success).json({msg: "Successfully received response from openai", response: completion.choices[0].message.content, success: true})
    } catch (error) {
        console.log(error)
        return res.status(ResponseStatus.internalServerError).json({msg: "Something went wrong", success: false})
    }
}

export const createJob = async (req: Request, res: Response) => {
    try {
        const {title, description, skills, connectsNum, currency, approxAmount, maxAmount, paymentType,  deadlineValue} = req.body
        const deadlineDateObject = new Date(deadlineValue)
        const userId = Number(req.headers.id)

        const parsingResult = createJobSchema.safeParse({title, description, skills, currency, connectsNum, approxAmount, maxAmount, paymentType, deadlineValue})
        if (parsingResult.error){
            return res.status(ResponseStatus.clientError).json({msg: parsingResult.error.errors[0].message, success: false})
        }

        if (isNaN(deadlineDateObject.getTime())) {
            return res.status(ResponseStatus.clientError).json({ msg: "Invalid deadline date", success: false });
        }

        // Converts number to words
        let connectsRequired: ConnectsFibonacci;
        if (connectsNum===1) connectsRequired=ConnectsFibonacci.ONE
        else if (connectsNum===2) connectsRequired=ConnectsFibonacci.TWO
        else if (connectsNum===3) connectsRequired=ConnectsFibonacci.THREE
        else if (connectsNum===5) connectsRequired=ConnectsFibonacci.FIVE
        else connectsRequired=ConnectsFibonacci.EIGHT

        const result = await prisma.$transaction(async (prisma) => {
            const createdJob = await prisma.job.create({
                data: {
                    title: title,
                    description: description,
                    connectsRequired: connectsRequired,
                    currency: currency,
                    approxAmount: approxAmount,
                    maxAmount: maxAmount,
                    paymentType: paymentType,
                    applicationDeadline: deadlineDateObject,

                    clientId: userId
                },
                select: {
                    id: true
                }
            })

            if (skills && skills.length > 0) {
                await prisma.jobRequiredSkills.createMany({
                    data: skills.map((skill: { id: number }) => ({
                        jobId: createdJob.id,
                        skillId: skill.id
                    }))
                });
            }

            const result2 = await prisma.job.findFirst({
                where: {id: createdJob.id},
                select: {
                    id: true,
                    status: true,
                    title: true,
                    description: true,
                    connectsRequired: true,
                    skillsRequired: true,
                    currency: true,
                    approxAmount: true,
                    maxAmount: true,
                    paymentType: true,
                    applicationDeadline: true,

                    client: true,

                    createdAt: true
                }
            })

            return result2
        })

        return res.status(ResponseStatus.success).json({msg: "Successfully created the job", job: result, success: true})
    } catch (error) {
        console.log(error)
        return res.status(ResponseStatus.internalServerError).json({msg: "Something went wrong", success: false})
    }
}