import DateCell from "@/components/shared/cell/DateCell";
import StatusBadgeCell from "@/components/shared/cell/StatusBadgeCell";
import { Badge } from "@/components/ui/badge";
import { IIdea } from "@/types/idea.types";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, TrendingUp } from "lucide-react";

export const ideaColumns: ColumnDef<IIdea>[] = [
    {
        id: "title",
        accessorKey: "title",
        header: "Idea Title",
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="font-medium text-sm line-clamp-1">{row.original.title}</span>
            </div>
        ),
    },
    {
        id: "author",
        accessorKey: "author.name",
        header: "Author",
        cell: ({ row }) => {
            const author = row.original.author;
            return (
                <div className="flex flex-col">
                    <span className="text-sm">{author?.name || "Unknown"}</span>
                    <span className="text-xs text-muted-foreground">{author?.email}</span>
                </div>
            );
        },
    },
    {
        id: "categories",
        accessorKey: "categories",
        enableSorting: false,
        header: "Categories",
        cell: ({ row }) => {
            const categories = row.original.categories;

            if (!categories || categories.length === 0) {
                return (
                    <span className="text-xs text-muted-foreground">No Categories</span>
                )
            }

            return (
                <div className="flex flex-wrap gap-1">
                    {
                        categories.map(({ category }, id) => (
                            <Badge variant={"secondary"} key={id} className="text-[10px] px-1 py-0" style={{ backgroundColor: category?.color + "20", color: category?.color, borderColor: category?.color }}>
                                {category?.name}
                            </Badge>
                        ))
                    }
                </div>
            )
        },
    },
    {
        id: "status",
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            return (
                <StatusBadgeCell status={row.original.status} />
            );
        },
    },
    {
        id: "price",
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => {
            return (
                <div className="flex flex-col">
                    {row.original.isPaid ? (
                        <span className="text-sm font-semibold text-green-600">
                            ${row.original?.price.toFixed(2)}
                        </span>
                    ) : (
                        <Badge variant="outline" className="w-fit text-[10px]">Free</Badge>
                    )}
                </div>
            );
        },
    },
    {
        id: "engagement",
        header: "Engagement",
        cell: ({ row }) => {
            return (
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1" title="Views">
                        <Eye className="h-3 w-3" />
                        {row.original.viewCount}
                    </div>
                    <div className="flex items-center gap-1" title="Votes">
                        <TrendingUp className="h-3 w-3" />
                        {row.original._count?.votes || 0}
                    </div>
                </div>
            );
        },
    },
    {
        id: "isFeatured",
        accessorKey: "isFeatured",
        header: "Featured",
        cell: ({ row }) => (
            row.original.isFeatured ? (
                <Badge className="bg-amber-500 text-white">Featured</Badge>
            ) : (
                <span className="text-xs text-muted-foreground">No</span>
            )
        ),
    },
    {
        id: "createdAt",
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) => {
            return (
                <DateCell date={row.original.createdAt} formatString="MMM dd, yyyy" />
            );
        },
    },
];