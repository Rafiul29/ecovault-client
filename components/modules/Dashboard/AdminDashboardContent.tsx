"use client"

import StatsCard from "@/components/shared/StatsCard"
import { getAdminDashboardData } from "@/services/dashboard.service"
import { ApiResponse } from "@/types/api.types"
import { IAdminDashboardData } from "@/types/dashboard.types"
import { useQuery } from "@tanstack/react-query"
import AdminBarChart from "./AdminBarChart"
import AdminPieChart from "./AdminPieChart"
import { Skeleton } from "@/components/ui/skeleton"

const AdminDashboardContent = () => {
    const { data: adminDashboardData, isLoading } = useQuery({
        queryKey: ["admin-dashboard-data"],
        queryFn: getAdminDashboardData as any,
        refetchOnWindowFocus: "always"
    })

    const data = (adminDashboardData as ApiResponse<IAdminDashboardData>)?.data;

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Array.from({ length: 7 }).map((_, i) => (
                        <Skeleton key={i} className="h-32 w-full rounded-xl" />
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Skeleton className="h-[400px] w-full rounded-xl" />
                    <Skeleton className="h-[400px] w-full rounded-xl" />
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6 pb-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                    title="Total Users"
                    value={data?.totalUsers || 0}
                    iconName="Users"
                    description="Active platform participants"
                />
                <StatsCard
                    title="Total Ideas"
                    value={data?.totalIdeas || 0}
                    iconName="Lightbulb"
                    description="Shared innovative solutions"
                />
                <StatsCard
                    title="Categories"
                    value={data?.totalCategories || 0}
                    iconName="Layers"
                    description="Thematic classifications"
                />
                <StatsCard
                    title="Total Tags"
                    value={data?.totalTags || 0}
                    iconName="Tag"
                    description="Meta-descriptors for ideas"
                />
                <StatsCard
                    title="Total Subscriptions"
                    value={data?.totalSubscriptions || 0}
                    iconName="Zap"
                    description="Active paid plans"
                />
                 <StatsCard
                    title="Total Payments"
                    value={data?.totalPayments || 0}
                    iconName="CreditCard"
                    description="Processed transactions"
                />
                <StatsCard
                    title="Total Revenue"
                    value={`$${data?.totalRevenue?.toLocaleString() || "0"}`}
                    iconName="DollarSign"
                    description="Gross platform earnings"
                    className="md:col-span-2 lg:col-span-2"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AdminBarChart
                    data={data?.barChartData || []}
                />
                <AdminPieChart
                    data={data?.pieChartData || []}
                />
            </div>
        </div>
    )
}

export default AdminDashboardContent