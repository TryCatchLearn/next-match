'use client';

import { Badge } from '@heroui/react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {GoInbox} from 'react-icons/go';
import {MdOutlineOutbox} from 'react-icons/md';

export default function MessageNav() {
    const items = [
        {key: 'inbox', label: 'Inbox', icon: GoInbox, badge: true},
        {key: 'outbox', label: 'Outbox', icon: MdOutlineOutbox, badge: false},
    ]
    const searchParams = useSearchParams();
    const active = searchParams.get('container') ?? 'inbox';

    return (
        <div className='flex flex-col gap-5 mt-3'>
            {items.map(({key, icon: Icon, label, badge}) => (
                <Badge.Anchor key={key}>
                    <Link
                        className={`flex items-center gap-5 rounded ${active === key ? 'text-accent' : 'hover:text-accent/50'}`}
                        href={`/messages?container=${key}`}
                    >
                        <div className='flex gap-5'>
                            <Icon size={24} />
                            <span>{label}</span>
                        </div>
                        {badge && <Badge color='accent' className='translate-x-1/2'>5</Badge>}
                    </Link>
                </Badge.Anchor>
            ))}
        </div>
    )
}