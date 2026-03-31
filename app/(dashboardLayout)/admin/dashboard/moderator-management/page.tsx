import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getAllModerators } from "@/services/moderator.service";
import ModeratorTable from "@/components/modules/Admin/ModeratorManagement/ModeratorTable";

const ModeratorManagementPage = async ({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) => {
    const queryClient = new QueryClient();

    const queryParamsObjects = await searchParams;

    const queryString = Object.keys(queryParamsObjects)
        .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(String(queryParamsObjects[key]))}`)
        .join("&");

    await queryClient.prefetchQuery({
        queryKey: ["moderators", queryString],
        queryFn: () => getAllModerators(queryString),
        staleTime: 1000 * 60,
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black text-neutral-900 tracking-tight flex items-center gap-2">
                             System Moderators
                        </h1>
                        <p className="text-sm font-medium text-neutral-500">
                            Monitor moderator performance, toggle account statuses, and oversee platform verification processes.
                        </p>
                    </div>
                </div>
                <ModeratorTable initialQueryString={queryString} />
            </div>
        </HydrationBoundary>
    );
}

export default ModeratorManagementPage;
