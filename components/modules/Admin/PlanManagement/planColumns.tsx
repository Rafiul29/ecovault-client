import DateCell from "@/components/shared/cell/DateCell";
import StatusBadgeCell from "@/components/shared/cell/StatusBadgeCell";
import { Badge } from "@/components/ui/badge";
import { ISubscriptionPlan } from "@/types/subscription";
import { ColumnDef } from "@tanstack/react-table";
import { DollarSign, Clock, Hash, Sparkles } from "lucide-react";

export const planColumns: ColumnDef<ISubscriptionPlan>[] = [
    {
        id: "name",
        accessorKey: "name",
        header: "Plan Name",
        cell: ({ row }) => (
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-neutral-900">{row.original.name}</span>
                    {row.original.isPopular && (
                        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-none px-1.5 py-0 text-[8px] font-black uppercase tracking-tighter h-4">
                            <Sparkles className="w-2.5 h-2.5 mr-0.5" /> Popular
                        </Badge>
                    )}
                </div>
                <span className="text-[9px] text-neutral-400 uppercase font-black tracking-widest leading-none">{row.original.tier}</span>
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
        id: "order",
        accessorKey: "order",
        header: "Rank",
        cell: ({ row }) => (
            <div className="flex items-center gap-1.5">
                <div className="h-8 w-8 rounded-lg bg-neutral-100 flex items-center justify-center">
                    <Hash className="h-3 w-3 text-neutral-500" />
                </div>
                <span className="font-black text-xs text-neutral-900">{row.original.order}</span>
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
