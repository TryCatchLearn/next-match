'use client';

import { CldImage } from "next-cloudinary"
import { Photo } from "../../generated/prisma/client"
import Image from 'next/image';

type Props = {
    photo: Photo
}

export default function MemberImage({ photo }: Props) {
    return (
        <div>
            {photo.publicId ? (
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
            )}
        </div>
    )
}