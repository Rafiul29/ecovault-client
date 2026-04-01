import Link from "next/link";
import {
    Eye,
    ArrowLeft,
    BadgeDollarSign,
    CheckCircle,
    Star,
    TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getIdeaById, getIdeas } from "@/services/idea.service";
import { getUserInfo } from "@/services/auth.service";
import {
    formatDate,
    formatNumber,
    ideaStatusLabel,
    ideaStatusVariant,
} from "@/lib/utils";
import IdeaInteraction from "@/components/modules/IdeaDetail/IdeaInteraction";
import IdeaComments from "@/components/modules/IdeaDetail/IdeaComments";
import IdeaAttachments from "@/components/modules/IdeaDetail/IdeaAttachments";
import { notFound } from "next/navigation";
import { IdeaStatus } from "@/types/types";

export default async function IdeaDetailPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    const ideaResponse = await getIdeaById(id);
    const currentUser = await getUserInfo();

    if (!ideaResponse.success || !ideaResponse.data) {
        return notFound();
    }

    const idea = ideaResponse.data;
    const isOwner = currentUser?.id === idea.authorId;

    // Fetch related ideas
    const relatedIdeasResponse = await getIdeas(`limit=3&exclude=${idea.id}&status=APPROVED`);
    const relatedIdeas = relatedIdeasResponse.data || [];

    // Determine current user's vote
    const userVoteObj = idea.votes?.find(v => v.userId === currentUser?.id);
    const initialUserVote = userVoteObj ? userVoteObj.value : 0;

    return (
        <div className="flex flex-1 flex-col py-5 px-3 md:px-0">
            <main className="flex-1">
                <div className="mx-auto max-w-7xl">
                    {/* Back */}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="mb-5 -ml-2 gap-1.5 text-muted-foreground"
                        asChild
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
                                    {idea.categories?.map((cat) => (
                                        <Badge key={cat.categoryId} variant="secondary" className="text-xs">
                                            {cat.category?.name || "Category"}
                                        </Badge>
                                    ))}
                                    <Badge
                                        variant={ideaStatusVariant(idea.status as IdeaStatus)}
                                        className="text-xs"
                                    >
                                        {ideaStatusLabel(idea.status as IdeaStatus)}
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
                                </div>
                            </div>

                            {/* Use split interaction component */}
                            <IdeaInteraction
                                ideaId={idea.id}
                                slug={idea.slug}
                                initialUpvotes={idea.upvoteCount}
                                initialDownvotes={idea.downvoteCount}
                                initialUserVote={initialUserVote}
                                isOwner={isOwner}
                                watchlisted={idea.watchlists?.some((w: any) => w.userId === currentUser?.id) || false}
                                initialWatchlistCount={idea.watchlists?.length || 0}
                                isLoggedIn={!!currentUser}
                            />

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

                            {/* Attachments: isPaid false show, isPaid true hide */}
                            {!idea.isPaid && idea.attachments && idea.attachments.length > 0 && (
                                <IdeaAttachments attachments={idea.attachments} />
                            )}

                            {/* Tags */}
                            {idea.tags && idea.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {idea.tags.map((tag) => (
                                        <span
                                            key={tag.tagId}
                                            className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground font-medium"
                                        >
                                            #{tag.tag?.name}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Use split comments component */}
                            <IdeaComments
                                ideaId={idea.id}
                                comments={idea.comments || []}
                                currentUser={currentUser}
                            />
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
                                        href={`/profile/${idea.author?.id}`}
                                        className="flex items-center gap-3"
                                    >
                                        <Avatar className="size-11">
                                            <AvatarImage
                                                src={idea.author?.image || undefined}
                                                alt={idea.author?.name}
                                            />
                                            <AvatarFallback>
                                                {idea.author?.name?.slice(0, 2) || "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-semibold">
                                                {idea.author?.name}
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
                                        { label: "Upvotes", value: idea.upvoteCount },
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
                            {relatedIdeas.length > 0 && (
                                <div className="rounded-xl border border-border bg-card overflow-hidden">
                                    <div className="border-b border-border px-4 py-3">
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                            Related Ideas
                                        </p>
                                    </div>
                                    <div className="divide-y divide-border">
                                        {relatedIdeas.map((rel: any) => (
                                            <Link
                                                key={rel.id}
                                                href={`/ideas/${rel.id}`}
                                                className="block px-4 py-3 hover:bg-muted/50"
                                            >
                                                <p className="line-clamp-2 text-sm font-medium leading-tight text-neutral-800">
                                                    {rel.title}
                                                </p>
                                                <p className="text-[11px] text-muted-foreground mt-1">
                                                    {rel.upvoteCount} upvotes
                                                </p>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

