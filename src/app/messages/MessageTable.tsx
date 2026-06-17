'use client';

import PresenceAvatar from "@/components/PresenceAvatar";
import { useMessageStore } from "@/lib/hooks/useMessageStore";
import { MessageDto } from "@/lib/types";
import { formatShortDateTime } from "@/lib/util";
import { deleteMessage, getMessagesByContainer } from "@/server/actions/messages";
import { Button, Table, toast } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { AiFillDelete } from "react-icons/ai";
import {useShallow} from 'zustand/shallow'

type Props = {
    initialMessages: MessageDto[];
    container: string;
    initNextCursor?: string;
}

export default function MessageTable({ initialMessages, container, initNextCursor }: Props) {
    const [isDeleting, startTransition] = useTransition();
    const [isLoadingMore, startLoadingMoreTransition] = useTransition();
    const router = useRouter();
    const isOutbox = container === 'outbox';
    const partyLabel = isOutbox ? 'Recipient' : 'Sender';
    const initMessages = useRef(initialMessages);
    const [cursor, setCursor] = useState(initNextCursor);

    const {set, remove, messages, updateUnreadCount, resetMessages} = useMessageStore(useShallow(state => ({
        set: state.set,
        remove: state.remove,
        messages: state.messages,
        updateUnreadCount: state.updateUnreadCount,
        resetMessages: state.resetMessages  
    })));

    useEffect(() => {
        set(initMessages.current);
        return () => resetMessages();
    }, [set, container, resetMessages]);

    const loadMore = useCallback(() => {
        if (cursor) {
            startLoadingMoreTransition(async () => {
                const {messages, nextCursor} = await getMessagesByContainer(container, cursor);
                set(messages);
                setCursor(nextCursor);
            })
        }
    }, [container, cursor, set]);

    const handleDelete = (message: MessageDto) => {
        startTransition(async () => {
            const result = await deleteMessage(message.id, isOutbox);
            if (result.status === 'error') toast.danger(result.error as string);
            else {
                remove(message.id);
                if (!message.dateRead && !isOutbox) updateUnreadCount(-1);
            }
        })
    }
    
    const hasMore = !!cursor;

    return (
        <Table>
            <Table.ScrollContainer className="max-h-[60vh] overflow-y-auto">
                <Table.Content aria-label="Messages table">
                    <Table.Header>
                        <Table.Column id="party" isRowHeader>{partyLabel}</Table.Column>
                        <Table.Column id="text">Message</Table.Column>
                        <Table.Column id="created">Date</Table.Column>
                        <Table.Column id="actions">{''}</Table.Column>
                    </Table.Header>
                    <Table.Body items={messages} renderEmptyState={() => 'No messages to display'}>
                        {(message) => {
                            const name = isOutbox ? message.recipientName : message.senderName;
                            const image = isOutbox ? message.recipientImage : message.senderImage;
                            const partyId = isOutbox ? message.recipientId : message.senderId;
                            const isRead = message.dateRead !== null;
                            return (
                                <Table.Row 
                                    id={message.id}
                                    onAction={() => router.push(`/members/${partyId}/chat`)}
                                    className={`${!isRead && !isOutbox ? 'font-semibold' : ''} cursor-pointer`}
                                >
                                    <Table.Cell>
                                        <div className="flex items-center gap-3">
                                            <PresenceAvatar src={image} userId={partyId} />
                                            <span>{name}</span>
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <span className="line-clamp-1">{message.text}</span>
                                    </Table.Cell>
                                    <Table.Cell>
                                        {formatShortDateTime(new Date(message.created))}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <div onPointerDown={e => e.stopPropagation()}>
                                            <Button
                                                isIconOnly
                                                variant="danger-soft"
                                                aria-label="Delete message"
                                                isPending={isDeleting}
                                                onClick={() => handleDelete(message)}
                                            >
                                                <AiFillDelete size={18} />
                                            </Button>
                                        </div>
                                    </Table.Cell>
                                </Table.Row>
                            )
                        }}
                    </Table.Body>
                </Table.Content>
            </Table.ScrollContainer>
            <Table.Footer className="justify-end">
                <Button 
                    variant="primary"
                    isPending={isLoadingMore}
                    isDisabled={!hasMore}
                    onClick={loadMore}
                >   
                    {hasMore ? 'Load more' : 'No more messages'}
                </Button>
            </Table.Footer>
        </Table>
    )
}