'use client';

import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation"

export const sections = [
    { name: 'Profile', path: '', segment: null },
    { name: 'Photos', path: '/photos', segment: 'photos' },
    { name: 'Chat', path: '/chat', segment: 'chat' },
]

export default function MemberNav({ userId }: { userId: string }) {
    const active = useSelectedLayoutSegment();
    const base = `/members/${userId}`;

    return (
        <nav className="flex flex-col p-4 ml-4 text-2xl gap-4">
            {sections.map(({name, path, segment}) => (
                <Link
                    key={name}
                    href={`${base}${path}`}
                    className={`block rounded ${active === segment ? 'text-accent' : 'hover:text-accent/50'}`}
                >
                    {name}
                </Link>
            ))}
        </nav>
    )
}