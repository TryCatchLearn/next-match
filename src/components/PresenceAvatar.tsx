import { usePresenceStore } from "@/lib/hooks/usePresenceStore";
import { transformImageUrl } from "@/lib/util";
import { Avatar, Badge } from "@heroui/react";

type Props = {
    userId: string;
    src?: string | null;
}

export default function PresenceAvatar({ userId, src }: Props) {
    const members = usePresenceStore(state => state.members);

    const isActive = members.indexOf(userId) !== -1;

    return (
        <Badge.Anchor>
            <Avatar>
                <Avatar.Image src={transformImageUrl(src) || '/images/user.png'} />
            </Avatar>
            {isActive && <Badge color="success" placement="top-right" size="sm" />}
        </Badge.Anchor>
    )
}