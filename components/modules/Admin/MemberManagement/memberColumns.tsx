import DateCell from "@/components/shared/cell/DateCell";
import StatusBadgeCell from "@/components/shared/cell/StatusBadgeCell";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { User, Mail, CreditCard, Star, Users } from "lucide-react";
import Image from "next/image";

export const memberColumns: ColumnDef<any>[] = [
    {
        id: "member",
        accessorKey: "name",
        header: "Member Details",
        cell: ({ row }) => {
            const member = row.original;
            return (
                <div className="flex items-center gap-4">
                    <div className="relative h-11 w-11 rounded-2xl overflow-hidden bg-neutral-100 border-2 border-white shadow-md ring-1 ring-neutral-100 shrink-0 animate-in fade-in zoom-in duration-500">
                        {member.image ? (
                            <Image src={member.image} alt={member.name} fill className="object-cover" />
                        ) : (
                            <div className="h-full w-full flex items-center justify-center text-neutral-400 bg-neutral-50">
                                <User className="h-5 w-5" />
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="font-black text-neutral-900 text-[14px] leading-tight truncate">{member.name || "Anonymous Member"}</span>
                        <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 font-black tracking-widest mt-1">
                            <Mail className="h-2.5 w-2.5 text-blue-500" />
                            {member.email}
                        </div>
                    </div>
                </div>
            );
        },
    },
    {
        id: "engagement",
        header: "Engagement Stats",
        cell: ({ row }) => {
            const counts = row.original._count || {};
            return (
                <div className="flex flex-wrap gap-2">
                    <div className="flex items-center gap-1.5 bg-neutral-50 px-2 py-1 rounded-lg border border-neutral-100" title="Ideas Published">
                        <Star className="h-3 w-3 text-amber-500" />
                        <span className="text-[10px] font-black text-neutral-700 uppercase tracking-tight">{counts.ideas || 0} IDEAS</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-neutral-50 px-2 py-1 rounded-lg border border-neutral-100" title="Purchased Solutions">
                        <CreditCard className="h-3 w-3 text-emerald-500" />
                        <span className="text-[10px] font-black text-neutral-700 uppercase tracking-tight">{counts.purchasedIdeas || 0} BOUGHT</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-neutral-50 px-2 py-1 rounded-lg border border-neutral-100" title="Followers Count">
                        <Users className="h-3 w-3 text-indigo-500" />
                        <span className="text-[10px] font-black text-neutral-700 uppercase tracking-tight">{counts.followers || 0} FANS</span>
                    </div>
                </div>
            );
        },
    },
    {
        id: "status",
        accessorKey: "status",
        header: "Account Rank",
        cell: ({ row }) => {
            return (
                <div className="flex flex-col gap-1.5">
                    <StatusBadgeCell status={row.original.status} />
                </div>
            );
        },
    },
    {
        id: "createdAt",
        accessorKey: "createdAt",
        header: "Member Since",
        cell: ({ row }) => {
            return (
                <div className="flex flex-col">
                    <DateCell date={row.original.createdAt} formatString="MMM dd, yyyy" />
                </div>
            );
        },
    },
];
