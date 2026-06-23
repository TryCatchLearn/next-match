'use client';

import { ProfileSchema } from "@/lib/schemas/registerSchema";
import { createMemberProfile } from "@/server/actions/members";
import { Button, toast } from "@heroui/react";
import { User } from "better-auth";
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form";
import ProfileForm from "../register/ProfileForm";

type Props = {
    user: User;
}

export default function CompleteProfileForm({user}: Props) {
    const router = useRouter();

    const { handleSubmit, control, setValue, formState: { isSubmitting, isValid } }
        = useForm<ProfileSchema>();

    const onSubmit = async (data: ProfileSchema) => {
        const result = await createMemberProfile(user, data);

        if (result.status === 'error') {
            toast.danger(result.error);
            return;
        }

        toast.success('Profile completed successfully');
        router.push('/members');
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <ProfileForm control={control} setValue={setValue} />

            <Button type="submit" variant="primary" isDisabled={isSubmitting || !isValid}>
                {isSubmitting ? 'Saving...' : 'Complete profile'}
            </Button>
        </form>
    )
}