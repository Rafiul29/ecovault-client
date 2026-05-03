"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { IIdea } from "@/types/idea.types"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar, User, Eye, DollarSign, Tag, Folder, Sparkles, FileText, CheckCircle2 } from "lucide-react"
import Image from "next/image"
import { format } from "date-fns"

interface ViewIdeaDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    idea: IIdea | null
}

const ViewIdeaDialog = ({ open, onOpenChange, idea }: ViewIdeaDialogProps) => {
    if (!idea) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-5xl max-h-[90vh] p-0 overflow-hidden flex flex-col rounded-[2.5rem] border-none shadow-2xl bg-background/50 backdrop-blur-3xl sm:rounded-[3rem]">
                <DialogHeader className="px-8 pt-10 pb-6 border-b border-border bg-card md:px-12 relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-600" />
                    <div className="flex items-center gap-3 mb-4">
                        <Badge className={`rounded-lg px-3 py-1 text-[10px] font-black uppercase tracking-widest shadow-none ${idea.status === 'APPROVED' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
                            {idea.status}
                        </Badge>
                        {idea.isFeatured && (
                            <Badge className="bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900 rounded-lg px-3 py-1 text-[10px] font-black uppercase tracking-widest shadow-none border-none">
                                <Sparkles className="w-3 h-3 mr-1 inline" /> Featured
                            </Badge>
                        )}
                    </div>
                    <DialogTitle className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground font-sans leading-tight">
                        {idea.title}
                    </DialogTitle>
                    <DialogDescription className="font-mono text-xs font-bold text-muted-foreground mt-2 tracking-widest">
                        ID: {idea.id} <span className="mx-2 opacity-50">•</span> SLUG: {idea.slug}
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="flex-1">
                    <div className="p-8 md:p-12 space-y-10 pb-16">
                        {/* Summary Section Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: "Author", value: idea.author?.name || "N/A", icon: User, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950" },
                                { label: "Joined", value: format(new Date(idea.createdAt), "PP"), icon: Calendar, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950" },
                                { label: "Views", value: idea.viewCount.toString(), icon: Eye, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950" },
                                { label: "Price", value: idea.isPaid ? `$${idea.price.toFixed(2)}` : "Free", icon: DollarSign, color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-50 dark:bg-rose-950" },
                            ].map((stat, i) => (
                                <div key={i} className="flex flex-col bg-card p-5 rounded-3xl border border-border shadow-sm hover:shadow-md transition-shadow group">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className={`h-8 w-8 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center transition-colors group-hover:bg-foreground group-hover:text-background`}>
                                            <stat.icon className="h-4 w-4" />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                                            {stat.label}
                                        </span>
                                    </div>
                                    <span className="text-lg font-black text-foreground tracking-tight pl-1">
                                        {stat.value}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Content Card */}
                        <div className="bg-card rounded-[2.5rem] border border-border shadow-sm overflow-hidden p-8 md:p-10 space-y-10">
                            <div>
                                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2 mb-4">
                                    <FileText className="h-4 w-4 text-emerald-500" /> Description
                                </h3>
                                <p className="text-[15px] leading-relaxed text-foreground font-medium">
                                    {idea.description}
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8 pt-8 border-t border-dashed border-border">
                                <div className="bg-rose-500/5 rounded-3xl p-6 border border-rose-500/20">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-rose-500 mb-4">Problem Statement</h3>
                                    <p className="text-[15px] leading-relaxed italic text-foreground font-medium">
                                        "{idea.problemStatement}"
                                    </p>
                                </div>
                                <div className="bg-emerald-500/5 rounded-3xl p-6 border border-emerald-500/20">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-4 flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4" /> Proposed Solution
                                    </h3>
                                    <p className="text-[15px] leading-relaxed text-foreground font-medium">
                                        {idea.proposedSolution}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Taxonomy Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-card rounded-3xl p-8 border border-border shadow-sm">
                                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2 mb-5">
                                    <Folder className="h-4 w-4 text-blue-500" /> Categories
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {idea.categories && idea.categories.length > 0 ? (
                                        idea.categories.map(({ category }) => (
                                            <Badge key={category.id} variant="secondary" className="px-3 py-1.5 rounded-xl font-bold text-xs" style={{ backgroundColor: category.color + "15", color: category.color, borderColor: category.color }}>
                                                {category.name}
                                            </Badge>
                                        ))
                                    ) : (
                                        <p className="text-xs font-bold text-muted-foreground italic">No categories</p>
                                    )}
                                </div>
                            </div>

                            <div className="bg-card rounded-3xl p-8 border border-border shadow-sm">
                                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2 mb-5">
                                    <Tag className="h-4 w-4 text-purple-500" /> Tags
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {idea.tags && idea.tags.length > 0 ? (
                                        idea.tags.map(({ tag }) => (
                                            <Badge key={tag.id} variant="outline" className="px-3 py-1.5 rounded-xl font-bold text-xs border-border text-foreground hover:border-emerald-500/50">
                                                #{tag.name}
                                            </Badge>
                                        ))
                                    ) : (
                                        <p className="text-xs font-bold text-muted-foreground italic">No tags</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Images Section */}
                        {idea.images && idea.images.length > 0 && (
                            <div className="bg-card rounded-[2.5rem] p-8 md:p-10 border border-border shadow-sm">
                                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-6">Visual Gallery</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {idea.images.map((img, i) => (
                                        <div key={i} className="relative aspect-video rounded-3xl overflow-hidden border border-border bg-muted/50 shadow-md hover:shadow-xl transition-shadow group">
                                            <Image src={img} alt={`Slide ${i}`} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}

export default ViewIdeaDialog