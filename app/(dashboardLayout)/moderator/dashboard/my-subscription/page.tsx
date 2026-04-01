import { getMySubscription } from "@/services/subscription.service";
import { format, differenceInDays } from "date-fns";
import { ShieldCheck, Calendar, CreditCard, Star, RefreshCw, AlertCircle, Mail, MapPin } from "lucide-react";
import Link from "next/link";
import { ISubscription } from "@/types/subscription";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const ModeratorMySubscriptionPage = async () => {
    // Fetch the moderator's subscription from the backend
    const res = await getMySubscription().catch(() => null);

    // The API returns an array in "data" according to the latest backend implementation
    const subscriptions = Array.isArray(res?.data) ? res.data : (res?.data ? [res.data] : []);

    // Assuming the first one or finding the active one
    const subscription = subscriptions.find((sub: ISubscription) => sub.isActive) || subscriptions[0] || null;

    // Helper for tier-based colors
    const getTierConfig = (tier: string) => {
        switch (tier?.toUpperCase()) {
            case "FREE":
                return {
                    wrapperClass: "border-neutral-200 ring-4 ring-neutral-50 shadow-neutral-200/50",
                    bgClass: "bg-linear-to-bl from-neutral-50 to-white",
                    iconGradient: "bg-linear-to-br from-neutral-400 to-neutral-600 shadow-neutral-500/30",
                    badgeClass: "bg-neutral-100 text-neutral-700 border-neutral-200",
                    accentText: "text-neutral-600"
                };
            case "BASIC":
                return {
                    wrapperClass: "border-blue-200 ring-4 ring-blue-50 shadow-blue-200/50",
                    bgClass: "bg-linear-to-bl from-blue-50 to-white",
                    iconGradient: "bg-linear-to-br from-blue-400 to-blue-600 shadow-blue-500/30",
                    badgeClass: "bg-blue-100 text-blue-700 border-blue-200",
                    accentText: "text-blue-600"
                };
            case "PRO":
                return {
                    wrapperClass: "border-amber-200 ring-4 ring-amber-50 shadow-amber-200/50",
                    bgClass: "bg-linear-to-bl from-amber-50 to-white",
                    iconGradient: "bg-linear-to-br from-amber-400 to-orange-500 shadow-orange-500/30",
                    badgeClass: "bg-amber-100 text-amber-700 border-amber-200",
                    accentText: "text-amber-600"
                };
            case "ENTERPRISE":
                return {
                    wrapperClass: "border-purple-200 ring-4 ring-purple-50 shadow-purple-200/50",
                    bgClass: "bg-linear-to-bl from-purple-50 to-white",
                    iconGradient: "bg-linear-to-br from-purple-500 to-indigo-600 shadow-indigo-500/30",
                    badgeClass: "bg-purple-100 text-purple-700 border-purple-200",
                    accentText: "text-purple-600"
                };
            default:
                return {
                    wrapperClass: "border-emerald-200 ring-4 ring-emerald-50 shadow-emerald-200/50",
                    bgClass: "bg-linear-to-bl from-emerald-50 to-white",
                    iconGradient: "bg-linear-to-br from-emerald-400 to-emerald-600 shadow-emerald-500/30",
                    badgeClass: "bg-emerald-100 text-emerald-700 border-emerald-200",
                    accentText: "text-emerald-600"
                };
        }
    };

    const tierConfig = subscription ? getTierConfig(subscription.tier) : null;
    const gatewayData = subscription?.payment?.paymentGatewayData;

    const daysRemaining = subscription ? Math.max(0, differenceInDays(new Date(subscription.endDate), new Date())) : 0;
    const totalDays = subscription?.subscriptionPlan?.durationDays || 365;
    const timeElapsedPercentage = Math.max(0, Math.min(100, ((totalDays - daysRemaining) / totalDays) * 100));

    let remainingColor = "bg-emerald-500";
    if (daysRemaining <= 7) remainingColor = "bg-rose-500";
    else if (daysRemaining <= 30) remainingColor = "bg-amber-500";

    return (
        <div className="max-w-[1200px] mx-auto py-8 px-4 sm:px-6 h-full pb-20">
            <div className="mb-8 flex flex-col sm:flex-row justify-between sm:items-end gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-neutral-900 tracking-tight">
                        My Subscription
                    </h1>
                    <p className="text-sm font-medium text-neutral-500 mt-2">
                        Manage your current subscription plan and billing details as a Moderator.
                    </p>
                </div>
            </div>

            {!subscription ? (
                <div className="bg-white rounded-[2.5rem] p-12 text-center border border-neutral-100 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
                    <div className="h-20 w-20 bg-neutral-50 rounded-full flex items-center justify-center mb-6 border border-neutral-100 shadow-inner">
                        <AlertCircle className="h-10 w-10 text-neutral-400" />
                    </div>
                    <h2 className="text-2xl font-black text-neutral-900 mb-3 tracking-tight">No Active Subscription</h2>
                    <p className="text-neutral-500 max-w-md mx-auto mb-8 font-medium leading-relaxed">
                        You currently do not have an active subscription or a plan assigned to your account. Head over to our pricing page to explore available tiers.
                    </p>
                    <Link href="/pricing">
                        <Button className="h-12 px-8 rounded-2xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-500/20 transition-all hover:-translate-y-1">
                            Explore Subscription Plans
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* Active Plan Detail Column */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className={`rounded-[2.5rem] p-8 sm:p-10 border shadow-sm relative overflow-hidden group transition-colors ${tierConfig?.wrapperClass} ${tierConfig?.bgClass}`}>
                            {/* Decorative Background Element */}
                            <div className={`absolute top-0 right-0 w-80 h-80 rounded-bl-[10rem] z-0 opacity-40 pointer-events-none group-hover:scale-105 transition-transform duration-700 bg-white/40`} />

                            <div className="relative z-10">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
                                    <div className="flex items-center gap-5">
                                        <div className={`h-16 w-16 rounded-2xl flex items-center justify-center text-white shrink-0 ${tierConfig?.iconGradient}`}>
                                            <Star className="h-8 w-8" />
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-black text-neutral-900 tracking-tight">
                                                {subscription.subscriptionPlan?.name || "Premium Plan"}
                                            </h2>
                                            <div className="flex items-center gap-2 mt-2">
                                                <Badge className={`px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest rounded-md border text-center pointer-events-none ${subscription.isActive ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'}`}>
                                                    {subscription.isActive ? "Active Status" : "Inactive Status"}
                                                </Badge>
                                                <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 border rounded-md ${tierConfig?.badgeClass}`}>
                                                    Tier: {subscription.tier}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-left sm:text-right bg-white/70 backdrop-blur-md p-4 rounded-2xl border border-white scroll-shadow-sm">
                                        <p className="text-4xl font-black text-neutral-900">
                                            ${subscription.subscriptionPlan?.price?.toFixed(2) || "0.00"}
                                        </p>
                                        <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${tierConfig?.accentText}`}>
                                            Billed per {subscription.subscriptionPlan?.durationDays} Days
                                        </p>
                                    </div>
                                </div>

                                {subscription.subscriptionPlan?.description && (
                                    <p className="text-neutral-600 font-medium mb-8 bg-white/50 p-4 rounded-xl border border-white/60">
                                        {subscription.subscriptionPlan.description}
                                    </p>
                                )}

                                <Separator className="my-8 bg-neutral-200/50" />

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <h3 className="text-[11px] font-black text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                                            <Calendar className="h-4 w-4" /> Billing Status
                                        </h3>
                                        <div className="space-y-5">
                                            <div className="bg-white/60 p-4 rounded-xl border border-neutral-100/50 flex items-center gap-4">
                                                <div className="h-10 w-10 bg-white rounded-lg border border-neutral-100 flex items-center justify-center shrink-0 shadow-sm">
                                                    <div className="h-3 w-3 rounded-full bg-emerald-500" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-wider mb-0.5">Started On</p>
                                                    <p className="text-sm font-bold text-neutral-800">
                                                        {format(new Date(subscription.startDate), "MMMM d, yyyy")}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="bg-white/60 p-4 rounded-xl border border-neutral-100/50 flex flex-col gap-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-10 w-10 bg-white rounded-lg border border-neutral-100 flex items-center justify-center shrink-0 shadow-sm">
                                                        <div className={`h-3 w-3 rounded-full ${daysRemaining <= 7 ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)] animate-pulse' : 'bg-amber-500'}`} />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-wider mb-0.5">Expiry / Next Billing</p>
                                                        <p className="text-sm font-bold text-neutral-800">
                                                            {format(new Date(subscription.endDate), "MMMM d, yyyy")}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="bg-white p-3.5 rounded-lg border border-neutral-100 shadow-[inset_0_1px_4px_rgba(0,0,0,0.02)]">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Plan Validity</p>
                                                        <p className={`text-[10px] font-black uppercase tracking-widest ${daysRemaining <= 7 ? 'text-rose-600' : (daysRemaining <= 30 ? 'text-amber-600' : 'text-emerald-600')}`}>
                                                            {daysRemaining} Days Left
                                                        </p>
                                                    </div>
                                                    <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full transition-all duration-1000 ${remainingColor}`}
                                                            style={{ width: `${timeElapsedPercentage}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <h3 className="text-[11px] font-black text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                                            <RefreshCw className="h-4 w-4" /> Renewal
                                        </h3>
                                        <div className="h-full bg-white/60 p-6 rounded-xl border border-neutral-100/50 flex flex-col justify-center">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className={`h-2.5 w-2.5 rounded-full ${subscription.autoRenew ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-neutral-300'}`} />
                                                <p className="text-sm font-black text-neutral-800 uppercase tracking-wide">
                                                    {subscription.autoRenew ? "Auto-Renew ON" : "Auto-Renew OFF"}
                                                </p>
                                            </div>
                                            <p className="text-xs font-medium text-neutral-600 leading-relaxed">
                                                {subscription.autoRenew
                                                    ? "Your subscription is set to automatically renew at the end of the current billing cycle. No further action is required."
                                                    : "Your subscription will safely expire at the end of the current billing cycle and will not automatically charge your account."}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Column */}
                    {subscription.payment && (
                        <div className="lg:col-span-1 space-y-8">
                            <div className="bg-neutral-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-neutral-900/40">
                                <div className="absolute -top-10 -right-10 p-6 opacity-[0.03] pointer-events-none">
                                    <CreditCard className="h-48 w-48 text-white" />
                                </div>
                                <h3 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest border-b border-neutral-800 pb-5 mb-8 relative z-10 flex items-center gap-2">
                                    <ShieldCheck className="h-4 w-4" /> Latest Payment Record
                                </h3>

                                <div className="space-y-8 relative z-10">
                                    <div>
                                        <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-1.5">Amount Billed</p>
                                        <p className="text-3xl font-black text-white">${subscription.payment.amount.toFixed(2)}</p>
                                    </div>

                                    <div className="space-y-5 bg-neutral-800/50 p-5 rounded-2xl border border-neutral-700/50">
                                        <div>
                                            <p className="text-[9px] font-black text-neutral-500 uppercase tracking-widest mb-1">Transaction ID</p>
                                            <p className="text-xs font-mono text-neutral-300 truncate tracking-wider">{subscription.payment.transactionId || "N/A"}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-neutral-500 uppercase tracking-widest mb-1.5">Method</p>
                                            <p className="text-xs font-bold text-neutral-300 uppercase">
                                                {gatewayData?.payment_method_types?.[0] || subscription.payment.paymentMethod || "CARD"}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-neutral-500 uppercase tracking-widest mb-1.5">Status</p>
                                            <Badge className={`bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 font-black uppercase text-[9px] rounded-md pointer-events-none tracking-widest`}>
                                                {subscription.payment.status}
                                            </Badge>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-neutral-500 uppercase tracking-widest mb-1">Payment Date</p>
                                            <p className="text-sm font-bold text-neutral-200">
                                                {format(new Date(subscription.payment.createdAt), "MMMM d, yyyy")}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Gateway Data Extra Info */}
                            {gatewayData?.customer_details && (
                                <div className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-sm space-y-4">
                                    <h3 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                                        Billing Information
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 bg-neutral-50 rounded-lg flex items-center justify-center">
                                                <Mail className="h-3.5 w-3.5 text-neutral-500" />
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Email</p>
                                                <p className="text-xs font-bold text-neutral-800 truncate">{gatewayData.customer_details.email}</p>
                                            </div>
                                        </div>
                                        {gatewayData.customer_details.address?.country && (
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 bg-neutral-50 rounded-lg flex items-center justify-center">
                                                    <MapPin className="h-3.5 w-3.5 text-neutral-500" />
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Country</p>
                                                    <p className="text-xs font-bold text-neutral-800">{gatewayData.customer_details.address.country}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ModeratorMySubscriptionPage;
