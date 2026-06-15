'use client';

import { authClient } from "@/lib/auth-client";
import { useMessageStore } from "@/lib/hooks/useMessageStore";
import { useNotifications } from "@/lib/hooks/useNotifications";
import { usePresence } from "@/lib/hooks/usePresence";
import { getUnreadMessageCount } from "@/server/actions/messages";
import { ReactNode, useEffect, useRef } from "react";

export default function Providers({ children }: { children: ReactNode }) {
    const session = authClient.useSession();
    const userId = session.data?.user.id || null;
    const updateUnreadCount = useMessageStore(state => state.updateUnreadCount);
    const isUnreadCountSet = useRef(false);

    useEffect(() => {
        if (!isUnreadCountSet.current && userId) {
            getUnreadMessageCount().then(count => {
                updateUnreadCount(count);
            });
            isUnreadCountSet.current = true;
        }
    }, [updateUnreadCount, userId])

    usePresence(userId);
    useNotifications(userId);

    return (
        <>{children}</>
    )
}