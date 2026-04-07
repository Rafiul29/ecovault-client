import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getAllAdmins } from "@/services/admin.service";
import CreateAdminModal from "@/components/modules/Admin/AdminManagement/CreateAdminModal";
import AdminTable from "@/components/modules/Admin/AdminManagement/AdminTable";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const AdminManagementPage = async ({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) => {
    const queryClient = new QueryClient();

    const queryParamsObjects = await searchParams;

    const queryString = Object.keys(queryParamsObjects)
        .map(
            (key) =>
                `${encodeURIComponent(key)}=${encodeURIComponent(
                    String(queryParamsObjects[key])
                )}`
        )
        .join("&");

    await queryClient.prefetchQuery({
        queryKey: ["admins", queryString],
        queryFn: () => getAllAdmins(queryString),
        staleTime: 1000 * 60,
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <div className="space-y-12">
                <div className="flex flex-col justify-between gap-6 border-b pb-8 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 font-sans">
                            System Administrators
                        </h1>
                        <p className="mt-2 text-lg text-neutral-500 font-medium tracking-tight">
                            Manage your ecosystem's administrators, update roles, and control access
                            permissions.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <Button
                            variant="outline"
                            className="rounded-2xl px-6 h-12 font-bold shadow-sm"
                        >
                            <Download className="mr-2 h-4 w-4" />
                            Export Data
                        </Button>
                        
                        <CreateAdminModal />
                    </div>
                </div>

                <div className="overflow-hidden rounded-[2.5rem] bg-white p-6 shadow-sm border border-neutral-100/60 relative">
                    <AdminTable initialQueryString={queryString} />
                </div>
            </div>
        </HydrationBoundary>
    );
};

export default AdminManagementPage;
