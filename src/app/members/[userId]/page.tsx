import { getMemberByUserId } from "@/server/actions/members";
import { notFound } from "next/navigation";

export default async function MemberDetailedPage(props: PageProps<"/members/[userId]">) {
    const {userId} = await props.params;
    const member = await getMemberByUserId(userId);

    if (!member) return notFound();

    return (
        <div>{member.description}</div>
    )
}