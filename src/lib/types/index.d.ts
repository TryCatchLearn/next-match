import { $ZodIssue } from "zod/v4/core";
import { Prisma } from "../../../generated/prisma/client";

type ActionResult<T> = { status: 'success', data: T }
    | { status: 'error', error: string | $ZodIssue[] }

type MessageDto = {
    id: string;
    text: string;
    created: string;
    dateRead: string | null;
    senderId: string;
    senderName: string;
    senderImage: string | null;
    recipientId: string;
    recipientName: string;
    recipientImage: string | null;
}

type MessageWithSenderRecipient = Prisma.MessageGetPayload<{
    select: {
        id: true,
        text: true,
        created: true,
        dateRead: true,
        sender: {
            select: {
                userId: true,
                name: true,
                image: true
            }
        },
        recipient: {
            select: {
                userId: true,
                name: true,
                image: true
            }
        }
    }
}>