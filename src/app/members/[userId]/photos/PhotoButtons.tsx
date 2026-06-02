'use client';

import { User } from "better-auth";
import { Photo } from "../../../../../generated/prisma/client"
import DeleteButton from "@/components/DeleteButton";
import StarButton from "@/components/StarButton";
import { useTransition } from "react";
import { deleteImage, setMainImage } from "@/server/actions/members";

type Props = {
    photo: Photo;
    user: User;
}

export default function PhotoButtons({ photo, user }: Props) {
    const [isMainPending, startMainTransition] = useTransition();
    const [isDeletePending, startDeleteTransition] = useTransition();

    const onSetMain = (photo: Photo) => {
        startMainTransition(() => {
            setMainImage(photo);
        })
    }

    const onDeleteImage = (photo: Photo) => {
        if (photo.url === user.image) return null;
        startDeleteTransition(() => {
            deleteImage(photo);
        })
    }


    return (
        <>
            <div onClick={() => onSetMain(photo)} className="absolute top-3 left-3 z-50">
                <StarButton selected={photo.url === user.image} loading={isMainPending} />
            </div>
            <div onClick={() => onDeleteImage(photo)} className="absolute top-3 right-3 z-50">
                <DeleteButton disabled={photo.url === user.image} loading={isDeletePending} />
            </div>
        </>
    )
}