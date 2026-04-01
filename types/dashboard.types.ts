export interface NavItem {
    title: string,
    href: string,
    icon: string
}

export interface NavSection {
    title?: string,
    items: NavItem[]
}

export interface PieChartData {
    status: string,
    count: number
}

export interface BarChartData {
    month: Date | string,
    count: number
}

export interface IAdminDashboardData {
    totalUsers: number;
    totalIdeas: number;
    totalCategories: number;
    totalTags: number;
    totalPayments: number;
    totalSubscriptions: number;
    totalRevenue: number;
    barChartData: BarChartData[];
    pieChartData: PieChartData[];
}