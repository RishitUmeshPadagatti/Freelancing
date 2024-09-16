import { acceptedCurrencies, Client, Freelancer } from "./interfaces"
import { dashboardRoute, selectAvatarRoute, talentAddBioAndSkills, talentAddResume } from "./frontendRoutes"

export const whereToNavigateTo = (userData: Client | Freelancer) => {
    if (userData.profilePicture === null){
        return selectAvatarRoute
    }

    if (userData.accountType === "FREELANCER"){
        if (userData.bio === null || userData.skills === null){
            return talentAddBioAndSkills
        }
        if (userData.resume === null){
            return talentAddResume
        }
    }

    return dashboardRoute
}

export function getCurrencySymbol(givenCurrency: string){
    if (givenCurrency===acceptedCurrencies.inr){
        return "₹"
    }
    else if (givenCurrency===acceptedCurrencies.usd){
        return "$"
    }
    else if (givenCurrency===acceptedCurrencies.eur){
        return "€"
    }
}

export function formatDateTime(dateTimeObject: { year: number, month: number, date: number, time: string }): string {
	const { year, month, date, time } = dateTimeObject;

	// Pad month and date with leading zeros if necessary
	const paddedMonth = String(month + 1).padStart(2, '0'); // Month is zero-indexed, so add 1
	const paddedDate = String(date).padStart(2, '0');

	// Construct the formatted string
	const formattedDateTime = `${year}-${paddedMonth}-${paddedDate}T${time}`;

	return formattedDateTime;
}