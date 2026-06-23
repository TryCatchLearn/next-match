import { Card } from "@heroui/react";
import { FaUser } from "react-icons/fa";
import { requireAuthUser } from "@/lib/auth";
import CompleteProfileForm from "./CompleteProfileForm";

export default async function CompleteProfilePage() {
    const user = await requireAuthUser();

    return (
        <div className="flex items-center justify-center h-[calc(100vh-6rem)]">
            <Card className='w-full max-w-xl shadow-xl'>
                <Card.Header className='flex flex-col items-center justify-center'>
                    <div className='flex flex-col gap-2 items-center text-primary'>
                        <div className='flex flex-row items-center gap-3'>
                            <FaUser size={30} />
                            <h1 className='text-3xl font-semibold'>Complete Your Profile</h1>
                        </div>
                        <p className='text-muted-foreground text-center'>
                            Please complete your profile to continue
                        </p>
                    </div>
                </Card.Header>

                <Card.Content>
                    <CompleteProfileForm user={user} />
                </Card.Content>

            </Card>
        </div>
    )
}