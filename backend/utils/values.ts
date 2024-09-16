export enum ResponseStatus {
    success = 200,
    notFound = 404,
    internalServerError = 500,
    clientError = 400
}

export const selectClientDataPrisma = {
    id: true,
    email: true,
    fullName: true,
    profilePicture: true,
    rating: true,
    accountType: true,
    createdAt: true
}

export const selectFreelancerDataPrisma = {
    id: true,
    email: true,
    fullName: true,
    bio: true,
    resume: true,
    profilePicture: true,
    skills: true,
    rating: true,
    accountType: true,
    connects: true,
    createdAt: true
}

// export enum acceptedCurrencies {
//     inr = "INR",
//     usd = "USD",
//     eur = "EUR"
// }

// export enum ConnectsFibonacci {
//     ONE,
//     TWO,
//     THREE,
//     FIVE,
//     EIGHT
// }