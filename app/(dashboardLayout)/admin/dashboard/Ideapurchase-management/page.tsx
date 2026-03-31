import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getSoldIdeas } from "@/services/purchase.service";
import SoldIdeasTable from "@/components/modules/Admin/IdeaPurchaseManagement/SoldIdeasTable";

const IdeaPurchaseManagementPage = async (props: {
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
                <div>
                    <h1 className="text-3xl font-black text-neutral-900 tracking-tight font-heading leading-none">
                        Idea Purchases
                    </h1>
                    <p className="text-neutral-500 font-medium mt-2 italic px-1">
                        Track every marketplace transaction — who bought what and when.
                    </p>
                </div>
                <SoldIdeasTable initialQueryString={queryString} />
            </div>
        </HydrationBoundary>
    );
};

export default IdeaPurchaseManagementPage;
