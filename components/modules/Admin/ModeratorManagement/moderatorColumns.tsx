import DateCell from "@/components/shared/cell/DateCell";
import StatusBadgeCell from "@/components/shared/cell/StatusBadgeCell";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { User, Mail, Zap, CheckCircle2, History, Star, Users, Briefcase } from "lucide-react";
import Image from "next/image";

export const moderatorColumns: ColumnDef<any>[] = [
    {
        id: "moderator",
        accessorKey: "name",
        header: "Ecosystem Personnel",
        cell: ({ row }) => {
            const moderator = row.original;
            return (
                <div className="flex items-center gap-4 py-1">
                    <div className="relative h-12 w-12 rounded-[1.25rem] overflow-hidden bg-neutral-100 border-2 border-white shadow-lg ring-1 ring-neutral-200 shrink-0 transform transition-transform hover:scale-105 active:scale-95 duration-300">
                        {moderator.profilePhoto ? (
                            <Image src={moderator.profilePhoto} alt={moderator.name} fill className="object-cover" />
                        ) : (
                            <div className="h-full w-full flex items-center justify-center text-neutral-400 bg-neutral-50">
                                <User className="h-6 w-6" />
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="font-black text-neutral-900 text-[15px] leading-tight truncate tracking-tight">{moderator.name}</span>
                        <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 font-bold  tracking-widest mt-1">
                            <Mail className="h-2.5 w-2.5 text-indigo-500" />
                            <span className="truncate">{moderator.email || moderator.user?.email || "N/A"}</span>
                        </div>
                    </div>
                </div>
            );
        },
    },
    {
        id: "stats",
        header: "Operational Stats",
        cell: ({ row }) => {
            const counts = row.original.user?._count || {};
            return (
                <div className="flex flex-wrap gap-2 py-1">
                    <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-xl border border-neutral-100 shadow-sm transition-all hover:bg-amber-50 group" title="Ideas Created">
                        <Star className="h-3 w-3 text-amber-500 group-hover:scale-110 duration-200" />
                        <span className="text-[10px] font-black text-neutral-700 uppercase tracking-tight">{counts.ideas || 0} IDEAS</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-xl border border-neutral-100 shadow-sm transition-all hover:bg-indigo-50 group" title="Account Followers">
                        <Users className="h-3 w-3 text-indigo-500 group-hover:scale-110 duration-200" />
                        <span className="text-[10px] font-black text-neutral-700 uppercase tracking-tight">{counts.followers || 0} FANS</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-xl border border-neutral-100 shadow-sm transition-all hover:bg-emerald-50 group" title="Reviews Conducted">
                        <Briefcase className="h-3 w-3 text-emerald-500 group-hover:scale-110 duration-200" />
                        <span className="text-[10px] font-black text-neutral-700 uppercase tracking-tight">{counts.reviewsPerformed || 0} REVIEWS</span>
                    </div>
                </div>
            );
        },
    },
    {
        id: "verification",
        accessorKey: "onboarded",
        header: "Status",
        cell: ({ row }) => (
            <div className="flex flex-col gap-1.5">
                <StatusBadgeCell status={row.original.user?.status || "PENDING"} />
                <div className={`flex items-center justify-center gap-1 px-2 py-0.5 rounded-md border text-[8px] font-black uppercase tracking-[0.15em] w-fit ${row.original.onboarded ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-rose-50 border-rose-100 text-rose-500'}`}>
                    {row.original.onboarded ? "VERIFIED ADMIN" : "IN REVIEW"}
                </div>
            </div>
        ),
    },
    {
        id: "score",
        accessorKey: "activityScore",
        header: "Rank",
        cell: ({ row }) => (
            <div className="flex items-center gap-3 pr-4">
                <div className="flex flex-col gap-1 flex-1 min-w-[70px]">
                    <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black text-neutral-400 uppercase tracking-wider">Score</span>
                        <span className="text-[9px] font-black text-indigo-600 uppercase tracking-wider">{row.original.activityScore || 0}%</span>
                    </div>
                    <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden border border-neutral-50 shadow-inner">
                        <div
                            className="h-full bg-linear-to-r from-indigo-400 to-indigo-600 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.4)] transition-all duration-700"
                            style={{ width: `${Math.min(row.original.activityScore || 0, 100)}%` }}
                        />
                    </div>
                </div>
            </div>
        ),
    },
    {
        id: "createdAt",
        accessorKey: "createdAt",
        header: "Service Since",
        cell: ({ row }) => {
            return (
                <div className="flex flex-col py-1">
                    <DateCell date={row.original.createdAt} formatString="MMM dd, yyyy" />
                </div>
            );
        },
    },
];
