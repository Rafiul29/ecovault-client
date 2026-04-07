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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllModerators } from "@/services/moderator.service";
import { deleteUserAccount } from "@/services/admin.service";
import { moderatorColumns } from "./moderatorColumns";
import { UserCog, ShieldCheck, ShieldOff, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Role, UserStatus } from "@/types/enums";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { PaginationMeta } from "@/types/api.types";
import { useRowActionModalState } from "@/hooks/useRowActionModalState";
import DeleteModeratorConfirmationDialog from "./DeleteModeratorConfirmationDialog";
import ChangeUserStatusDialog from "@/components/modules/Admin/shared/ChangeUserStatusDialog";
import ChangeUserRoleDialog from "@/components/modules/Admin/shared/ChangeUserRoleDialog";
import { useRouter } from "next/navigation";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MODERATOR_FILTER_DEFINITIONS = [serverManagedFilter.single("user.status")];

const ModeratorTable = ({ initialQueryString }: { initialQueryString: string }) => {
    const queryClient = useQueryClient();
    const searchParams = useSearchParams();
    const router = useRouter();

    // ── Delete modal (existing pattern) ──────────────────────────────────────
    const {
        deletingItem,
        isDeleteDialogOpen,
        onDeleteOpenChange,
        tableActions,
    } = useRowActionModalState<any>();

    // ── Status modal ──────────────────────────────────────────────────────────
    const [statusModal, setStatusModal] = useState<{
        open: boolean;
        user: any | null;
        targetStatus: UserStatus.ACTIVE | UserStatus.BLOCKED;
    }>({ open: false, user: null, targetStatus: UserStatus.BLOCKED });

    const openStatusModal = (moderator: any) => {
        const isActive = moderator.user?.status === UserStatus.ACTIVE;
        setStatusModal({
            open: true,
            user: moderator,
            targetStatus: isActive ? UserStatus.BLOCKED : UserStatus.ACTIVE,
        });
    };

    // ── Role modal ────────────────────────────────────────────────────────────
    const [roleModal, setRoleModal] = useState<{
        open: boolean;
        user: any | null;
    }>({ open: false, user: null });

    // ── Server-managed table state ────────────────────────────────────────────
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
            definitions: MODERATOR_FILTER_DEFINITIONS,
            updateParams,
        });

    const { data: moderatorsResponse, isLoading, isFetching } = useQuery({
        queryKey: ["moderators", queryString],
        queryFn: () => getAllModerators(queryString),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteUserAccount(id),
        onSuccess: () => {
            toast.success("Moderator account deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["moderators"] });
        },
        onError: (err: any) =>
            toast.error(err?.response?.data?.message || "Failed to delete moderator account"),
    });

    const moderators = Array.isArray(moderatorsResponse?.data)
        ? moderatorsResponse.data
        : [];
    const meta: PaginationMeta | undefined = moderatorsResponse?.meta;

    const filterConfigs = useMemo<DataTableFilterConfig[]>(
        () => [
            {
                id: "user.status",
                label: "Account Status",
                type: "single-select",
                options: [
                    { label: "Active", value: "ACTIVE" },
                    { label: "Blocked", value: "BLOCKED" },
                    { label: "Deleted", value: "DELETED" },
                ],
            },
        ],
        []
    );

    const filterValuesForTable = useMemo<DataTableFilterValues>(
        () => ({ "user.status": filterValues["user.status"] }),
        [filterValues]
    );

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
                            const isActive =
                                moderator.user?.status === UserStatus.ACTIVE;

                            return (
                                <div className="flex items-center gap-2">
                                    {/* View Profile */}
                                    <Button
                                        size="icon"
                                        variant="secondary"
                                        className="h-9 w-9 rounded-xl bg-neutral-100 hover:bg-neutral-200 transition-all shadow-sm"
                                        onClick={() =>
                                            router.push(
                                                `/admin/dashboard/moderator-management/view/${moderator.id}`
                                            )
                                        }
                                        title="View Profile"
                                    >
                                        <Eye className="h-4.5 w-4.5" />
                                    </Button>

                                    {/* Block / Activate → modal */}
                                    <Button
                                        size="icon"
                                        variant="secondary"
                                        className={`h-9 w-9 rounded-xl transition-all shadow-sm ${isActive
                                            ? "bg-amber-50 text-amber-600 hover:bg-amber-100"
                                            : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                                            }`}
                                        onClick={() => openStatusModal(moderator)}
                                        title={
                                            isActive
                                                ? "Block Moderator"
                                                : "Activate Moderator"
                                        }
                                    >
                                        {isActive ? (
                                            <ShieldOff className="h-4.5 w-4.5" />
                                        ) : (
                                            <ShieldCheck className="h-4.5 w-4.5" />
                                        )}
                                    </Button>

                                    {/* Change Role → modal */}
                                    <Button
                                        size="icon"
                                        variant="secondary"
                                        className="h-9 w-9 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 shadow-sm transition-all group"
                                        onClick={() =>
                                            setRoleModal({ open: true, user: moderator })
                                        }
                                        title="Change Role"
                                    >
                                        <UserCog className="h-4.5 w-4.5 group-hover:rotate-45 duration-300" />
                                    </Button>

                                    {/* Delete Account */}
                                    <Button
                                        size="icon"
                                        variant="secondary"
                                        className="h-9 w-9 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white transition-all shadow-sm group"
                                        onClick={() => {
                                            if (
                                                confirm(
                                                    "Are you sure you want to delete this moderator account?"
                                                )
                                            ) {
                                                deleteMutation.mutate(moderator.user?.id || moderator.userId);
                                            }
                                        }}
                                        title="Delete Account"
                                    >
                                        <Trash2 className="h-4.5 w-4.5 group-hover:scale-110 duration-200" />
                                    </Button>
                                </div>
                            );
                        },
                    },
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
            // actions={tableActions}
            />

            {/* Delete confirmation */}
            <DeleteModeratorConfirmationDialog
                open={isDeleteDialogOpen}
                onOpenChange={onDeleteOpenChange}
                moderator={deletingItem}
            />

            {/* Status change modal */}
            <ChangeUserStatusDialog
                open={statusModal.open}
                onOpenChange={(open) =>
                    setStatusModal((prev) => ({ ...prev, open }))
                }
                user={statusModal.user}
                targetStatus={statusModal.targetStatus}
                queryKey="moderators"
            />

            {/* Role change modal — Moderators can be MEMBER, MODERATOR, or ADMIN */}
            <ChangeUserRoleDialog
                open={roleModal.open}
                onOpenChange={(open) => setRoleModal((prev) => ({ ...prev, open }))}
                user={roleModal.user}
                allowedRoles={[Role.MEMBER, Role.MODERATOR, Role.ADMIN]}
                queryKey="moderators"
            />
        </>
    );
};

export default ModeratorTable;
