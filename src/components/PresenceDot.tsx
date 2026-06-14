'use client';

import { usePresenceStore } from "@/lib/hooks/usePresenceStore";
import { Member } from "../../generated/prisma/client"
import { GoDot, GoDotFill } from "react-icons/go";

type Props = {
    member: Member;
}

export default function PresenceDot({ member }: Props) {
    const members = usePresenceStore(state => state.members);
    const isActive = members.indexOf(member.userId) !== -1;

    if (!isActive) return null;

    return (
        <>
            <GoDot size={36} className="fill-white absolute -top-0.5 -right-0.5" />
            <GoDotFill size={32} className="fill-green-500 animate-pulse" />
        </>
    )
}