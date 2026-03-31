"use client";

import DataTable from "@/components/shared/table/DataTable";
import { useRowActionModalState } from "@/hooks/useRowActionModalState";
import { getTags } from "@/services/tag.service";
import { PaginationMeta } from "@/types/api.types";
import { ITag } from "@/types/tag.types";
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable";
import { useServerManagedDataTableSearch } from "@/hooks/useServerManagedDataTableSearch";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import CreateTagFormModal from "./CreateTagFormModal";
import EditTagFormModal from "./EditTagFormModal";
import DeleteTagConfirmationDialog from "./DeleteTagConfirmationDialog";
import { tagColumns } from "./tagColumns";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const TagTable = ({ initialQueryString }: { initialQueryString: string }) => {
    const searchParams = useSearchParams();
    const {
        editingItem,
        deletingItem,
        isEditModalOpen,
        isDeleteDialogOpen,
        onEditOpenChange,
        onDeleteOpenChange,
        tableActions,
    } = useRowActionModalState<ITag>();

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

    const { data: tagDataResponse, isLoading, isFetching } = useQuery({
        queryKey: ["tags", queryString],
        queryFn: () => getTags(queryString)
    });

    const tags = tagDataResponse?.data ?? [];
    const meta: PaginationMeta | undefined = tagDataResponse?.meta;

    return (
        <>
            <DataTable
                data={tags}
                columns={tagColumns}
                isLoading={isLoading || isFetching || isRouteRefreshPending}
                emptyMessage="No tags found."
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
                    placeholder: "Search tags by name...",
                    debounceMs: 700,
                    onDebouncedChange: handleDebouncedSearchChange,
                }}
                toolbarAction={<CreateTagFormModal />}
                meta={meta}
                actions={tableActions}
            />

            <EditTagFormModal
                open={isEditModalOpen}
                onOpenChange={onEditOpenChange}
                tag={editingItem}
            />

            <DeleteTagConfirmationDialog
                open={isDeleteDialogOpen}
                onOpenChange={onDeleteOpenChange}
                tag={deletingItem}
            />
        </>
    )

}
export default TagTable
