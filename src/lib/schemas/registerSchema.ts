import z from "zod";

export const registerSchema = z.object({
    name: z.string().min(1, {error: 'The name is required'}),
    email: z.email(),
    password: z.string().min(6, {
        error: 'Password must be at least 6 characters'
    }),
    confirmPassword: z.string()
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

export type RegisterSchema = z.infer<typeof registerSchema>

