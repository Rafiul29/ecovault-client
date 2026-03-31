"use client";

import DataTable from "@/components/shared/table/DataTable";
import {
    DataTableFilterConfig,
    DataTableFilterValues,
} from "@/components/shared/table/DataTableFilters";
import {
    serverManagedFilter,
    useServerManagedDataTableFilters,
} from "@/hooks/useServerManagedDataTableFilters";
import { useServerManagedDataTableSearch } from "@/hooks/useServerManagedDataTableSearch";
import { useRowActionModalState } from "@/hooks/useRowActionModalState";
import { getAllSubscriptions } from "@/services/subscription.service";
import { PaginationMeta } from "@/types/api.types";
import { ISubscription } from "@/types/subscription";
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { subscriptionColumns } from "./subscriptionColumns";
import ViewSubscriptionModal from "./ViewSubscriptionModal";
import { SubscriptionTier } from "@/types/enums";
import { Eye } from "lucide-react";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const SUBSCRIPTION_FILTER_DEFINITIONS = [
    serverManagedFilter.single("tier"),
    serverManagedFilter.single("isActive"),
];

const SubscriptionTable = ({ initialQueryString }: { initialQueryString: string }) => {
    const searchParams = useSearchParams();
    const {
        editingItem,
        isEditModalOpen,
        onEditOpenChange,
        tableActions,
    } = useRowActionModalState<ISubscription>();

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
        definitions: SUBSCRIPTION_FILTER_DEFINITIONS,
        updateParams,
    });

    const { data: subscriptionDataResponse, isLoading, isFetching } = useQuery({
        queryKey: ["subscriptions", queryString],
        queryFn: () => getAllSubscriptions(queryString)
    });

    // Based on Comment implementation, it's nested
    const subscriptions = subscriptionDataResponse?.data?.data || [];
    const meta: PaginationMeta | undefined = subscriptionDataResponse?.data?.meta;

    const filterConfigs = useMemo<DataTableFilterConfig[]>(() => {
        return [
            {
                id: "tier",
                label: "Tier Level",
                type: "single-select",
                options: Object.values(SubscriptionTier).map(t => ({ label: t, value: t })),
            },
            {
                id: "isActive",
                label: "Access Status",
                type: "single-select",
                options: [
                    { label: "Active", value: "true" },
                    { label: "Revoked", value: "false" },
                ],
            },
        ];
    }, []);

    const filterValuesForTable = useMemo<DataTableFilterValues>(() => {
        return {
            tier: filterValues.tier,
            isActive: filterValues.isActive,
        };
    }, [filterValues]);

    return (
        <>
            <DataTable
                data={subscriptions}
                columns={[
                    ...subscriptionColumns,
                    {
                        id: "actions",
                        header: "Inspection",
                        cell: ({ row }) => (
                            <button
                                onClick={() => tableActions.onEdit?.(row.original)}
                                className="h-9 w-9 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-600 hover:bg-neutral-900 hover:text-white transition-all shadow-sm"
                                title="View Record"
                            >
                                <Eye className="h-4 w-4" />
                            </button>
                        ),
                    },
                ]}
                isLoading={isLoading || isFetching || isRouteRefreshPending}
                emptyMessage="No subscription records found in registry."
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
                    placeholder: "Identify subscriber or plan...",
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

            <ViewSubscriptionModal
                open={isEditModalOpen}
                onOpenChange={onEditOpenChange}
                subscription={editingItem}
            />
        </>
    )

}
export default SubscriptionTable
