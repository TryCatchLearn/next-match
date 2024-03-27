import {z} from 'zod';

export const memberEditSchema = z.object({
    name: z.string().min(1, {
        message: 'Name is required'
    }),
    description: z.string().min(1, {
        message: 'Description is required'
    }),
    city: z.string().min(1, {
        message: 'City is required'
    }),
    country: z.string().min(1, {
        message: 'Country is required'
    })
})

export type MemberEditSchema = z.infer<typeof memberEditSchema>