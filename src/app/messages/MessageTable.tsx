'use client';

import { MessageDto } from "@/lib/types";
import { transformImageUrl } from "@/lib/util";
import { deleteMessage } from "@/server/actions/messages";
import { Avatar, Button, Table, toast } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { AiFillDelete } from "react-icons/ai";

type Props = {
    messages: MessageDto[];
    container: string;
}

export default function MessageTable({ messages, container }: Props) {
    const [isDeleting, startTransition] = useTransition();
    const router = useRouter();
    const isOutbox = container === 'outbox';
    const partyLabel = isOutbox ? 'Recipient' : 'Sender';

    const handleDelete = (messageId: string) => {
        startTransition(async () => {
            const result = await deleteMessage(messageId, isOutbox);
            if (result.status === 'error') toast.danger(result.error as string);
        })
    }

    return (
        <Table>
            <Table.ScrollContainer className="max-h-[65vh] overflow-y-auto">
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
                                            <Avatar>
                                                <Avatar.Image 
                                                    alt={name}
                                                    src={transformImageUrl(image) || '/images/user.png'}
                                                />
                                            </Avatar>
                                            <span>{name}</span>
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <span className="line-clamp-1">{message.text}</span>
                                    </Table.Cell>
                                    <Table.Cell>
                                        {message.created}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <div onPointerDown={e => e.stopPropagation()}>
                                            <Button
                                                isIconOnly
                                                variant="danger-soft"
                                                aria-label="Delete message"
                                                isPending={isDeleting}
                                                onClick={() => handleDelete(message.id)}
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
        </Table>
    )
}