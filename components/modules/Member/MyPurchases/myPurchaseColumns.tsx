import { IIdeaPurchase } from "@/types/purchase.types";
import { ColumnDef } from "@tanstack/react-table";
import { User, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const myPurchaseColumns: ColumnDef<IIdeaPurchase>[] = [
    {
        id: "idea",
        header: "Idea",
        cell: ({ row }) => {
            const idea = row.original.idea;
            return (
                <div className="flex items-center gap-3 min-w-0">
                    {idea?.images?.[0] ? (
                        <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-neutral-200 shrink-0">
                            <Image
                                src={idea.images[0]}
                                alt={idea.title}
                                fill
                                className="object-cover"
                            />
                        </div>
                    ) : (
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                            <ShoppingBag className="h-5 w-5 text-emerald-500" />
                        </div>
                    )}
                    <div className="flex flex-col min-w-0">
                        <span className="font-bold text-sm text-neutral-900 truncate max-w-[220px] hover:text-emerald-500 transition-colors duration-200 hover:underline">
                            <Link href={`/dashboard/ideas/${row.original.ideaId}`}>
                                {idea?.title}
                            </Link>
                        </span>
                        <span className="text-[10px] text-neutral-400 font-medium truncate max-w-[220px] mt-0.5">
                            {idea?.description}
                        </span>
                    </div>
                </div>
            );
        },
    },
    {
        id: "author",
        header: "Author",
        cell: ({ row }) => {
            const author = row.original.idea?.author;
            return (
                <div className="flex items-center gap-2">
                    {author?.image ? (
                        <div className="relative w-7 h-7 rounded-full overflow-hidden border border-neutral-200 shrink-0">
                            <Image
                                src={author.image}
                                alt={author.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                    ) : (
                        <div className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center border border-neutral-200 shrink-0">
                            <User className="h-3.5 w-3.5 text-neutral-400" />
                        </div>
                    )}
                    <span className="text-sm font-semibold text-neutral-700 truncate max-w-[120px]">
                        {author?.name ?? "Unknown"}
                    </span>
                </div>
            );
        },
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
                <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${colorMap[status] ?? "bg-neutral-100 text-neutral-500 border-neutral-200"
                        }`}
                >
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
                <span>
                    {new Date(row.original.purchasedAt).toLocaleDateString("en-US", {
                        dateStyle: "medium",
                    })}
                </span>
                <span className="text-[10px] text-neutral-400">
                    {new Date(row.original.purchasedAt).toLocaleTimeString("en-US", {
                        timeStyle: "short",
                    })}
                </span>
            </div>
        ),
    }
];
