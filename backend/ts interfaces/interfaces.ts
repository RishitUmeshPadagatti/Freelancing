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