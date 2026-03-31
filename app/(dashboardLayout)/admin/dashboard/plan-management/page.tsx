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
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-neutral-900 tracking-tight font-heading leading-none">Plan Architect</h1>
                        <p className="text-neutral-500 font-medium mt-2 italic px-1">
                            Configure the pricing tiers and membership levels for the EcoVault platform.
                        </p>
                    </div>
                </div>
                <PlanTable />
            </div>
        </HydrationBoundary>
    );
}

export default PlanManagementPage
