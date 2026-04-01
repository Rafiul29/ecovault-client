"use client";

import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { formatRelativeTime } from "@/lib/utils";
import { createComment } from "@/services/comment.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface IdeaCommentsProps {
    ideaId: string;
    comments: any[];
    currentUser?: any;
}

const IdeaComments = ({ ideaId, comments, currentUser }: IdeaCommentsProps) => {
    const router = useRouter();
    const [newComment, setNewComment] = useState("");
    const [isPending, setIsPending] = useState(false);

    const handlePostComment = async () => {
        if (!currentUser) {
            toast.error("Please login to comment.");
            return;
        }

        setIsPending(true);
        try {
            const response = await createComment({
                content: newComment,
                ideaId,
            });

            if (response.success) {
                toast.success("Comment posted!");
                setNewComment("");
                router.refresh();
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to post comment.");
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div className="rounded-xl border border-border bg-card overflow-hidden mt-6">
            <div className="border-b border-border px-5 py-3 flex items-center gap-2">
                <MessageSquare className="size-4 text-primary" />
                <h2 className="text-sm font-semibold">
                    Comments ({comments.length})
                </h2>
            </div>
            <div className="px-5 py-4 space-y-4">
                {comments.map((c) => (
                    <div key={c.id} className="flex gap-3">
                        <Avatar className="size-8 shrink-0">
                            <AvatarImage src={c.author?.image} alt={c.author?.name} />
                            <AvatarFallback className="text-xs">
                                {c.author?.name?.slice(0, 2) || "U"}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 rounded-lg border border-border bg-muted/30 p-3">
                            <div className="mb-1.5 flex items-center gap-2">
                                <span className="text-xs font-semibold">
                                    {c.author?.name}
                                </span>
                                <span className="text-[11px] text-muted-foreground">
                                    {formatRelativeTime(c.createdAt)}
                                </span>
                            </div>
                            <p className="text-sm text-foreground leading-relaxed">
                                {c.content}
                            </p>
                        </div>
                    </div>
                ))}

                {/* Add comment */}
                <Separator />
                <div className="flex gap-3">
                    <Avatar className="size-8 shrink-0">
                        <AvatarImage
                            src={currentUser?.image}
                            alt={currentUser?.name}
                        />
                        <AvatarFallback className="text-xs">
                            {currentUser?.name?.slice(0, 2) || "U"}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                        <Textarea
                            placeholder="Share your thoughts..."
                            className="resize-none text-sm"
                            rows={3}
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            disabled={!currentUser || isPending}
                        />
                        <Button
                            size="sm"
                            disabled={!newComment.trim() || !currentUser || isPending}
                            onClick={handlePostComment}
                        >
                            {isPending ? "Posting..." : "Post Comment"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IdeaComments;
