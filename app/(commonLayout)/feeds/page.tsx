"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import {
  Filter,
  Flame,
  Clock,
  Zap,
  Loader2,
  ThumbsUp,
  ThumbsDown,
  Eye,
} from "lucide-react";
import { useInfiniteQuery } from "@tanstack/react-query";

import IdeaCard, { IdeaCardSkeleton } from "@/components/ideas/IdeaCard";
import { getIdeas } from "@/services/idea.service";
import { IIdea } from "@/types/idea.types";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { cn } from "@/lib/utils";

const TABS = [
  {
    id: "trending",
    label: "Trending",
    icon: Flame,
    description: "Hot topics and highly voted ideas",
    value: { sortBy: "trendingScore", sortOrder: "desc" },
  },
  {
    id: "newest",
    label: "Newest",
    icon: Clock,
    description: "Freshly submitted concepts",
    value: { sortBy: "createdAt", sortOrder: "desc" },
  },
  {
    id: "top_voted",
    label: "Top Voted",
    icon: ThumbsUp,
    description: "Ideas with the most upvotes",
    value: { sortBy: "upvoteCount", sortOrder: "desc" },
  },
  {
    id: "most_viewed",
    label: "Most Viewed",
    icon: Eye,
    description: "Ideas with the highest view count",
    value: { sortBy: "viewCount", sortOrder: "desc" },
  },
  {
    id: "controversial",
    label: "Controversial",
    icon: ThumbsDown,
    description: "Ideas with the most downvotes",
    value: { sortBy: "downvoteCount", sortOrder: "desc" },
  },
  {
    id: "high_impact",
    label: "High Impact",
    icon: Zap,
    description: "Admin highlighted & featured",
    value: { isFeatured: "true", sortBy: "createdAt", sortOrder: "desc" },
  },
];

export default function FeedsPage() {
  const [activeTab, setActiveTab] = useState(TABS[0].id);

  // Get the configured query params for the active tab
  const activeTabConfig = useMemo(() => {
    return TABS.find((t) => t.id === activeTab)?.value || TABS[0].value;
  }, [activeTab]);

  const fetchIdeasPage = async ({ pageParam = 1 }) => {
    const params = new URLSearchParams();
    params.set("page", pageParam.toString());
    params.set("limit", "10");
    params.set("status", "APPROVED"); // Only Approved ideas allowed in Feed

    Object.entries(activeTabConfig).forEach(([key, value]) => {
      params.set(key, value);
    });

    const res = await getIdeas(params.toString());
    return res;
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["ideas", "feed", activeTabConfig],
      queryFn: fetchIdeasPage,
      initialPageParam: 1,
      getNextPageParam: (lastPage: any, allPages) => {
        const maxPages = lastPage.meta?.totalPages || 0;
        const nextPage = allPages.length + 1;
        return nextPage <= maxPages ? nextPage : undefined;
      },
    });

  // Flatten ideas from all fetched pages
  const ideas = useMemo(() => {
    return data?.pages.flatMap((page: any) => page.data || []) || [];
  }, [data]);

  // Intersection Observer for Infinite Scroll
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const entry = useIntersectionObserver(loadMoreRef, { rootMargin: "200px" });

  useEffect(() => {
    // Fetch next page when bottom div is in view and not already loading
    if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
      console.log("Fetching next page...");
      fetchNextPage();
    }
  }, [entry?.isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="flex flex-1 flex-col">
      <main className="mx-auto max-w-4xl px-2 sm:px-4 py-4 sm:py-8 w-full">
        {/* Header */}
        <div className="mb-4 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-1.5 sm:mb-2">
            Community Feed
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground w-full md:w-2/3 leading-relaxed">
            Discover the latest eco-innovations. Trending solutions are ranked
            by community votes, while High Impact highlights top-tier
            admin-approved projects.
          </p>
        </div>

        {/* Tabs / Filters */}
        <div className="flex space-x-1.5 sm:space-x-2 overflow-x-auto pb-2 sm:pb-4 mb-4 border-b border-border hide-scrollbar">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon
                  className={cn(
                    "size-4",
                    isActive && "text-primary-foreground",
                  )}
                />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Feed Content */}
        <div className="flex flex-col gap-4 sm:gap-6">
          {isLoading ? (
            /* Initial loading shimmer */
            [...Array(3)].map((_, i) => (
              <IdeaCardSkeleton key={i} />
            ))
          ) : ideas.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center p-12 text-center border rounded-2xl border-dashed bg-muted/20">
              <Filter className="size-8 text-muted-foreground/50 mb-3" />
              <h3 className="text-lg font-semibold text-foreground">
                No updates available
              </h3>
              <p className="text-sm text-muted-foreground">
                We couldn't find any ideas for this feed at the moment.
              </p>
            </div>
          ) : (
            /* Idea List (Rendered vertically like Reddit) */
            <div className="flex flex-col gap-4 sm:gap-6">
              {ideas.map((idea: IIdea) => (
                <div key={idea.id} className="w-full flex">
                  <div className="w-full relative shadow-sm hover:shadow transition-shadow rounded-xl">
                    <IdeaCard idea={idea as any} showStatus />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Infinite Scroll Trigger & Loader */}
          <div
            ref={loadMoreRef}
            className="py-4 sm:py-6 flex items-center justify-center w-full"
          >
            {isFetchingNextPage ? (
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border shadow-sm">
                <Loader2 className="size-4 animate-spin text-primary" />
                <span className="text-sm font-medium">Loading more...</span>
              </div>
            ) : hasNextPage ? (
              <span className="text-sm text-muted-foreground opacity-0">
                Scroll for more
              </span>
            ) : (
              ideas.length > 0 && (
                <span className="text-sm text-muted-foreground font-medium">
                  You've reached the end!
                </span>
              )
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
