import { differenceInYears, format } from "date-fns";
import { ActionResult } from "./types";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

export function calculateAge(dob: string | Date) {
    return differenceInYears(new Date(), new Date(dob));
}

export function formatShortDateTime(date: Date) {
    return format(date, 'dd MMM yy h:mm:a')
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