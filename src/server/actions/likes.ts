'use server';

import { requireAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";
import { revalidatePath } from "next/cache";

export async function toggleLikeMember(targetUserId: string, isLiked?: boolean) {
    try {
        const user = await requireAuthUser();

        if (isLiked) {
            await prisma.like.delete({
                where: {
                    sourceUserId_targetUserId: {
                        sourceUserId: user.id,
                        targetUserId
                    }
                }
            })
        } else {
            const like = await prisma.like.create({
                data: {
                    sourceUserId: user.id,
                    targetUserId
                },
                select: {
                    sourceMember: {
                        select: {
                            name: true,
                            image: true,
                            userId: true
                        }
                    }
                }
            });

            pusherServer.trigger(`private-${targetUserId}`, 'like:new', {
                name: like.sourceMember.name,
                image: like.sourceMember.image,
                userId: like.sourceMember.userId
            });
        }
        revalidatePath('/members');
        revalidatePath(`/members/${targetUserId}`);
    } catch (error) {
        console.log(error);
    }
}

export async function fetchCurrentUserLikeIds() {
    try {
        const user = await requireAuthUser();

        const likes = await prisma.like.findMany({
            where: {
                sourceUserId: user.id
            },
            select: {
                targetUserId: true
            }
        });

        return likes.map(like => like.targetUserId);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function fetchLikedMembers(type = "target") {
    try {
        const user = await requireAuthUser();

        switch (type) {
            case 'target':
                return await fetchTargetLikes(user.id);
            case 'source':
                return await fetchSourceLikes(user.id);
            case 'mutual':
                return await fetchMutualLikes(user.id);
            default:
                return [];
        }

    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function fetchTargetLikes(id: string) {
    const targets = await prisma.like.findMany({
        where: {sourceUserId: id},
        select: {targetMember: true}
    });

    return targets.map(x => x.targetMember);
}

async function fetchSourceLikes(id: string) {
    const sources = await prisma.like.findMany({
        where: {targetUserId: id},
        select: {sourceMember: true}
    });

    return sources.map(x => x.sourceMember);
}

async function fetchMutualLikes(id: string) {
    const likedUsers = await prisma.like.findMany({
        where: {sourceUserId: id},
        select: {targetUserId: true}
    });
    const likedIds = likedUsers.map(x => x.targetUserId);

    const mutualList = await prisma.like.findMany({
        where: {
            AND: [
                {targetUserId: id},
                {sourceUserId: {in: likedIds}}
            ]
        },
        select: {sourceMember: true}
    });

    return mutualList.map(x => x.sourceMember);
}

