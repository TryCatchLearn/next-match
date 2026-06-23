'use client';

import { authClient } from "@/lib/auth-client";
import { profileSchema, ProfileSchema, registerSchema, RegisterSchema } from "@/lib/schemas/registerSchema";
import { Button, Card, CardHeader, toast } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { GiPadlock } from "react-icons/gi";
import UserForm from "./UserForm";
import ProfileForm from "./ProfileForm";

export default function RegisterForm() {
    const router = useRouter();
    const [activeStep, setActiveStep] = useState(0);
    const isLastStep = activeStep === 1;

    const userForm = useForm<RegisterSchema>({
        resolver: zodResolver(registerSchema),
        mode: 'onTouched'
    });

    const profileForm = useForm<ProfileSchema>({
        resolver: zodResolver(profileSchema),
        mode: 'onTouched'
    });

    const onNext = () => setActiveStep(1);
    const onBack = () => setActiveStep(0);

    const onSubmit = async () => {
        const userData = userForm.getValues();
        const profileData = profileForm.getValues();
        const data = { ...userData, ...profileData, profileComplete: true };
        await authClient.signUp.email(data, {
            onSuccess: () => {
                toast.success('Registration successful! Please check your email to verify your account')
                router.push('/');
            },
            onError: (ctx) => {
                toast.danger(ctx.error.message)
            }
        })
    }

    return (
        <Card className="w-md shadow-xl">
            <CardHeader className="flex flex-col items-center justify-center">
                <div className="flex flex-col gap-2 items-center">
                    <div className="flex flex-row items-center gap-3">
                        <GiPadlock size={30} />
                        <h1 className="text-3xl font-semibold">Register</h1>
                    </div>
                    <p className="text-foreground/60">Sign up for a new account</p>
                </div>
            </CardHeader>

            <form onSubmit={isLastStep
                ? profileForm.handleSubmit(onSubmit)
                : userForm.handleSubmit(onNext)} className="flex flex-col gap-4 px-6 py-4"
            >
                {activeStep === 0
                    ? <UserForm control={userForm.control} />
                    : <ProfileForm control={profileForm.control} 
                        setValue={profileForm.setValue} />
                }

                <div className="flex flex-row gap-2">
                    {activeStep > 0 && (
                        <Button variant="secondary" onClick={onBack}
                            type="button" className='flex-1'>
                            Back
                        </Button>
                    )}

                    <Button isPending={isLastStep 
                        ? profileForm.formState.isSubmitting 
                        : userForm.formState.isSubmitting} 
                        type="submit" 
                        className="flex-1"
                        variant="primary"
    
                    >
                        {isLastStep ? 'Submit' : 'Continue'}
                    </Button>
                </div>
            </form>
        </Card>
    )
}