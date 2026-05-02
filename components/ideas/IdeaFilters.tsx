"use client";

import { ChevronDown, Filter, SlidersHorizontal, Sparkles, X } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { MultiSelectFilterControl } from "@/components/shared/table/DataTableFilters";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ICategory } from "@/types/category";

interface IdeaFiltersProps {
    categories: ICategory[];
    selectedCategories: string[];
    onCategoriesChange: (categories: string[]) => void;
    isPaid: string;
    onIsPaidChange: (value: string) => void;
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
    selectedCategories,
    onCategoriesChange,
    isPaid,
    onIsPaidChange,
    sortBy,
    onSortByChange,
    sortOrder,
    onSortOrderChange,
    onClearFilters,
}: IdeaFiltersProps) {
    const hasActiveFilters = (!selectedCategories.includes("ALL") && selectedCategories.length > 0) || sortBy !== "trendingScore" || isPaid !== "ALL" || sortOrder !== "desc";

    return (
        <div className="mb-10 rounded-3xl border border-border/50 bg-card/40 p-2 sm:p-2 backdrop-blur-xl shadow-xl shadow-primary/5 transition-all hover:bg-card/60">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                {/* Left Side: Categories & Reset */}
                <div className="flex flex-1 items-center gap-2 p-1">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="ghost"
                                className={cn(
                                    "h-10 px-4 rounded-2xl flex items-center gap-2.5 transition-all duration-300",
                                    !selectedCategories.includes("ALL") 
                                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90" 
                                        : "hover:bg-primary/10 hover:text-primary"
                                )}
                            >
                                <Filter className={cn("size-4", !selectedCategories.includes("ALL") ? "text-primary-foreground" : "text-primary")} />
                                <span className="text-sm font-bold tracking-tight">
                                    {selectedCategories.includes("ALL")
                                        ? "All Categories"
                                        : selectedCategories.length === 1
                                            ? categories.find(c => c.id === selectedCategories[0])?.name || "1 Category"
                                            : `${selectedCategories.length} Categories`}
                                </span>
                                <ChevronDown className={cn("size-4 opacity-50", !selectedCategories.includes("ALL") ? "text-primary-foreground" : "text-primary")} />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-72 p-0 rounded-2xl border-border/50 shadow-2xl backdrop-blur-xl" align="start" sideOffset={8}>
                            <div className="p-4 border-b border-border/50 bg-muted/20">
                                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/80">Filter Categories</h4>
                            </div>
                            <div className="p-2">
                                <MultiSelectFilterControl
                                    filter={{
                                        id: "category",
                                        label: "Category",
                                        type: "multi-select",
                                        options: [
                                            { label: "All Categories", value: "ALL" },
                                            ...categories.map(c => ({ label: c.name, value: c.id }))
                                        ]
                                    }}
                                    value={selectedCategories}
                                    onFilterChange={(_, val) => {
                                        if (!val || (val as string[]).length === 0) {
                                            onCategoriesChange(["ALL"]);
                                        } else {
                                            const newVals = val as string[];
                                            if (newVals.includes("ALL") && !selectedCategories.includes("ALL")) {
                                                onCategoriesChange(["ALL"]);
                                            }
                                            else if (newVals.length > 1 && newVals.includes("ALL")) {
                                                onCategoriesChange(newVals.filter(v => v !== "ALL"));
                                            }
                                            else {
                                                onCategoriesChange(newVals);
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </PopoverContent>
                    </Popover>

                    {hasActiveFilters && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClearFilters}
                            className="h-8 gap-1.5 rounded-full text-[10px] font-black uppercase tracking-wider text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all group"
                        >
                            <X className="size-3 transition-transform group-hover:rotate-90" />
                            Reset
                        </Button>
                    )}
                </div>

                {/* Right Side: Sorting & Price */}
                <div className="flex flex-col sm:flex-row items-center gap-2 p-1 md:border-l md:border-border/50 md:pl-4 w-full md:w-auto">
                    {/* Sort Select Group */}
                    <div className="flex items-center -space-x-px w-full md:w-auto">
                        <Select value={sortBy} onValueChange={onSortByChange}>
                            <SelectTrigger className={cn(
                                "h-10 flex-1 md:w-40 rounded-l-2xl rounded-r-none border-border/50 bg-background/50 backdrop-blur-sm text-sm font-bold transition-all hover:bg-background focus:ring-primary/20",
                                sortBy !== "trendingScore" && "border-primary/30 text-primary"
                            )}>
                                <div className="flex items-center gap-2">
                                    <SlidersHorizontal className="size-4 text-primary/70" />
                                    <SelectValue />
                                </div>
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl border-border/50 shadow-2xl backdrop-blur-xl" position="popper" align="start" sideOffset={4}>
                                {SORT_OPTIONS.map((option) => (
                                    <SelectItem
                                        key={option.value}
                                        value={option.value}
                                        className="text-xs font-bold focus:bg-primary focus:text-primary-foreground rounded-xl my-1 mx-1.5"
                                    >
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={sortOrder} onValueChange={onSortOrderChange}>
                            <SelectTrigger className={cn(
                                "h-10 w-20 rounded-r-2xl rounded-l-none border-l-0 border-border/50 bg-background/50 backdrop-blur-sm text-xs font-black transition-all hover:bg-background focus:ring-primary/20 uppercase tracking-tighter",
                                sortOrder !== "desc" && "border-primary/30 text-primary"
                            )}>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl border-border/50 shadow-2xl min-w-[100px] backdrop-blur-xl" position="popper" align="end" sideOffset={4}>
                                <SelectItem value="desc" className="text-xs font-black focus:bg-primary focus:text-primary-foreground rounded-xl my-1 mx-1.5">DESC</SelectItem>
                                <SelectItem value="asc" className="text-xs font-black focus:bg-primary focus:text-primary-foreground rounded-xl my-1 mx-1.5">ASC</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Price Select */}
                    <Select value={isPaid || "ALL"} onValueChange={onIsPaidChange}>
                        <SelectTrigger
                            className={cn(
                                "h-10 w-full md:w-32 rounded-2xl border-border/50 bg-background/50 backdrop-blur-sm text-sm font-bold transition-all hover:bg-background focus:ring-primary/20",
                                isPaid !== "ALL" && "border-primary/30 text-primary"
                            )}
                        >
                            <div className="flex items-center gap-2">
                                <Sparkles className="size-4 text-primary/70" />
                                <SelectValue placeholder="Price" />
                            </div>
                        </SelectTrigger>
                        <SelectContent
                            className="rounded-2xl border-border/50 bg-popover/90 shadow-2xl backdrop-blur-xl"
                            position="popper"
                            align="end"
                            sideOffset={4}
                        >
                            <SelectItem value="ALL" className="text-xs font-bold rounded-xl my-1 mx-1.5">All Models</SelectItem>
                            <SelectItem value="false" className="text-xs font-bold rounded-xl my-1 mx-1.5 text-emerald-600 dark:text-emerald-400">Free Only</SelectItem>
                            <SelectItem value="true" className="text-xs font-bold rounded-xl my-1 mx-1.5 text-primary">Paid Only</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
}
