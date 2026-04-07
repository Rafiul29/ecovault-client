"use client";

import DataTable from "@/components/shared/table/DataTable";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllMembers } from "@/services/member.service";
import { deleteUserAccount } from "@/services/admin.service";
import { memberColumns } from "./memberColumns";
import { toast } from "sonner";
import { UserX, ShieldAlert, ShieldCheck, Eye, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable";
import { useServerManagedDataTableSearch } from "@/hooks/useServerManagedDataTableSearch";
import { useMutation } from "@tanstack/react-query";
import {
    serverManagedFilter,
    useServerManagedDataTableFilters,
} from "@/hooks/useServerManagedDataTableFilters";
import {
    DataTableFilterConfig,
    DataTableFilterValues,
} from "@/components/shared/table/DataTableFilters";
import { useMemo, useState } from "react";
import { UserStatus, Role } from "@/types/enums";
import ChangeUserStatusDialog from "@/components/modules/Admin/shared/ChangeUserStatusDialog";
import ChangeUserRoleDialog from "@/components/modules/Admin/shared/ChangeUserRoleDialog";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MEMBER_FILTER_DEFINITIONS = [serverManagedFilter.single("user.status")];

const MemberTable = ({ initialQueryString }: { initialQueryString: string }) => {
    const queryClient = useQueryClient();
    const router = useRouter();
    const searchParams = useSearchParams();

    // ── Modal state ───────────────────────────────────────────────────────────
    const [statusModal, setStatusModal] = useState<{
        open: boolean;
        user: any | null;
        targetStatus: UserStatus.ACTIVE | UserStatus.BLOCKED;
    }>({ open: false, user: null, targetStatus: UserStatus.BLOCKED });

    const [roleModal, setRoleModal] = useState<{
        open: boolean;
        user: any | null;
    }>({ open: false, user: null });

    const openStatusModal = (user: any) => {
        const isBlocked = user.status === UserStatus.BLOCKED;
        setStatusModal({
            open: true,
            user,
            targetStatus: isBlocked ? UserStatus.ACTIVE : UserStatus.BLOCKED,
        });
    };

    // ── Table / server state ──────────────────────────────────────────────────
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
            definitions: MEMBER_FILTER_DEFINITIONS,
            updateParams,
        });

    const { data: membersResponse, isLoading, isFetching } = useQuery({
        queryKey: ["members", queryString],
        queryFn: () => getAllMembers(queryString),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteUserAccount(id),
        onSuccess: () => {
            toast.success("Member account deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["members"] });
        },
        onError: (err: any) =>
            toast.error(err?.response?.data?.message || "Failed to delete member account"),
    });

    const members = Array.isArray(membersResponse?.data) ? membersResponse.data : [];
    const meta = membersResponse?.meta;

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
                data={members}
                columns={[
                    ...memberColumns,
                    {
                        id: "admin-actions",
                        header: "Administration",
                        cell: ({ row }) => {
                            const member = row.original;
                            const isBlocked = member.status === UserStatus.BLOCKED;

                            return (
                                <div className="flex items-center gap-2">
                                    {/* View Profile */}
                                    <Button
                                        size="icon"
                                        variant="secondary"
                                        className="h-9 w-9 rounded-xl bg-neutral-100 hover:bg-neutral-200 transition-all shadow-sm"
                                        onClick={() =>
                                            router.push(
                                                `/admin/dashboard/member-management/view/${member.id}`
                                            )
                                        }
                                        title="View Profile"
                                    >
                                        <Eye className="h-4.5 w-4.5" />
                                    </Button>

                                    {/* Block / Unblock → opens modal */}
                                    <Button
                                        size="icon"
                                        variant="secondary"
                                        className={`h-9 w-9 rounded-xl shadow-sm transition-all ${isBlocked
                                            ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                                            : "bg-amber-50 text-amber-600 hover:bg-amber-100"
                                            }`}
                                        onClick={() => openStatusModal(member)}
                                        title={isBlocked ? "Activate Account" : "Block Account"}
                                    >
                                        {isBlocked ? (
                                            <ShieldCheck className="h-4.5 w-4.5" />
                                        ) : (
                                            <ShieldAlert className="h-4.5 w-4.5" />
                                        )}
                                    </Button>

                                    {/* Change Role → opens modal */}
                                    <Button
                                        size="icon"
                                        variant="secondary"
                                        className="h-9 w-9 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 shadow-sm transition-all"
                                        onClick={() => setRoleModal({ open: true, user: member })}
                                        title="Change Role"
                                    >
                                        <UserCog className="h-4.5 w-4.5" />
                                    </Button>

                                    {/* Delete Account */}
                                    <Button
                                        size="icon"
                                        variant="secondary"
                                        className="h-9 w-9 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white transition-all shadow-sm group"
                                        onClick={() => {
                                            if (
                                                confirm(
                                                    "Are you sure you want to delete this member account?"
                                                )
                                            ) {
                                                deleteMutation.mutate(member.id);
                                            }
                                        }}
                                        title="Delete Account"
                                    >
                                        <UserX className="h-4.5 w-4.5 group-hover:scale-110 duration-200" />
                                    </Button>
                                </div>
                            );
                        },
                    },
                ]}
                isLoading={isLoading || isFetching || isRouteRefreshPending}
                emptyMessage="No members found."
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
                    placeholder: "Search members by name or email...",
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

            {/* Status change modal */}
            <ChangeUserStatusDialog
                open={statusModal.open}
                onOpenChange={(open: boolean) =>
                    setStatusModal((prev) => ({ ...prev, open }))
                }
                user={statusModal.user}
                targetStatus={statusModal.targetStatus}
                queryKey="members"
            />

            {/* Role change modal — Members can only be promoted to MODERATOR */}
            <ChangeUserRoleDialog
                open={roleModal.open}
                onOpenChange={(open: boolean) =>
                    setRoleModal((prev) => ({ ...prev, open }))
                }
                user={roleModal.user}
                allowedRoles={[Role.MEMBER, Role.MODERATOR]}
                queryKey="members"
            />
        </>
    );
};

export default MemberTable;
