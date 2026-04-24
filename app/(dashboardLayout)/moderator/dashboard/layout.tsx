import SubscriptionExpiryBanner from "@/components/modules/Dashboard/SubscriptionExpiryBanner";

export const dynamic = "force-dynamic";

export default function ModeratorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-full">
      {/* Subscription expiry warning — only visible ≤10 days before expiry */}
      <SubscriptionExpiryBanner />
      {children}
    </div>
  );
}
