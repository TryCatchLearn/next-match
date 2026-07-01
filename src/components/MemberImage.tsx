'use client';

import { CldImage } from "next-cloudinary"
import { Photo } from "../../generated/prisma/client"
import Image from 'next/image';
import { useOverlayState } from "@heroui/react";
import AppModal from "./AppModal";

type Props = {
    photo: Photo,
    enableLightbox?: boolean;
}

export default function MemberImage({ photo, enableLightbox }: Props) {
    const lightboxState = useOverlayState();

    const cardImage = photo.publicId ? (
        <CldImage
            alt='Image of member'
            src={photo.publicId}
            width={300}
            height={300}
            crop='fill'
            gravity='face'
            className="rounded-xl"
        />
    ) : (
        <Image
            alt='Image of member'
            width={300}
            height={300}
            loading="eager"
            unoptimized
            sizes="(max-width: 768px) 100vw, 33vw"
            src={photo.url}
            className="aspect-square object-cover rounded-xl relative"
        />
    )

    if (!enableLightbox) return <div>{cardImage}</div>

    return (
        <>
            <div className="cursor-pointer" onClick={lightboxState.open}>
                {cardImage}
            </div>

            <AppModal state={lightboxState} dialogClassName="w-auto !max-w-[90vw]">
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                    src={photo.url} 
                    alt="Image of member"
                    className="max-h-[85vh] max-w-full w-auto h-auto block" 
                />
            </AppModal>
        </>
    )
}