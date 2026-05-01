import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://ecovault.vercel.app";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/login",
        "/register",
        "/forgot-password",
        "/reset-password",
        "/verify-email",
        "/dashboard/",
        "/admin/",
        "/moderator/",
        "/my-profile",
        "/change-password",
        "/payment/",
        "/watchlist",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
