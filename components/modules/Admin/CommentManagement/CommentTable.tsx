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
import { getComments } from "@/services/comment.service";
import { PaginationMeta } from "@/types/api.types";
import { IComment } from "@/types/comment";
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import DeleteCommentConfirmationDialog from "./DeleteCommentConfirmationDialog";
import EditCommentFormModal from "./EditCommentFormModal";
import { commentColumns } from "./commentColumns";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const COMMENT_FILTER_DEFINITIONS = [
    serverManagedFilter.single("isFlagged"),
    serverManagedFilter.single("isDeleted"),
];

const CommentTable = ({ initialQueryString }: { initialQueryString: string }) => {
    const searchParams = useSearchParams();
    const {
        editingItem,
        deletingItem,
        isEditModalOpen,
        isDeleteDialogOpen,
        onEditOpenChange,
        onDeleteOpenChange,
        tableActions,
    } = useRowActionModalState<IComment>();

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
        definitions: COMMENT_FILTER_DEFINITIONS,
        updateParams,
    });

    const { data: commentDataResponse, isLoading, isFetching } = useQuery({
        queryKey: ["comments", queryString],
        queryFn: () => getComments(queryString)
    });

    const comments = commentDataResponse?.data?.data || [];

    const meta: PaginationMeta | undefined = commentDataResponse?.data?.meta;

    const filterConfigs = useMemo<DataTableFilterConfig[]>(() => {
        return [
            {
                id: "isFlagged",
                label: "Flags",
                type: "single-select",
                options: [
                    { label: "Flagged", value: "true" },
                    { label: "Normal", value: "false" },
                ],
            },
            {
                id: "isDeleted",
                label: "Status",
                type: "single-select",
                options: [
                    { label: "Deleted", value: "true" },
                    { label: "Active", value: "false" },
                ],
            },
        ];
    }, []);

    const filterValuesForTable = useMemo<DataTableFilterValues>(() => {
        return {
            isFlagged: filterValues.isFlagged,
            isDeleted: filterValues.isDeleted,
        };
    }, [filterValues]);

    return (
        <>
            <DataTable
                data={comments}
                columns={commentColumns}
                isLoading={isLoading || isFetching || isRouteRefreshPending}
                emptyMessage="No comments found."
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
                    placeholder: "Search comments by content...",
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
                actions={tableActions}
            />

            <EditCommentFormModal
                open={isEditModalOpen}
                onOpenChange={onEditOpenChange}
                comment={editingItem}
            />

            <DeleteCommentConfirmationDialog
                open={isDeleteDialogOpen}
                onOpenChange={onDeleteOpenChange}
                comment={deletingItem}
            />
        </>
    )

}
export default CommentTable
