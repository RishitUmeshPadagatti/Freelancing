import { PrismaClient } from "@prisma/client"
import { Request, response, Response } from "express"
import { ResponseStatus, selectFreelancerDataPrisma } from "../utils/values"
import { definedOpenai } from "../utils/openai"
import jwt from "jsonwebtoken"

const prisma = new PrismaClient()
const maxAge = 30 * 24 * 60 * 60 * 1000

export const signUpNewFreelancer = async (req: Request, res: Response) => {
    try {
        const { fullName, email, profilePicture } = req.body

        const userExists1 = await prisma.client.findFirst({ where: { email: email } })
        const userExists2 = await prisma.freelancer.findFirst({ where: { email: email } })
        if (userExists1 || userExists2) {
            return res.status(ResponseStatus.clientError).json({ msg: "User already exists", success: false })
        }

        const freelancerData = {
            fullName: fullName,
            email: email,
            ...(profilePicture && { profilePicture })  // Only include profilePicture if provided
        };

        const result = await prisma.freelancer.create({
            data: freelancerData,
            select: selectFreelancerDataPrisma
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

        return res.status(ResponseStatus.success).json({ msg: "Freelancer Created", freelancer: result, success: true })
    } catch (error) {
        return res.status(ResponseStatus.internalServerError).json({ msg: "Internal Server Error", success: false })
    }
}

export const signInFreelancer = async (req: Request, res: Response) => {
    try {
        const { email } = req.body

        const result = await prisma.freelancer.findFirst({
            where: { email: email },
            select: selectFreelancerDataPrisma
        })
        if (!result) {
            return res.status(ResponseStatus.clientError).json({ msg: "User doesn't exist", success: false })
        }

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

        res.status(ResponseStatus.success).json({ msg: "Signed in", freelancer: result, success: true })
    } catch (error) {
        console.log(error)
        return res.status(ResponseStatus.internalServerError).json({ msg: "Internal Server Error", succes: false })
    }
}

export const getSkills = async (req: Request, res: Response) => {
    try {
        const result = await prisma.skill.findMany({})

        return res.status(ResponseStatus.success).json({ msg: "Predefined Skills found successfully", skills: result, success: true })
    } catch (error) {
        console.log(error)
        return res.status(ResponseStatus.internalServerError).json({ msg: "Internal Server Error", success: false })
    }
}

export const aboutMe = async (req: Request, res: Response) => {
    try {
        const freelancerId = Number(req.headers.id)

        const result = await prisma.freelancer.findFirst({
            where: {id: freelancerId},
            select: selectFreelancerDataPrisma
        })

        return res.status(ResponseStatus.success).json({msg: "Found details about you", freelancer: result, success: true})
    } catch (error) {
        console.log(error)
        return res.status(ResponseStatus.internalServerError).json({msg: "Internal Server Error", success: false})
    }
}

export const generateBioAI = async (req: Request, res: Response) => {
    try {
        const {prompt} = req.body

        // OPENAI
        const completion = await definedOpenai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a professional resume and bio writer. Generate engaging and professional bios for freelancers based on the provided details. Bio should contain at least 30 characters and a maximum of 5000 characters. Directly start writing the content, do not mention any headings." },
                {
                    role: "user",
                    content: prompt
                }
            ]
        })

        return res.status(ResponseStatus.success).json({msg: "Successfully received response from openai", response: completion.choices[0].message.content, success: true})

        // await new Promise((resolve) => {
        //     setTimeout(() => {
        //         resolve(1)
        //     }, 500);
        // })
        // return res.status(ResponseStatus.success).json({msg: "Successfully received response", response: "AI generated text. blah blah blah.\nokay", success: true})

    } catch (error) {
        console.log(error)
        return res.status(ResponseStatus.internalServerError).json({ msg: "Something went wrong", success: false })
    }
}

export const addBioAndSkills = async (req: Request, res: Response) => {
    try {
        const freelancerId = Number(req.headers.id)
        const bioInput = req.body.bioInput
        const skillsInput = req.body.skillsInput

        const result = await prisma.$transaction(async (primsa) => {
            await prisma.freelancer.update({
                where: {
                    id: freelancerId
                },
                data: {
                    bio: bioInput
                }
            })

            await primsa.freelancerSkills.deleteMany({
                where: { freelancerId: freelancerId }
            })

            await primsa.freelancerSkills.createMany({
                data: skillsInput.map((mapObj: { id: number, name: string }) => ({
                    freelancerId: freelancerId,
                    skillId: mapObj.id
                }))
            })

            const freelancer = await primsa.freelancer.findFirst({
                where: {id: freelancerId},
                select: selectFreelancerDataPrisma
            })
            return freelancer
        })

        return res.status(ResponseStatus.success).json({msg: "Successfully Updated", freelancer: result, success: true})
    } catch (error) {
        console.log(error)
        return res.status(ResponseStatus.internalServerError).json({msg: "Something went wrong", success: false})
    }
}

export const addResume = async (req: Request, res: Response) => {
    try {
        const freelancerId = Number(req.headers.id)
        const url = String(req.body.url)

        const result = await prisma.freelancer.update({
            where: {id: freelancerId},
            data: {resume: url}
        })

        return res.status(ResponseStatus.success).json({msg: "Successfully Updated", freelancer: result, success: true})
    } catch (error) {
        console.log(error)
        return res.status(ResponseStatus.internalServerError).json({msg: "Something went wrong", success: false})
    }
}