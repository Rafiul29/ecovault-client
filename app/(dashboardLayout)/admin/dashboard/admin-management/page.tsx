import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getAllAdmins } from "@/services/admin.service";
import AdminTable from "@/components/modules/Admin/AdminManagement/AdminTable";

const AdminManagementPage = async () => {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ["admins"],
        queryFn: () => getAllAdmins(),
        staleTime: 1000 * 60,
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black text-neutral-900 tracking-tight">System Administrators</h1>
                        <p className="text-sm font-medium text-neutral-500">
                            Manage your ecosystem's administrators, update roles, and control access permissions.
                        </p>
                    </div>
                </div>
                <AdminTable />
            </div>
        </HydrationBoundary>
    );
}

export default AdminManagementPage;
