'use client';

import { getPusherClient } from "@/lib/pusher-client";
import { MessageDto } from "@/lib/types";
import { Channel } from "pusher-js";
import { useCallback, useEffect, useRef, useState } from "react";
import MessageBox from "./MessageBox";
import { markMessagesAsRead } from "@/server/actions/messages";
import { useMessageStore } from "@/lib/hooks/useMessageStore";
import ChatForm from "./ChatForm";
import { User } from "better-auth";
import { Chip } from "@heroui/react";

type Props = {
    initialMessages: MessageDto[];
    currentUser: User;
    chatId: string;
    readCount: number;
}

export default function MessageList({ initialMessages, currentUser, chatId, readCount }: Props) {
    const [messages, setMessages] = useState(initialMessages);
    const channelRef = useRef<Channel | null>(null);
    const updateUnreadCount = useMessageStore(state => state.updateUnreadCount);
    const countUpdated = useRef(false);
    const [typingName, setTypingName] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleTyping = useCallback((name: string) => {
        setIsTyping(true);
        setTypingName(name);

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            setIsTyping(false);
        }, 3000);

    }, [])

    const handleNewMessage = useCallback(async (message: MessageDto) => {
        setMessages(prevState => {
            return [...prevState, message]
        });

        if (message.senderId !== currentUser.id) {
            await markMessagesAsRead([message.id], message.senderId)
        }
    }, [currentUser]);

    const handleReadMessages = useCallback((messageIds: string[]) => {
        setMessages(prevState => prevState.map(message => messageIds.includes(message.id)
            ? { ...message, dateRead: new Date().toISOString() }
            : message))
    }, []);

    useEffect(() => {
        if (!countUpdated.current) {
            updateUnreadCount(-readCount);
            countUpdated.current = true;
        }
    }, [readCount, updateUnreadCount])

    useEffect(() => {
        if (!channelRef.current) {
            channelRef.current = getPusherClient().subscribe(chatId);
            channelRef.current.bind('message:new', handleNewMessage);
            channelRef.current.bind('messages:read', handleReadMessages);
            channelRef.current.bind('client-typing', handleTyping);
        }

        return () => {
            if (channelRef.current && channelRef.current.subscribed) {
                channelRef.current.unsubscribe();
                channelRef.current.unbind_all();
                channelRef.current = null;
            }
        }
    }, [chatId, handleNewMessage, handleReadMessages, handleTyping]);

    const triggerTyping = () => {
        if (channelRef.current) {
            channelRef.current.trigger('client-typing', currentUser.name);
        }
    }

    return (
        <div className="relative flex flex-col flex-1">
            <div className="flex-1 overflow-y-auto">
                {messages?.length === 0 ? (
                    <p>No messages yet.  Start the conversation</p>
                ) : (
                    <>
                        {messages?.map(message => (
                            <MessageBox
                                key={message.id}
                                message={message}
                                currentUserId={currentUser.id}
                            />
                        ))}
                    </>
                )}
            </div>
            {isTyping && (
                <Chip color="accent" variant="secondary" className="w-fit rounded-md absolute bottom-14">
                    {typingName} is typing...
                </Chip>
            )}
            <ChatForm triggerTyping={triggerTyping} />
        </div>
    )
}