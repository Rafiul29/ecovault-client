import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getSoldIdeas } from "@/services/purchase.service";
import SoldIdeasTable from "@/components/modules/Admin/IdeaPurchaseManagement/SoldIdeasTable";

const ModeratorSoldIdeasPage = async (props: {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}) => {
    const searchParams = await props.searchParams;
    const queryString = new URLSearchParams(
        Object.entries(searchParams).flatMap(([key, val]) =>
            val === undefined
                ? []
                : Array.isArray(val)
                ? val.map((v) => [key, v])
                : [[key, val]]
        )
    ).toString();

    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ["sold-ideas", queryString],
        queryFn: () => getSoldIdeas(queryString),
        staleTime: 1000 * 60,
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Sold Ideas</h1>
                        <p className="text-muted-foreground">
                            View all marketplace purchases for ideas in the ecosystem.
                        </p>
                    </div>
                </div>
                <SoldIdeasTable initialQueryString={queryString} />
            </div>
        </HydrationBoundary>
    );
};

export default ModeratorSoldIdeasPage;
