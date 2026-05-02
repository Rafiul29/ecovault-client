"use client";

import { ChevronDown, Filter, SlidersHorizontal } from "lucide-react";
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
        <div className="mb-8 rounded-2xl border border-border bg-card/50 p-3 sm:p-4 backdrop-blur-sm shadow-sm transition-all hover:bg-card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Category Multi-Select */}
                <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider hidden md:block">
                        Category
                    </span>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className={cn(
                                    "h-9 min-w-[160px] justify-between bg-muted/30 border-border/60 rounded-lg hover:border-primary/40 focus:ring-primary/20 transition-all font-normal text-xs",
                                    !selectedCategories.includes("ALL") && "border-primary/50 bg-primary/5"
                                )}
                            >
                                <div className="flex items-center gap-2 truncate">
                                    <Filter className="size-3.5 text-primary shrink-0" />
                                    <span className="truncate">
                                        {selectedCategories.includes("ALL")
                                            ? "All Categories"
                                            : selectedCategories.length === 1
                                                ? categories.find(c => c.id === selectedCategories[0])?.name || "1 Category"
                                                : `${selectedCategories.length} Categories`}
                                    </span>
                                </div>
                                <ChevronDown className="size-3.5 opacity-50 shrink-0 ml-2" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-64 p-3 rounded-xl border-border shadow-2xl" align="start">
                            <div className="mb-2 pb-2 border-b border-border/50">
                                <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Select Categories</h4>
                            </div>
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
                                        // If "ALL" was selected alongside others, and it wasn't there before, make it just "ALL"
                                        if (newVals.includes("ALL") && !selectedCategories.includes("ALL")) {
                                            onCategoriesChange(["ALL"]);
                                        }
                                        // If "ALL" was there and something else was added, remove "ALL"
                                        else if (newVals.length > 1 && newVals.includes("ALL")) {
                                            onCategoriesChange(newVals.filter(v => v !== "ALL"));
                                        }
                                        else {
                                            onCategoriesChange(newVals);
                                        }
                                    }
                                }}
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto sm:ml-4 pt-1 sm:pt-0 border-t sm:border-t-0 border-border/50">
                    <div className="flex items-center gap-2">
                        {hasActiveFilters && (
                            <button
                                onClick={onClearFilters}
                                className="text-[10px] font-bold text-muted-foreground hover:text-destructive transition-all flex items-center gap-1 bg-muted/50 px-2 py-1 rounded-md border border-border/40 hover:border-destructive/40 mr-2"
                            >
                                Clear All
                            </button>
                        )}

                        <div className="flex items-center gap-1">
                            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider hidden lg:block mr-1">
                                Sort
                            </span>
                            <div className="flex items-center -space-x-px">
                                <Select value={sortBy} onValueChange={onSortByChange}>
                                    <SelectTrigger className={cn(
                                        "h-9 sm:w-40 text-xs bg-muted/30 border-border/60 rounded-l-lg rounded-r-none hover:border-primary/40 focus:ring-primary/20 transition-all z-10",
                                        sortBy !== "trendingScore" && "border-primary/50 bg-primary/5 text-primary font-medium"
                                    )}>
                                        <div className="flex items-center gap-2 truncate">
                                            <SlidersHorizontal className="size-3.5 text-primary shrink-0" />
                                            <SelectValue />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-border shadow-2xl" position="popper" align="start" sideOffset={4}>
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
                                <Select value={sortOrder} onValueChange={onSortOrderChange}>
                                    <SelectTrigger className={cn(
                                        "h-9 w-20 text-xs bg-muted/30 border-border/60 rounded-r-lg rounded-l-none hover:border-primary/40 focus:ring-primary/20 transition-all border-l-0",
                                        sortOrder !== "desc" && "border-primary/50 bg-primary/5 text-primary font-medium"
                                    )}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-border shadow-2xl min-w-[100px]" position="popper" align="end" sideOffset={4}>
                                        <SelectItem value="desc" className="text-xs focus:bg-primary focus:text-primary-foreground rounded-lg my-0.5 mx-1">DESC</SelectItem>
                                        <SelectItem value="asc" className="text-xs focus:bg-primary focus:text-primary-foreground rounded-lg my-0.5 mx-1">ASC</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 ml-2">
                            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider hidden lg:block mr-1">
                                Price
                            </span>
                            <Select value={isPaid || "ALL"} onValueChange={onIsPaidChange}>
                                <SelectTrigger
                                    className={cn(
                                        "h-9 w-24 sm:w-32 text-xs bg-background border-border/60 rounded-lg hover:border-primary/40 focus:ring-primary/20 transition-all shadow-sm",
                                        isPaid !== "ALL" && "border-primary/50 bg-primary/5 text-primary font-medium"
                                    )}
                                >
                                    <SelectValue placeholder="All Models" />
                                </SelectTrigger>
                                <SelectContent
                                    className="rounded-xl border border-border bg-popover shadow-xl z-[100]"
                                    position="popper"
                                    align="end"
                                    sideOffset={4}
                                >
                                    <SelectItem value="ALL" className="text-xs rounded-lg my-0.5 mx-1 cursor-pointer">
                                        All Models
                                    </SelectItem>
                                    <SelectItem value="false" className="text-xs rounded-lg my-0.5 mx-1 cursor-pointer">
                                        Free Only
                                    </SelectItem>
                                    <SelectItem value="true" className="text-xs rounded-lg my-0.5 mx-1 cursor-pointer">
                                        Paid Only
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
