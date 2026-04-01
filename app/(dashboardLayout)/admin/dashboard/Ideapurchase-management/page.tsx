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
            <div className="space-y-12">
                <div className="flex flex-col justify-between gap-6 border-b pb-8 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 font-sans">Idea Purchases</h1>
                        <p className="mt-2 text-lg text-neutral-500 font-medium tracking-tight">
                            Track every marketplace transaction — who bought what and when.
                        </p>
                    </div>
                </div>
                <div className="overflow-hidden rounded-[2.5rem] bg-white p-6 shadow-sm border border-neutral-100/60 relative">
                    <SoldIdeasTable initialQueryString={queryString} />
                </div>
            </div>
        </HydrationBoundary>
    );
};

export default IdeaPurchaseManagementPage;
