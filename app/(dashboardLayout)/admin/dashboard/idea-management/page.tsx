import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getIdeas } from "@/services/idea.service";
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
        queryKey: ["ideas", queryString],
        queryFn: () => getIdeas(queryString),
        staleTime: 1000 * 60,
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <div className="space-y-12">
                <div className="flex flex-col justify-between gap-6 border-b pb-8 md:flex-row md:items-center">
                    <div>
                        {/* Changed text-neutral-900 to text-foreground or added dark: variant */}
                        <h1 className="text-4xl font-extrabold tracking-tight font-sans text-foreground">
                            Idea Management
                        </h1>
                        {/* Changed text-neutral-500 to text-muted-foreground */}
                        <p className="mt-2 text-lg text-muted-foreground font-medium tracking-tight">
                            Manage your ecosystem's ideas, review submissions, and feature innovative solutions.
                        </p>
                    </div>
                </div>
                <div className="overflow-hidden">
                    <IdeasTable initialQueryString={queryString} />
                </div>
            </div>
        </HydrationBoundary>
    );
}

export default IdeaManagementPage