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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllModerators } from "@/services/moderator.service";
import { moderatorColumns } from "./moderatorColumns";
import { toast } from "sonner";
import { UserCog, ShieldCheck, ShieldOff, Shield, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { changeUserRole, changeUserStatus } from "@/services/admin.service";
import { Role } from "@/types/enums";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuLabel, 
    DropdownMenuSeparator, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { PaginationMeta } from "@/types/api.types";
import { useRowActionModalState } from "@/hooks/useRowActionModalState";
import DeleteModeratorConfirmationDialog from "./DeleteModeratorConfirmationDialog";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MODERATOR_FILTER_DEFINITIONS = [
    serverManagedFilter.single("status"),
];

const ModeratorTable = ({ initialQueryString }: { initialQueryString: string }) => {
    const queryClient = useQueryClient();
    const searchParams = useSearchParams();

    const {
        deletingItem,
        isDeleteDialogOpen,
        onDeleteOpenChange,
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
        definitions: MODERATOR_FILTER_DEFINITIONS,
        updateParams,
    });

    const { data: moderatorsResponse, isLoading, isFetching } = useQuery({
        queryKey: ["moderators", queryString],
        queryFn: () => getAllModerators(queryString),
    });

    const moderators = Array.isArray(moderatorsResponse?.data) ? moderatorsResponse.data : [];
    const meta: PaginationMeta | undefined = moderatorsResponse?.meta;

    const statusMutation = useMutation({
        mutationFn: (payload: { userId: string; userStatus: string }) => changeUserStatus(payload),
        onSuccess: () => {
            toast.success("Account status successfully updated")
            queryClient.invalidateQueries({ queryKey: ["moderators"] })
        }
    });

    const roleMutation = useMutation({
        mutationFn: (payload: { userId: string; role: string }) => changeUserRole(payload),
        onSuccess: () => {
            toast.success("Moderator role successfully changed")
            queryClient.invalidateQueries({ queryKey: ["moderators"] })
        }
    });

    const filterConfigs = useMemo<DataTableFilterConfig[]>(() => {
        return [
            {
                id: "status",
                label: "Account Access",
                type: "single-select",
                options: [
                    { label: "Active Admins", value: "ACTIVE" },
                    { label: "Blocked Access", value: "BLOCKED" },
                ],
            },
        ];
    }, []);

    const filterValuesForTable = useMemo<DataTableFilterValues>(() => {
        return {
            status: filterValues.status,
        };
    }, [filterValues]);

    return (
        <>
            <DataTable
                data={moderators}
                columns={[
                    ...moderatorColumns,
                    {
                        id: "quick-actions",
                        header: "Quick Control",
                        cell: ({ row }) => {
                            const moderator = row.original;
                            const isActive = moderator.user?.status === "ACTIVE";
                            
                            return (
                                <div className="flex items-center gap-2">
                                    <Button
                                        size="icon"
                                        variant="secondary"
                                        className={`h-9 w-9 rounded-xl transition-all shadow-sm ${isActive ? 'bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white'}`}
                                        onClick={() => {
                                            const newStatus = isActive ? "BLOCKED" : "ACTIVE";
                                            statusMutation.mutate({ userId: moderator.userId, userStatus: newStatus });
                                        }}
                                        title={isActive ? "Block Admin" : "Authorize Admin"}
                                    >
                                        {isActive ? <ShieldOff className="h-4.5 w-4.5" /> : <ShieldCheck className="h-4.5 w-4.5" />}
                                    </Button>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button size="icon" variant="secondary" className="h-9 w-9 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white shadow-sm transition-all group" title="Modify Permissions">
                                                <UserCog className="h-4.5 w-4.5 group-hover:rotate-45 duration-300" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="rounded-[1.5rem] border-neutral-100 shadow-2xl overflow-hidden font-bold min-w-[200px] p-2">
                                            <DropdownMenuLabel className="text-[10px] uppercase font-black tracking-widest text-neutral-400 p-3 italic">System Privilege</DropdownMenuLabel>
                                            <DropdownMenuSeparator className="bg-neutral-50 mb-1" />
                                            <DropdownMenuItem className="p-3 rounded-xl focus:bg-emerald-50 focus:text-emerald-700 cursor-pointer text-sm" onClick={() => roleMutation.mutate({ userId: moderator.userId, role: Role.ADMIN })}>
                                                <Shield className="h-4 w-4 mr-3 text-emerald-500" /> Standard Admin
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="p-3 rounded-xl focus:bg-indigo-50 focus:text-indigo-700 cursor-pointer text-sm" onClick={() => roleMutation.mutate({ userId: moderator.userId, role: Role.MODERATOR })}>
                                                <ShieldCheck className="h-4 w-4 mr-3 text-indigo-500" /> Dedicated Moderator
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="p-3 rounded-xl focus:bg-amber-50 focus:text-amber-700 cursor-pointer text-sm" onClick={() => roleMutation.mutate({ userId: moderator.userId, role: Role.MEMBER })}>
                                                <ShieldOff className="h-4 w-4 mr-3 text-amber-500" /> Revoke to Member
                                            </DropdownMenuItem>
                                            
                                            <DropdownMenuSeparator className="bg-neutral-50 my-1" />
                                            <DropdownMenuItem className="p-3 rounded-xl focus:bg-rose-50 focus:text-rose-700 cursor-pointer text-sm text-rose-600" onClick={() => tableActions.onDelete?.(moderator)}>
                                                <Trash2 className="h-4 w-4 mr-3" /> Terminate Account
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            );
                        }
                    }
                ]}
                isLoading={isLoading || isFetching || isRouteRefreshPending}
                emptyMessage="No moderators matching these credentials."
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
                    placeholder: "Identify by name, email or status...",
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

            <DeleteModeratorConfirmationDialog
                open={isDeleteDialogOpen}
                onOpenChange={onDeleteOpenChange}
                moderator={deletingItem}
            />
        </>
    );
};

export default ModeratorTable;
