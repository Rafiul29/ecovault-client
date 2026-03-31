import DateCell from "@/components/shared/cell/DateCell";
import StatusBadgeCell from "@/components/shared/cell/StatusBadgeCell";
import { Badge } from "@/components/ui/badge";
import { ISubscription } from "@/types/subscription";
import { ColumnDef } from "@tanstack/react-table";
import { User, CreditCard, Calendar, ShieldCheck, Eye } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export const subscriptionColumns: ColumnDef<ISubscription>[] = [
    {
        id: "user",
        accessorKey: "user.name",
        header: "Subscriber",
        cell: ({ row }) => (
            <div className="flex items-center gap-3">
                {row.original.user.image ? (
                    <div className="relative w-8 h-8 rounded-full overflow-hidden border">
                        <Image
                            src={row.original.user.image}
                            alt={row.original.user.name}
                            fill
                            className="object-cover"
                        />
                    </div>
                ) : (
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                )}
                <div className="flex flex-col">
                    <span className="font-bold text-sm text-neutral-900">{row.original.user.name}</span>
                    <span className="text-[10px] text-neutral-400 truncate max-w-[120px]">{row.original.user.email}</span>
                </div>
            </div>
        ),
    },
    {
        id: "plan",
        accessorKey: "subscriptionPlan.name",
        header: "Plan",
        cell: ({ row }) => (
            <div className="flex flex-col">
                <Badge variant="secondary" className="w-fit text-[10px] px-1.5 py-0 font-black tracking-tight mb-0.5">
                    {row.original.tier}
                </Badge>
                <span className="text-xs font-bold text-neutral-700">{row.original.subscriptionPlan.name}</span>
            </div>
        ),
    },
    {
        id: "dates",
        header: "Period",
        cell: ({ row }) => (
            <div className="flex flex-col text-[11px] font-medium text-neutral-500">
                <span>Starts: {new Date(row.original.startDate).toLocaleDateString()}</span>
                <span>Ends: {new Date(row.original.endDate).toLocaleDateString()}</span>
            </div>
        ),
    },
    {
        id: "payment",
        accessorKey: "payment.amount",
        header: "Last Payment",
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="text-sm font-black text-emerald-600">${row.original.payment.amount.toFixed(2)}</span>
                <span className={`text-[9px] font-bold uppercase tracking-widest ${row.original.payment.status === 'COMPLETED' ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {row.original.payment.status}
                </span>
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
];
