import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getAllMembers } from "@/services/member.service";
import MemberTable from "@/components/modules/Admin/MemberManagement/MemberTable";

const MemberManagementPage = async ({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) => {
    const queryClient = new QueryClient();

    const queryParamsObjects = await searchParams;

    const queryString = Object.keys(queryParamsObjects)
        .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(String(queryParamsObjects[key]))}`)
        .join("&");

    await queryClient.prefetchQuery({
        queryKey: ["members", queryString],
        queryFn: () => getAllMembers(queryString),
        staleTime: 1000 * 60,
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black text-neutral-900 tracking-tight">Ecosystem Members</h1>
                        <p className="text-sm font-medium text-neutral-500">
                             Manage user accounts, monitor engagement, and maintain community standards across the platform.
                        </p>
                    </div>
                </div>
                <MemberTable initialQueryString={queryString} />
            </div>
        </HydrationBoundary>
    );
}

export default MemberManagementPage;
