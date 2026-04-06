"use client";

import DataTable from "@/components/shared/table/DataTable";
import {
    serverManagedFilter,
    useServerManagedDataTableFilters,
} from "@/hooks/useServerManagedDataTableFilters";
import { useServerManagedDataTableSearch } from "@/hooks/useServerManagedDataTableSearch";
import { getMyPurchases } from "@/services/purchase.service";
import { IIdeaPurchase } from "@/types/purchase.types";
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import { myPurchaseColumns } from "./myPurchaseColumns";
import { PaginationMeta } from "@/types/api.types";
import {
    DataTableFilterConfig,
    DataTableFilterValues,
} from "@/components/shared/table/DataTableFilters";
import { useRowActionModalState } from "@/hooks/useRowActionModalState";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const MY_PURCHASE_FILTER_DEFINITIONS = [
    serverManagedFilter.single("status"),
];

const MyPurchasesTable = ({ initialQueryString }: { initialQueryString: string }) => {
    const searchParams = useSearchParams();
    const router = useRouter();

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

    const {
        tableActions,
    } = useRowActionModalState<IIdeaPurchase>();

    const queryString = queryStringFromUrl || initialQueryString;

    const {
        searchTermFromUrl,
        handleDebouncedSearchChange,
    } = useServerManagedDataTableSearch({
        searchParams,
        updateParams,
    });

    const {
        filterValues,
        handleFilterChange,
        clearAllFilters,
    } = useServerManagedDataTableFilters({
        searchParams,
        definitions: MY_PURCHASE_FILTER_DEFINITIONS,
        updateParams,
    });

    const { data: purchasesResponse, isLoading, isFetching } = useQuery({
        queryKey: ["my-purchases", queryString],
        queryFn: () => getMyPurchases(queryString),
    });

    const records: IIdeaPurchase[] = purchasesResponse?.data ?? [];
    const meta: PaginationMeta | undefined = purchasesResponse?.meta;

    const filterConfigs: DataTableFilterConfig[] = [
        {
            id: "status",
            label: "Status",
            type: "single-select",
            options: [
                { label: "Approved", value: "APPROVED" },
                { label: "Under Review", value: "UNDER_REVIEW" },
                { label: "Rejected", value: "REJECTED" },
            ],
        },
    ];

    const filterValuesForTable: DataTableFilterValues = {
        status: filterValues.status,
    };

    return (
        <DataTable
            data={records}
            columns={myPurchaseColumns}
            isLoading={isLoading || isFetching || isRouteRefreshPending}
            emptyMessage="You haven't purchased any ideas yet."
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
                placeholder: "Search purchased ideas...",
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

export default MyPurchasesTable;
