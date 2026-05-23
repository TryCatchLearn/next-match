import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cache } from "react";

export async function getMembers() {
    const currentUser = await getCurrentUser();
    if (!currentUser) return null;

    try {
        return prisma.member.findMany({
            where: {NOT: {userId: currentUser.id}}
        });
    } catch (error) {
        console.log(error);
    }
}

export const getMemberByUserId = cache((userId: string) => {
    try {
        return prisma.member.findUnique({where: {userId}})
    } catch (error) {
        console.log(error);
    }
});