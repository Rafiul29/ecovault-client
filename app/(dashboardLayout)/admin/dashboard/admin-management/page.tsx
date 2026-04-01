import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getAllAdmins } from "@/services/admin.service";
import AdminTable from "@/components/modules/Admin/AdminManagement/AdminTable";
import { Download, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

const AdminManagementPage = async () => {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ["admins"],
        queryFn: () => getAllAdmins(),
        staleTime: 1000 * 60,
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <div className="space-y-12">
                <div className="flex flex-col justify-between gap-6 border-b pb-8 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 font-sans">System Administrators</h1>
                        <p className="mt-2 text-lg text-neutral-500 font-medium tracking-tight">
                            Manage your ecosystem's administrators, update roles, and control access permissions.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <Button variant="outline" className="rounded-2xl px-6 h-12 font-bold shadow-sm">
                            <Download className="mr-2 h-4 w-4" />
                            Export Data
                        </Button>
                        <Button className="rounded-2xl bg-emerald-600 px-6 h-12 font-bold text-white shadow-lg shadow-emerald-100/50 hover:bg-emerald-700 transition-all border-none">
                            <UserPlus className="mr-2 h-4 w-4" />
                            Add Admin
                        </Button>
                    </div>
                </div>

                <div className="overflow-hidden rounded-[2.5rem] bg-white p-6 shadow-sm border border-neutral-100/60 relative">
                    <AdminTable />
                </div>
            </div>
        </HydrationBoundary>
    );
}

export default AdminManagementPage;
