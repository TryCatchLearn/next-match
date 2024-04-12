import {z} from 'zod';
import { calculateAge } from '../util';

export const registerSchema = z.object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6, {
        message: 'Password must be at least 6 characters'
    })
})

export const profileSchema = z.object({
    gender: z.string().min(1),
    description: z.string().min(1),
    city: z.string().min(1),
    country: z.string().min(1),
    dateOfBirth: z.string().min(1, {
        message: 'Date of birth is required'
    }).refine(dateString => {
        const age = calculateAge(new Date(dateString));
        return age >= 18;
    }, {
        message: 'You must be at least 18 to use this app'
    }),
});

export const combinedRegisterSchema = registerSchema.and(profileSchema);

export type ProfileSchema = z.infer<typeof profileSchema>;

export type RegisterSchema = z.infer<typeof registerSchema & typeof profileSchema>