"use client";

import { Button, Pagination } from "@heroui/react";

type Props = {
    page: number;
    itemsPerPage: number;
    totalItems: number;
    setPage: (page: number) => void;
    setPageSize: (size: number) => void;
}

export function PaginationComponent({ page, itemsPerPage, totalItems, setPage, setPageSize }
        : Props) {
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
    const pageSizes = [3,6,12];
    
    const getPageNumbers = () => {
        const pages: (number | "ellipsis")[] = [];

        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);

            if (page > 3) {
                pages.push("ellipsis");
            }

            const start = Math.max(2, page - 1);
            const end = Math.min(totalPages - 1, page + 1);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (page < totalPages - 2) {
                pages.push("ellipsis");
            }

            pages.push(totalPages);
        }

        return pages;
    };

    const startItem = (page - 1) * itemsPerPage + 1;
    const endItem = Math.min(page * itemsPerPage, totalItems);

    return (
        <Pagination className="sticky bottom-0 mt-auto border-accent/40 w-full border-t px-6 py-4">
            <Pagination.Summary>
                Showing {startItem}-{endItem} of {totalItems} results
            </Pagination.Summary>
            <Pagination.Content>
                <Pagination.Item>
                    <Pagination.Previous isDisabled={page === 1} onPress={() => setPage(page - 1)}>
                        <Pagination.PreviousIcon />
                        <span>Previous</span>
                    </Pagination.Previous>
                </Pagination.Item>
                {getPageNumbers().map((p, i) =>
                    p === "ellipsis" ? (
                        <Pagination.Item key={`ellipsis-${i}`}>
                            <Pagination.Ellipsis />
                        </Pagination.Item>
                    ) : (
                        <Pagination.Item key={p}>
                            <Pagination.Link isActive={p === page} onPress={() => setPage(p)}>
                                {p}
                            </Pagination.Link>
                        </Pagination.Item>
                    ),
                )}
                <Pagination.Item>
                    <Pagination.Next isDisabled={page === totalPages} onPress={() => setPage(page + 1)}>
                        <span>Next</span>
                        <Pagination.NextIcon />
                    </Pagination.Next>
                </Pagination.Item>
            </Pagination.Content>
            <div className="flex gap-2">
                {pageSizes.map(s => (
                    <Button 
                        key={s} 
                        onClick={() => setPageSize(s)}
                        variant={itemsPerPage === s ? 'primary' : 'secondary'}
                    >
                        {s}
                    </Button>
                ))}
            </div>
        </Pagination>
    );
}