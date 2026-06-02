import z from "zod";

export const profileEditSchema = z.object({
    name: z.string().min(1, {error: 'Name is required'}),
    description: z.string().min(1, {error: 'Description is required'}),
    city: z.string().min(1, {error: 'City is required'}),
    country: z.string().min(1, {error: 'Country is required'}),
});

export type ProfileEditSchema = z.infer<typeof profileEditSchema>;