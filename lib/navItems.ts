import { NavSection } from "@/types/dashboard.types";
import { getDefaultDashboardRoute, UserRole } from "./authUtils";

export const getCommonNavItems = (role: UserRole): NavSection[] => {
    const defaultDashboard = getDefaultDashboardRoute(role);
    return [
        {
            // title : "Dashboard",
            items: [
                {
                    title: "Home",
                    href: "/",
                    icon: "Home"
                },
                {
                    title: "Dashboard",
                    href: defaultDashboard,
                    icon: "LayoutDashboard"

                },
                {
                    title: "My Profile",
                    href: `/my-profile`,
                    icon: "User",
                },
            ]
        },
        {
            title: "Settings",
            items: [
                {
                    title: "Change Password",
                    href: "/change-password",
                    icon: "Settings"
                }
            ]
        }
    ]
}

export const moderatorNavItems: NavSection[] = [
    {
        title: "Content Management",
        items: [
            {
                title: "Manage Ideas",
                href: "/moderator/dashboard/ideas",
                icon: "Lightbulb",
            },
            {
                title: "Manage Categories",
                href: "/moderator/dashboard/categories",
                icon: "LayoutGrid",
            },
            {
                title: "Manage Tags",
                href: "/moderator/dashboard/tags",
                icon: "Tag",
            },
        ]
    },
    {
        title: "Sales & Subscription",
        items: [
            {
                title: "Sold Ideas",
                href: "/moderator/dashboard/sold-ideas",
                icon: "TrendingUp",
            },
            {
                title: "My Subscription",
                href: "/moderator/dashboard/my-subscription",
                icon: "CreditCard",
            },
        ]
    }
]

export const adminNavItems: NavSection[] = [
    {
        title: "System Control",
        items: [
            {
                title: "Idea Management",
                href: "/admin/dashboard/idea-management",
                icon: "Lightbulb",
            },
            {
                title: "Purchase Management",
                href: "/admin/dashboard/Ideapurchase-management",
                icon: "ShoppingCart",
            },
            {
                title: "Comment Management",
                href: "/admin/dashboard/comment-management",
                icon: "MessageSquare",
            },
        ],
    },
    {
        title: "User Control",
        items: [
            {
                title: "Admin Management",
                href: "/admin/dashboard/admin-management",
                icon: "ShieldCheck",
            },
            {
                title: "Moderator Management",
                href: "/admin/dashboard/moderator-management",
                icon: "ShieldAlert",
            },
            {
                title: "Member Management",
                href: "/admin/dashboard/member-management",
                icon: "Users",
            },
        ],
    },
    {
        title: "Platform Setup",
        items: [
            {
                title: "Category Management",
                href: "/admin/dashboard/category-management",
                icon: "LayoutGrid",
            },
            {
                title: "Tag Management",
                href: "/admin/dashboard/tag-management",
                icon: "Tag",
            },
            {
                title: "Plan Management",
                href: "/admin/dashboard/plan-management",
                icon: "Zap",
            },
            {
                title: "Subscription Management",
                href: "/admin/dashboard/subscription-management",
                icon: "CreditCard",
            },
            {
                title: "Payment Management",
                href: "/admin/dashboard/payment-management",
                icon: "DollarSign",
            },
        ],
    },
];

export const memberNavItems: NavSection[] = [
    {
        title: "My Content",
        items: [
            {
                title: "Purchased Ideas",
                href: "/dashboard/my-purchased-ideas",
                icon: "Lightbulb",
            },
            {
                title: "My Achievements",
                href: "/achievements",
                icon: "Award",
            },
        ],
    },
];

export const getNavItemsByRole = (role: UserRole): NavSection[] => {
    const commonNavItems = getCommonNavItems(role);

    switch (role) {
        case "SUPER_ADMIN":
        case "ADMIN":
            return [...commonNavItems, ...adminNavItems];

        case "MEMBER":
            return [...commonNavItems, ...memberNavItems];

        case "MODERATOR":
            return [...commonNavItems, ...moderatorNavItems]
    }


}