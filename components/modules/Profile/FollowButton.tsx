"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserCheck, UserPlus, Users } from "lucide-react";
import { toggleFollow } from "@/services/follow.service";
import { toast } from "sonner";

interface FollowButtonProps {
    targetUserId: string;
    initialIsFollowing: boolean;
    initialFollowerCount: number;
    currentUserId?: string;
    showCount?: boolean;
}

export default function FollowButton({
    targetUserId,
    initialIsFollowing,
    initialFollowerCount,
    currentUserId,
    showCount = true,
}: FollowButtonProps) {
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
    const [followerCount, setFollowerCount] = useState(initialFollowerCount);
    const [isPending, setIsPending] = useState(false);

    // Don't render for own profile
    if (!currentUserId || currentUserId === targetUserId) {
        if (showCount) {
            return (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span><span className="font-semibold text-foreground">{followerCount}</span> followers</span>
                </div>
            );
        }
        return null;
    }

    const handleFollowToggle = async () => {
        if (isPending) return;

        const wasFollowing = isFollowing;
        // Optimistic update
        setIsFollowing(!wasFollowing);
        setFollowerCount(wasFollowing ? followerCount - 1 : followerCount + 1);
        setIsPending(true);

        try {
            const res = await toggleFollow(targetUserId);
            if (!res.success) {
                throw new Error(res.message || "Failed to update follow status");
            }
            toast.success(res.message || (wasFollowing ? "Unfollowed" : "Following"));
        } catch (err: any) {
            // Revert
            setIsFollowing(wasFollowing);
            setFollowerCount(wasFollowing ? followerCount : followerCount - 1);
            toast.error(err.message || "Failed to update follow status");
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div className="flex items-center gap-3">
            {showCount && (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>
                        <span className="font-semibold text-foreground">{followerCount}</span> followers
                    </span>
                </div>
            )}
            <Button
                size="sm"
                variant={isFollowing ? "outline" : "default"}
                onClick={handleFollowToggle}
                disabled={isPending}
                className="h-8 gap-1.5 text-xs font-medium"
            >
                {isFollowing ? (
                    <><UserCheck className="h-3.5 w-3.5" />Following</>
                ) : (
                    <><UserPlus className="h-3.5 w-3.5" />Follow</>
                )}
            </Button>
        </div>
    );
}
