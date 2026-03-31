import DateCell from "@/components/shared/cell/DateCell";
import StatusBadgeCell from "@/components/shared/cell/StatusBadgeCell";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { User, Wallet, FileText, Hash, CreditCard, ShoppingBag, Globe, AlertTriangle, UserCheck } from "lucide-react";
import Image from "next/image";

export const paymentColumns: ColumnDef<any>[] = [
    {
        id: "payment",
        accessorKey: "paymentId",
        header: "Payment Reference",
        cell: ({ row }) => {
            const purchase = row.original;
            return (
                <div className="flex items-center gap-3 py-1">
                    <div className="h-10 w-10 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-400">
                        <Hash className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="font-black text-neutral-900 text-[13px] leading-tight font-mono tracking-tighter">
                            {purchase.paymentId || "TRANS_REF_PENDING"}
                        </span>
                        <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-1">
                            <CreditCard className="h-2.5 w-2.5 text-blue-500" />
                            {purchase.amount ? `Stripe Payment Gateway` : "Processing..."}
                        </div>
                    </div>
                </div>
            );
        },
    },
    {
        id: "purchaser",
        accessorKey: "user.name",
        header: "Buyer Information",
        cell: ({ row }) => {
            const user = row.original.user;
            return (
                <div className="flex items-center gap-3">
                    <div className="relative h-9 w-9 rounded-full overflow-hidden bg-neutral-100 border border-neutral-200 shrink-0">
                        {user?.image ? (
                            <Image src={user.image} alt={user.name} fill className="object-cover" />
                        ) : (
                            <div className="h-full w-full flex items-center justify-center text-neutral-300 bg-neutral-50 font-black text-[10px]">
                                {user?.name?.charAt(0).toUpperCase() || <User className="h-4 w-4" />}
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5">
                            <span className="font-bold text-neutral-800 text-[13px] tracking-tight truncate">{user?.name || "Anonymous Member"}</span>
                        </div>
                        <span className="text-[10px] text-neutral-400 font-medium truncate max-w-[140px] italic">{user?.email}</span>
                    </div>
                </div>
            );
        },
    },
    {
        id: "idea",
        accessorKey: "idea.title",
        header: "Product Acquired",
        cell: ({ row }) => {
            const idea = row.original.idea;
            return (
                <div className="flex flex-col gap-1 max-w-[220px]">
                    <div className="flex items-center gap-2">
                        <ShoppingBag className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                        <span className="font-black text-neutral-900 text-xs truncate leading-relaxed">
                            {idea?.title || "Product Unavailable"}
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5 pl-5">
                        {idea?.isDeleted && <Badge variant="destructive" className="h-3 text-[7px] px-1 font-black uppercase tracking-widest">Deleted</Badge>}
                        <Badge variant="secondary" className="h-3 text-[7px] px-1 font-black uppercase tracking-widest bg-neutral-100 text-neutral-500 border-none">{idea?.status || "ARCHIVED"}</Badge>
                    </div>
                </div>
            );
        },
    },
    {
        id: "value",
        accessorKey: "amount",
        header: "Monetary Value",
        cell: ({ row }) => {
            const amount = row.original.amount;
            return (
                <div className="flex flex-col">
                    <div className="flex items-baseline gap-0.5">
                        <span className="text-[10px] font-black text-neutral-400 uppercase tracking-tighter pr-0.5">$</span>
                        <span className="font-black text-neutral-900 text-[16px] leading-tight tracking-tight">
                            {amount?.toFixed(2) || "0.00"}
                        </span>
                    </div>
                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mt-0.5">Paid Full</span>
                </div>
            )
        },
    },
    {
        id: "purchasedAt",
        accessorKey: "purchasedAt",
        header: "Transaction Date",
        cell: ({ row }) => (
            <div className="flex flex-col">
                <DateCell date={row.original.purchasedAt} formatString="MMM dd, yyyy" />
                <div className="flex items-center gap-1 text-[10px] text-neutral-400 font-bold mt-0.5">
                    <Globe className="h-2.5 w-2.5" />
                    {new Date(row.original.purchasedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} UTC
                </div>
            </div>
        ),
    },
];
