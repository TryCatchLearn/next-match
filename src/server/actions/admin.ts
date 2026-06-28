'use server';

import { requireAdminUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getPendingPhotos() {
    await requireAdminUser();

    return prisma.photo.findMany({
        where: {status: 'pending'},
        include: {
            member: {
                select: {name: true, userId: true}
            }
        },
        orderBy: {member: {created: 'asc'}}
    })
}

export async function approvePhoto(photoId: string) {
    await requireAdminUser();

    const photo = await prisma.photo.update({
        where: {id: photoId},
        data: {status: 'approved'},
        include: {member: {select: {userId: true, image: true}}}
    });

    if (!photo.member.image) await prisma.member.update({
        where: {id: photo.memberId},
        data: {
            image: photo.url,
            user: {
                update: {
                    image: photo.url
                }
            }
        }
    });

    revalidatePath('/admin/photos');
    revalidatePath(`/members/${photo.member.userId}/photos`);
    revalidatePath('/members');
}

export async function rejectPhoto(photoId: string) {
    await requireAdminUser();

    const photo = await prisma.photo.update({
        where: {id: photoId},
        data: {status: 'rejected'},
        include: {member: {select: {userId: true}}}
    });

    revalidatePath('/admin/photos');
    revalidatePath(`/members/${photo.member.userId}/photos`);
}