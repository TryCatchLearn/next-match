import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";

const FILTER_COOKIE = 'memberFilters';
const MAX_AGE = 60 * 60 * 24 * 30 // 30 days

function readCookie(name: string) {
    return document.cookie
        .split('; ')
        .find(c => c.startsWith(`${name}=`))
        ?.split('=')[1];
}

export const useFilterParams = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const commit = useCallback((updates: Record<string, string | null>) => {
        const params = new URLSearchParams(searchParams);
        for (const [key, value] of Object.entries(updates)) {
            if (value === null) params.delete(key);
            else params.set(key, value);
        }

        const query = params.toString();
        document.cookie = `${FILTER_COOKIE}=${encodeURIComponent(query)}; path=/; max-age=${MAX_AGE}`
        startTransition(() => router.replace(query ? `${pathname}?${query}` : pathname));
    }, [pathname, router, searchParams]);

    const restore = useCallback(() => {
        const saved = readCookie(FILTER_COOKIE);
        const query = saved ? decodeURIComponent(saved) : '';
        if (!query) return;
        startTransition(() => router.replace(`${pathname}?${query}`))
    }, [pathname, router]);

    const reset = useCallback(() => {
        document.cookie = `${FILTER_COOKIE}=; path=/; max-age=0`;
        startTransition(() => router.replace(pathname));
    }, [pathname, router]);

    return {
        commit,
        isPending,
        searchParams,
        pathname,
        restore,
        reset
    }
}