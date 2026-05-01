import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://ecovault.vercel.app";

  const routes = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/ideas`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/feeds`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/achievements`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.4,
    },
  ];

  return routes;
}
