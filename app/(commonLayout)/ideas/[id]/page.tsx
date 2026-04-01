"use client";

import { useState } from "react";
import Link from "next/link";
import {
    ThumbsUp,
    ThumbsDown,
    Eye,
    Bookmark,
    BookmarkCheck,
    Share2,
    Edit,
    MessageSquare,
    ArrowLeft,
    BadgeDollarSign,
    CheckCircle,
    Star,
    TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { mockIdeas, mockCurrentUser } from "@/lib/mock-data";
import {
    formatDate,
    formatNumber,
    formatRelativeTime,
    ideaStatusLabel,
    ideaStatusVariant,
} from "@/lib/utils";

const idea = mockIdeas[0];
const relatedIdeas = mockIdeas.slice(1, 4);

const mockComments = [
    {
        id: "c1",
        content:
            "This is exactly the kind of innovation we need! The modular approach makes it very scalable.",
        author: {
            id: "user_2",
            name: "Priya Nair",
            image: "https://i.pravatar.cc/80?u=priya-nair",
        },
        createdAt: "2026-03-28T10:00:00Z",
    },
    {
        id: "c2",
        content:
            "Have you considered the battery storage costs? That might be a challenge for low-income communities.",
        author: {
            id: "user_3",
            name: "Marco Chen",
            image: "https://i.pravatar.cc/80?u=marco-chen",
        },
        createdAt: "2026-03-27T14:30:00Z",
    },
];

export default function IdeaDetailPage() {
    const [upvoted, setUpvoted] = useState(false);
    const [downvoted, setDownvoted] = useState(false);
    const [watchlisted, setWatchlisted] = useState(false);
    const [upvoteCount, setUpvoteCount] = useState(idea.upvoteCount);
    const [comment, setComment] = useState("");

    const handleUpvote = () => {
        if (upvoted) {
            setUpvoted(false);
            setUpvoteCount((c) => c - 1);
        } else {
            setUpvoted(true);
            if (downvoted) setDownvoted(false);
            setUpvoteCount((c) => c + 1);
        }
    };

    const isOwner = idea.author.id === mockCurrentUser.id;

    return (
        <div className="flex flex-1 flex-col">
            <main className="flex-1 p-6">
                <div className="mx-auto max-w-6xl">
                    {/* Back */}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="mb-5 -ml-2 gap-1.5 text-muted-foreground"
                    >
                        <Link href="/ideas">
                            <ArrowLeft className="size-4" /> Back to Ideas
                        </Link>
                    </Button>

                    <div className="grid gap-6 lg:grid-cols-3">
                        <div className="space-y-5 lg:col-span-2">
                            {idea.images[0] && (
                                <div className="overflow-hidden rounded-xl border border-border">
                                    <img
                                        src={idea.images[0]}
                                        alt={idea.title}
                                        className="h-72 w-full object-cover"
                                    />
                                </div>
                            )}

                            <div className="rounded-xl border border-border bg-card p-5">
                                <div className="mb-3 flex flex-wrap items-center gap-2">
                                    {idea.categories.map((cat) => (
                                        <Badge key={cat.id} variant="secondary" className="text-xs">
                                            {cat.name}
                                        </Badge>
                                    ))}
                                    <Badge
                                        variant={ideaStatusVariant(idea.status)}
                                        className="text-xs"
                                    >
                                        {ideaStatusLabel(idea.status)}
                                    </Badge>
                                    {idea.isFeatured && (
                                        <div className="flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-[11px] font-semibold text-accent border border-accent/20">
                                            <Star className="size-2.5 fill-accent" /> Featured
                                        </div>
                                    )}
                                </div>

                                <h1 className="text-2xl font-bold leading-tight tracking-tight mb-3">
                                    {idea.title}
                                </h1>

                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <Eye className="size-3.5" /> {formatNumber(idea.viewCount)}{" "}
                                        views
                                    </span>
                                    <span>{formatDate(idea.createdAt)}</span>
                                    {idea.publishedAt && (
                                        <span>
                                            Published {formatRelativeTime(idea.publishedAt)}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card p-3">
                                <button
                                    onClick={handleUpvote}
                                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium border ${upvoted
                                        ? "bg-primary text-primary-foreground border-primary"
                                        : "border-border text-foreground hover:bg-muted"
                                        }`}
                                >
                                    <ThumbsUp className="size-4" />
                                    {formatNumber(upvoteCount)} Upvotes
                                </button>

                                <button
                                    onClick={() => {
                                        if (downvoted) setDownvoted(false);
                                        else {
                                            setDownvoted(true);
                                            if (upvoted) {
                                                setUpvoted(false);
                                                setUpvoteCount((c) => c - 1);
                                            }
                                        }
                                    }}
                                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium border ${downvoted
                                        ? "bg-destructive text-destructive-foreground border-destructive"
                                        : "border-border text-foreground hover:bg-muted"
                                        }`}
                                >
                                    <ThumbsDown className="size-4" />
                                    {formatNumber(idea.downvoteCount)}
                                </button>

                                <button
                                    onClick={() => setWatchlisted((w) => !w)}
                                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium border ${watchlisted
                                        ? "bg-primary/10 text-primary border-primary/30"
                                        : "border-border text-foreground hover:bg-muted"
                                        }`}
                                >
                                    {watchlisted ? (
                                        <BookmarkCheck className="size-4" />
                                    ) : (
                                        <Bookmark className="size-4" />
                                    )}
                                    {watchlisted ? "Saved" : "Save"}
                                </button>

                                <button className="flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted ml-auto">
                                    <Share2 className="size-4" />
                                </button>

                                {isOwner && (
                                    <Button variant="outline" size="sm">
                                        <Link href={`/ideas/${idea.slug}/edit`}>
                                            <Edit className="size-4" /> Edit
                                        </Link>
                                    </Button>
                                )}
                            </div>

                            <div className="rounded-xl border border-border bg-card overflow-hidden">
                                <div className="border-b border-border px-5 py-3">
                                    <h2 className="text-sm font-semibold">Overview</h2>
                                </div>
                                <div className="px-5 py-4 text-sm text-foreground leading-relaxed">
                                    {idea.description}
                                </div>
                            </div>

                            <div className="rounded-xl border border-border bg-card overflow-hidden">
                                <div className="border-b border-border px-5 py-3">
                                    <h2 className="text-sm font-semibold">Problem Statement</h2>
                                </div>
                                <div className="px-5 py-4 text-sm text-foreground leading-relaxed">
                                    {idea.problemStatement}
                                </div>
                            </div>

                            <div className="rounded-xl border border-border bg-card overflow-hidden">
                                <div className="border-b border-border px-5 py-3">
                                    <h2 className="text-sm font-semibold">Proposed Solution</h2>
                                </div>
                                <div className="px-5 py-4 text-sm text-foreground leading-relaxed">
                                    {idea.proposedSolution}
                                </div>
                            </div>

                            {/* Tags */}
                            {idea.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {idea.tags.map((tag) => (
                                        <span
                                            key={tag.id}
                                            className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground font-medium"
                                        >
                                            #{tag.name}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Comments */}
                            <div className="rounded-xl border border-border bg-card overflow-hidden">
                                <div className="border-b border-border px-5 py-3 flex items-center gap-2">
                                    <MessageSquare className="size-4 text-primary" />
                                    <h2 className="text-sm font-semibold">
                                        Comments ({mockComments.length})
                                    </h2>
                                </div>
                                <div className="px-5 py-4 space-y-4">
                                    {mockComments.map((c) => (
                                        <div key={c.id} className="flex gap-3">
                                            <Avatar className="size-8 shrink-0">
                                                <AvatarImage src={c.author.image} alt={c.author.name} />
                                                <AvatarFallback className="text-xs">
                                                    {c.author.name.slice(0, 2)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 rounded-lg border border-border bg-muted/30 p-3">
                                                <div className="mb-1.5 flex items-center gap-2">
                                                    <span className="text-xs font-semibold">
                                                        {c.author.name}
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
                                                src={mockCurrentUser.image}
                                                alt={mockCurrentUser.name}
                                            />
                                            <AvatarFallback className="text-xs">
                                                {mockCurrentUser.name.slice(0, 2)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 space-y-2">
                                            <Textarea
                                                placeholder="Share your thoughts..."
                                                className="resize-none text-sm"
                                                rows={3}
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                            />
                                            <Button size="sm" disabled={!comment.trim()}>
                                                Post Comment
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {/* Author */}
                            <div className="rounded-xl border border-border bg-card overflow-hidden">
                                <div className="border-b border-border px-4 py-3">
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                        Author
                                    </p>
                                </div>
                                <div className="p-4">
                                    <Link
                                        href={`/profile/${idea.author.id}`}
                                        className="flex items-center gap-3"
                                    >
                                        <Avatar className="size-11">
                                            <AvatarImage
                                                src={idea.author.image}
                                                alt={idea.author.name}
                                            />
                                            <AvatarFallback>
                                                {idea.author.name.slice(0, 2)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-semibold">
                                                {idea.author.name}
                                            </p>
                                            <p className="text-xs text-primary mt-0.5">
                                                View profile →
                                            </p>
                                        </div>
                                    </Link>
                                </div>
                            </div>

                            {idea.isPaid ? (
                                <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
                                    <div className="mb-2 flex items-center gap-2">
                                        <BadgeDollarSign className="size-5 text-primary" />
                                        <span className="text-xl font-bold text-primary">
                                            ${idea.price}
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mb-3">
                                        Unlock full business plan, financial projections, and
                                        exclusive resources.
                                    </p>
                                    <Button className="w-full" size="sm">
                                        Purchase Idea
                                    </Button>
                                </div>
                            ) : (
                                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                                    <div className="mb-1.5 flex items-center gap-2 text-primary">
                                        <CheckCircle className="size-4" />
                                        <span className="text-sm font-semibold">Free Idea</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        This idea is freely available to all community members.
                                    </p>
                                </div>
                            )}

                            {/* Stats */}
                            <div className="rounded-xl border border-border bg-card overflow-hidden">
                                <div className="border-b border-border px-4 py-3 flex items-center gap-2">
                                    <TrendingUp className="size-3.5 text-muted-foreground" />
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                        Stats
                                    </p>
                                </div>
                                <div className="divide-y divide-border">
                                    {[
                                        { label: "Views", value: idea.viewCount.toLocaleString() },
                                        { label: "Upvotes", value: upvoteCount },
                                        { label: "Downvotes", value: idea.downvoteCount },
                                        {
                                            label: "Trending Score",
                                            value: idea.trendingScore.toFixed(1),
                                        },
                                    ].map((s) => (
                                        <div
                                            key={s.label}
                                            className="flex items-center justify-between px-4 py-2.5"
                                        >
                                            <span className="text-xs text-muted-foreground">
                                                {s.label}
                                            </span>
                                            <span className="text-xs font-semibold">{s.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Related Ideas */}
                            <div className="rounded-xl border border-border bg-card overflow-hidden">
                                <div className="border-b border-border px-4 py-3">
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                        Related Ideas
                                    </p>
                                </div>
                                <div className="divide-y divide-border">
                                    {relatedIdeas.map((rel) => (
                                        <Link
                                            key={rel.id}
                                            href={`/ideas/${rel.slug}`}
                                            className="block px-4 py-3 hover:bg-muted/50"
                                        >
                                            <p className="line-clamp-2 text-sm font-medium leading-tight">
                                                {rel.title}
                                            </p>
                                            <p className="text-[11px] text-muted-foreground mt-1">
                                                {rel.upvoteCount} upvotes
                                            </p>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
