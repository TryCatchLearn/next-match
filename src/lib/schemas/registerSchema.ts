import z from "zod";
import { calculateAge } from "../util";

const requiredString = (fieldName: string, min = 1) => 
    z.string({error: `${fieldName} is required`}).min(min, {error: `${fieldName} is required`})

export const registerSchema = z.object({
    name: requiredString('name'),
    email: z.email({error: 'Invalid email'}),
    password: requiredString('password', 6),
    confirmPassword: requiredString('confirmPassword', 6)
})
    .superRefine(({confirmPassword, password}, ctx) => {
        if (confirmPassword !== password) {
            ctx.addIssue({
                code: 'custom',
                message: 'The passwords do not match',
                path: ['confirmPassword']
            })
        }
    })

export const profileSchema = z.object({
    gender: requiredString('gender'),
    description: requiredString('description', 10),
    city: requiredString('city'),
    country: requiredString('country'),
    dateOfBirth: requiredString('dateOfBirth').refine(dateString => {
        const age = calculateAge(dateString);
        return age >= 18;
    }, {
        error: 'You must be at least 18 years old to use this app'
    })
})

export const combinedRegisterSchema = registerSchema.and(profileSchema);

export type ProfileSchema = z.infer<typeof profileSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;

export type CombinedRegisterSchema = z.infer<typeof combinedRegisterSchema>

