"use client"

import StatsCard from "@/components/shared/StatsCard"
import { getModeratorDashboardData } from "@/services/dashboard.service"
import { ApiResponse } from "@/types/api.types"
import { IModeratorDashboardData } from "@/types/dashboard.types"
import { useQuery } from "@tanstack/react-query"
import AdminPieChart from "./AdminPieChart"
import { Skeleton } from "@/components/ui/skeleton"

const ModeratorDashboardContent = () => {
    const { data: moderatorDashboardData, isLoading } = useQuery({
        queryKey: ["moderator-dashboard-data"],
        queryFn: getModeratorDashboardData as any,
        refetchOnWindowFocus: "always"
    })

    const data = (moderatorDashboardData as ApiResponse<IModeratorDashboardData>)?.data;

    // Transform ideaStatusDistribution to match PieChart expected format
    const pieData = data?.ideaStatusDistribution?.map(item => ({
        status: item.status.replace("_", " "),
        count: item.count
    })) || [];

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-32 w-full rounded-xl" />
                    ))}
                </div>
                <div className="grid grid-cols-1 gap-6">
                    <Skeleton className="h-[450px] w-full rounded-xl" />
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6 pb-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                    title="Reviews Handled"
                    value={data?.totalReviewsHandled || 0}
                    iconName="CheckCircle"
                    description="Total ideas reviewed by you"
                />
                <StatsCard
                    title="Pending Reviews"
                    value={data?.pendingReviews || 0}
                    iconName="Clock"
                    description="Ideas awaiting your feedback"
                />
                <StatsCard
                    title="Sold Ideas"
                    value={data?.totalSoldIdeas || 0}
                    iconName="ShoppingBag"
                    description="Ideas purchased by members"
                />
                <StatsCard
                    title="Total Revenue Share"
                    value={`$${data?.totalSoldPrices?.toLocaleString() || "0"}`}
                    iconName="Banknote"
                    description="Volume of ideas handled"
                />
            </div>

            <div className="grid grid-cols-1 gap-6">
                <div className="bg-white p-6 pb-12  rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <div className="w-1.5 h-6 bg-primary rounded-full" />
                        Idea Status Distribution
                    </h3>
                    <div className="h-[400px]">
                        <AdminPieChart data={pieData} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModeratorDashboardContent;
