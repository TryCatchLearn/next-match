import { useEffect } from "react";
import { usePresenceStore } from "./usePresenceStore"
import { getPusherClient } from "../pusher-client";
import { Members, PresenceChannel } from "pusher-js";

type PresenceMember = {id: string, info: unknown}

export const usePresence = (userId: string | null) => {
    const {set, add, remove} = usePresenceStore();

    useEffect(() => {
        if (!userId) return;

        const handleSetMembers = (memberIds: string[]) => {
            set(memberIds);
        }

        const handleAddMember = (memberId: string) => {
            add(memberId);
        }

        const handleRemoveMember = (memberId: string) => {
            remove(memberId);
        }

        const channel = getPusherClient().subscribe('presence-nm') as PresenceChannel;

        channel.bind('pusher:subscription_succeeded', (members: Members) => {
            handleSetMembers(Object.keys(members.members))
        });

        channel.bind('pusher:member_added', (member: PresenceMember) => {
            handleAddMember(member.id);
        });

        channel.bind('pusher:member_removed', (member: PresenceMember) => {
            handleRemoveMember(member.id);
        });

        return () => {
            channel.unbind_all();
        }
    }, [add, remove, set, userId])
}