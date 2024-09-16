import { z } from 'zod';

export const signupSchema = z.object({
    fullName: z.string().min(1, { message: 'Full Name is required' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
});

export const signinSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
});

export const addBioAndSkillsSchema = z.object({
    bio: z
        .string()
        .min(30, { message: "Bio should contain at least 30 characters" })
        .max(5000, { message: "Bio cannot contain more than 5000 characters" }),
    skills: z
        .array(z.object({
            id: z.number(),
            name: z.string(),
        }))
        .min(1, { message: "Minimum 1 skill is required" })
});

export const createJobSchema = z.object({
    title: z
        .string()
        .min(10, { message: "Title should contain at least 10 characters" }),
    description: z
        .string()
        .min(30, { message: "Description should contain at least 30 characters" }),
    skills: z
        .array(z.object({
            id: z.number(),
            name: z.string()
        }))
        .min(1, { message: "At least one skill is required" }),
    connectsNum: z
        .number()
        .refine((val) => [1, 2, 3, 5, 8].includes(val), {
            message: "The number must be one of the following: 1, 2, 3, 5, 8",
        }),
    currency: z
        .string()
        .refine((val) => ["INR", "USD", "EUR"].includes(val), {
            message: "The currency must be one of: INR, USD, EUR",
        }),
    approxAmount: z
        .number()
        .nonnegative(),
    maxAmount: z
        .number()
        .nonnegative(),
    paymentType: z
        .string(),
    deadlineValue: z
        .string()
})