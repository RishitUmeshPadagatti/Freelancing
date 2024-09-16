import { PrismaClient } from "@prisma/client"
import { Request, Response } from "express"

const prisma = new PrismaClient()

export const addSkillsAdmin = async (req: Request, res: Response) => {
    try {
        const predefinedSkills = req.body.predefinedSkills

        for (const skill of predefinedSkills) {
            await prisma.skill.upsert({
              where: { name: skill.name },
              update: {},
              create: skill,
            });
            await prisma.skill.createMany({
                data: predefinedSkills,
                skipDuplicates: true
            })
        }
        return res.status(200).send("Added Predefined skills")
    } catch (error) {
        return res.status(400).send(error)
    }
}