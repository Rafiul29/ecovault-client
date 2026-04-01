export type UserRole = "SUPER_ADMIN" | "ADMIN" | "MEMBER" | "MODERATOR";

export const authRoutes = ["/login", "/register", "/forgot-password", "/reset-password", "/verify-email"];

export const isAuthRoute = (pathname: string) => {
    return authRoutes.some((router: string) => router === pathname)
}

export type RouteConfig = {
    exact: string[];
    pattern: RegExp[];
}

export const commonProtectedRoutes: RouteConfig = {
    exact: ["/my-profile", "/change-password", "/achievements"],
    pattern: []
}

export const moderatorProtectedRoutes: RouteConfig = {
    pattern: [/^\/moderator\/dashboard/], // Matches any path that starts with /moderator/dashboard
    exact: []
}

export const adminProtectedRoutes: RouteConfig = {
    pattern: [/^\/admin\/dashboard/], // Matches any path that starts with /admin/dashboard
    exact: []
}

// export const superAdminProtectedRoutes : RouteConfig = {
//     pattern: [/^\/admin\/dashboard/ ], // Matches any path that starts with /super-admin/dashboard
//     exact : []
// }

export const memberProtectedRoutes: RouteConfig = {
    pattern: [/^\/dashboard/], // Matches any path that starts with /dashboard
    exact: ["/payment/success"]
}

export const isRouteMatches = (pathname: string, routes: RouteConfig) => {
    if (routes.exact.includes(pathname)) {
        return true;
    }
    return routes.pattern.some((pattern) => pattern.test(pathname))
}

export const getRouteOwner = (pathname: string): "ADMIN" | "MODERATOR" | "MEMBER" | "COMMON" | null => {
    if (isRouteMatches(pathname, moderatorProtectedRoutes)) {
        return "MODERATOR";
    }

    if (isRouteMatches(pathname, adminProtectedRoutes)) {
        return "ADMIN";
    }

    if (isRouteMatches(pathname, memberProtectedRoutes)) {
        return "MEMBER";
    }

    if (isRouteMatches(pathname, commonProtectedRoutes)) {
        return "COMMON"
    }
    return null;
}

export const getDefaultDashboardRoute = (role: UserRole) => {
    if (role === "ADMIN" || role === "SUPER_ADMIN") {
        return "/admin/dashboard";
    }
    if (role === "MODERATOR") {
        return "/moderator/dashboard";
    }
    if (role === "MEMBER") {
        return "/dashboard";
    }

    return "/";
}

export const isValidRedirectForRole = (redirectPath: string, role: UserRole) => {
    const unifySuperAdminAndAdminRole = role === "SUPER_ADMIN" ? "ADMIN" : role;

    role = unifySuperAdminAndAdminRole;

    const routeOwner = getRouteOwner(redirectPath);

    if (routeOwner === null || routeOwner === "COMMON") {
        return true;
    }

    if (routeOwner === role) {
        return true;
    }

    return false;
}