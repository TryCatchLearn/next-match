import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function useLoading() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentUrl = pathname + (searchParams ? `?${searchParams.toString()}` : '');

    const [navStartUrl, setNavStartUrl] = useState<string | null>(null);
    const isLoading = navStartUrl !== null && navStartUrl === currentUrl;

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const anchor = (e.target as Element).closest('a');
            if (!anchor) return;
            try {
                const url = new URL(anchor.href, window.location.origin);
                if (url.origin !== window.location.origin 
                    || anchor.target === '_blank' 
                    || anchor.download 
                    || (url.pathname === window.location.pathname && url.search === window.location.search)
                ) return;
                setNavStartUrl(currentUrl);
            } catch {}
        }

        const handlePopState = () => setNavStartUrl(currentUrl);

        document.addEventListener('click', handleClick, true);
        window.addEventListener('popstate', handlePopState)
    }, [currentUrl]);

    return isLoading;
}