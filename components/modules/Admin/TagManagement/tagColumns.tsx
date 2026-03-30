import DateCell from "@/components/shared/cell/DateCell";
import { ITag } from "@/types/tag.types";
import { ColumnDef } from "@tanstack/react-table";
import { Hash } from "lucide-react";
import EditTagFormModal from "./EditTagFormModal";
import DeleteTagConfirmationDialog from "./DeleteTagConfirmationDialog";


export const tagColumns: ColumnDef<ITag>[] = [
    {
        id: "name",
        accessorKey: "name",
        header: "Tag",
        cell: ({ row }) => (
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-muted flex items-center justify-center">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex flex-col">
                    <span className="font-medium text-sm">{row.original.name}</span>
                    <span className="text-xs text-muted-foreground">{row.original.slug}</span>
                </div>
            </div>
        ),
    },
    {
        id: "createdAt",
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) => (
            <DateCell date={row.original.createdAt} formatString="MMM dd, yyyy" />
        ),
    },
];
