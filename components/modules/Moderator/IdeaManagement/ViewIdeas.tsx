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
import { Separator } from "@/components/ui/separator"
import { Calendar, User, Eye, Vote, DollarSign, Tag, Folder } from "lucide-react"
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
            <DialogContent className="max-w-5xl max-h-[85vh] p-0 overflow-hidden flex flex-col">
                <DialogHeader className="p-6 border-b">
                    <div className="flex items-center gap-2 mb-2">
                        <Badge variant={idea.status === "APPROVED" ? "default" : "secondary"}>
                            {idea.status}
                        </Badge>
                        {idea.isFeatured && (
                            <Badge className="bg-amber-500 hover:bg-amber-600">Featured</Badge>
                        )}
                    </div>
                    <DialogTitle className="text-2xl">{idea.title}</DialogTitle>
                    <DialogDescription className="font-mono text-xs">
                        ID: {idea.id} | Slug: {idea.slug}
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="flex-1">
                    <div className="p-6 space-y-8 pb-10">
                        {/* Summary Section */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="space-y-1">
                                <p className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1">
                                    <User className="h-3 w-3" /> Author
                                </p>
                                <p className="text-sm font-medium">{idea.author?.name || "N/A"}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1">
                                    <Calendar className="h-3 w-3" /> Joined
                                </p>
                                <p className="text-sm font-medium">{format(new Date(idea.createdAt), "PP")}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1">
                                    <Eye className="h-3 w-3" /> Views
                                </p>
                                <p className="text-sm font-medium">{idea.viewCount}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1">
                                    <DollarSign className="h-3 w-3" /> Price
                                </p>
                                <p className="text-sm font-medium">
                                    {idea.isPaid ? `$${idea.price.toFixed(2)}` : "Free"}
                                </p>
                            </div>
                        </div>

                        {/* Content Sections */}
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">Description</h3>
                                <p className="text-sm leading-relaxed">{idea.description}</p>
                            </div>

                            <Separator />

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">Problem Statement</h3>
                                    <p className="text-sm leading-relaxed italic border-l-2 pl-3 py-1 bg-muted/30">
                                        "{idea.problemStatement}"
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">Proposed Solution</h3>
                                    <p className="text-sm leading-relaxed">
                                        {idea.proposedSolution}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Taxonomy Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                    <Folder className="h-4 w-4" /> Categories
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {idea.categories && idea.categories.length > 0 ? (
                                        idea.categories.map(({ category }) => (
                                            <Badge key={category.id} variant="secondary" className="px-2" style={{ backgroundColor: category.color + "15", color: category.color, borderColor: category.color }}>
                                                {category.name}
                                            </Badge>
                                        ))
                                    ) : (
                                        <p className="text-xs text-muted-foreground italic">No categories assigned</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                    <Tag className="h-4 w-4" /> Tags
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {idea.tags && idea.tags.length > 0 ? (
                                        idea.tags.map(({ tag }) => (
                                            <Badge key={tag.id} variant="outline" className="text-xs font-normal">
                                                #{tag.name}
                                            </Badge>
                                        ))
                                    ) : (
                                        <p className="text-xs text-muted-foreground italic">No tags assigned</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Images Section */}
                        {idea.images && idea.images.length > 0 && (
                            <div className="space-y-3">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Gallery</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {idea.images.map((img, i) => (
                                        <div key={i} className="relative aspect-video rounded-lg overflow-hidden border bg-muted shadow-sm hover:shadow-md transition-shadow">
                                            <Image src={img} alt={`Slide ${i}`} fill className="object-cover" />
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