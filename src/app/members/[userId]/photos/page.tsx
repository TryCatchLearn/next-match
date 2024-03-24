import { getMemberPhotosByUserId } from '@/app/actions/memberActions'
import { CardHeader, Divider, CardBody, Image } from '@nextui-org/react'
import React from 'react'

export default async function PhotosPage({ params }: { params: { userId: string } }) {
    const photos = await getMemberPhotosByUserId(params.userId);
    return (
        <>
            <CardHeader className='text-2xl font-semibold text-secondary'>
                Photos
            </CardHeader>
            <Divider />
            <CardBody>
                <div className='grid grid-cols-5 gap-3'>
                    {photos && photos.map(photo => (
                        <div key={photo.id}>
                            <Image 
                                width={300}
                                height={300}
                                src={photo.url}
                                alt='Image of member'
                                className='object-cover aspect-square'
                            />
                        </div>
                    ))}
                </div>
            </CardBody>
        </>

    )
}
