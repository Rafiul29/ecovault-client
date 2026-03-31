import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getMyPurchases } from "@/services/purchase.service";
import MyPurchasesTable from "@/components/modules/Member/MyPurchases/MyPurchasesTable";

const MyPurchasedIdeasPage = async () => {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ["my-purchases", ""],
        queryFn: () => getMyPurchases(),
        staleTime: 1000 * 60,
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <div className="flex flex-col gap-6 p-6 md:p-10 max-w-[1600px] mx-auto w-full">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">My Purchases</h1>
                        <p className="text-muted-foreground mt-1">
                            All the ideas you've unlocked from the EcoVault marketplace.
                        </p>
                    </div>
                </div>
                <MyPurchasesTable initialQueryString="" />
            </div>
        </HydrationBoundary>
    );
};

export default MyPurchasedIdeasPage;
