'use client';

import { Photo } from '@prisma/client'
import { CldImage } from 'next-cloudinary';
import React from 'react'
import {Image} from '@nextui-org/react';

type Props = {
    photo: Photo | null;
}

export default function MemberImage({ photo }: Props) {
    return (
        <div>
            {photo?.publicId ? (
                <CldImage
                    alt='Image of member'
                    src={photo.publicId}
                    width={300}
                    height={300}
                    crop='fill'
                    gravity='faces'
                    className='rounded-2xl'
                    priority
                />
            ) : (
                <Image
                    width={220}
                    height={220}
                    src={photo?.url || '/images/user.png'}
                    alt='Image of user'
                />
            )}
        </div>
    )
}
