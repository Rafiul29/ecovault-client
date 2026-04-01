import ModeratorDashboardContent from "@/components/modules/Dashboard/ModeratorDashboardContent";
import { getModeratorDashboardData } from "@/services/dashboard.service";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

const ModeratorDashboardPage = async () => {

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["moderator-dashboard-data"],
    queryFn: getModeratorDashboardData as any,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  return (
    <div className="p-4 md:p-6">
      <div className="mb-10">
        <h1 className="text-4xl font-black tracking-tighter text-gray-900 mb-2">
          Moderator <span className="text-primary">Stats</span>
        </h1>
        <p className="text-gray-500 font-medium tracking-tight">
          Track your review performance and platform impact metrics.
        </p>
      </div>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <ModeratorDashboardContent />
      </HydrationBoundary>
    </div>
  )
}

export default ModeratorDashboardPage;
