"use client";

import { useState, useEffect, useCallback } from "react";
import { MessageSquare, CornerDownRight, ChevronUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { formatRelativeTime, cn } from "@/lib/utils";
import { createComment, getCommentsByIdeaId } from "@/services/comment.service";
import { toast } from "sonner";

interface IdeaCommentsProps {
    ideaId: string;
    totalComments: number;
    currentUser?: any;
}

const CommentItem = ({ comment, currentUser, onReply, depth = 0 }: any) => {
    const [isReplying, setIsReplying] = useState(false);
    const [replyContent, setReplyContent] = useState("");
    const [isPending, setIsPending] = useState(false);
    const [showReplies, setShowReplies] = useState(false);

    const handleReplySubmit = async () => {
        if (!replyContent.trim()) return;
        setIsPending(true);

        const parentId = comment._id || comment.id;
        const success = await onReply(parentId, replyContent);
        if (success) {
            setReplyContent("");
            setIsReplying(false);
            setShowReplies(true);
        }
        setIsPending(false);
    };

    return (
        <div className={cn("flex flex-col", depth > 0 && "mt-[1px] ml-[1px]")}>
            <div className="flex gap-2 sm:gap-3">
                {depth > 0 && (
                    <div className="w-3 sm:w-8 flex-shrink-0 flex justify-end">
                        {/* Nested reply visual connector */}
                        <div className="w-1/2 h-4 border-b-2 border-l-2 border-muted-foreground/30 rounded-bl-xl border-solid transform -translate-y-2"></div>
                    </div>
                )}

                <Avatar className="size-7 sm:size-8 shrink-0">
                    <AvatarImage src={comment.author?.image} alt={comment.author?.name} />
                    <AvatarFallback className="text-[10px] sm:text-xs">
                        {comment.author?.name?.slice(0, 2) || "U"}
                    </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                    <div className="rounded-2xl border border-transparent bg-muted/60 px-3 py-2 w-fit">
                        <span className="text-xs font-semibold text-foreground tracking-tight">
                            {comment.author?.name}
                        </span>
                        <p className="text-[13px] sm:text-sm text-foreground/90 leading-snug break-words mt-0.5">
                            {comment.content}
                        </p>
                    </div>

                    <div className="flex justify-start mt-1 mb-1 items-center gap-4 px-2">
                        <span className="text-[11px] font-medium text-muted-foreground hover:underline cursor-pointer">
                            {formatRelativeTime(comment.createdAt)}
                        </span>
                        {/* <button className="text-[11px] font-bold text-muted-foreground hover:underline cursor-pointer transition-colors">
                            Like
                        </button> */}
                        {currentUser && (
                            <button
                                onClick={() => setIsReplying(!isReplying)}
                                className="text-[11px] font-bold text-muted-foreground hover:underline cursor-pointer transition-colors"
                            >
                                Reply
                            </button>
                        )}
                    </div>

                    {isReplying && (
                        <div className="mt-1.5 flex animate-in fade-in slide-in-from-top-1">
                            <div className="flex-1 space-y-2">
                                <Textarea
                                    autoFocus
                                    placeholder={`Reply to ${comment.author?.name}...`}
                                    className="resize-none text-xs sm:text-sm min-h-[50px] p-2"
                                    rows={2}
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                    disabled={isPending}
                                />
                                <div className="flex justify-end gap-2">
                                    <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setIsReplying(false)} disabled={isPending}>Cancel</Button>
                                    <Button size="sm" className="h-7 text-xs" onClick={handleReplySubmit} disabled={!replyContent.trim() || isPending}>
                                        {isPending ? "Posting..." : "Reply"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Recursive replies container */}
                    {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-1">
                            {!showReplies ? (
                                <button
                                    onClick={() => setShowReplies(true)}
                                    className="flex items-center gap-1.5 text-[12px] font-semibold text-muted-foreground hover:text-foreground transition-colors px-1 py-0.5"
                                >
                                    <CornerDownRight className="size-3.5" />
                                    View {comment.replies.length} repl{comment.replies.length === 1 ? 'y' : 'ies'}
                                </button>
                            ) : (
                                <div className="flex flex-col mt-[2px]">
                                    <button
                                        onClick={() => setShowReplies(false)}
                                        className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors px-1 py-0.5 mb-1"
                                    >
                                        <ChevronUp className="size-3" />
                                        Hide replies
                                    </button>
                                    {comment.replies.map((reply: any) => (
                                        <CommentItem
                                            key={reply._id || reply.id}
                                            comment={reply}
                                            currentUser={currentUser}
                                            onReply={onReply}
                                            depth={depth + 1}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const IdeaComments = ({ ideaId, totalComments, currentUser }: IdeaCommentsProps) => {
    const [localComments, setLocalComments] = useState<any[]>([]);
    const [newComment, setNewComment] = useState("");
    const [isPending, setIsPending] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Extracted so it can be called after a successful post to sync with DB
    const fetchComments = useCallback(async (silent = false) => {
        if (!silent) setIsLoading(true);
        try {
            const response = await getCommentsByIdeaId(ideaId);
            if (response.success && response.data) {
                setLocalComments(response.data);
            }
        } catch (error) {
            console.error("Failed to load comments:", error);
        } finally {
            if (!silent) setIsLoading(false);
        }
    }, [ideaId]);

    useEffect(() => {
        if (ideaId) {
            fetchComments();
        }
    }, [ideaId, fetchComments]);

    const insertReply = (nodes: any[], parentId: string | null, newEntity: any): any[] => {
        if (!parentId) {
            return [...nodes, newEntity];
        }
        return nodes.map(node => {
            if (node._id === parentId || node.id === parentId) {
                return { ...node, replies: [...(node.replies || []), newEntity] };
            }
            if (node.replies && node.replies.length > 0) {
                return { ...node, replies: insertReply(node.replies, parentId, newEntity) };
            }
            return node;
        });
    };

    const removeReply = (nodes: any[], idToRemove: string): any[] => {
        return nodes.filter(node => node.id !== idToRemove).map(node => ({
            ...node,
            replies: node.replies ? removeReply(node.replies, idToRemove) : []
        }));
    };

    const handlePostComment = async (parentId: string | null = null, content: string = newComment): Promise<boolean> => {
        if (!currentUser) {
            toast.error("Please login to comment.");
            return false;
        }
        if (!content.trim()) return false;

        const optimisticId = `temp-${Date.now()}`;
        const optimisticComment = {
            id: optimisticId,
            content,
            createdAt: new Date().toISOString(),
            parentId,
            replies: [],
            author: {
                id: currentUser.id,
                name: currentUser.name,
                image: currentUser.image,
            }
        };

        if (parentId === null) setIsPending(true);

        // Optimistic update for nested structure
        setLocalComments((prev) => insertReply(prev, parentId, optimisticComment));

        if (parentId === null) setNewComment("");

        try {
            const response = await createComment({
                content,
                ideaId,
                parentId: parentId || undefined
            });

            if (!response.success) {
                // Roll back optimistic update on API failure
                setLocalComments((prev) => removeReply(prev, optimisticId));
                if (parentId === null) setNewComment(content);
                toast.error(response.message || "Failed to post comment.");
                return false;
            }

            toast.success(parentId ? "Reply posted!" : "Comment posted!");
            // Re-fetch from DB silently — replaces optimistic temp ID with real data
            await fetchComments(true);
            return true;
        } catch (error: any) {
            setLocalComments((prev) => removeReply(prev, optimisticId));
            if (parentId === null) setNewComment(content);
            toast.error(error.message || "Failed to post comment.");
            return false;
        } finally {
            if (parentId === null) setIsPending(false);
        }
    };

    return (
        <div className="rounded-xl border border-border bg-card overflow-hidden mt-6 shadow-sm">
            <div className="border-b border-border px-5 py-4 flex items-center gap-2 bg-muted/10">
                <MessageSquare className="size-4 text-primary" />
                <h2 className="text-sm font-semibold text-foreground">
                    Discussion ({totalComments})
                </h2>
            </div>

            <div className="px-5 py-5 space-y-6">
                <div className="space-y-5">
                    {isLoading ? (
                        <div className="flex justify-center py-6 text-sm text-muted-foreground animate-pulse">
                            Loading comments...
                        </div>
                    ) : localComments.length > 0 ? (
                        localComments.map((c) => (
                            <CommentItem
                                key={c._id || c.id}
                                comment={c}
                                currentUser={currentUser}
                                onReply={(parentId: string, content: string) => handlePostComment(parentId, content)}
                            />
                        ))
                    ) : (
                        <div className="text-center py-6 text-sm text-muted-foreground border border-dashed rounded-xl bg-muted/20">
                            No comments yet. Be the first to share your thoughts!
                        </div>
                    )}
                </div>

                {!isLoading && localComments.length > 0 && <Separator className="my-2" />}

                {/* Main Topic Comment Box */}
                <div className="flex gap-3">
                    <Avatar className="size-9 shrink-0 ring-2 ring-background">
                        <AvatarImage
                            src={currentUser?.image}
                            alt={currentUser?.name}
                        />
                        <AvatarFallback className="text-xs bg-primary/10 text-primary font-bold">
                            {currentUser?.name?.slice(0, 2) || "U"}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                        <Textarea
                            placeholder={!currentUser ? "Please login to comment." : `${currentUser.name}, join the discussion...`}
                            className="resize-none text-sm transition-colors focus-visible:ring-1 min-h-[80px]"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            disabled={!currentUser || isPending}
                        />
                        <div className="flex justify-end">
                            <Button
                                size="sm"
                                disabled={!newComment.trim() || !currentUser || isPending}
                                onClick={() => handlePostComment(null, newComment)}
                                className="px-6 rounded-full font-semibold shadow-sm"
                            >
                                {isPending ? "Posting..." : "Post Comment"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IdeaComments;

