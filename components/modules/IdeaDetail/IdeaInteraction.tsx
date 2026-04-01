"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown, Bookmark, BookmarkCheck, Share2, Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/utils";
import Link from "next/link";
import { toggleVote } from "@/services/vote.service";
import { toggleWatchlist } from "@/services/watchlist.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface IdeaInteractionProps {
    ideaId: string;
    slug: string;
    initialUpvotes: number;
    initialDownvotes: number;
    initialUserVote?: number;
    isOwner: boolean;
    watchlisted?: boolean;
    isLoggedIn?: boolean;
    initialWatchlistCount: number;
}

const IdeaInteraction = ({
    ideaId,
    slug,
    initialUpvotes,
    initialDownvotes,
    initialUserVote,
    isOwner,
    watchlisted: initialWatchlisted,
    isLoggedIn = false,
    initialWatchlistCount
}: IdeaInteractionProps) => {
    const router = useRouter();
    const [userVote, setUserVote] = useState(initialUserVote || 0);
    const [upvotes, setUpvotes] = useState(initialUpvotes);
    const [downvotes, setDownvotes] = useState(initialDownvotes);
    const [isWatchlisted, setIsWatchlisted] = useState(initialWatchlisted || false);
    const [isPending, setIsPending] = useState(false);
    const [isWatchlistPending, setIsWatchlistPending] = useState(false);
    const [watchlistCount, setWatchlistCount] = useState<number>(Number(initialWatchlistCount) || 0);

    const handleVote = async (value: number) => {
        if (!isLoggedIn) {
            toast.error("Please log in to vote on ideas.");
            return;
        }

        if (isPending) return;

        // Optimistic UI update
        const previousVote = userVote;
        const previousUpvotes = upvotes;
        const previousDownvotes = downvotes;

        const newVoteValue = userVote === value ? 0 : value;

        let newUpvotes = upvotes;
        let newDownvotes = downvotes;

        // Revert previous vote impact
        if (previousVote === 1) newUpvotes -= 1;
        if (previousVote === -1) newDownvotes -= 1;

        // Apply new vote impact
        if (newVoteValue === 1) newUpvotes += 1;
        if (newVoteValue === -1) newDownvotes += 1;

        setUserVote(newVoteValue);
        setUpvotes(newUpvotes);
        setDownvotes(newDownvotes);
        setIsPending(true);

        try {
            const response = await toggleVote({ ideaId, value });
            if (!response.success) {
                throw new Error(response.message || "Failed to vote");
            }
            // Optionally refresh to sync with server, but optimistic keeps UI fast
        } catch (error: any) {
            // Revert state on failure
            setUserVote(previousVote);
            setUpvotes(previousUpvotes);
            setDownvotes(previousDownvotes);
            toast.error(error.message || "Failed to vote");
        } finally {
            setIsPending(false);
        }
    };

    const handleWatchlist = async () => {
        if (!isLoggedIn) {
            toast.error("Please log in to save ideas to your watchlist.");
            return;
        }
        if (isWatchlistPending) return;

        const previousState = isWatchlisted;
        setIsWatchlisted(!isWatchlisted);
        setIsWatchlistPending(true);

        try {
            const response = await toggleWatchlist({ ideaId });
            if (!response.success) {
                throw new Error(response.message || "Failed to update saved ideas");
            }
            setWatchlistCount(previousState ? watchlistCount - 1 : watchlistCount + 1);
            toast.success(response.message || (previousState ? "Removed from saved ideas" : "Added to saved ideas"));
        } catch (error: any) {
            setIsWatchlisted(previousState);
            toast.error(error.message || "Failed to update saved ideas");
        } finally {
            setIsWatchlistPending(false);
        }

    }




    return (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card p-3">
            <button
                onClick={() => handleVote(1)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium border transition-all ${userVote === 1
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-foreground hover:bg-muted"
                    } ${isPending ? 'opacity-70 pointer-events-none' : ''}`}
            >
                <ThumbsUp className="size-4" />
                {formatNumber(upvotes)} Upvotes
            </button>

            <button
                onClick={() => handleVote(-1)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium border transition-all ${userVote === -1
                    ? "bg-destructive text-destructive-foreground border-destructive"
                    : "border-border text-foreground hover:bg-muted"
                    } ${isPending ? 'opacity-70 pointer-events-none' : ''}`}
            >
                <ThumbsDown className="size-4" />
                {formatNumber(downvotes)}
            </button>

            <button
                onClick={handleWatchlist}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium border transition-all ${isWatchlisted
                    ? "bg-primary/10 text-primary border-primary/30"
                    : "border-border text-foreground hover:bg-muted"
                    } ${isWatchlistPending ? 'opacity-70 pointer-events-none' : ''}`}
            >
                {isWatchlisted ? (
                    <BookmarkCheck className="size-4" />
                ) : (
                    <Bookmark className="size-4" />
                )}
                {isWatchlisted ? "Saved" : "Save"} {watchlistCount > 0 ? `${watchlistCount}` : ""}
            </button>

            <button className="flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted ml-auto">
                <Share2 className="size-4" />
            </button>
        </div>
    );
};

export default IdeaInteraction;
