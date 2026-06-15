import { MessageDto } from "@/lib/types";
import { transformImageUrl } from "@/lib/util";
import { toast } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";

export const messageToast = (message: MessageDto) => {
    toast(
        <Link
            href={`/members/${message.senderId}/chat`}
            className="font-semibold hover:underline"
        >
            {message.senderName} sent you a message
        </Link>,
        {
            indicator: (
                <Image
                    src={transformImageUrl(message.senderImage) || '/images/user.png'}
                    height={40}
                    width={40}
                    alt="sender image"
                    className="rounded-full object-cover"
                />
            ),
            description: (
                <Link
                    href={`/members/${message.senderId}/chat`}
                    className="text-sm hover:underline"
                >
                    Click to view
                </Link>
            ),
            variant: 'accent',
            timeout: 5000
        }
    )
}