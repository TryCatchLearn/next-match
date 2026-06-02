import { getCurrentUser } from "@/lib/auth";
import { getMemberByUserId } from "@/server/actions/members";
import { notFound } from "next/navigation";
import ProfileForm from "./ProfileForm";

export default async function MemberDetailedPage(props: PageProps<"/members/[userId]">) {
    const {userId} = await props.params;
    const user = await getCurrentUser();
    const member = await getMemberByUserId(userId);

    if (!member) return notFound();

    const isCurrentUser = member.userId === user?.id;

    return (
        <div>
            {isCurrentUser ? (
                <ProfileForm member={member} />
            ) : (
                <div>{member.description}</div>
            )}
        </div>
    )
}