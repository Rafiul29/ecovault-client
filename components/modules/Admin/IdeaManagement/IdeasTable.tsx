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
import { getIdeas } from "@/services/idea.services";
import { getCategories } from "@/services/category.service.";
import { PaginationMeta } from "@/types/api.types";
import { IIdea } from "@/types/idea.types";
import { ICategory } from "@/types/category";
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import DeleteIdeaConfirmationDialog from "./DeleteIdeaConfirmationDialog";
import ViewIdeaDialog from "./ViewIdeas";
import { ideaColumns } from "./ideasColumns";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const CATEGORIES_FILTER_KEY = "categories.category.name";
const IDEA_FILTER_DEFINITIONS = [
    serverManagedFilter.single("status"),
    serverManagedFilter.multi(CATEGORIES_FILTER_KEY),
    serverManagedFilter.single("isPaid"),
    serverManagedFilter.single("isFeatured"),
];


const IdeasTable = ({ initialQueryString }: { initialQueryString: string }) => {
    const searchParams = useSearchParams();
    const {
        viewingItem,
        editingItem,
        deletingItem,
        isViewDialogOpen,
        isEditModalOpen,
        isDeleteDialogOpen,
        onViewOpenChange,
        onEditOpenChange,
        onDeleteOpenChange,
        tableActions,
    } = useRowActionModalState<IIdea>();

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
        definitions: IDEA_FILTER_DEFINITIONS,
        updateParams,
    });

    const { data: ideaDataResponse, isLoading, isFetching } = useQuery({
        queryKey: ["ideas", queryString],
        queryFn: () => getIdeas(queryString)
    });

    const router = useRouter();

    const { data: categoriesResponse, isLoading: isLoadingCategories } = useQuery({
        queryKey: ["categories"],
        queryFn: () => getCategories(),
        staleTime: 1000 * 60 * 60 * 6,
        gcTime: 1000 * 60 * 60 * 24,
    });

    const ideas = ideaDataResponse?.data ?? [];
    const categories = useMemo<ICategory[]>(() => {
        return categoriesResponse?.data ?? [];
    }, [categoriesResponse]);
    const meta: PaginationMeta | undefined = ideaDataResponse?.meta;

    const filterConfigs = useMemo<DataTableFilterConfig[]>(() => {
        return [
            {
                id: "status",
                label: "Status",
                type: "single-select",
                options: [
                    { label: "Draft", value: "DRAFT" },
                    { label: "Under Review", value: "UNDER_REVIEW" },
                    { label: "Approved", value: "APPROVED" },
                    { label: "Rejected", value: "REJECTED" },
                ],
            },
            {
                id: CATEGORIES_FILTER_KEY,
                label: "Categories",
                type: "multi-select",
                options: categories.map((cat) => ({
                    label: cat.name,
                    value: cat.name,
                })),
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
            {
                id: "isFeatured",
                label: "Featured",
                type: "single-select",
                options: [
                    { label: "Yes", value: "true" },
                    { label: "No", value: "false" },
                ],
            },
        ];
    }, [categories]);

    const filterValuesForTable = useMemo<DataTableFilterValues>(() => {
        return {
            status: filterValues.status,
            [CATEGORIES_FILTER_KEY]: filterValues[CATEGORIES_FILTER_KEY],
            isPaid: filterValues.isPaid,
            isFeatured: filterValues.isFeatured,
        };
    }, [filterValues]);

    return (
        <>
            <DataTable
                data={ideas}
                columns={ideaColumns}
                isLoading={isLoading || isFetching || isRouteRefreshPending}
                emptyMessage="No ideas found."
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
                    placeholder: "Search ideas by title, description...",
                    debounceMs: 700,
                    onDebouncedChange: handleDebouncedSearchChange,
                }}
                filters={{
                    configs: filterConfigs,
                    values: filterValuesForTable,
                    onFilterChange: handleFilterChange,
                    onClearAll: clearAllFilters,
                }}
                toolbarAction={
                    <Link href="/admin/dashboard/idea-management/create">
                        <Button className="h-11 rounded-xl px-6 font-bold shadow-xl shadow-emerald-500/20 bg-emerald-600 hover:bg-emerald-700">
                            <Plus className="mr-2 h-4 w-4" />
                            Submit Idea
                        </Button>
                    </Link>
                }
                meta={meta}
                actions={{
                    ...tableActions,
                    onEdit: (idea) => router.push(`/admin/dashboard/idea-management/edit/${idea.id}`),
                    onView: (idea) => router.push(`/admin/dashboard/idea-management/view/${idea.id}`),
                }}
            />

            <DeleteIdeaConfirmationDialog
                open={isDeleteDialogOpen}
                onOpenChange={onDeleteOpenChange}
                idea={deletingItem}
            />

            {/* <ViewIdeaDialog
                open={isViewDialogOpen}
                onOpenChange={onViewOpenChange}
                idea={viewingItem}
            /> */}
        </>
    )

}
export default IdeasTable