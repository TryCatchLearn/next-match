'use client';

import { MessageDto } from '@/types'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import MessageBox from './MessageBox';
import { pusherClient } from '@/lib/pusher';
import { formatShortDateTime } from '@/lib/util';
import useMessageStore from '@/hooks/useMessageStore';

type Props = {
    initialMessages: {messages: MessageDto[], readCount: number};
    currentUserId: string;
    chatId: string;
}

export default function MessageList({initialMessages, currentUserId, chatId}: Props) {
    const setReadCount = useRef(false);
    const [messages, setMessages] = useState(initialMessages.messages);
    const {updateUnreadCount} = useMessageStore(state => ({
        updateUnreadCount: state.updateUnreadCount
    }));

    useEffect(() => {
        if (!setReadCount.current) {
            updateUnreadCount(-initialMessages.readCount);
            setReadCount.current = true;
        }
    }, [initialMessages.readCount, updateUnreadCount])

    const handleNewMessage = useCallback((message: MessageDto) => {
        setMessages(prevState => {
            return [...prevState, message]
        })
    }, [])

    const handleReadMessages = useCallback((messageIds: string[]) => {
        setMessages(prevState => prevState.map(message => messageIds.includes(message.id) 
            ? {...message, dateRead: formatShortDateTime(new Date())}
            : message
        ))
    }, []);

    useEffect(() => {
        const channel = pusherClient.subscribe(chatId);

        channel.bind('message:new', handleNewMessage);
        channel.bind('messages:read', handleReadMessages);

        return () => {
            channel.unsubscribe();
            channel.unbind('message:new', handleNewMessage);
            channel.unbind('messages:read', handleReadMessages);
        }
    }, [chatId, handleNewMessage, handleReadMessages]);

    return (
        <div>
            {messages.length === 0 ? 'No messages to display' : (
                <div>
                    {messages.map(message => (
                        <MessageBox 
                            key={message.id} 
                            message={message} 
                            currentUserId={currentUserId}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
