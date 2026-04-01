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
            <div className="space-y-12">
                <div className="flex flex-col justify-between gap-6 border-b pb-8 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 font-sans">Access Ledger</h1>
                        <p className="mt-2 text-lg text-neutral-500 font-medium tracking-tight">
                            Monitor active memberships and revenue streams for the platform.
                        </p>
                    </div>
                </div>
                <div className="overflow-hidden rounded-[2.5rem] bg-white p-6 shadow-sm border border-neutral-100/60 relative">
                    <SubscriptionTable initialQueryString={queryString} />
                </div>
            </div>
        </HydrationBoundary>
    );
}

export default SubscriptionManagementPage
