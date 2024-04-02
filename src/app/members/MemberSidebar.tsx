'use client';

import PresenceDot from '@/components/PresenceDot';
import { calculateAge, transformImageUrl } from '@/lib/util'
import { Button, Card, CardBody, CardFooter, Divider, Image } from '@nextui-org/react'
import { Member } from '@prisma/client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

type Props = {
    member: Member
    navLinks: { name: string, href: string }[]
}

export default function MemberSidebar({ member, navLinks }: Props) {
    const pathname = usePathname();

    return (
        <Card className='w-full mt-10 items-center h-[80vh]'>
            <Image
                height={200}
                width={200}
                src={transformImageUrl(member.image) || '/images/user.png'}
                alt='User profile main image'
                className='rounded-full mt-6 aspect-square object-cover'
            />
            <CardBody className='overflow-hidden'>
                <div className='flex flex-col items-center'>
                    <div className='flex'>
                        <div className='text-2xl'>
                            {member.name}, {calculateAge(member.dateOfBirth)}
                        </div>
                        <div>
                            <PresenceDot member={member} />
                        </div>
                    </div>

                    <div className='text-sm text-neutral-500'>
                        {member.city}, {member.country}
                    </div>
                </div>
                <Divider className='my-3' />
                <nav className='flex flex-col p-4 ml-4 text-2xl gap-4'>
                    {navLinks.map(link => (
                        <Link
                            href={link.href}
                            key={link.name}
                            className={`block rounded 
                                ${pathname === link.href
                                    ? 'text-secondary' : 'hover:text-secondary/50'}`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>
            </CardBody>
            <CardFooter>
                <Button
                    as={Link}
                    href='/members'
                    fullWidth
                    color='secondary'
                    variant='bordered'
                >
                    Go back
                </Button>
            </CardFooter>
        </Card>
    )
}
