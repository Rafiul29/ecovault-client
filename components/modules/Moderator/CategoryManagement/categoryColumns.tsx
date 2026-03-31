import DateCell from "@/components/shared/cell/DateCell";
import StatusBadgeCell from "@/components/shared/cell/StatusBadgeCell";
import { Badge } from "@/components/ui/badge";
import { ICategory } from "@/types/category";
import { ColumnDef } from "@tanstack/react-table";
import { Palette } from "lucide-react";
import Image from "next/image";
import EditCategoryFormModal from "./EditCategoryFormModal";
import DeleteCategoryConfirmationDialog from "./DeleteCategoryConfirmationDialog";

export const categoryColumns: ColumnDef<ICategory>[] = [
    {
        id: "name",
        accessorKey: "name",
        header: "Category",
        cell: ({ row }) => (
            <div className="flex items-center gap-3">
                {row.original.icon ? (
                    <div className="relative w-8 h-8 rounded bg-muted overflow-hidden">
                        <Image
                            src={row.original.icon}
                            alt={row.original.name}
                            fill
                            className="object-cover"
                        />
                    </div>
                ) : (
                    <div className="w-8 h-8 rounded bg-muted flex items-center justify-center">
                        <Palette className="h-4 w-4 text-muted-foreground" />
                    </div>
                )}
                <div className="flex flex-col">
                    <span className="font-medium text-sm">{row.original.name}</span>
                </div>
            </div>
        ),
    },
    {
        id: "color",
        accessorKey: "color",
        header: "Theme",
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <div
                    className="w-3 h-3 rounded-full border"
                    style={{ backgroundColor: row.original.color || "#ccc" }}
                />
                <span className="text-xs font-mono lowercase">{row.original.color || "N/A"}</span>
            </div>
        ),
    },
    {
        id: "isActive",
        accessorKey: "isActive",
        header: "Status",
        cell: ({ row }) => (
            <StatusBadgeCell status={row.original.isActive ? "ACTIVE" : "INACTIVE"} />
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
