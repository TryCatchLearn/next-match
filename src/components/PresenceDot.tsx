import usePresenceStore from '@/hooks/usePresenceStore';
import { Member } from '@prisma/client'
import React from 'react'
import { GoDot, GoDotFill } from 'react-icons/go';

type Props = {
    member: Member;
}

export default function PresenceDot({ member }: Props) {
    const {members} = usePresenceStore(state => ({
        members: state.members
    }))

    const isOnline = members.indexOf(member.userId) !== -1;

    if (!isOnline) return null;

    return (
        <>
            <GoDot size={36} className='fill-white absolute -top-[2px] -right-[2px]'/>
            <GoDotFill size={32} className='fill-green-500 animate-pulse' />
        </>
    )
}
