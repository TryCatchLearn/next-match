'use client';

import { useSearchParams } from "next/navigation"

export default function SectionTitle() {
    const params = useSearchParams();
    const title = params.get('container') ?? 'Inbox';

    return (
        <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold capitalize text-accent">{title}</h2>
        </div>
        
    )
}