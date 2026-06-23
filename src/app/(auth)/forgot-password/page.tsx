'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { GiPadlock } from 'react-icons/gi';
import Link from 'next/link';
import { forgotPasswordSchema, ForgotPasswordSchema } from '@/lib/schemas/resetPasswordSchema';
import { Button, Card } from '@heroui/react';
import TextInput from '@/components/TextInput';
import { FaCheckCircle } from 'react-icons/fa';
import { authClient } from '@/lib/auth-client';

export default function ForgotPasswordPage() {
    const { control, handleSubmit, formState: { isValid, isSubmitting, isSubmitSuccessful } } = useForm<ForgotPasswordSchema>({
        resolver: zodResolver(forgotPasswordSchema),
        mode: 'onTouched'
    });

    const onSubmit = async (data: ForgotPasswordSchema) => {
        await authClient.requestPasswordReset({
            email: data.email
        })
    }

    return (
        <div className='flex justify-center items-center min-h-[calc(100vh-6rem)]'>
            <Card className='w-full max-w-md shadow-xl'>
                <Card.Header className='flex flex-col items-center justify-center'>
                    <div className='flex flex-col gap-2 items-center text-primary'>
                        <div className='flex flex-row items-center gap-3'>
                            <GiPadlock size={30} />
                            <h1 className='text-3xl font-semibold'>Forgot Password</h1>
                        </div>
                        <p className='text-neutral-600'>Enter your email to reset your password</p>
                    </div>
                </Card.Header>

                <Card.Content>
                    {isSubmitSuccessful ? (
                        <div className='flex flex-col items-center gap-4 py-4'>
                            <FaCheckCircle size={40} className='text-green-600' />
                            <p className='text-center text-neutral-600'>
                                If an account exists with that email, we have sent you a link to reset your password.
                            </p>
                            <Link href='/login' className='text-accent hover:underline'>
                                Back to login
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                            <TextInput
                                control={control}
                                name='email'
                            />
                            <Button type='submit' className='w-full' isDisabled={!isValid || isSubmitting}>
                                {isSubmitting ? 'Submitting...' : 'Send Reset Link' }
                            </Button>
                            <Link href='/login' className='text-center text-sm text-accent hover:underline'>
                                Back to login
                            </Link>
                        </form>
                    )}
                </Card.Content>
            </Card>
        </div>
    );
}