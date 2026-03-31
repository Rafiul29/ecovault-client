import DateCell from "@/components/shared/cell/DateCell";
import StatusBadgeCell from "@/components/shared/cell/StatusBadgeCell";
import { Badge } from "@/components/ui/badge";
import { IComment } from "@/types/comment";
import { ColumnDef } from "@tanstack/react-table";
import { MessageSquare, ThumbsUp, Heart, Star, Flag } from "lucide-react";
import Image from "next/image";

export const commentColumns: ColumnDef<IComment>[] = [
    {
        id: "content",
        accessorKey: "content",
        header: "Comment",
        cell: ({ row }) => (
            <div className="flex flex-col gap-1 max-w-[300px]">
                <span className="text-sm font-medium line-clamp-2">{row.original.content}</span>
                <span className="text-xs text-muted-foreground">ID: {row.original.id}</span>
            </div>
        ),
    },
    {
        id: "author",
        accessorKey: "author.name",
        header: "Author",
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                {row.original.author.image ? (
                    <div className="relative w-6 h-6 rounded-full overflow-hidden">
                        <Image
                            src={row.original.author.image}
                            alt={row.original.author.name}
                            fill
                            className="object-cover"
                        />
                    </div>
                ) : (
                    <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold">
                        {row.original.author.name.charAt(0)}
                    </div>
                )}
                <span className="text-sm">{row.original.author.name}</span>
            </div>
        ),
    },
    {
        id: "idea",
        accessorKey: "idea.title",
        header: "Idea",
        cell: ({ row }) => (
            <div className="flex flex-col max-w-[200px]">
                <span className="text-sm truncate">{row.original.idea?.title || "N/A"}</span>
                <span className="text-[10px] text-muted-foreground uppercase">{row.original.ideaId}</span>
            </div>
        ),
    },
    {
        id: "stats",
        header: "Stats",
        cell: ({ row }) => {
            const reactionCount = row.original.reactions?.length || row.original._count?.reactions || 0;
            const replyCount = row.original.replies?.length || row.original._count?.replies || 0;
            
            return (
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground" title="Reactions">
                        <ThumbsUp className="h-3 w-3" />
                        <span>{reactionCount}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground" title="Replies">
                        <MessageSquare className="h-3 w-3" />
                        <span>{replyCount}</span>
                    </div>
                </div>
            );
        },
    },
    {
        id: "isFlagged",
        accessorKey: "isFlagged",
        header: "Flagged",
        cell: ({ row }) => (
            <div className="flex justify-center">
                {row.original.isFlagged ? (
                    <Badge variant="destructive" className="gap-1 px-1.5 py-0">
                        <Flag className="h-3 w-3" />
                        <span>Flagged</span>
                    </Badge>
                ) : (
                    <span className="text-muted-foreground">-</span>
                )}
            </div>
        ),
    },
    {
        id: "createdAt",
        accessorKey: "createdAt",
        header: "Date",
        cell: ({ row }) => (
            <DateCell date={row.original.createdAt} formatString="MMM dd, yyyy" />
        ),
    },
];
