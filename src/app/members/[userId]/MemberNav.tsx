'use client';

import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation"

type Props = {
    userId: string;
    sections: {segment: string | null, name: string, path: string}[];
}

export default function MemberNav({userId, sections}: Props) {
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