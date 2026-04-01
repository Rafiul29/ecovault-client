import { IdeaStatus, SubscriptionTier } from "@/types/types";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatRelativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateStr);
}

export function formatNumber(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function ideaStatusLabel(status: IdeaStatus): string {
  const labels: Record<IdeaStatus, string> = {
    DRAFT: "Draft",
    PENDING: "Pending Review",
    APPROVED: "Approved",
    REJECTED: "Rejected",
    PUBLISHED: "Published",
  };
  return labels[status];
}

export function ideaStatusVariant(
  status: IdeaStatus,
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "PUBLISHED":
    case "APPROVED":
      return "default";
    case "REJECTED":
      return "destructive";
    case "DRAFT":
      return "outline";
    default:
      return "secondary";
  }
}

export function tierLabel(tier: SubscriptionTier): string {
  return { FREE: "Free", PRO: "Pro", PREMIUM: "Premium" }[tier];
}
