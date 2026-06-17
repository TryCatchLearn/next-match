'use client';

import { useFilterParams } from "@/lib/hooks/useFilterParams"
import { Button, Card } from "@heroui/react";
import { FaSearch } from "react-icons/fa";

export default function EmptyState() {
    const { reset, isPending } = useFilterParams();

    return (
        <div className="flex justify-center items-center px-6 py-24">
            <Card className="w-full max-w-3xl mx-auto shadow-xl rounded-2xl">
                <Card.Header className="flex flex-col items-center justify-center gap-5 pt-12 pb-2">
                    <FaSearch size={40} className="text-accent" />
                    <h2 className="text-3xl font-semibold text-center">
                        No results found
                    </h2>
                </Card.Header>
                <Card.Content className="text-center text-muted pb-2">
                    Try adjusting your filters or reset
                </Card.Content>
                <Card.Footer className="flex justify-center pb-12 pt-4">
                    <Button onClick={reset} variant="primary" isPending={isPending}>
                        {isPending ? 'Resetting...' : 'Reset Filters'}
                    </Button>
                </Card.Footer>
            </Card>
        </div>
    )
}