import { MessageDto, MessageWithSenderRecipient } from "./types";
import { formatShortDateTime } from "./util";

export function mapMessageToMessageDto(message: MessageWithSenderRecipient): MessageDto {
    if (!message.sender || !message.recipient) throw new Error('Missing sender or recipient');
    return {
        id: message.id,
        text: message.text,
        created: formatShortDateTime(message.created),
        dateRead: message.dateRead ? formatShortDateTime(message.created) : null,
        senderId: message.sender.userId,
        senderName: message.sender.name,
        senderImage: message.sender.image,
        recipientId: message.recipient.userId,
        recipientName: message.recipient.name,
        recipientImage: message.recipient.image
    }
}