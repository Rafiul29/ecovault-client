import { getDefaultDashboardRoute } from "@/lib/authUtils"

import { getUserInfo } from "@/services/auth.service"
import DashboardSidebarContent from "./DashboardSidebarContent"
import { NavSection } from "@/types/dashboard.types"
import { getNavItemsByRole } from "@/lib/navItems"

const DashboardSidebar = async () => {
    const userInfo = await getUserInfo()
    const navItems: NavSection[] = getNavItemsByRole(userInfo.role)

    const dashboardHome = getDefaultDashboardRoute(userInfo.role)
    return (
        <DashboardSidebarContent userInfo={userInfo} navItems={navItems} dashboardHome={dashboardHome} />
    )
}

export default DashboardSidebar