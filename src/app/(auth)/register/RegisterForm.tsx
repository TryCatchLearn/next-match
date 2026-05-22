'use client';

import { authClient } from "@/lib/auth-client";
import { registerSchema, RegisterSchema } from "@/lib/schemas/registerSchema";
import { Button, Card, CardHeader, FieldError, Input, TextField, toast } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { GiPadlock } from "react-icons/gi";

export default function RegisterForm() {
    const router = useRouter();
    const { register, handleSubmit, formState: {errors, isSubmitting} } = useForm<RegisterSchema>({
        resolver: zodResolver(registerSchema)
    });

    const onSubmit = async (data: RegisterSchema) => {
        await authClient.signUp.email({
            email: data.email,
            password: data.password,
            name: data.name
        }, {
            onSuccess: () => {
                router.push('/members')
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

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 px-6 py-4">
                <TextField defaultValue="" aria-label="name" isInvalid={!!errors.name}>
                    <Input
                        placeholder="Enter your name"
                        {...register('name')}
                    />
                    <FieldError>{errors.name?.message}</FieldError>
                </TextField>

                <TextField defaultValue="" aria-label="email" isInvalid={!!errors.email}>
                    <Input
                        placeholder="Enter your email"
                        {...register('email')}
                    />
                    <FieldError>{errors.email?.message}</FieldError>
                </TextField>

                <TextField defaultValue="" aria-label="password" isInvalid={!!errors.password}>
                    <Input
                        type="password"
                        placeholder="Enter your password"
                        {...register('password')}
                    />
                    <FieldError>{errors.password?.message}</FieldError>
                </TextField>

                <TextField defaultValue="" aria-label="confirm password" 
                    isInvalid={!!errors.confirmPassword}>
                    <Input
                        type="password"
                        placeholder="Confirm your password"
                        {...register('confirmPassword')}
                    />
                    <FieldError>{errors.confirmPassword?.message}</FieldError>
                </TextField>

                <Button isPending={isSubmitting} type="submit" className="w-full">
                    Register
                </Button>
            </form>
        </Card>
    )
}