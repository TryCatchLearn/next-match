import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { headers } from "next/headers";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "./prisma";
import { getEmailHtml, sendEmail } from "./mail";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    user: {
        additionalFields: {
            profileComplete: {
                type: 'boolean',
                defaultValue: false
            }
        }
    },
    emailVerification: {
        sendVerificationEmail: async ({user, token}) => {
            if (process.env.SEEDING === 'true') return;
            const verificationUrl = `${process.env.BETTER_AUTH_URL}/verify-email?token=${token}&callbackURL=/members`
            void sendEmail({
                to: user.email,
                subject: 'Verify your email address',
                text: `Click the link to verify your email: ${verificationUrl}`,
                html: getEmailHtml({
                    heading: 'Verify your email address',
                    body: 'Click the button to verify your email and complete registration',
                    buttonText: 'Verify email',
                    buttonUrl: verificationUrl
                })
            })
        },
        sendOnSignIn: true,
        autoSignInAfterVerification: true
    },
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
        sendResetPassword: async ({user, token}) => {
            const resetUrl = `${process.env.BETTER_AUTH_URL}/reset-password?token=${token}`
            void sendEmail({
                to: user.email,
                subject: 'Reset your password',
                text: `Click the link to reset your password: ${resetUrl}`,
                html: getEmailHtml({
                    heading: 'Reset your password',
                    body: 'Click the button to reset password. Link will expire in 1 hour',
                    buttonText: 'Reset password',
                    buttonUrl: resetUrl
                })
            })
        }
    },
     socialProviders: {
        github: { 
            clientId: process.env.GITHUB_CLIENT_ID as string, 
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string, 
        },
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }
    },
    databaseHooks: {
        user: {
            create: {
                after: async (user, context) => {
                    const body = context?.body as {
                        gender: string;
                        dateOfBirth: string;
                        description: string;
                        city: string;
                        country: string
                    } | undefined;

                    const {gender, dateOfBirth, description, city, country} = body ?? {};

                    if (gender && dateOfBirth && description && city && country) {
                        await prisma.member.create({
                            data: {
                                userId: user.id,
                                name: user.name,
                                gender,
                                dateOfBirth: new Date(dateOfBirth),
                                description,
                                city,
                                country
                            }
                        })
                    }
                }
            }
        }
    },
    plugins: [nextCookies()]
});

export async function getCurrentUser() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    return session?.user;
}

export async function requireAuthUser() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) throw new Error("Unauthorized");

    return session.user;
}