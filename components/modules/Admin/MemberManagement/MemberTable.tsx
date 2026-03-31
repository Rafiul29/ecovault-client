"use client";

import DataTable from "@/components/shared/table/DataTable";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllMembers } from "@/services/member.service";
import { deleteUserAccount, changeUserStatus } from "@/services/admin.service";
import { memberColumns } from "./memberColumns";
import { toast } from "sonner";
import { UserX, ShieldAlert, ShieldCheck, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable";
import { useServerManagedDataTableSearch } from "@/hooks/useServerManagedDataTableSearch";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const MemberTable = ({ initialQueryString }: { initialQueryString: string }) => {
    const queryClient = useQueryClient();
    const router = useRouter();
    const searchParams = useSearchParams();

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

    const { data: membersResponse, isLoading, isFetching } = useQuery({
        queryKey: ["members", queryString],
        queryFn: () => getAllMembers(queryString),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteUserAccount(id),
        onSuccess: () => {
            toast.success("User account soft-deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["members"] });
        },
        onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to delete user account")
    });

    const statusMutation = useMutation({
        mutationFn: (payload: { userId: string; userStatus: string }) => changeUserStatus(payload),
        onSuccess: () => {
            toast.success("User status changed successfully");
            queryClient.invalidateQueries({ queryKey: ["members"] });
        }
    });

    const members = Array.isArray(membersResponse?.data) ? membersResponse.data : [];
    const meta = membersResponse?.meta;

    return (
        <DataTable
            data={members}
            columns={[
                ...memberColumns,
                {
                    id: "admin-actions",
                    header: "Administration",
                    cell: ({ row }) => {
                        const member = row.original;
                        const isBlocked = member.status === "BLOCKED";
                        
                        return (
                            <div className="flex items-center gap-2">
                                <Button
                                    size="icon"
                                    variant="secondary"
                                    className="h-9 w-9 rounded-xl bg-neutral-100 hover:bg-neutral-200 transition-all shadow-sm"
                                    onClick={() => router.push(`/admin/dashboard/member-management/view/${member.id}`)}
                                    title="View Profile"
                                >
                                    <Eye className="h-4.5 w-4.5" />
                                </Button>
                                
                                <Button
                                    size="icon"
                                    variant="secondary"
                                    className={`h-9 w-9 rounded-xl shadow-sm transition-all ${isBlocked ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 'bg-amber-50 text-amber-600 hover:bg-amber-100'}`}
                                    onClick={() => {
                                        const newStatus = isBlocked ? "ACTIVE" : "BLOCKED";
                                        statusMutation.mutate({ userId: member.id, userStatus: newStatus });
                                    }}
                                    title={isBlocked ? "Unblock Account" : "Block Account"}
                                >
                                    {isBlocked ? <ShieldCheck className="h-4.5 w-4.5" /> : <ShieldAlert className="h-4.5 w-4.5" />}
                                </Button>

                                <Button
                                    size="icon"
                                    variant="secondary"
                                    className="h-9 w-9 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white transition-all shadow-sm group"
                                    onClick={() => {
                                        if (confirm("Are you sure you want to SOFT-DELETE this user account?")) {
                                            deleteMutation.mutate(member.id);
                                        }
                                    }}
                                    title="Delete Account"
                                >
                                    <UserX className="h-4.5 w-4.5 group-hover:scale-110 duration-200" />
                                </Button>
                            </div>
                        );
                    }
                }
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
            meta={meta}
        />
    );
};

export default MemberTable;
