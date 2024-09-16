import { Request, Response } from "express"
import { PrismaClient } from "@prisma/client"
import { ResponseStatus, selectClientDataPrisma, selectFreelancerDataPrisma } from "../utils/values"
import axios from "axios"
import dotenv from 'dotenv'

const prisma = new PrismaClient()
dotenv.config()

export const addProfilePicture = async (req: Request, res: Response) => {
    try {
        const url = String(req.body.url)
        const userId = Number(req.headers.id)
        const accountType = req.headers.accountType

        if (accountType==="CLIENT"){
            const result = await prisma.client.update({
                where: {
                    id: userId
                },
                data: {
                    profilePicture: url
                },
                select: selectClientDataPrisma
            })
            return res.status(ResponseStatus.success).json({ msg: "Added/Updated profile picture", success: true, client: result })
        }
        else if (accountType==="FREELANCER"){
            const result = await prisma.freelancer.update({
                where: {
                    id: userId
                },
                data: {
                    profilePicture: url
                },
                select: selectFreelancerDataPrisma
            })
            return res.status(ResponseStatus.success).json({ msg: "Added/Updated profile picture", success: true, freelancer: result })
        }

    } catch (error) {
        console.log(error)
        return res.status(ResponseStatus.internalServerError).json({msg: "Internal Server Error", success: false})
    }
}

export const getConversionRates = async(req: Request, res: Response) => {
    try {
        const {baseCurrency} = req.body

        if (!baseCurrency){
            return res.status(ResponseStatus.clientError).json({msg: "No base currency in the body", success: false})
        }

        if (baseCurrency!=="INR" && baseCurrency!=="USD" && baseCurrency!=="EUR"){
            return res.status(ResponseStatus.clientError).json({msg: "Unsupported Currency", success: false})
        }

        // const result = await axios.get(`https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_RATE_API_KEY}/latest/${baseCurrency}`)
        // const conversionRates = result.data.conversion_rates

        // res.status(ResponseStatus.success).json({msg: "Successfully found the conversion rates", rates: {"INR": conversionRates.INR, "USD": conversionRates.USD, "EUR": conversionRates.EUR}, success: true})

        // TEMP
        let conversionRates;
        if (baseCurrency==="INR"){
            conversionRates={INR: 1, USD: 0.01191, EUR: 0.0108};
        }
        else if (baseCurrency==="USD"){
            conversionRates={INR: 83.9738, USD: 1, EUR: 0.9046};
        }
        else{
            conversionRates={INR: 92.5964, USD: 1.1055, EUR: 1}
        }
        res.status(ResponseStatus.success).json({msg: "Successfully found the conversion rates", rates: {"INR": conversionRates.INR, "USD": conversionRates.USD, "EUR": conversionRates.EUR}, success: true})
    } catch (error) {
        console.log(error)
        return res.status(ResponseStatus.internalServerError).json({msg: "Internal Server Error", success: false})
    }
}