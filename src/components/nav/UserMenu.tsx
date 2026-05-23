'use client';

import { authClient } from "@/lib/auth-client";
import { Avatar, Dropdown, Label } from "@heroui/react";
import { User } from "better-auth";
import { useRouter } from "next/navigation";

type Props = {
    user: User;
}

export default function UserMenu({user}: Props) {
    const router = useRouter();

    const signOut = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push('/');
                    router.refresh();
                }
            }
        })
    }

    return (
        <Dropdown>
            <Dropdown.Trigger>
                <Avatar>
                    <Avatar.Image alt={user.name} src={user.image || '/images/user.png'} />
                    <Avatar.Fallback>{user.name.charAt(0)}</Avatar.Fallback>
                </Avatar>
            </Dropdown.Trigger>

            <Dropdown.Popover>
                <Dropdown.Menu>
                    <Dropdown.Item id="edit-profile" textValue="Edit Profile">
                        <Label>Edit profile</Label>
                    </Dropdown.Item>
        
                    <Dropdown.Item onClick={signOut} id="logout" textValue="Logout" variant="danger">
                        <Label>Logout</Label>
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown.Popover>
        </Dropdown>
    )
}