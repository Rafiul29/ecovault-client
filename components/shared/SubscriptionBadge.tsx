import { Badge } from "@/components/ui/badge";
import type { SubscriptionTier } from "@/lib/types";
import { cn } from "@/lib/utils";

interface SubscriptionBadgeProps {
  tier: SubscriptionTier;
  className?: string;
}

const tierStyles: Record<SubscriptionTier, string> = {
  FREE: "bg-muted text-muted-foreground border-border",
  PRO: "bg-primary/10 text-primary border-primary/30",
  PREMIUM: "bg-accent/10 text-accent border-accent/30",
};

export default function SubscriptionBadge({
  tier,
  className,
}: SubscriptionBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn("text-label font-semibold", tierStyles[tier], className)}
    >
      {tier}
    </Badge>
  );
}
