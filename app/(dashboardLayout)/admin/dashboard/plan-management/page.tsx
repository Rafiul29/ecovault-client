import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getAllSubscriptionPlans } from "@/services/subscription.service";
import PlanTable from "@/components/modules/Admin/PlanManagement/PlanTable";

const PlanManagementPage = async () => {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ["subscription-plans"],
        queryFn: () => getAllSubscriptionPlans(),
        staleTime: 1000 * 60,
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <div className="space-y-12">
                <div className="flex flex-col justify-between gap-6 border-b pb-8 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 font-sans">Plan Architect</h1>
                        <p className="mt-2 text-lg text-neutral-500 font-medium tracking-tight">
                            Configure the pricing tiers and membership levels for the EcoVault platform.
                        </p>
                    </div>
                </div>
                <div className="overflow-hidden rounded-[2.5rem] bg-white p-6 shadow-sm border border-neutral-100/60 relative">
                    <PlanTable />
                </div>
            </div>
        </HydrationBoundary>
    );
}

export default PlanManagementPage
