import MemberDashboardContent from "@/components/modules/Dashboard/MemberDashboardContent";
import { getMemberDashboardData } from "@/services/dashboard.service";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

const MemberDashboardPage = async () => {

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["member-dashboard-data"],
    queryFn: getMemberDashboardData as any,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  return (
    <div className="p-4 md:p-6 lg:p-10 min-h-screen">
      <div className="mb-10">
        <h1 className="text-4xl font-black tracking-tighter text-gray-900 mb-2">
          <span className="text-primary">Dashboard</span>
        </h1>
        <p className="text-gray-500 font-medium tracking-tight">
          Manage your ideas, track your purchases, and monitor your platform growth.
        </p>
      </div>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <MemberDashboardContent />
      </HydrationBoundary>
    </div>
  )
}

export default MemberDashboardPage;
