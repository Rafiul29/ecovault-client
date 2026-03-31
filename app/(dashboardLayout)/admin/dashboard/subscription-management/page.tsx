import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getAllSubscriptions } from "@/services/subscription.service";
import SubscriptionTable from "@/components/modules/Admin/SubscriptionManagement/SubscriptionTable";

const SubscriptionManagementPage = async (props: { searchParams: Promise<any> }) => {
    const queryClient = new QueryClient();
    const searchParams = await props.searchParams;
    const queryString = new URLSearchParams(searchParams).toString();

    await queryClient.prefetchQuery({
        queryKey: ["subscriptions", queryString],
        queryFn: () => getAllSubscriptions(queryString),
        staleTime: 1000 * 60,
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <div className="flex flex-col gap-4">
                <div>
                    <h1 className="text-3xl font-black text-neutral-900 tracking-tight font-heading leading-none">Access Ledger</h1>
                    <p className="text-neutral-500 font-medium mt-2 italic px-1">
                        Monitor active memberships and revenue streams for the platform.
                    </p>
                </div>
                <SubscriptionTable initialQueryString={queryString} />
            </div>
        </HydrationBoundary>
    );
}

export default SubscriptionManagementPage
