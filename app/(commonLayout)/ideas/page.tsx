"use client";

import { useState } from "react";
import Link from "next/link";
import { Filter, Plus, SlidersHorizontal, Lightbulb } from "lucide-react";

import IdeaCard from "@/components/ideas/IdeaCard";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { mockIdeas, mockCategories } from "@/lib/mock-data";
import { IdeaStatus } from "@/types/enums";

export default function IdeasPage() {
    const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
    const [selectedStatus, setSelectedStatus] = useState<IdeaStatus | "ALL">(
        "ALL",
    );
    const [sortBy, setSortBy] = useState<string>("trending");

    const filtered = mockIdeas
        .filter(
            (i) =>
                selectedCategory === "ALL" ||
                i.categories.some((c) => c.id === selectedCategory),
        )
        .filter((i) => selectedStatus === "ALL" || i.status === selectedStatus)
        .sort((a, b) => {
            if (sortBy === "trending") return b.trendingScore - a.trendingScore;
            if (sortBy === "newest")
                return (
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
            if (sortBy === "upvotes") return b.upvoteCount - a.upvoteCount;
            return b.viewCount - a.viewCount;
        });

    return (
        <div className="flex flex-1 flex-col">
            <main className="mx-auto max-w-6xl px-6">
                {/* Page Header */}
                <div className="mb-8 ">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                                    <Lightbulb className="size-4 text-primary" />
                                </div>
                                <h1 className="text-2xl font-bold tracking-tight">
                                    Browse Ideas
                                </h1>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Discover eco-innovations submitted by the community
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mb-6 rounded-xl border border-border bg-card p-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex flex-wrap gap-1.5">
                            <button
                                onClick={() => setSelectedCategory("ALL")}
                                className={`rounded-full px-3 py-1 text-xs font-medium border ${selectedCategory === "ALL"
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                                    }`}
                            >
                                All Categories
                            </button>
                            {mockCategories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`rounded-full px-3 py-1 text-xs font-medium border ${selectedCategory === cat.id
                                        ? "bg-primary text-primary-foreground border-primary"
                                        : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                                        }`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>

                        <div className="hidden h-5 w-px bg-border sm:block" />

                        <div className="ml-auto flex items-center gap-2">
                            <span className="text-[11px] text-muted-foreground hidden sm:block">
                                Sort:
                            </span>
                            <Select value={sortBy}>
                                <SelectTrigger className="h-8 w-40 text-xs border-border">
                                    <SlidersHorizontal className="size-3 mr-1.5 text-muted-foreground" />
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="trending">Trending</SelectItem>
                                    <SelectItem value="newest">Newest</SelectItem>
                                    <SelectItem value="upvotes">Most Upvoted</SelectItem>
                                    <SelectItem value="views">Most Viewed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <p className="text-xs text-muted-foreground mb-4 font-medium">
                    {filtered.length} {filtered.length === 1 ? "idea" : "ideas"} found
                </p>

                {filtered.length === 0 ? (
                    <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-muted/30 text-center">
                        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                            <Filter className="size-5 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-foreground">
                                No ideas found
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Try adjusting your filters
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {filtered.map((idea) => (
                            <IdeaCard key={idea.id} idea={idea} showStatus />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
