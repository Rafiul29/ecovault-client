import { getIdeaById } from "@/services/idea.service"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"
import { ChevronLeft, Calendar, User, Eye, DollarSign, Tag as TagIcon, Folder, Edit3, Trash2, ShieldCheck, Clock, TrendingUp, ThumbsUp, ThumbsDown, MessageSquare, Save, Share2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { IIdea } from "@/types/idea.types"
import IdeaAttachments from "@/components/modules/IdeaManagement/IdeaAttachments"
import IdeaInteraction from "@/components/modules/IdeaDetail/IdeaInteraction"
import { getUserInfo } from "@/services/auth.service"
import { API_BASE_URL } from "@/lib/env"
import IdeaComments from "@/components/modules/IdeaDetail/IdeaComments"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import FollowButton from "@/components/modules/Profile/FollowButton"

// This page renders a premium view of a single Idea entity
const ViewIdeaPage = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params
    const response = await getIdeaById(id)

    const currentUser = await getUserInfo();

    if (!response?.success || !response.data) {
        notFound()
    }

    const idea = response.data as IIdea

    const isOwner = currentUser?.id === idea.authorId;


    // Determine current user's vote
    const userVoteObj = idea.votes?.find(v => v.userId === currentUser?.id);
    const initialUserVote = userVoteObj ? userVoteObj.value : 0;

    // Fetch author's followers to determine follow state
    let authorFollowerCount = 0;
    let isFollowingAuthor = false;
    try {
        const followRes = await fetch(`${API_BASE_URL}/follows/followers/${idea.authorId}`);
        const followJson = await followRes.json();
        if (followJson?.success) {
            const followers: any[] = followJson.data || [];
            authorFollowerCount = followers.length;
            isFollowingAuthor = followers.some(
                (f: any) => f.follower?.id === currentUser?.id || f.followerId === currentUser?.id
            );
        }
    } catch {
        // Non-critical
    }

    // Helper functions for status styling
    const getStatusConfig = (status: string) => {
        switch (status) {
            case "APPROVED": return { color: "bg-emerald-50 text-emerald-700 border-emerald-100", icon: <ShieldCheck className="h-3.5 w-3.5 mr-1.5" /> }
            case "UNDER_REVIEW": return { color: "bg-amber-50 text-amber-700 border-amber-100", icon: <Clock className="h-3.5 w-3.5 mr-1.5" /> }
            case "REJECTED": return { color: "bg-rose-50 text-rose-700 border-rose-100", icon: <Trash2 className="h-3.5 w-3.5 mr-1.5" /> }
            default: return { color: "bg-neutral-100 text-neutral-700 border-neutral-200", icon: null }
        }
    }

    const statusConfig = getStatusConfig(idea.status)

    return (

        <div className="py-8 px-4 sm:px-6 space-y-5 bg-slate-50/30 min-h-screen">

            {/* Top Navigation & Interaction Bar (Matches Image Design) */}
            <div className="">

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
                {/*
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="h-9 px-3 rounded-xl hover:bg-slate-50 text-slate-500 font-bold text-xs" asChild>
                        <Link href="/admin/dashboard/idea-management">
                            <ChevronLeft className="h-4 w-4 mr-1" /> Back
                        </Link>
                    </Button>
                    <Separator orientation="vertical" className="h-4 mx-1" />
                    <div className="flex items-center bg-emerald-800 text-white px-3 py-1.5 rounded-xl gap-2 cursor-default">
                        <ThumbsUp className="h-4 w-4" />
                        <span className="text-xs font-bold">1 Upvotes</span>
                    </div>
                    <Button variant="outline" size="sm" className="h-9 px-4 rounded-xl border-slate-200 text-slate-600 font-bold text-xs">
                        <ThumbsDown className="h-4 w-4 mr-2" /> 0
                    </Button>
                    <Button variant="outline" size="sm" className="h-9 px-4 rounded-xl border-emerald-100 bg-emerald-50/50 text-emerald-700 font-bold text-xs">
                        <Save className="h-4 w-4 mr-2" /> Saved 1
                    </Button>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl border-slate-200">
                        <Share2 className="h-4 w-4 text-slate-500" />
                    </Button>
                </div> */}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: Content */}
                <div className="lg:col-span-8 space-y-5">

                    {/* Idea Header Section */}
                    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                        <div className="p-5 border-b border-slate-50 bg-slate-50/30">
                            <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline" className={`text-[10px] uppercase font-bold py-0 ${statusConfig.color}`}>
                                    {statusConfig.icon} {idea.status}
                                </Badge>
                                <span className="text-[10px] font-bold text-slate-400">ID: #{idea.id.slice(-6)}</span>
                            </div>
                            <h1 className="text-2xl font-bold text-slate-900 leading-tight">{idea.title}</h1>
                        </div>
                    </div>

                    {/* Overview Card (Clean Image-like Style) */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all hover:border-emerald-100">
                        <div className="px-5 py-3 border-b border-slate-50 bg-slate-50/20">
                            <h3 className="text-sm font-bold text-slate-800">Overview</h3>
                        </div>
                        <div className="p-5 text-sm text-slate-600 leading-relaxed font-medium">
                            {idea.description || "Project details summary goes here..."}
                        </div>
                    </div>

                    {/* Problem Statement Card */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all hover:border-rose-100">
                        <div className="px-5 py-3 border-b border-slate-50 bg-slate-50/20">
                            <h3 className="text-sm font-bold text-slate-800">Problem Statement</h3>
                        </div>
                        <div className="p-5 text-sm text-slate-600 leading-relaxed">
                            {idea.problemStatement}
                        </div>
                    </div>

                    {/* Proposed Solution Card */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all hover:border-emerald-100">
                        <div className="px-5 py-3 border-b border-slate-50 bg-slate-50/20">
                            <h3 className="text-sm font-bold text-slate-800">Proposed Solution</h3>
                        </div>
                        <div className="p-5 text-sm text-slate-600 leading-relaxed italic">
                            {idea.proposedSolution}
                        </div>
                    </div>

                    {/* Attachments (Integrated within the same style) */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-2">
                        <IdeaAttachments
                            ideaId={idea.id}
                            authorId={idea.authorId}
                            currentUserId={idea.authorId}
                            currentUserRole="MEMBER"
                        />
                    </div>

                    {/* Use split comments component */}
                    <IdeaComments
                        ideaId={idea?.id}
                        totalComments={idea?._count?.comments || 0}
                        currentUser={currentUser}
                    />
                </div>

                {/* Right Column: Sidebar (Sticky) */}
                <div className="lg:col-span-4 space-y-5">
                    <div className="sticky top-6 space-y-5">

                        {/* Author Card (Modern Profile Style) */}
                        {/* <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Project Author</h4>
                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center font-bold text-emerald-700 overflow-hidden relative">
                                    {idea.author?.image ? (
                                        <Image src={idea.author.image} alt="author" fill className="object-cover" />
                                    ) : idea.author?.name?.charAt(0)}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-slate-800 truncate">{idea.author?.name}</p>
                                    <p className="text-[10px] text-slate-500 truncate">{idea.author?.email}</p>
                                </div>
                            </div>
                        </div> */}

                        <div className="rounded-xl border border-border bg-card overflow-hidden">
                            <div className="border-b border-border px-4 py-3">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    Author
                                </p>
                            </div>
                            <div className="p-4 space-y-3">
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
                                <FollowButton
                                    targetUserId={idea.authorId}
                                    initialIsFollowing={isFollowingAuthor}
                                    initialFollowerCount={authorFollowerCount}
                                    currentUserId={currentUser?.id}
                                    showCount={true}
                                />
                            </div>
                        </div>


                        {/* Metrics Card */}
                        <div className="bg-slate-900 rounded-2xl p-5 shadow-lg text-white">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase">Views</p>
                                    <p className="text-xl font-bold">{idea.viewCount.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase">Comments</p>
                                    <p className="text-xl font-bold">{idea._count?.comments || 0}</p>
                                </div>
                            </div>
                        </div>

                        {/* Taxonomy Card */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
                            <div>
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                                    <Folder className="h-3 w-3" /> Categories
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {idea.categories?.map((c) => (
                                        <Badge key={c.category.id} className="bg-slate-50 text-slate-600 border-slate-100 hover:bg-slate-100 px-2.5 py-1 rounded-lg">
                                            {c.category.name}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                            <Separator className="bg-slate-50" />
                            <div>
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                                    <TagIcon className="h-3 w-3" /> Tags
                                </h4>
                                <div className="flex flex-wrap gap-1.5">
                                    {idea.tags?.map((t) => (
                                        <span key={t.tag.id} className="text-[11px] font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md">
                                            #{t.tag.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );

}

export default ViewIdeaPage
