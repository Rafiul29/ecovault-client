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
            <div className="space-y-12">
                <div className="flex flex-col justify-between gap-6 border-b pb-8 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 font-sans">Ecosystem Members</h1>
                        <p className="mt-2 text-lg text-neutral-500 font-medium tracking-tight">
                            Manage user accounts, monitor engagement, and maintain community standards across the platform.
                        </p>
                    </div>
                </div>
                <div className="overflow-hidden rounded-[2.5rem] bg-white p-6 shadow-sm border border-neutral-100/60 relative">
                    <MemberTable initialQueryString={queryString} />
                </div>
            </div>
        </HydrationBoundary>
    );
}

export default MemberManagementPage;
