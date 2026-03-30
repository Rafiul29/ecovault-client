import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getTags } from "@/services/tag.service";
import TagTable from "@/components/modules/Admin/TagManagement/TagTable";

const TagManagementPage = async ({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) => {

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
        queryKey: ["tags", queryString],
        queryFn: () => getTags(queryString),
        staleTime: 1000 * 60,
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Tag Management</h1>
                        <p className="text-muted-foreground">
                            Define fine-grained labels that help in categorization and indexing of innovative ideas.
                        </p>
                    </div>
                </div>
                <TagTable initialQueryString={queryString} />
            </div>
        </HydrationBoundary>
    );
}

export default TagManagementPage
