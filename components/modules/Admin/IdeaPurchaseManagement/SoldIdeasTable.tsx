"use client";

import DataTable from "@/components/shared/table/DataTable";
import {
    serverManagedFilter,
    useServerManagedDataTableFilters,
} from "@/hooks/useServerManagedDataTableFilters";
import { useServerManagedDataTableSearch } from "@/hooks/useServerManagedDataTableSearch";
import { getSoldIdeas } from "@/services/purchase.service";
import { IIdeaPurchase } from "@/types/purchase.types";
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { soldIdeaColumns } from "./soldIdeaColumns";
import { PaginationMeta } from "@/types/api.types";
import { DataTableFilterConfig, DataTableFilterValues } from "@/components/shared/table/DataTableFilters";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const SOLD_IDEA_FILTER_DEFINITIONS = [
    serverManagedFilter.single("status"),
    serverManagedFilter.single("isPaid"),
];

const SoldIdeasTable = ({ initialQueryString }: { initialQueryString: string }) => {
    const searchParams = useSearchParams();

    const {
        queryStringFromUrl,
        optimisticSortingState,
        optimisticPaginationState,
        isRouteRefreshPending,
        updateParams,
        handleSortingChange,
        handlePaginationChange,
    } = useServerManagedDataTable({
        searchParams,
        defaultPage: DEFAULT_PAGE,
        defaultLimit: DEFAULT_LIMIT,
    });

    const queryString = queryStringFromUrl || initialQueryString;

    const { searchTermFromUrl, handleDebouncedSearchChange } =
        useServerManagedDataTableSearch({ searchParams, updateParams });

    const { filterValues, handleFilterChange, clearAllFilters } =
        useServerManagedDataTableFilters({
            searchParams,
            definitions: SOLD_IDEA_FILTER_DEFINITIONS,
            updateParams,
        });

    const { data: soldIdeasResponse, isLoading, isFetching } = useQuery({
        queryKey: ["sold-ideas", queryString],
        queryFn: () => getSoldIdeas(queryString),
    });

    const records: IIdeaPurchase[] = soldIdeasResponse?.data ?? [];
    const meta: PaginationMeta | undefined = soldIdeasResponse?.meta;

    const filterConfigs = useMemo<DataTableFilterConfig[]>(() => [
        {
            id: "status",
            label: "Idea Status",
            type: "single-select",
            options: [
                { label: "Draft", value: "DRAFT" },
                { label: "Under Review", value: "UNDER_REVIEW" },
                { label: "Approved", value: "APPROVED" },
                { label: "Rejected", value: "REJECTED" },
            ],
        },
        {
            id: "isPaid",
            label: "Price Type",
            type: "single-select",
            options: [
                { label: "Free", value: "false" },
                { label: "Paid", value: "true" },
            ],
        },
    ], []);

    const filterValuesForTable = useMemo<DataTableFilterValues>(() => ({
        status: filterValues.status,
        isPaid: filterValues.isPaid,
    }), [filterValues]);

    return (
        <DataTable
            data={records}
            columns={soldIdeaColumns}
            isLoading={isLoading || isFetching || isRouteRefreshPending}
            emptyMessage="No purchase records found."
            sorting={{
                state: optimisticSortingState,
                onSortingChange: handleSortingChange,
            }}
            pagination={{
                state: optimisticPaginationState,
                onPaginationChange: handlePaginationChange,
            }}
            search={{
                initialValue: searchTermFromUrl,
                placeholder: "Search by buyer, idea title...",
                debounceMs: 700,
                onDebouncedChange: handleDebouncedSearchChange,
            }}
            filters={{
                configs: filterConfigs,
                values: filterValuesForTable,
                onFilterChange: handleFilterChange,
                onClearAll: clearAllFilters,
            }}
            meta={meta}
        />
    );
};

export default SoldIdeasTable;
