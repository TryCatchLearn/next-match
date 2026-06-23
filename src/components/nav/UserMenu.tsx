'use client';

import { authClient } from "@/lib/auth-client";
import { transformImageUrl } from "@/lib/util";
import { Avatar, Dropdown, Label, Separator } from "@heroui/react";
import { User } from "better-auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ComponentProps } from "react";

type Props = {
    user: User;
}

export default function UserMenu({ user }: Props) {
    const router = useRouter();

    const signOut = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    document.cookie = `memberFilters=; path=/; max-age=0`;
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
                    <Avatar.Image alt={user.name} src={transformImageUrl(user.image) || '/images/user.png'} />
                    <Avatar.Fallback>{user.name.charAt(0)}</Avatar.Fallback>
                </Avatar>
            </Dropdown.Trigger>

            <Dropdown.Popover>
                <Dropdown.Menu
                    disabledKeys={['signed-in-as']}
                >
                    <Dropdown.Section>
                        <Dropdown.Item id='signed-in-as'>
                            Signed in as {user.name}
                        </Dropdown.Item>
                    </Dropdown.Section>
                    <Separator className="my-1" />
                    <Dropdown.Section>
                        <Dropdown.Item 
                            id="edit-profile" 
                            textValue="Edit Profile"
                            render={props => <Link {...props as ComponentProps<typeof Link>} />}
                            href={`/members/${user.id}`}
                        >
                            <Label>Edit profile</Label>
                        </Dropdown.Item>

                        <Dropdown.Item onClick={signOut} id="logout" textValue="Logout" variant="danger">
                            <Label>Logout</Label>
                        </Dropdown.Item>
                    </Dropdown.Section>

                </Dropdown.Menu>
            </Dropdown.Popover>
        </Dropdown>
    )
}