"use client";

import DataTable from "@/components/shared/table/DataTable";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllAdmins, deleteAdmin, changeUserStatus } from "@/services/admin.service";
import { adminColumns } from "./adminColumns";
import { toast } from "sonner";
import { UserX, UserCheck, ShieldOff } from "lucide-react";
import { Button } from "@/components/ui/button";

const AdminTable = () => {
    const queryClient = useQueryClient();
    const { data: adminsResponse, isLoading, isFetching } = useQuery({
        queryKey: ["admins"],
        queryFn: () => getAllAdmins(),
    });

    const admins = Array.isArray(adminsResponse?.data) ? adminsResponse.data : [];

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteAdmin(id),
        onSuccess: () => {
            toast.success("Admin account deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["admins"] });
        },
        onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to delete admin")
    });

    const statusMutation = useMutation({
        mutationFn: (payload: { userId: string; userStatus: string }) => changeUserStatus(payload),
        onSuccess: () => {
            toast.success("User status updated");
            queryClient.invalidateQueries({ queryKey: ["admins"] });
        }
    });

    return (
        <DataTable
            data={admins}
            columns={[
                ...adminColumns,
                {
                    id: "actions",
                    header: "Actions",
                    cell: ({ row }) => {
                        const admin = row.original;
                        const isSuperAdmin = admin.user?.role === "SUPER_ADMIN";
                        
                        return (
                            <div className="flex items-center gap-2">
                                <Button
                                    size="icon"
                                    variant="secondary"
                                    className="h-8 w-8 rounded-lg bg-neutral-100 hover:bg-rose-100 hover:text-rose-600 transition-colors"
                                    onClick={() => {
                                        if (confirm("Are you sure you want to delete this administrator?")) {
                                            deleteMutation.mutate(admin.id);
                                        }
                                    }}
                                    disabled={isSuperAdmin}
                                >
                                    <UserX className="h-4 w-4" />
                                </Button>
                                
                                <Button
                                    size="icon"
                                    variant="secondary"
                                    className={`h-8 w-8 rounded-lg bg-neutral-100 hover:bg-emerald-100 hover:text-emerald-700 transition-colors ${admin.user?.status === 'ACTIVE' ? '' : 'text-neutral-400'}`}
                                    onClick={() => {
                                        const newStatus = admin.user?.status === "ACTIVE" ? "BLOCKED" : "ACTIVE";
                                        statusMutation.mutate({ userId: admin.userId, userStatus: newStatus });
                                    }}
                                >
                                    {admin.user?.status === "ACTIVE" ? <UserCheck className="h-4 w-4" /> : <ShieldOff className="h-4 w-4" />}
                                </Button>
                            </div>
                        );
                    }
                }
            ]}
            isLoading={isLoading || isFetching}
            emptyMessage="No administrators found."
            search={{
                placeholder: "Search administrators...",
                onDebouncedChange: () => {}, // Simple for now as admins don't use server search yet
            }}
        />
    );
};

export default AdminTable;
