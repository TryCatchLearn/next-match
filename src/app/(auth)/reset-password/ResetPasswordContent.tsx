'use client';

import TextInput from "@/components/TextInput";
import { authClient } from "@/lib/auth-client";
import { ResetPasswordSchema, resetPasswordSchema } from "@/lib/schemas/resetPasswordSchema";
import { toast, Card, Button } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaCheckCircle } from "react-icons/fa";
import { GiPadlock } from "react-icons/gi";
import { ImCross } from "react-icons/im";

export default function ResetPasswordContent() {
const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');
    const [status, setStatus] = useState<'form' | 'success' | 'error'>('form');
    const [errorMessage, setErrorMessage] = useState('');

    const { control, handleSubmit, formState: { isValid, isSubmitting } } = useForm<ResetPasswordSchema>({
        resolver: zodResolver(resetPasswordSchema),
        mode: 'onTouched'
    });

    const onSubmit = async (data: ResetPasswordSchema) => {
        if (!token) {
            toast.danger('Invalid reset link.  No token provided');
            return;
        }

        await authClient.resetPassword({
            newPassword: data.password,
            token
        }, {
            onSuccess: () => {
                setStatus('success');
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            },
            onError: () => {
                setStatus('error');
                setErrorMessage('Failed to reset password. The link may have expired');
            }
        })
    }

    return (
        <div className='flex justify-center items-center min-h-[calc(100vh-6rem)]'>
            <Card className='w-full max-w-md shadow-xl'>
                <Card.Header className='flex flex-col items-center justify-center'>
                    <div className='flex flex-col gap-2 items-center text-primary'>
                        <div className='flex flex-row items-center gap-3'>
                            <GiPadlock size={30} />
                            <h1 className='text-3xl font-semibold'>Reset Password</h1>
                        </div>
                        <p className='text-neutral-600'>Enter your new password</p>
                    </div>
                </Card.Header>

                <Card.Content>
                    {status === 'success' && (
                        <div className='flex flex-col items-center gap-4 py-4'>
                            <FaCheckCircle size={40} className='text-green-600' />
                            <p className='text-green-600 text-lg font-semibold'>Password reset successfully!</p>
                            <p className='text-neutral-600'>Redirecting to login...</p>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className='flex flex-col items-center gap-4 py-4'>
                            <ImCross size={40} className='text-danger' />
                            <p className='text-destructive text-lg font-semibold'>{errorMessage}</p>
                            <Link href='/forgot-password' className='text-primary hover:underline'>
                                Request new reset link
                            </Link>
                        </div>
                    )}

                    {status === 'form' && (
                        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                            <TextInput
                                control={control}
                                name='password'
                                type='password'
                                label='New password'
                            />
                            <TextInput
                                control={control}
                                name='confirmPassword'
                                type='password'
                                label='Confirm new password'
                            />

                            <Button type='submit' className='w-full' isDisabled={!isValid || isSubmitting}>
                                {isSubmitting ? 'Submitting...' : 'Reset Password'}
                            </Button>
                        </form>
                    )}
                </Card.Content>
            </Card>
        </div>
    );
}