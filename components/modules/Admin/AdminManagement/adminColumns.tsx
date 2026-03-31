import DateCell from "@/components/shared/cell/DateCell";
import StatusBadgeCell from "@/components/shared/cell/StatusBadgeCell";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { User, Shield, Phone, Mail } from "lucide-react";
import Image from "next/image";

export const adminColumns: ColumnDef<any>[] = [
    {
        id: "admin",
        accessorKey: "name",
        header: "Administrator",
        cell: ({ row }) => {
            const admin = row.original;
            return (
                <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200">
                        {admin.profilePhoto ? (
                            <Image src={admin.profilePhoto} alt={admin.name} fill className="object-cover" />
                        ) : (
                            <div className="h-full w-full flex items-center justify-center text-neutral-400">
                                <User className="h-5 w-5" />
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-neutral-900 text-sm">{admin.name}</span>
                        <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-medium">
                            <Mail className="h-3 w-3" />
                            {admin.user?.email}
                        </div>
                    </div>
                </div>
            );
        },
    },
    {
        id: "role",
        accessorKey: "user.role",
        header: "Role",
        cell: ({ row }) => {
            const role = row.original.user?.role;
            return (
                <Badge variant="outline" className={`font-black text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-md border-2 ${role === 'SUPER_ADMIN' ? 'bg-indigo-50 text-indigo-600 border-indigo-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'}`}>
                    <Shield className="h-3 w-3 mr-1" />
                    {role?.replace("_", " ")}
                </Badge>
            );
        },
    },
    {
        id: "contact",
        accessorKey: "contactNumber",
        header: "Contact",
        cell: ({ row }) => (
            <div className="flex items-center gap-1.5 text-xs text-neutral-600 font-medium font-mono">
                <Phone className="h-3 w-3 text-neutral-400" />
                {row.original.contactNumber || "N/A"}
            </div>
        ),
    },
    {
        id: "status",
        accessorKey: "user.status",
        header: "Status",
        cell: ({ row }) => {
            return (
                <StatusBadgeCell status={row.original.user?.status} />
            );
        },
    },
    {
        id: "createdAt",
        accessorKey: "createdAt",
        header: "Joined at",
        cell: ({ row }) => {
            return (
                <DateCell date={row.original.createdAt} formatString="MMM dd, yyyy" />
            );
        },
    },
];
