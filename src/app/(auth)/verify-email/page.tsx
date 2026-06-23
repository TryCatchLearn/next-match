'use client';

import { authClient } from "@/lib/auth-client";
import { Button, Card, Spinner } from "@heroui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MdOutlineMarkEmailRead } from "react-icons/md";

export default function VerifyEmailPage() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const callbackURL = searchParams.get('callbackURL') ?? '/members';
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
        token ? 'loading' : 'error');
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState(
        token ? '' : 'Verification token is missing'
    )

    useEffect(() => {
        if (!token) return;

        authClient.verifyEmail(
            { query: { token, callbackURL } },
            {
                onSuccess: () => setStatus('success'),
                onError: (ctx) => {
                    setStatus('error');
                    setErrorMessage(ctx.error.message ?? 'Email verification failed')
                }
            }
        )
    }, [callbackURL, token]);

    useEffect(() => {
        if (status === 'success') {
            const timer = setTimeout(() => {
                router.push(callbackURL);
                router.refresh();
            }, 2000);
            return () => clearTimeout(timer)
        }
    }, [callbackURL, router, status])


    return (
        <div className="flex items-center justify-center h-[calc(100vh-6rem)]">
            <Card className="w-md shadow-xl">
                <Card.Header className="flex flex-col items-center justify-center pt-6">
                    <div className="flex flex-row items-center gap-3">
                        <MdOutlineMarkEmailRead size={30} />
                        <h1 className="text-3xl font-semibold">Email Verification</h1>
                    </div>
                </Card.Header>
                <Card.Content className="flex flex-col items-center gap-4 py-8">
                    {status === 'loading' && (
                        <>
                            <Spinner size="lg" />
                            <p className="text-foreground/60">Verifying your email address...</p>
                        </>
                    )}
                    {status === 'success' && (
                        <>
                            <p className="text-success font-medium">Your email has been verified!</p>
                            <p className="text-foreground/60 text-sm">Redirecting you now...</p>
                        </>
                    )}
                    {status === 'error' && (
                        <>
                            <p className="text-danger font-medium">{errorMessage}</p>
                            <Button onPress={() => router.push('/login')}>
                                Back to login
                            </Button>
                        </>
                    )}
                </Card.Content>
            </Card>
        </div>
    );
}