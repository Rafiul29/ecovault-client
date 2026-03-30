import { Badge } from "@/components/ui/badge";
import { UserStatus, IdeaStatus, PaymentStatus } from "@/types/enums";
import { cn } from "@/lib/utils";

type StatusType = UserStatus | IdeaStatus | PaymentStatus | string;

interface IStatusBadgeCellProps {
    status: StatusType;
    className?: string;
}

const getStatusVariant = (status: StatusType): "default" | "secondary" | "destructive" | "outline" => {
    const s = String(status).toUpperCase();
    
    // User / Idea / Generic Success/Active
    if (["ACTIVE", "APPROVED", "COMPLETED"].includes(s)) return "default";
    
    // Danger / Warning
    if (["BLOCKED", "DELETED", "REJECTED", "FAILED"].includes(s)) return "destructive";
    
    // Pending / Ongoing
    if (["PENDING", "UNDER_REVIEW", "DRAFT"].includes(s)) return "secondary";
    
    return "outline";
}

const StatusBadgeCell = ({ status, className }: IStatusBadgeCellProps) => {
    return (
        <Badge
            variant={getStatusVariant(status)}
            className={cn("capitalize px-2.5 py-0.5", className)}
        >
            {status.toLowerCase().replace("_", " ")}
        </Badge>
    )
}

export default StatusBadgeCell