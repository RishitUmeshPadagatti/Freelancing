import { atom, selector } from "recoil";
import { acceptedCurrencies } from "../utils/interfaces";
import axios from "axios";
import { get_conversion_rates } from "../utils/requestAddresses";

export const languageAtom = atom({
    key: "languageAtom",
    default: "en"
})

export const selectedCurrencyAtom = atom({
    key: "selectedCurrencyAtom",
    default: localStorage.getItem("currency") || acceptedCurrencies.inr
})

export const conversionRatesAtom = selector({
    key: "conversionRatesAtom",
    get: async ({get}) => {
        const currentCurrency = get(selectedCurrencyAtom)
        try {
            const result = await axios.post(get_conversion_rates, {
                baseCurrency: currentCurrency
            }, {withCredentials: true})
            return result.data.rates
        } catch (error) {
            throw error
        }
    }
})