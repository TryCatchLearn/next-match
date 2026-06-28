'use client';

import { useTransition } from "react";
import { Photo } from "../../../../generated/prisma/client"
import MemberImage from "@/components/MemberImage";
import { Button, Spinner } from "@heroui/react";
import { approvePhoto, rejectPhoto } from "@/server/actions/admin";

type Props = {
    photo: Photo
}

export default function ModerationCard({ photo }: Props) {
    const [isApprovePending, startApproveTransition] = useTransition();
    const [isRejectPending, startRejectTransition] = useTransition();

    return (
        <div>
            <MemberImage photo={photo} />
            <div className="flex gap-2 w-full mt-3">
                <Button
                    isPending={isApprovePending}
                    onClick={() => startApproveTransition(() => approvePhoto(photo.id))}
                    className='flex-1'
                >
                    {isApprovePending && <Spinner />}
                    Approve
                </Button>
                <Button
                    isPending={isRejectPending}
                    onClick={() => startRejectTransition(() => rejectPhoto(photo.id))}
                    className='flex-1'
                    variant="danger"
                >
                    {isRejectPending && <Spinner />}
                    Reject
                </Button>
            </div>
        </div>
    )
}