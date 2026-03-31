import { IIdeaPurchase } from "@/types/purchase.types";
import { ColumnDef } from "@tanstack/react-table";
import { User } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export const soldIdeaColumns: ColumnDef<IIdeaPurchase>[] = [
    {
        id: "buyer",
        header: "Buyer",
        cell: ({ row }) => (
            <div className="flex items-center gap-3">
                {row.original.user?.image ? (
                    <div className="relative w-9 h-9 rounded-full overflow-hidden border border-neutral-200 shrink-0">
                        <Image
                            src={row.original.user.image}
                            alt={row.original.user.name}
                            fill
                            className="object-cover"
                        />
                    </div>
                ) : (
                    <div className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center border border-neutral-200 shrink-0">
                        <User className="h-4 w-4 text-neutral-400" />
                    </div>
                )}
                <div className="flex flex-col min-w-0">
                    <span className="font-bold text-sm text-neutral-900 truncate">{row.original.user?.name}</span>
                    <span className="text-[10px] text-neutral-400 truncate max-w-[160px]">{row.original.user?.email}</span>
                </div>
            </div>
        ),
    },
    {
        id: "idea",
        header: "Idea",
        cell: ({ row }) => (
            <div className="flex flex-col min-w-0 max-w-[260px]">
                <span className="font-bold text-sm text-neutral-900 truncate">
                    {row.original.idea?.title}
                </span>
                <span className="text-[10px] text-neutral-400 font-medium mt-0.5 truncate">
                    {row.original.idea?.description}
                </span>
            </div>
        ),
    },
    {
        id: "price",
        header: "Price Paid",
        cell: ({ row }) => (
            <span className="font-black text-emerald-600 text-sm">
                ${(row.original.idea?.price ?? 0).toFixed(2)}
            </span>
        ),
    },
    {
        id: "status",
        header: "Idea Status",
        cell: ({ row }) => {
            const status = row.original.idea?.status ?? "";
            const colorMap: Record<string, string> = {
                APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
                UNDER_REVIEW: "bg-amber-50 text-amber-700 border-amber-200",
                DRAFT: "bg-neutral-100 text-neutral-500 border-neutral-200",
                REJECTED: "bg-rose-50 text-rose-700 border-rose-200",
            };
            return (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${colorMap[status] ?? "bg-neutral-100 text-neutral-500 border-neutral-200"}`}>
                    {status.replace("_", " ")}
                </span>
            );
        },
    },
    {
        id: "purchasedAt",
        header: "Purchased On",
        cell: ({ row }) => (
            <div className="flex flex-col text-[11px] font-medium text-neutral-500">
                <span>{new Date(row.original.purchasedAt).toLocaleDateString("en-US", { dateStyle: "medium" })}</span>
                <span className="text-[10px] text-neutral-400">{new Date(row.original.purchasedAt).toLocaleTimeString("en-US", { timeStyle: "short" })}</span>
            </div>
        ),
    },
];
