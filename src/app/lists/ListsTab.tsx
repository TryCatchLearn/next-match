'use client';

import { Spinner, Tab, Tabs } from '@nextui-org/react';
import { Member } from '@prisma/client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useTransition } from 'react'
import { Key } from 'react';
import MemberCard from '../members/MemberCard';
import LoadingComponent from '@/components/LoadingComponent';

type Props = {
    members: Member[];
    likeIds: string[];
}

export default function ListsTab({ members, likeIds }: Props) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

    const tabs = [
        { id: 'source', label: 'Members I have liked' },
        { id: 'target', label: 'Members that like me' },
        { id: 'mutual', label: 'Mutual likes' },
    ]

    function handleTabChange(key: Key) {
        startTransition(() => {
            const params = new URLSearchParams(searchParams);
            params.set('type', key.toString());
            router.replace(`${pathname}?${params.toString()}`);
        })
    }

    return (
        <div className='flex w-full flex-col mt-10 gap-5'>
            <div className='flex items-center'>
                <Tabs
                    aria-label='Like tabs'
                    color='secondary'
                    onSelectionChange={(key) => handleTabChange(key)}
                >
                    {tabs.map((item) => (
                        <Tab key={item.id} title={item.label} />
                    ))}
                </Tabs>
                {isPending && <Spinner color='secondary' className='self-center ml-3' />}
            </div>

            {tabs.map((item) => {
                const isSelected = searchParams.get('type') === item.id;
                return isSelected ? (
                    <div>
                        {members.length > 0 ? (
                            <div className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-8'>
                                {members.map(member => (
                                    <MemberCard key={member.id} member={member} likeIds={likeIds} />
                                ))}
                            </div>
                        ) : (
                            <div>No members for this filter</div>
                        )}
                    </div>
                ) : null;
            })}
        </div >
    )
}
