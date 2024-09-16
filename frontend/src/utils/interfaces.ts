export interface Client {
    id: number;
    email: string;
    fullName: string;
    profilePicture?: string;
    rating?: number;
    accountType: 'CLIENT';
    createdAt: Date;
}

export interface Freelancer {
    id: number;
    email: string;
    fullName: string;
    bio?: string;
    resume?: string;
    profilePicture?: string;
    skills: string[];
    rating?: number;  // to be confirmed (TBC)
    accountType: 'FREELANCER';
    connects: number;
    createdAt: Date;
}

export interface skillInterface {
    id: number;
    name: string;
}

export enum acceptedCurrencies {
    inr = "INR",
    usd = "USD",
    eur = "EUR"
}

export enum paymentTypeEnum {
    full = "FULL",
    hourly = "HOURLY"
}

// enum SupportedCurrency {
// 	INR = 'INR',
// 	USD = 'USD',
// 	EUR = 'EUR',
// }