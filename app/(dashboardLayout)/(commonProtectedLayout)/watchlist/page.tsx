import WatchlistContent from "@/components/modules/Watchlist/WatchlistContent";
import { getMemberDashboardData } from "@/services/dashboard.service";
import { getMyWatchlist } from "@/services/watchlist.service";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

const WatchlistPage = async () => {
    const queryClient = new QueryClient();

    // Prefetch dashboard data as requested
    await queryClient.prefetchQuery({
        queryKey: ["member-dashboard-data"],
        queryFn: getMemberDashboardData as any,
        staleTime: 30 * 1000,
        gcTime: 5 * 60 * 1000,
    });

    // Prefetch watchlist data
    await queryClient.prefetchQuery({
        queryKey: ["my-watchlist"],
        queryFn: getMyWatchlist,
        staleTime: 30 * 1000,
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <WatchlistContent />
        </HydrationBoundary>
    );
};

export default WatchlistPage;