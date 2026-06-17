'use client';

import { PaginationComponent } from "@/components/PaginationComponent";
import { useFilterParams } from "@/lib/hooks/useFilterParams";

type Props = {
    totalCount: number;
}

export default function MembersPagination({ totalCount }: Props) {
    const {searchParams, commit} = useFilterParams();

    const page = Number(searchParams.get('page')) || 1;
    const pageSize = Number(searchParams.get('pageSize')) || 12;

    return (
        <PaginationComponent 
            page={page}
            itemsPerPage={pageSize}
            totalItems={totalCount}
            setPage={page => commit({page: String(page)})}
            setPageSize={size => commit({pageSize: String(size), page: null})}
        />
    )
}