"use client";

import { useState, useMemo } from "react";
import { getMyWatchlist } from "@/services/watchlist.service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import IdeaCard, { IdeaCardSkeleton } from "@/components/ideas/IdeaCard";
import { Bookmark, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const WatchlistContent = () => {
    const queryClient = useQueryClient();
    const { data: watchlistData, isLoading } = useQuery({
        queryKey: ["my-watchlist"],
        queryFn: getMyWatchlist,
    });

    const [searchQuery, setSearchQuery] = useState("");

    const watchlist = useMemo(() => {
        return (watchlistData?.data || []) as any[];
    }, [watchlistData]);

    const filteredWatchlist = useMemo(() => {
        return watchlist.filter((item) =>
            item?.idea?.title?.toLowerCase()?.includes(searchQuery.toLowerCase())
        );
    }, [watchlist, searchQuery]);

    const handleWatchlistToggle = (ideaId: string, action: "added" | "removed") => {
        if (action === "removed") {
            // Optimistically update the cache to hide the item immediately
            queryClient.setQueryData(["my-watchlist"], (oldData: any) => {
                if (!oldData?.success || !Array.isArray(oldData.data)) return oldData;
                return {
                    ...oldData,
                    data: oldData.data.filter((item: any) =>
                        item.ideaId !== ideaId && item?.idea?.id !== ideaId
                    )
                };
            });
        }

        // Invalidate relevant queries
        queryClient.invalidateQueries({ queryKey: ["member-dashboard-data"] });
        // We don't necessarily need to invalidate my-watchlist here if we trust the optimistic update,
        // but it's safer for long-term consistency.
    };

    return (
        <div className="space-y-8 p-4">
            {/* Header Section */}
            <div className="flex flex-col gap-6 sm:flex-row md:items-center md:justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Bookmark className="size-5 text-primary" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight">My Watchlist</h1>
                    </div>
                    <p className="text-muted-foreground font-medium">
                        Keep track of the innovative ideas that inspire you.
                    </p>
                </div>

                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                        placeholder="Search your watchlist..."
                        className="pl-9 bg-background/50 border-border/50 focus:border-primary/50 transition-all rounded-xl"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Content Section */}
            {isLoading ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <IdeaCardSkeleton key={i} />
                    ))}
                </div>
            ) : filteredWatchlist.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredWatchlist.map((item) => (
                        <div key={item.id} className="relative group">
                            <IdeaCard
                                idea={{ ...item?.idea, isWatchlisted: true }}
                                isWatchlisted={true}
                                onWatchlistToggle={handleWatchlistToggle}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center bg-card/40 rounded-[2rem] border border-dashed border-border/60">
                    <div className="mb-6 p-6 bg-muted/50 rounded-2xl ring-4 ring-muted/20">
                        <Bookmark className="size-12 text-muted-foreground/30" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Your watchlist is empty</h3>
                    <p className="text-muted-foreground max-w-xs mx-auto font-medium">
                        Explore the marketplace and bookmark ideas you want to save for later.
                    </p>
                </div>
            )}
        </div>
    );
};

export default WatchlistContent;
