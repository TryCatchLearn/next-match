'use client';

import { useSelectedLayoutSegment } from "next/navigation"
import PhotoUpload from "./photos/PhotoUpload";

type Props = {
    sections: {segment: string | null, name: string, path: string}[];
    isOwner: boolean;
}

export default function SectionTitle({sections, isOwner}: Props) {
    const active = useSelectedLayoutSegment();
    const title = sections.find(x => x.segment === active)?.name ?? '';

    return (
        <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold capitalize text-accent">{title}</h2>
            {title === 'Photos' && isOwner && <PhotoUpload />}
        </div>
        
    )
}