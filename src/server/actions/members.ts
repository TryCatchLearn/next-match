'use server';

import { requireAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { profileEditSchema, ProfileEditSchema } from "@/lib/schemas/profileEditSchema";
import { ActionResult, PaginatedResponse, UserFilters } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { cache } from "react";
import { Member, Photo } from "../../../generated/prisma/client";
import { cloudinary } from "@/lib/cloudinary";
import { addYears } from "date-fns";
import { User } from "better-auth";
import { ProfileSchema } from "@/lib/schemas/registerSchema";

export async function getMembers(params: UserFilters): Promise<PaginatedResponse<Member>> {
    const currentUser = await requireAuthUser();

    const ageRange = params.ageRange?.toString()?.split(',') || [18, 100];
    const currentDate = new Date();
    const minDob = addYears(currentDate, -ageRange[1] - 1);
    const maxDob = addYears(currentDate, -ageRange[0]);
    const orderBySelector = params?.orderBy || 'updated';
    const selectedGender = params.gender?.toString()?.split(',') || ['male', 'female'];
    const pageNumber = Number(params?.page) || 1;
    const pageSize = Number(params?.pageSize) || 12;
    const withPhoto = String(params.withPhoto) === 'true'

    const where = {
        AND: [
            { dateOfBirth: { gte: minDob, lte: maxDob } },
            { gender: { in: selectedGender } },
            ...(withPhoto === true ? [{image: {not: null}}] : [])
        ],
        NOT: { userId: currentUser.id }
    }

    try {
        const [items, totalCount] = await Promise.all([
            prisma.member.findMany({
                where,
                orderBy: { [orderBySelector]: 'desc' },
                skip: (pageNumber - 1) * pageSize,
                take: pageSize
            }),
            prisma.member.count({where})
        ]);

        return {items, totalCount}

    } catch (error) {
        console.log(error);
        return {items: [], totalCount: 0}
    }
}

export const getMemberByUserId = cache((userId: string) => {
    try {
        return prisma.member.findUnique({ where: { userId } })
    } catch (error) {
        console.log(error);
    }
});

export async function updateProfile(data: ProfileEditSchema): Promise<ActionResult<Member>> {
    try {
        const user = await requireAuthUser();

        const validated = profileEditSchema.safeParse(data);

        if (!validated.success) return { status: 'error', error: validated.error.issues }

        const { name, description, city, country } = validated.data;

        const member = await prisma.member.update({
            where: { userId: user.id },
            data: {
                name,
                description,
                city,
                country,
                user: {
                    update: { name: data.name }
                }
            }
        });

        revalidatePath('/members');
        revalidatePath(`/members/${member.userId}`);

        return { status: 'success', data: member }
    } catch (error) {
        if (error instanceof Error) return { status: 'error', error: error.message }
        else return { status: 'error', error: 'Something went wrong!' }
    }
}

export async function getMemberPhotosByUserId(userId: string) {
    const member = await prisma.member.findUnique({
        where: { userId },
        select: { photos: true }
    });

    return member?.photos;
}

export async function addImage(url: string, publicId: string) {
    try {
        const user = await requireAuthUser();

        const member = await prisma.member.update({
            where: { userId: user.id },
            data: {
                photos: {
                    create: [{ url, publicId }]
                }
            }
        });

        revalidatePath(`/members/${member.userId}/photos`);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function setMainImage(photo: Photo) {
    try {
        const user = await requireAuthUser();

        const result = await prisma.user.update({
            where: { id: user.id },
            data: {
                image: photo.url,
                member: {
                    update: {
                        image: photo.url
                    }
                }
            }
        });

        revalidatePath(`/members/${user.id}/photos`);
        revalidatePath(`/members`);

        return result;

    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function deleteImage(photo: Photo) {
    try {
        const user = await requireAuthUser();

        if (photo.publicId) {
            await cloudinary.v2.uploader.destroy(photo.publicId);
        }

        const result = await prisma.member.update({
            where: { userId: user.id },
            data: {
                photos: {
                    delete: { id: photo.id }
                }
            }
        });

        revalidatePath(`/members/${user.id}/photos`);

        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function updateLastActive() {
    const user = await requireAuthUser();

    if (!user.profileComplete) return null;

    prisma.member.update({
        where: { userId: user.id },
        data: { updated: new Date() }
    }).catch(e => {
        console.error('update last active failed: ', e)
    })
}

export async function createMemberProfile(user: User, data: ProfileSchema) {
    try {
        const [member] = await prisma.$transaction([
            prisma.member.create({
                data: {
                    userId: user.id,
                    name: user.name,
                    gender: data.gender,
                    dateOfBirth: new Date(data.dateOfBirth),
                    description: data.description,
                    city: data.city,
                    country: data.country
                }
            }),
            prisma.user.update({
                where: {id: user.id},
                data: {profileComplete: true}
            })
        ]);

        return {status: 'success', data: member};
    } catch (error) {
        console.log(error);
        return {status: 'error', error: 'Failed to create member profile'}
    }
}