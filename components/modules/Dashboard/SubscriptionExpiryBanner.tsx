import { getMySubscription } from "@/services/subscription.service";
import { differenceInDays } from "date-fns";
import { AlertTriangle, X, Clock } from "lucide-react";
import Link from "next/link";
import { ISubscription } from "@/types/subscription";

const SubscriptionExpiryBanner = async () => {
    const res = await getMySubscription().catch(() => null);

    const subscriptions = Array.isArray(res?.data)
        ? res.data
        : res?.data
            ? [res.data]
            : [];

    const subscription: ISubscription | null =
        subscriptions.find((s: ISubscription) => s.isActive) ||
        subscriptions[0] ||
        null;

    if (!subscription || !subscription.isActive) return null;

    const daysRemaining = Math.max(
        0,
        differenceInDays(new Date(subscription.endDate), new Date())
    );

    if (daysRemaining > 10) return null;

    const isUrgent = daysRemaining <= 3;
    const isExpiring = daysRemaining <= 7;

    return (
        <div
            role="alert"
            className={`relative w-full flex items-center justify-between gap-4 px-4 sm:px-6 py-3 mb-2 text-sm font-medium  border-b overflow-hidden
                ${isUrgent
                    ? "bg-rose-50 border-rose-200 text-rose-800"
                    : isExpiring
                        ? "bg-amber-50 border-amber-200 text-amber-800"
                        : "bg-yellow-50 border-yellow-200 text-yellow-800"
                }`}
        >
            {/* Decorative pulse dot */}
            <span
                className={`absolute left-0 top-0 h-full w-1 ${isUrgent ? "bg-rose-500" : isExpiring ? "bg-amber-500" : "bg-yellow-500"}`}
            />

            <div className="flex items-center gap-3 pl-2">
                {isUrgent ? (
                    <AlertTriangle className="size-4 shrink-0 animate-pulse" />
                ) : (
                    <Clock className="size-4 shrink-0" />
                )}

                <span>
                    {daysRemaining === 0
                        ? "Your subscription expires today! Renew now to keep access to moderator features."
                        : `Your subscription expires in ${daysRemaining} day${daysRemaining === 1 ? "" : "s"}. Renew to avoid losing access.`}
                </span>
            </div>

            <Link
                href="/pricing"
                className={`shrink-0 px-4 py-1 rounded-full text-xs font-bold border transition-all hover:scale-105
                    ${isUrgent
                        ? "bg-rose-600 text-white border-rose-600 hover:bg-rose-700"
                        : isExpiring
                            ? "bg-amber-600 text-white border-amber-600 hover:bg-amber-700"
                            : "bg-yellow-500 text-white border-yellow-500 hover:bg-yellow-600"
                    }`}
            >
                Renew Now
            </Link>
        </div>
    );
};

export default SubscriptionExpiryBanner;
