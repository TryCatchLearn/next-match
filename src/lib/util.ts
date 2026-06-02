import { differenceInYears } from "date-fns";

export function calculateAge(dob: string | Date) {
    return differenceInYears(new Date(), new Date(dob));
}

export function transformImageUrl(imageUrl?: string | null) {
    if (!imageUrl) return null;

    if (!imageUrl.includes('cloudinary')) return imageUrl;

    const uploadIndex = imageUrl.indexOf('/upload/') + '/upload/'.length;

    const transformation = 'c_fill,w_640,h_640,g_face/';

    return `${imageUrl.slice(0, uploadIndex)}${transformation}${imageUrl.slice(uploadIndex)}`
}