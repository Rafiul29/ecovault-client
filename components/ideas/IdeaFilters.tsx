"use client";

import { SlidersHorizontal } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ICategory } from "@/types/category";

interface IdeaFiltersProps {
    categories: ICategory[];
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
    sortBy: string;
    onSortByChange: (sortBy: string) => void;
    sortOrder: string;
    onSortOrderChange: (sortOrder: string) => void;
    onClearFilters: () => void;
}

const SORT_OPTIONS = [
    { label: "Trending", value: "trendingScore" },
    { label: "Newest", value: "createdAt" },
    { label: "Upvotes", value: "upvoteCount" },
    { label: "Downvotes", value: "downvoteCount" },
    { label: "Views", value: "viewCount" },
    { label: "Price", value: "price" },
    { label: "Paid", value: "isPaid" },
    { label: "Featured", value: "isFeatured" }
];

export default function IdeaFilters({
    categories,
    selectedCategory,
    onCategoryChange,
    sortBy,
    onSortByChange,
    sortOrder,
    onSortOrderChange,
    onClearFilters,
}: IdeaFiltersProps) {
    const hasActiveFilters = selectedCategory !== "ALL" || sortBy !== "trendingScore";

    return (
        <div className="mb-8 rounded-2xl border border-border bg-card/50 p-3 sm:p-4 backdrop-blur-sm shadow-sm transition-all hover:bg-card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Categories Scrollable Container on Mobile */}
                <div className="flex flex-1 items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
                    <div className="flex flex-wrap gap-1.5 min-w-max sm:min-w-0">
                        <button
                            onClick={() => onCategoryChange("ALL")}
                            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-300 border ${selectedCategory === "ALL"
                                ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20 scale-105"
                                : "bg-muted/50 border-border/60 text-muted-foreground hover:border-primary/40 hover:text-foreground hover:bg-muted"
                                }`}
                        >
                            All Categories
                        </button>
                        {categories.slice(0, 4).map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => onCategoryChange(cat.id)}
                                className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-300 border ${selectedCategory === cat.id
                                    ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20 scale-105"
                                    : "bg-muted/50 border-border/60 text-muted-foreground hover:border-primary/40 hover:text-foreground hover:bg-muted"
                                    }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto sm:ml-4 pt-1 sm:pt-0 border-t sm:border-t-0 border-border/50 sm:block">
                    <div className="flex items-center gap-2">
                        {hasActiveFilters && (
                            <button
                                onClick={onClearFilters}
                                className="text-[10px] font-bold text-muted-foreground hover:text-destructive transition-all flex items-center gap-1 bg-muted/50 px-2 py-1 rounded-md border border-border/40 hover:border-destructive/40"
                            >
                                Clear Filters
                            </button>
                        )}
                        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider hidden md:block">
                            Sort
                        </span>
                        <Select value={sortBy} onValueChange={onSortByChange}>
                            <SelectTrigger className="h-9 sm:w-44 text-xs bg-muted/30 border-border/60 rounded-lg hover:border-primary/40 focus:ring-primary/20 transition-all">
                                <div className="flex items-center gap-2">
                                    <SlidersHorizontal className="size-3.5 text-primary" />
                                    <SelectValue />
                                </div>
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-border shadow-2xl">
                                {SORT_OPTIONS.map((option) => (
                                    <SelectItem
                                        key={option.value}
                                        value={option.value}
                                        className="text-xs focus:bg-primary focus:text-primary-foreground rounded-lg my-0.5 mx-1"
                                    >
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
        </div>
    );
}
