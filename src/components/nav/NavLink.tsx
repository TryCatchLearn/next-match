'use client'

import Link from "next/link";
import { usePathname } from "next/navigation"

type Props = {
    href: string;
    label: string;
}

export default function NavLink({href, label}: Props) {
    const pathname = usePathname();

    return (
        <Link 
            key={href} 
            href={href}
            className={pathname === href ? 'text-yellow-400' : 'hover:text-yellow-400/80'}
        >
            {label}
        </Link>
    )
}