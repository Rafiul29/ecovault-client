import DateCell from "@/components/shared/cell/DateCell";
import StatusBadgeCell from "@/components/shared/cell/StatusBadgeCell";
import { Badge } from "@/components/ui/badge";
import { ISubscriptionPlan } from "@/types/subscription";
import { ColumnDef } from "@tanstack/react-table";
import { DollarSign, Clock, Layers } from "lucide-react";

export const planColumns: ColumnDef<ISubscriptionPlan>[] = [
    {
        id: "name",
        accessorKey: "name",
        header: "Plan Name",
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="font-bold text-sm text-neutral-900">{row.original.name}</span>
                <span className="text-[10px] text-neutral-400 uppercase font-black tracking-widest">{row.original.tier}</span>
            </div>
        ),
    },
    {
        id: "price",
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => (
            <div className="flex items-center gap-1.5">
                <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <DollarSign className="h-4 w-4 text-emerald-600" />
                </div>
                <span className="font-black text-sm text-neutral-900">${row.original.price.toFixed(2)}</span>
            </div>
        ),
    },
    {
        id: "durationDays",
        accessorKey: "durationDays",
        header: "Duration",
        cell: ({ row }) => (
            <div className="flex items-center gap-1.5">
                <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                    <Clock className="h-4 w-4 text-indigo-600" />
                </div>
                <span className="font-bold text-sm text-neutral-900">{row.original.durationDays} Days</span>
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
        header: "Created",
        cell: ({ row }) => (
            <DateCell date={row.original.createdAt} formatString="MMM dd, yyyy" />
        ),
    },
];
