'use server';

import { requireAuthUser } from "@/lib/auth";
import { mapMessageToMessageDto } from "@/lib/mappings";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";
import { chatSchema, ChatSchema } from "@/lib/schemas/chatSchema";
import { ActionResult, MessageDto } from "@/lib/types";
import { createChatId, handlePrismaError } from "@/lib/util";
import { revalidatePath } from "next/cache";

export async function createMessage(recipientUserId: string, data: ChatSchema):
    Promise<ActionResult<MessageDto>> {
    try {
        const user = await requireAuthUser();

        const validated = chatSchema.safeParse(data);

        if (!validated.success) return { status: 'error', error: validated.error.issues[0].message }

        const { text } = validated.data;

        const message = await prisma.message.create({
            data: {
                text,
                recipientId: recipientUserId,
                senderId: user.id
            },
            select: messageSelect
        });

        const messageDto = mapMessageToMessageDto(message);

        await pusherServer.trigger(
            createChatId(user.id, recipientUserId), 'message:new', messageDto);

        await pusherServer.trigger(`private-${recipientUserId}`, 'message:new', messageDto);

        revalidatePath(`/members/${recipientUserId}/chat`);

        return { status: 'success', data: messageDto }
    } catch (error) {
        return handlePrismaError(error);
    }
}

export async function getMessageThread(recipientId: string) {
    try {
        const user = await requireAuthUser();

        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    {
                        senderId: user.id,
                        recipientId,
                        senderDeleted: false
                    },
                    {
                        senderId: recipientId,
                        recipientId: user.id,
                        recipientDeleted: false
                    }
                ]
            },
            orderBy: {
                created: 'asc'
            },
            select: messageSelect
        });

        let readCount = 0;

        if (messages.length > 0) {
            const readMessageIds = messages
                .filter(m => m.dateRead === null
                    && m.recipient?.userId === user.id
                    && m.sender?.userId === recipientId)
                .map(m => m.id);

            await prisma.message.updateMany({
                where: { id: { in: readMessageIds } },
                data: { dateRead: new Date() }
            });

            await pusherServer.trigger(createChatId(recipientId, user.id),
                'messages:read', readMessageIds);

            readCount = readMessageIds.length;
        }

        return {messages: messages.map(message => mapMessageToMessageDto(message)), readCount}
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function markMessagesAsRead(messageIds: string[], senderId: string) {
    const user = await requireAuthUser();

    await prisma.message.updateMany({
        where: { id: { in: messageIds } },
        data: { dateRead: new Date() }
    });

    await pusherServer.trigger(createChatId(senderId, user.id), 'messages:read', messageIds)
}

export async function getMessagesByContainer(container = 'inbox', cursor?: string, limit = 2) {
    try {
        const user = await requireAuthUser();

        const conditions = {
            [container === 'outbox' ? 'senderId' : 'recipientId']: user.id,
            ...(container === 'outbox' ? { senderDeleted: false } : { recipientDeleted: false })
        }

        const messages = await prisma.message.findMany({
            where: {
                ...conditions,
                ...(cursor ? {created: {lte: new Date(cursor)}} : {})
            },
            orderBy: { created: 'desc' },
            select: messageSelect,
            take: limit + 1
        });

        let nextCursor: string | undefined;

        if (messages.length > limit) {
            const nextItem = messages.pop();
            nextCursor = nextItem?.created.toISOString();
        } else {
            nextCursor = undefined;
        }

        const messageToReturn = messages.map(message => mapMessageToMessageDto(message));

        return {messages: messageToReturn, nextCursor}
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const messageSelect = {
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

export async function deleteMessage(messageId: string, isOutbox: boolean): Promise<ActionResult<void>> {
    const selector = isOutbox ? 'senderDeleted' : 'recipientDeleted';

    try {
        const user = await requireAuthUser();

        await prisma.message.update({
            where: { id: messageId },
            data: {
                [selector]: true
            }
        });

        const messagesToDelete = await prisma.message.findMany({
            where: {
                OR: [
                    {
                        senderId: user.id,
                        senderDeleted: true,
                        recipientDeleted: true
                    },
                    {
                        recipientId: user.id,
                        senderDeleted: true,
                        recipientDeleted: true
                    }
                ]
            }
        });

        if (messagesToDelete.length > 0) {
            await prisma.message.deleteMany({
                where: {
                    OR: messagesToDelete.map(m => ({ id: m.id }))
                }
            })
        }

        revalidatePath(`/members/${user.id}/chat`);
        revalidatePath('/messages');

        return { status: 'success', data: undefined }
    } catch (error) {
        console.log(error);
        return handlePrismaError(error);
    }
}

export async function getUnreadMessageCount() {
    try {
        const user = await requireAuthUser();

        return prisma.message.count({
            where: {
                recipientId: user.id,
                dateRead: null,
                recipientDeleted: false
            }
        })
    } catch (error) {
        console.log(error);
        throw error;
    }
}