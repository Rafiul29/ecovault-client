import { getIdeaById } from "@/services/idea.service"
import { getMyPurchasedIdeas, getMyMemberProfile } from "@/services/member.service"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"
import { ChevronLeft, Calendar, User, Eye, DollarSign, Tag as TagIcon, Folder, ShieldCheck, Clock, TrendingUp, ThumbsUp, MessageSquare, Trash2, Lock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { IIdea } from "@/types/idea.types"
import IdeaAttachments from "@/components/modules/IdeaManagement/IdeaAttachments"

// This page renders a comprehensive view of a single Idea entity for dashboard members
const MemberViewIdeaPage = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params

    // Fetch idea, purchases, and profile in parallel
    const [ideaRes, purchasesRes, profileRes] = await Promise.all([
        getIdeaById(id).catch(() => null),
        getMyPurchasedIdeas().catch(() => null),
        getMyMemberProfile().catch(() => null)
    ])

    if (!ideaRes?.success || !ideaRes.data) {
        notFound()
    }

    const idea = ideaRes.data as IIdea
    const purchases = (purchasesRes as any)?.data || []
    const currentUser = (profileRes as any)?.data
    const currentUserId = currentUser?.id || ""

    const isAuthor = currentUserId === idea.authorId
    const hasPurchased = purchases.some((p: any) => p.ideaId === idea.id)

    // Determine if user can see attachments (free idea, or they bought it, or they are the author)
    const canViewAttachments = !idea.isPaid || hasPurchased || isAuthor

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
        <div className="py-6 px-4 sm:px-6 lg:px-8 space-y-6 pb-20">
            {/* Elegant Header */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <Link href="/dashboard">
                        <Button variant="outline" size="icon" className="h-11 w-11 rounded-2xl border-neutral-200 hover:bg-neutral-50 transition-all hover:scale-105 shrink-0">
                            <ChevronLeft className="h-5 w-5 text-neutral-600" />
                        </Button>
                    </Link>
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <Badge variant="outline" className={`px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-lg border ${statusConfig.color}`}>
                                {statusConfig.icon}
                                {idea.status.replace("_", " ")}
                            </Badge>
                            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest px-2 py-0.5 bg-neutral-50 border border-neutral-100 rounded-lg">
                                #{idea.id.slice(-6)}
                            </span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-black text-neutral-900 tracking-tight">
                            {idea.title}
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                    {!canViewAttachments && idea.price > 0 && (
                        <Button className="h-11 px-6 rounded-2xl font-bold gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20 transition-all hover:scale-105">
                            <Lock className="h-4 w-4" />
                            Secure This Idea (${idea.price.toFixed(2)})
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Main Content Area */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Visual Highlights Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Problem Card */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-100 hover:border-rose-100 transition-colors group">
                            <div className="h-12 w-12 rounded-2xl bg-rose-50 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                                <Trash2 className="h-6 w-6 text-rose-500" />
                            </div>
                            <h3 className="text-lg font-bold text-neutral-900 mb-2">The Problem</h3>
                            <p className="text-sm font-medium text-neutral-500 leading-relaxed italic">
                                "{idea.problemStatement}"
                            </p>
                        </div>

                        {/* Solution Card */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-100 hover:border-emerald-100 transition-colors group">
                            <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                                <ShieldCheck className="h-6 w-6 text-emerald-500" />
                            </div>
                            <h3 className="text-lg font-bold text-neutral-900 mb-2">Proposed Solution</h3>
                            <p className="text-sm font-medium text-neutral-500 leading-relaxed">
                                {idea.proposedSolution}
                            </p>
                        </div>
                    </div>

                    {/* Image Gallery */}
                    {idea.images && idea.images.length > 0 && (
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-100">
                            <div className="flex items-center gap-2 mb-6">
                                <Eye className="h-4 w-4 text-neutral-400" />
                                <h3 className="text-sm font-black uppercase tracking-widest text-neutral-400">Media Gallery</h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {idea.images.map((img, idx) => (
                                    <div key={idx} className={`relative rounded-2xl overflow-hidden border border-neutral-100 aspect-square group`}>
                                        <Image
                                            src={img}
                                            alt={`${idea.title} - ${idx + 1}`}
                                            fill
                                            className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                                        />
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Description Card */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-neutral-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-1.5 w-6 bg-emerald-500 rounded-full" />
                            <h3 className="text-lg font-black text-neutral-900 tracking-tight">Full Project Overview</h3>
                        </div>
                        <div className="prose prose-neutral max-w-none">
                            <p className="text-neutral-600 leading-relaxed font-medium whitespace-pre-wrap text-[15px]">
                                {idea.description}
                            </p>
                        </div>
                    </div>

                    {/* Attachments Section */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-neutral-100">
                        {canViewAttachments ? (
                            <IdeaAttachments
                                ideaId={idea.id}
                                authorId={idea.authorId}
                                currentUserId={currentUserId}
                                currentUserRole="MEMBER"
                            />
                        ) : (
                            <div className="text-center py-10">
                                <div className="bg-neutral-50 h-20 w-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-neutral-100 overflow-hidden relative group">
                                    <Lock className="h-10 w-10 text-neutral-300 group-hover:scale-110 transition-transform" />
                                    <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <h3 className="text-2xl font-black text-neutral-900 mb-3 tracking-tight">Premium Content Restricted</h3>
                                <p className="text-neutral-500 max-w-md mx-auto mb-8 font-medium leading-relaxed">
                                    This idea contains exclusive resources, presentations, and detailed documentation only available to verified purchasers.
                                </p>
                                <Button className="h-12 px-8 rounded-2xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-500/20 gap-2 transition-all hover:scale-105 active:scale-95">
                                    <Lock className="h-4 w-4" />
                                    Unlock Access for ${idea.price.toFixed(2)}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar area */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Insights & Metrics */}
                    <div className="bg-neutral-900 rounded-3xl p-6 shadow-xl text-white relative overflow-hidden">
                        <TrendingUp className="absolute -bottom-4 -right-4 h-32 w-32 opacity-10 rotate-12" />

                        <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-6 border-b border-white/10 pb-4">Idea Pulse</h3>

                        <div className="grid grid-cols-2 gap-4 relative z-10">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-tighter">Total Views</p>
                                <p className="text-xl font-black text-white">{idea.viewCount.toLocaleString()}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-tighter">Engagement</p>
                                <p className="text-xl font-black text-white">{((idea as any).upvoteCount || 0) + (idea._count?.comments || 0)}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-tighter">Upvotes</p>
                                <div className="flex items-center gap-1.5">
                                    <ThumbsUp className="h-4 w-4 text-emerald-400" />
                                    <p className="text-xl font-black text-white">{(idea as any).upvoteCount || 0}</p>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-tighter">Comments</p>
                                <div className="flex items-center gap-1.5">
                                    <MessageSquare className="h-4 w-4 text-blue-400" />
                                    <p className="text-xl font-black text-white">{idea._count?.comments || 0}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pricing Block */}
                    <div className={`p-6 rounded-3xl border-2 transition-all shadow-sm ${idea.isPaid ? 'bg-emerald-50/30 border-emerald-500/20' : 'bg-white border-neutral-100'}`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${idea.isPaid ? 'bg-emerald-100 text-emerald-600' : 'bg-neutral-100 text-neutral-500'}`}>
                                    <DollarSign className="h-5 w-5" />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Access Mode</p>
                                    <p className="font-bold text-neutral-900">{idea.isPaid ? 'Paid Tier' : 'Open Access'}</p>
                                </div>
                            </div>
                            {idea.isPaid && (
                                <div className="text-right">
                                    <p className="text-2xl font-black text-emerald-600">${idea.price.toFixed(2)}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Author Details */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-100">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-4 flex items-center gap-2">
                            <User className="h-3.5 w-3.5" /> Project Author
                        </h3>
                        <div className="flex items-center gap-4 p-3 rounded-2xl bg-neutral-50 border border-neutral-100">
                            <div className="h-12 w-12 rounded-xl bg-neutral-200 flex items-center justify-center font-bold text-neutral-600 overflow-hidden relative">
                                {idea.author?.image ? (
                                    <Image src={idea.author.image} alt={idea.author.name} fill className="object-cover" />
                                ) : (
                                    idea.author?.name?.charAt(0) || "A"
                                )}
                            </div>
                            <div className="overflow-hidden">
                                <p className="font-bold text-neutral-900 truncate">{idea.author?.name || "Anonymous"}</p>
                                <p className="text-xs text-neutral-500 truncate">{idea.author?.email}</p>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-neutral-50 space-y-2">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-neutral-400 font-bold uppercase tracking-tighter">Published</span>
                                <span className="text-neutral-700 font-bold">{format(new Date(idea.createdAt), "MMM d, yyyy")}</span>
                            </div>
                        </div>
                    </div>

                    {/* Taxonomy (Categories & Tags) */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-100 space-y-6">
                        <div className="space-y-3">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                                <Folder className="h-3.5 w-3.5" /> Discovery
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {idea.categories?.map((c) => (
                                    <Badge key={c.category.id} variant="secondary" className="px-3 py-1 rounded-lg border hover:scale-105 transition-transform" style={{ backgroundColor: c.category.color + "15", color: c.category.color, borderColor: c.category.color + "30" }}>
                                        {c.category.name}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3 pt-4 border-t border-neutral-50">
                            <div className="flex flex-wrap gap-1.5">
                                {idea.tags?.map((t) => (
                                    <Badge key={t.tag.id} variant="outline" className="px-2 py-0.5 text-[10px] rounded-md border-neutral-200 text-neutral-500 font-medium">
                                        #{t.tag.name}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MemberViewIdeaPage
