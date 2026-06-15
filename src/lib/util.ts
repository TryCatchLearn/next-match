import { differenceInYears, format, formatDistanceToNow } from "date-fns";
import { ActionResult } from "./types";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

export function calculateAge(dob: string | Date) {
    return differenceInYears(new Date(), new Date(dob));
}

export function formatShortDateTime(date: Date) {
    return format(date, 'dd MMM yy h:mm:a')
}

export function timeAgo(date: string) {
    return formatDistanceToNow(new Date(date), {addSuffix: true})
}

export function transformImageUrl(imageUrl?: string | null) {
    if (!imageUrl) return null;

    if (!imageUrl.includes('cloudinary')) return imageUrl;

    const uploadIndex = imageUrl.indexOf('/upload/') + '/upload/'.length;

    const transformation = 'c_fill,w_640,h_640,g_face/';

    return `${imageUrl.slice(0, uploadIndex)}${transformation}${imageUrl.slice(uploadIndex)}`
}

export function handlePrismaError<T>(error: unknown): ActionResult<T> {
    if (error instanceof PrismaClientKnownRequestError || error instanceof Error) {
        return { status: 'error', error: error.message }
    } else {
        return { status: 'error', error: 'Something went wrong' }
    }
}

export function createChatId(a: string, b: string) {
    return a > b ? `private-${b}-${a}` : `private-${a}-${b}`
}