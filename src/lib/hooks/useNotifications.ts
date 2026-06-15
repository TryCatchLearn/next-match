import { Channel } from "pusher-js"
import { useCallback, useEffect, useRef } from "react"
import { getPusherClient } from "../pusher-client";
import { usePathname, useSearchParams } from "next/navigation";
import { useMessageStore } from "./useMessageStore";
import { MessageDto } from "../types";
import { messageToast } from "@/components/MessageToast";
import { likeToast } from "@/components/LikeToast";

export const useNotifications = (userId: string | null) => {
    const channelRef = useRef<Channel | null>(null);
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const add = useMessageStore(state => state.add);
    const updateUnreadCount = useMessageStore(state => state.updateUnreadCount);

    const handleNewMessage = useCallback((message: MessageDto) => {
        if (pathname === '/messages' && searchParams.get('container') !== 'outbox') {
            add(message);
            updateUnreadCount(1);
        } else if (pathname !== `/members/${message.senderId}/chat`) {
            messageToast(message);
            updateUnreadCount(1);
        }
    }, [add, pathname, searchParams, updateUnreadCount]);

    const handleNewLike = useCallback(({name, image, userId}: 
            {name: string, image: string, userId: string}) => {
        likeToast({name, image, userId});
    }, [])

    useEffect(() => {
        if (!userId) return;
        if (!channelRef.current) {
            channelRef.current = getPusherClient().subscribe(`private-${userId}`);
        }

        return () => {
            if (channelRef.current && channelRef.current.subscribed) {
                channelRef.current.unsubscribe();
                channelRef.current.unbind_all();
                channelRef.current = null;
            }
        }
    }, [userId]);

    useEffect(() => {
        const channel = channelRef.current;
        if (!channel) return;

        channel.bind('message:new', handleNewMessage);
        channel.bind('like:new', handleNewLike);

        return () => {
            channel.unbind_all();
        }
    }, [handleNewMessage, handleNewLike]);
}