"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown, Bookmark, BookmarkCheck, Share2, Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/utils";
import Link from "next/link";
import { toggleVote } from "@/services/vote.service";
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
}

const IdeaInteraction = ({
    ideaId,
    slug,
    initialUpvotes,
    initialDownvotes,
    initialUserVote,
    isOwner,
    watchlisted: initialWatchlisted,
}: IdeaInteractionProps) => {
    const router = useRouter();
    const [userVote, setUserVote] = useState(initialUserVote || 0);
    const [isWatchlisted, setIsWatchlisted] = useState(initialWatchlisted || false);
    const [isPending, setIsPending] = useState(false);

    const handleVote = async (value: number) => {
        setIsPending(true);
        try {
            const response = await toggleVote({ ideaId, value });
            if (response.success) {
                toast.success(response.message);
                router.refresh();
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to vote");
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card p-3">
            <button
                onClick={() => handleVote(1)}
                disabled={isPending}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium border transition-all ${userVote === 1
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-foreground hover:bg-muted"
                    }`}
            >
                <ThumbsUp className="size-4" />
                {formatNumber(initialUpvotes)} Upvotes
            </button>

            <button
                onClick={() => handleVote(-1)}
                disabled={isPending}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium border transition-all ${userVote === -1
                    ? "bg-destructive text-destructive-foreground border-destructive"
                    : "border-border text-foreground hover:bg-muted"
                    }`}
            >
                <ThumbsDown className="size-4" />
                {formatNumber(initialDownvotes)}
            </button>

            <button
                onClick={() => setIsWatchlisted(!isWatchlisted)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium border transition-all ${isWatchlisted
                    ? "bg-primary/10 text-primary border-primary/30"
                    : "border-border text-foreground hover:bg-muted"
                    }`}
            >
                {isWatchlisted ? (
                    <BookmarkCheck className="size-4" />
                ) : (
                    <Bookmark className="size-4" />
                )}
                {isWatchlisted ? "Saved" : "Save"}
            </button>

            <button className="flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted ml-auto">
                <Share2 className="size-4" />
            </button>

            {/* {isOwner && (
                <Button variant="outline" size="sm" asChild>
                    <Link href={`/ideas/${slug}/edit`}>
                        <Edit className="size-4" /> Edit
                    </Link>
                </Button>
            )} */}
        </div>
    );
};

export default IdeaInteraction;
