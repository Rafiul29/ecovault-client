"use client"

import StatsCard from "@/components/shared/StatsCard"
import { getMemberDashboardData } from "@/services/dashboard.service"
import { ApiResponse } from "@/types/api.types"
import { IMemberDashboardData } from "@/types/dashboard.types"
import { useQuery } from "@tanstack/react-query"
import { Skeleton } from "@/components/ui/skeleton"

const MemberDashboardContent = () => {
    const { data: memberDashboardData, isLoading } = useQuery({
        queryKey: ["member-dashboard-data"],
        queryFn: getMemberDashboardData as any,
        refetchOnWindowFocus: "always"
    })

    const data = (memberDashboardData as ApiResponse<IMemberDashboardData>)?.data;

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className="h-32 w-full rounded-2xl" />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8 pb-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatsCard
                    title="My Ideas"
                    value={data?.totalMyIdeas || 0}
                    iconName="Lightbulb"
                    description="Ideas you have shared"
                />
                <StatsCard
                    title="Purchased Ideas"
                    value={data?.totalPurchasedIdeas || 0}
                    iconName="ShoppingBag"
                    description="Innovations you've acquired"
                />
                <StatsCard
                    title="Total Investment"
                    value={`$${data?.totalSpent?.toLocaleString() || "0"}`}
                    iconName="Wallet"
                    description="Your commitment to growth"
                />
                <StatsCard
                    title="Watchlist"
                    value={data?.watchlistCount || 0}
                    iconName="Bookmark"
                    description="Ideas you are monitoring"
                />
                {/* <StatsCard
                    title="Followers"
                    value={data?.totalFollowers || 0}
                    iconName="Users"
                    description="Community following your updates"
                /> */}
                <StatsCard
                    title="Following"
                    value={data?.totalFollowing || 0}
                    iconName="UserPlus"
                    description="Innovators you find inspiring"
                />
            </div>

            {/* Optional Empty State or Welcome Section */}
            {!data?.totalMyIdeas && !data?.totalPurchasedIdeas && (
                <div className="bg-emerald-50/50 rounded-[2rem] border border-emerald-100/50 p-12 text-center">
                    <div className="mx-auto w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg mb-6 ring-4 ring-emerald-50">
                        <span className="text-3xl animate-bounce">🌱</span>
                    </div>
                    <h3 className="text-xl font-black text-gray-900 mb-2">Welcome to your Dashboard!</h3>
                    <p className="text-gray-500 max-w-sm mx-auto font-medium">
                        Start your journey by exploring innovative ideas or sharing your own unique concepts with the world.
                    </p>
                </div>
            )}
        </div>
    )
}

export default MemberDashboardContent;
