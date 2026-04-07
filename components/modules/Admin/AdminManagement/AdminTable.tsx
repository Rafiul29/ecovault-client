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
import { getAllAdmins, deleteAdmin } from "@/services/admin.service";
import { adminColumns } from "./adminColumns";
import { toast } from "sonner";
import { UserX, ShieldCheck, ShieldOff, UserCog, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { UserStatus, Role } from "@/types/enums";
import ChangeUserStatusDialog from "@/components/modules/Admin/shared/ChangeUserStatusDialog";
import ChangeUserRoleDialog from "@/components/modules/Admin/shared/ChangeUserRoleDialog";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const ADMIN_FILTER_DEFINITIONS = [serverManagedFilter.single("user.status")];

const AdminTable = ({ initialQueryString }: { initialQueryString: string }) => {
    const queryClient = useQueryClient();
    const searchParams = useSearchParams();
    const router = useRouter();

    // ── Modal state ───────────────────────────────────────────────────────────
    const [statusModal, setStatusModal] = useState<{
        open: boolean;
        user: any | null;
        targetStatus: UserStatus.ACTIVE | UserStatus.BLOCKED;
    }>({ open: false, user: null, targetStatus: UserStatus.BLOCKED });

    const openStatusModal = (admin: any) => {
        const isActive = admin.user?.status === UserStatus.ACTIVE;
        setStatusModal({
            open: true,
            user: admin,
            targetStatus: isActive ? UserStatus.BLOCKED : UserStatus.ACTIVE,
        });
    };

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
            definitions: ADMIN_FILTER_DEFINITIONS,
            updateParams,
        });

    const { data: adminsResponse, isLoading, isFetching } = useQuery({
        queryKey: ["admins", queryString],
        queryFn: () => getAllAdmins(queryString),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteAdmin(id),
        onSuccess: () => {
            toast.success("Admin account deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["admins"] });
        },
        onError: (err: any) =>
            toast.error(err?.response?.data?.message || "Failed to delete admin"),
    });

    const admins = Array.isArray(adminsResponse?.data) ? adminsResponse.data : [];
    const meta = adminsResponse?.meta;

    const filterConfigs = useMemo<DataTableFilterConfig[]>(
        () => [
            {
                id: "user.status",
                label: "Account Status",
                type: "single-select",
                options: [
                    { label: "Active", value: "ACTIVE" },
                    { label: "Blocked", value: "BLOCKED" },
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
                data={admins}
                columns={[
                    ...adminColumns,
                    {
                        id: "actions",
                        header: "Administration",
                        cell: ({ row }) => {
                            const admin = row.original;
                            const isSuperAdmin = admin.user?.role === Role.SUPER_ADMIN;
                            const isActive = admin.user?.status === UserStatus.ACTIVE;

                            return (
                                <div className="flex items-center gap-2">
                                    {/* View Profile */}
                                    {/* <Button
                                        size="icon"
                                        variant="secondary"
                                        className="h-9 w-9 rounded-xl bg-neutral-100 hover:bg-neutral-200 transition-all shadow-sm"
                                        onClick={() =>
                                            router.push(
                                                `/admin/dashboard/admin-management/view/${admin.id}`
                                            )
                                        }
                                        title="View Profile"
                                    >
                                        <Eye className="h-4.5 w-4.5" />
                                    </Button> */}

                                    {/* Block / Unblock */}
                                    <Button
                                        size="icon"
                                        variant="secondary"
                                        className={`h-9 w-9 rounded-xl shadow-sm transition-all ${isActive
                                            ? "bg-amber-50 text-amber-600 hover:bg-amber-100"
                                            : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                                            }`}
                                        onClick={() => openStatusModal(admin)}
                                        title={isActive ? "Block Account" : "Activate Account"}
                                        disabled={isSuperAdmin}
                                    >
                                        {isActive ? (
                                            <ShieldOff className="h-4.5 w-4.5" />
                                        ) : (
                                            <ShieldCheck className="h-4.5 w-4.5" />
                                        )}
                                    </Button>

                                    {/* Change Role */}
                                    <Button
                                        size="icon"
                                        variant="secondary"
                                        className="h-9 w-9 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 shadow-sm transition-all"
                                        onClick={() => setRoleModal({ open: true, user: admin })}
                                        title="Change Role"
                                        disabled={isSuperAdmin}
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
                                                    "Are you sure you want to delete this administrator?"
                                                )
                                            ) {
                                                deleteMutation.mutate(admin.id);
                                            }
                                        }}
                                        title="Delete Account"
                                        disabled={isSuperAdmin}
                                    >
                                        <UserX className="h-4.5 w-4.5 group-hover:scale-110 duration-200" />
                                    </Button>
                                </div>
                            );
                        },
                    },
                ]}
                isLoading={isLoading || isFetching || isRouteRefreshPending}
                emptyMessage="No administrators found."
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
                    placeholder: "Search admins by name or email...",
                    debounceMs: 700,
                    onDebouncedChange: handleDebouncedSearchChange,
                }}
                // filters={{
                //     configs: filterConfigs,
                //     values: filterValuesForTable,
                //     onFilterChange: handleFilterChange,
                //     onClearAll: clearAllFilters,
                // }}
                meta={meta}
            />

            {/* Status change modal */}
            <ChangeUserStatusDialog
                open={statusModal.open}
                onOpenChange={(open) => setStatusModal((prev) => ({ ...prev, open }))}
                user={statusModal.user}
                targetStatus={statusModal.targetStatus}
                queryKey="admins"
            />

            {/* Role change modal — Admins can be promoted to SUPER_ADMIN or demoted to MODERATOR */}
            <ChangeUserRoleDialog
                open={roleModal.open}
                onOpenChange={(open) => setRoleModal((prev) => ({ ...prev, open }))}
                user={roleModal.user}
                allowedRoles={[Role.MODERATOR, Role.ADMIN, Role.SUPER_ADMIN]}
                queryKey="admins"
            />
        </>
    );
};

export default AdminTable;
