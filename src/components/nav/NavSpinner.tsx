'use client';

import { useLoading } from "@/lib/hooks/useLoading"
import { Spinner } from "@heroui/react";

export default function NavSpinner() {
    const isLoading = useLoading();

    return (
        <div className="w-10 h-10 flex items-center justify-center">
            {isLoading && <Spinner size='lg' className="text-white" />}
        </div>
    )
}