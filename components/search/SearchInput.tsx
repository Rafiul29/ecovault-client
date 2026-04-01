"use client";

import { Search, X, Loader2 } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";

interface SearchInputProps {
    initialValue: string;
    onSearch: (value: string) => void;
    placeholder?: string;
    isLoading?: boolean;
}

export default function SearchInput({
    initialValue,
    onSearch,
    placeholder = "Search ideas, topics, problem statements...",
    isLoading = false,
}: SearchInputProps) {
    const [value, setValue] = useState(initialValue);

    // Sync with initialValue when it changes (e.g., from URL)
    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    // Simple debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            if (value !== initialValue) {
                onSearch(value);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [value, initialValue, onSearch]);

    return (
        <div className="relative group max-w-2xl mx-auto mb-10">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                {isLoading ? (
                    <Loader2 className="size-5 text-primary animate-spin" />
                ) : (
                    <Search className="size-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                )}
            </div>
            <Input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="h-14 pl-12 pr-12 text-lg bg-card border-border/60 rounded-2xl shadow-xl shadow-primary/5 focus:ring-primary/20 transition-all border-2"
                placeholder={placeholder}
            />
            {value && (
                <button
                    onClick={() => setValue("")}
                    className="absolute inset-y-0 right-4 flex items-center text-muted-foreground hover:text-destructive transition-colors"
                >
                    <X className="size-5" />
                </button>
            )}
        </div>
    );
}
