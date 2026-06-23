import z from "zod";

const requiredString = (fieldName: string, min = 1) =>
    z.string({ error: `${fieldName} is required` }).min(min, { error: `${fieldName} is required` })

export const forgotPasswordSchema = z.object({
    email: z.email({ error: 'Invalid email' })
});

export const resetPasswordSchema = z.object({
    password: requiredString('password', 6),
    confirmPassword: requiredString('confirmPassword', 6)
})
    .superRefine(({ confirmPassword, password }, ctx) => {
        if (confirmPassword !== password) {
            ctx.addIssue({
                code: 'custom',
                message: 'The passwords do not match',
                path: ['confirmPassword']
            })
        }
    })

export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;