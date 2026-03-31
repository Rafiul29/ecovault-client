import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getMyIdeas } from "@/services/idea.service";
import IdeasTable from "@/components/modules/Admin/IdeaManagement/IdeasTable";

const IdeaManagementPage = async ({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) => {

    const queryParamsObjects = await searchParams;

    const queryString = Object.keys(queryParamsObjects)
        .map((key) => {
            const value = queryParamsObjects[key];
            if (value === undefined) {
                return "";
            }


            if (Array.isArray(value)) {
                return value
                    .map((v) => `${encodeURIComponent(key)}=${encodeURIComponent(v)}`)
                    .join("&");
            }

            return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
        })
        .filter(Boolean)
        .join("&");


    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ["my-ideas", queryString],
        queryFn: () => getMyIdeas(queryString),
        staleTime: 1000 * 60,
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">My Ideas</h1>
                        <p className="text-muted-foreground">
                            Manage your ecosystem's ideas, review submissions, and feature innovative solutions.
                        </p>
                    </div>
                </div>
                <IdeasTable initialQueryString={queryString} mode="my-ideas" />
            </div>
        </HydrationBoundary>
    );
}

export default IdeaManagementPage