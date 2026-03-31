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
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable";
import { useQuery } from "@tanstack/react-query";
import { getAllPurchases } from "@/services/payment.service";
import { paymentColumns } from "./paymentColumns";
import { FileText, Eye, Printer, History, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { PaginationMeta } from "@/types/api.types";
import { useRowActionModalState } from "@/hooks/useRowActionModalState";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const PAYMENT_FILTER_DEFINITIONS = [
    serverManagedFilter.single("status"),
    serverManagedFilter.single("paymentMethod"),
];

const PaymentTable = ({ initialQueryString }: { initialQueryString: string }) => {
    const searchParams = useSearchParams();
    const {
        viewingItem,
        isViewDialogOpen,
        onViewOpenChange,
        tableActions,
    } = useRowActionModalState<any>();

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
        definitions: PAYMENT_FILTER_DEFINITIONS,
        updateParams,
    });

    const { data: paymentsResponse, isLoading, isFetching } = useQuery({
        queryKey: ["payments", queryString],
        queryFn: () => getAllPurchases(queryString),
    });

    const payments = Array.isArray(paymentsResponse?.data) ? paymentsResponse.data : [];
    const meta: PaginationMeta | undefined = paymentsResponse?.meta;

    const filterConfigs = useMemo<DataTableFilterConfig[]>(() => {
        return [
            {
                id: "status",
                label: "Settlement Status",
                type: "single-select",
                options: [
                    { label: "Pending Verification", value: "PENDING" },
                    { label: "Successful Payment", value: "COMPLETED" },
                    { label: "Failed Transaction", value: "FAILED" },
                    { label: "Refund Processed", value: "REFUNDED" },
                ],
            },
            {
                id: "paymentMethod",
                label: "Payment Gateway",
                type: "single-select",
                options: [
                    { label: "Stripe Checkout", value: "STRIPE" },
                    { label: "Mobile Wallet (bKash)", value: "bkash" },
                    { label: "EcoVault Wallet", value: "ECOVAULT_FUNDS" },
                ],
            },
        ];
    }, []);

    const filterValuesForTable = useMemo<DataTableFilterValues>(() => {
        return {
            status: filterValues.status,
            paymentMethod: filterValues.paymentMethod,
        };
    }, [filterValues]);

    return (
        <DataTable
            data={payments}
            columns={[
                ...paymentColumns,
                {
                    id: "management-controls",
                    header: "System Control",
                    cell: ({ row }) => {
                        const purchase = row.original;
                        return (
                            <div className="flex items-center gap-2">
                                <Button
                                    size="icon"
                                    variant="secondary"
                                    className="h-9 w-9 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition-all shadow-sm border border-neutral-200/50"
                                    onClick={() => window.open(`/admin/dashboard/idea-management/view/${purchase.ideaId}`, '_blank')}
                                    title="View Product Details"
                                >
                                    <ExternalLink className="h-4 w-4" />
                                </Button>

                                <Button
                                    size="icon"
                                    variant="secondary"
                                    className="h-9 w-9 rounded-xl bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-600 transition-all shadow-sm border border-indigo-100 group"
                                    onClick={() => tableActions.onView?.(purchase)}
                                    title="Audit Transaction Logs"
                                >
                                    <History className="h-4.5 w-4.5 group-hover:rotate-12 duration-200" />
                                </Button>
                            </div>
                        );
                    }
                }
            ]}
            isLoading={isLoading || isFetching || isRouteRefreshPending}
            emptyMessage="No financial settlements matched your criteria."
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
                placeholder: "Audit by payment ID, member, or product title...",
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

export default PaymentTable;
