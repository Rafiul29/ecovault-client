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
import { getCategories } from "@/services/category.service.";
import { PaginationMeta } from "@/types/api.types";
import { ICategory } from "@/types/category";
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import CreateCategoryFormModal from "./CreateCategoryFormModal";
import EditCategoryFormModal from "./EditCategoryFormModal";
import DeleteCategoryConfirmationDialog from "./DeleteCategoryConfirmationDialog";
import { categoryColumns } from "./categoryColumns";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const CATEGORY_FILTER_DEFINITIONS = [
    serverManagedFilter.single("isActive"),
];

const CategoryTable = ({ initialQueryString }: { initialQueryString: string }) => {
    const searchParams = useSearchParams();
    const {
        editingItem,
        deletingItem,
        isEditModalOpen,
        isDeleteDialogOpen,
        onEditOpenChange,
        onDeleteOpenChange,
        tableActions,
    } = useRowActionModalState<ICategory>();

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
        definitions: CATEGORY_FILTER_DEFINITIONS,
        updateParams,
    });

    const { data: categoryDataResponse, isLoading, isFetching } = useQuery({
        queryKey: ["categories", queryString],
        queryFn: () => getCategories(queryString)
    });

    const categories = categoryDataResponse?.data ?? [];
    const meta: PaginationMeta | undefined = categoryDataResponse?.meta;

    const filterConfigs = useMemo<DataTableFilterConfig[]>(() => {
        return [
            {
                id: "isActive",
                label: "Status",
                type: "single-select",
                options: [
                    { label: "Active", value: "true" },
                    { label: "Inactive", value: "false" },
                ],
            },
        ];
    }, []);

    const filterValuesForTable = useMemo<DataTableFilterValues>(() => {
        return {
            isActive: filterValues.isActive,
        };
    }, [filterValues]);

    return (
        <>
            <DataTable
                data={categories}
                columns={categoryColumns}
                isLoading={isLoading || isFetching || isRouteRefreshPending}
                emptyMessage="No categories found."
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
                    placeholder: "Search categories by name...",
                    debounceMs: 700,
                    onDebouncedChange: handleDebouncedSearchChange,
                }}
                filters={{
                    configs: filterConfigs,
                    values: filterValuesForTable,
                    onFilterChange: handleFilterChange,
                    onClearAll: clearAllFilters,
                }}
                toolbarAction={<CreateCategoryFormModal />}
                meta={meta}
                actions={tableActions}
            />

            <EditCategoryFormModal
                open={isEditModalOpen}
                onOpenChange={onEditOpenChange}
                category={editingItem}
            />

            <DeleteCategoryConfirmationDialog
                open={isDeleteDialogOpen}
                onOpenChange={onDeleteOpenChange}
                category={deletingItem}
            />
        </>
    )

}
export default CategoryTable
