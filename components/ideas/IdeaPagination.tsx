"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface IdeaPaginationProps {
    currentPage: number;
    totalPages: number;
    totalRows: number;
    onPageChange: (page: number) => void;
    isLoading?: boolean;
}

export default function IdeaPagination({
    currentPage,
    totalPages,
    totalRows,
    onPageChange,
    isLoading = false,
}: IdeaPaginationProps) {
    if (totalPages <= 1) return null;

    const items = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="mt-8 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[13px] text-muted-foreground font-medium">
                Showing {totalRows > 0 ? (currentPage - 1) * 10 + 1 : 0} to{" "}
                {Math.min(currentPage * 10, totalRows)} of {totalRows} ideas
            </p>
            <div className="flex flex-wrap items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1 || isLoading}
                >
                    <ChevronLeft className="h-4 w-4" />
                    Prev
                </Button>

                {items.map((i) => (
                    <Button
                        key={i}
                        variant={i === currentPage ? "default" : "outline"}
                        size="sm"
                        className={`min-w-9 ${i === currentPage ? "pointer-events-none" : ""}`}
                        onClick={() => onPageChange(i)}
                        disabled={isLoading}
                    >
                        {i}
                    </Button>
                ))}

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || isLoading}
                >
                    Next
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>


        </div>
    );
}
