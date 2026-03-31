import { getIdeaById } from "@/services/idea.services"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"
import { ChevronLeft, Calendar, User, Eye, DollarSign, Tag as TagIcon, Folder, Edit3, Trash2, ShieldCheck, Clock, TrendingUp, ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { IIdea } from "@/types/idea.types"
import IdeaAttachments from "@/components/modules/Admin/IdeaManagement/IdeaAttachments"

// This page renders a premium view of a single Idea entity
const ViewIdeaPage = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params
    const response = await getIdeaById(id)

    if (!response?.success || !response.data) {
        notFound()
    }

    const idea = response.data as IIdea

    // Helper functions for status styling
    const getStatusConfig = (status: string) => {
        switch (status) {
            case "APPROVED": return { color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: <ShieldCheck className="h-4 w-4 mr-1" /> }
            case "UNDER_REVIEW": return { color: "bg-amber-50 text-amber-700 border-amber-200", icon: <Clock className="h-4 w-4 mr-1" /> }
            case "REJECTED": return { color: "bg-rose-50 text-rose-700 border-rose-200", icon: <Trash2 className="h-4 w-4 mr-1" /> }
            default: return { color: "bg-neutral-100 text-neutral-700 border-neutral-200", icon: null }
        }
    }

    const statusConfig = getStatusConfig(idea.status)

    return (
        <div className="max-w-[1600px] mx-auto py-8 px-4 sm:px-6 lg:px-8 h-full pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-8 border-b border-neutral-100 mb-8">
                <div className="flex items-start gap-6">
                    <Link href="/admin/dashboard/idea-management">
                        <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-2 border-neutral-100 hover:bg-neutral-50 shadow-sm transition-all hover:-translate-x-1 shrink-0 mt-1">
                            <ChevronLeft className="h-6 w-6 text-neutral-600" />
                        </Button>
                    </Link>
                    <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-3">
                            <Badge variant="outline" className={`px-3 py-1 text-xs font-black uppercase tracking-widest rounded-full border-2 ${statusConfig.color}`}>
                                {statusConfig.icon}
                                {idea.status.replace("_", " ")}
                            </Badge>
                            {idea.isFeatured && (
                                <Badge className="px-3 py-1 bg-linear-to-r from-amber-400 to-orange-500 text-white text-xs font-black uppercase tracking-widest rounded-full border-none shadow-lg shadow-orange-500/20">
                                    Featured Idea
                                </Badge>
                            )}
                            <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest bg-neutral-100 px-2 py-1 rounded-md">
                                ID: {idea.id.slice(-8)}
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-neutral-900 tracking-tight leading-tight">
                            {idea.title}
                        </h1>
                        <p className="text-sm font-bold text-neutral-400 flex items-center gap-2">
                            <Link href={`/projects/${idea.slug}`} className="hover:text-emerald-600 transition-colors hover:underline">
                                /{idea.slug}
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                    <Link href={`/admin/dashboard/idea-management/edit/${idea.id}`}>
                        <Button variant="outline" className="h-12 px-6 rounded-2xl font-bold gap-2 text-neutral-600 hover:text-emerald-700 hover:border-emerald-200 hover:bg-emerald-50 transition-all border-2">
                            <Edit3 className="h-4 w-4" />
                            Edit Idea
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">

                {/* Main Content Column */}
                <div className="xl:col-span-2 space-y-8">

                    {/* Hero Images Gallery */}
                    {idea.images && idea.images.length > 0 && (
                        <div className="bg-white rounded-[2.5rem] p-4 sm:p-6 shadow-sm border border-neutral-100">
                            <h2 className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-6 px-2">Project Gallery</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {idea.images.map((img, idx) => (
                                    <div key={idx} className={`relative rounded-3xl overflow-hidden bg-neutral-100 border border-neutral-100 ${idx === 0 && idea.images.length % 2 !== 0 ? 'sm:col-span-2 aspect-video' : 'aspect-square sm:aspect-4/3'}`}>
                                        <Image
                                            src={img}
                                            alt={`${idea.title} - Image ${idx + 1}`}
                                            fill
                                            className="object-cover hover:scale-105 transition-transform duration-700"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Detailed Content */}
                    <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-sm border border-neutral-100 space-y-12">

                        {/* Description */}
                        <div>
                            <h2 className="flex items-center gap-3 text-lg font-black text-neutral-900 tracking-tight mb-4">
                                <div className="h-8 w-2 bg-emerald-500 rounded-full" />
                                Comprehensive Description
                            </h2>
                            <p className="text-neutral-600 leading-relaxed text-lg font-medium whitespace-pre-wrap pl-5 border-l-2 border-neutral-100">
                                {idea.description}
                            </p>
                        </div>

                        <Separator className="bg-neutral-100" />

                        {/* Problem & Solution */}
                        <div className="grid md:grid-cols-2 gap-10">
                            <div className="space-y-4">
                                <h3 className="text-sm font-black uppercase tracking-widest text-rose-500 flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                                    The Problem
                                </h3>
                                <div className="bg-rose-50/50 rounded-3xl p-6 border border-rose-100">
                                    <p className="text-neutral-700 font-medium leading-relaxed italic">
                                        "{idea.problemStatement}"
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-sm font-black uppercase tracking-widest text-emerald-500 flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                    Proposed Solution
                                </h3>
                                <div className="bg-emerald-50/50 rounded-3xl p-6 border border-emerald-100">
                                    <p className="text-neutral-700 font-medium leading-relaxed">
                                        {idea.proposedSolution}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Resources & Attachments */}
                    <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-sm border border-neutral-100 mt-8">
                        <IdeaAttachments ideaId={idea.id} authorId={idea.authorId} currentUserId={idea.authorId} currentUserRole="ADMIN" />
                    </div>
                </div>

                {/* Sidebar Column */}
                <div className="xl:col-span-1 space-y-8">

                    {/* Author & Stats Card */}
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-neutral-100 bg-linear-to-br from-white to-neutral-50/50 relative overflow-hidden">

                        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                            <TrendingUp className="h-32 w-32" />
                        </div>

                        <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-8 flex items-center gap-2 border-b border-neutral-100 pb-4">
                            Metrics & Details
                        </h3>

                        <div className="space-y-8">

                            <div className="flex items-center gap-4">
                                <div className="h-14 w-14 rounded-full bg-emerald-100 flex items-center justify-center border-2 border-emerald-200">
                                    <User className="h-6 w-6 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-0.5">Author</p>
                                    <p className="font-bold text-neutral-900">{idea.author?.name || "Anonymous"}</p>
                                    <p className="text-xs text-neutral-500 font-medium">{idea.author?.email}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-white rounded-2xl border border-neutral-100 shadow-sm">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 flex items-center gap-1.5 mb-2">
                                        <Calendar className="h-3 w-3" /> Created
                                    </p>
                                    <p className="font-bold text-neutral-800 text-sm">{format(new Date(idea.createdAt), "MMM d, yyyy")}</p>
                                </div>
                                <div className="p-4 bg-white rounded-2xl border border-neutral-100 shadow-sm">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 flex items-center gap-1.5 mb-2">
                                        <Eye className="h-3 w-3" /> Views
                                    </p>
                                    <p className="font-bold text-neutral-800 text-sm">{idea.viewCount.toLocaleString()} views</p>
                                </div>
                                <div className="p-4 bg-white rounded-2xl border border-neutral-100 shadow-sm flex flex-col justify-center">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 flex items-center gap-1.5 mb-2">
                                        <ThumbsUp className="h-3 w-3 text-emerald-500" /> Upvotes
                                    </p>
                                    <p className="font-bold text-neutral-800 text-sm">{(idea as any).upvoteCount || 0}</p>
                                </div>
                                <div className="p-4 bg-white rounded-2xl border border-neutral-100 shadow-sm flex flex-col justify-center">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 flex items-center gap-1.5 mb-2">
                                        <MessageSquare className="h-3 w-3 text-blue-500" /> Comments
                                    </p>
                                    <p className="font-bold text-neutral-800 text-sm">{idea._count?.comments || 0}</p>
                                </div>
                            </div>

                            <Separator className="bg-neutral-100" />

                            <div className="space-y-4">
                                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Pricing Tier</p>
                                <div className={`p-5 rounded-2xl border-2 flex items-center justify-between ${idea.isPaid ? 'bg-emerald-50/50 border-emerald-500/30' : 'bg-neutral-50 border-neutral-200'}`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${idea.isPaid ? 'bg-emerald-100 text-emerald-600' : 'bg-neutral-200 text-neutral-600'}`}>
                                            <DollarSign className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className={`font-bold ${idea.isPaid ? 'text-emerald-900' : 'text-neutral-700'}`}>
                                                {idea.isPaid ? "Paid Access" : "Free Access"}
                                            </p>
                                        </div>
                                    </div>
                                    {idea.isPaid && (
                                        <div className="text-right">
                                            <span className="text-xl font-black text-emerald-600">${idea.price.toFixed(2)}</span>
                                            <span className="text-xs font-bold text-emerald-600/50 ml-1">USD</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Taxonomy Card */}
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-neutral-100">
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                                    <Folder className="h-3.5 w-3.5" /> Categories
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {idea.categories && idea.categories.length > 0 ? (
                                        idea.categories.map((c) => (
                                            <Badge key={c.category.id} variant="secondary" className="px-3 py-1.5 rounded-xl border-2 hover:scale-105 transition-transform" style={{ backgroundColor: c.category.color + "15", color: c.category.color, borderColor: c.category.color + "30" }}>
                                                {c.category.name}
                                            </Badge>
                                        ))
                                    ) : (
                                        <p className="text-xs font-medium text-neutral-400 italic bg-neutral-50 px-3 py-2 rounded-lg border border-neutral-100">No categories assigned</p>
                                    )}
                                </div>
                            </div>

                            <Separator className="bg-neutral-100" />

                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                                    <TagIcon className="h-3.5 w-3.5" /> Tags
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {idea.tags && idea.tags.length > 0 ? (
                                        idea.tags.map((t) => (
                                            <Badge key={t.tag.id} variant="outline" className="px-3 py-1.5 rounded-xl border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-600 font-bold transition-colors">
                                                #{t.tag.name}
                                            </Badge>
                                        ))
                                    ) : (
                                        <p className="text-xs font-medium text-neutral-400 italic bg-neutral-50 px-3 py-2 rounded-lg border border-neutral-100">No tags assigned</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default ViewIdeaPage
