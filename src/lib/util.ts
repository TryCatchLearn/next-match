import {differenceInYears, format, formatDistance} from 'date-fns';
import { FieldValues, Path, UseFormSetError } from 'react-hook-form';
import { ZodIssue } from 'zod';

export function calculateAge(dob: Date) {
    return differenceInYears(new Date(), dob);
}

export function formatShortDateTime(date: Date) {
    return format(date, 'dd MMM yy h:mm:a')
}

export function timeAgo(date: string) {
    return formatDistance(new Date(date), new Date()) + ' ago';
}

export function handleFormServerErrors<TFieldValues extends FieldValues>(
    errorResponse: {error: string | ZodIssue[]},
    setError: UseFormSetError<TFieldValues>
) {
    if (Array.isArray(errorResponse.error)) {
        errorResponse.error.forEach((e) => {
            const fieldName = e.path.join('.') as Path<TFieldValues>
            setError(fieldName, {message: e.message})
        })
    } else {
        setError('root.serverError', {message: errorResponse.error});
    }
}

export function transformImageUrl(imageUrl?: string | null) {
    if (!imageUrl) return null;

    if (!imageUrl.includes('cloudinary')) return imageUrl;

    const uploadIndex = imageUrl.indexOf('/upload/') + '/upload/'.length;

    const transformation = 'c_fill,w_300,h_300,g_faces/';

    return `${imageUrl.slice(0, uploadIndex)}${transformation}${imageUrl.slice(uploadIndex)}`
}

export function truncateString(text?: string | null, num = 50) {
    if (!text) return null;
    if (text.length <= num) {
        return text;
    }
    return text.slice(0, num) + '...';
}

export function createChatId(a: string, b: string) {
    return a > b ? `${b}-${a}` : `${a}-${b}`
}