"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ISubscription } from "@/types/subscription"
import { User, CreditCard, Calendar, ShieldCheck, Mail, Database, Clock, DollarSign, Wallet, Layers, CheckCircle2, XCircle } from "lucide-react"
import Image from "next/image"

interface ViewSubscriptionModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    subscription: ISubscription | null
}

const ViewSubscriptionModal = ({ open, onOpenChange, subscription }: ViewSubscriptionModalProps) => {
    if (!subscription) return null

    const isActive = subscription.isActive
    const statusColor = isActive ? "text-emerald-700 bg-emerald-50" : "text-rose-700 bg-rose-50"

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden rounded-3xl border-none shadow-2xl bg-white">
                {/* Header Banner */}
                <div className={`px-6 py-8 ${isActive ? 'bg-emerald-600' : 'bg-rose-600'} relative text-white`}>
                    <div className="flex flex-wrap gap-4 items-start justify-between relative z-10">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-white/70 text-[10px] font-bold uppercase tracking-widest">
                                <Database className="h-3 w-3" />
                                Record Token: {subscription.id.slice(-12)}
                            </div>
                            <DialogTitle className="text-2xl font-bold text-white">Registry Record Insight</DialogTitle>
                        </div>
                        <div className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center gap-2 shadow-lg">
                            {isActive ? <CheckCircle2 className="h-4 w-4 text-emerald-200" /> : <XCircle className="h-4 w-4 text-rose-200" />}
                            <span className="text-[10px] font-black uppercase tracking-widest">{isActive ? "Access Granted" : "Access Revoked"}</span>
                        </div>
                    </div>
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/5 rounded-full -ml-12 -mb-12 blur-2xl"></div>
                </div>

                <div className="px-6 py-8 space-y-8">
                    {/* Subscriber Overview */}
                    <div className="flex items-center gap-5 p-5 rounded-[2rem] bg-neutral-50 border border-neutral-100/50 shadow-sm">
                        <div className="relative">
                            {subscription.user.image ? (
                                <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-md border-2 border-white ring-4 ring-neutral-100">
                                    <Image
                                        src={subscription.user.image}
                                        alt={subscription.user.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-md border-2 border-white ring-4 ring-neutral-100">
                                    <User className="h-7 w-7 text-neutral-300" />
                                </div>
                            )}
                            <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white shadow-sm flex items-center justify-center ${isActive ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                                <ShieldCheck className="h-3 w-3 text-white" />
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-xl text-neutral-900 leading-none truncate">{subscription.user.name}</h3>
                            <div className="flex items-center gap-1.5 text-neutral-500 text-sm mt-2">
                                <Mail className="h-4 w-4 text-neutral-400" />
                                <span className="truncate">{subscription.user.email}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                                <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 text-[9px] font-black tracking-widest uppercase px-2">ID: {subscription.user.id.slice(0, 8)}...</Badge>
                                <Badge variant="outline" className="text-[9px] font-black tracking-widest uppercase px-2 border-neutral-200">Tier: {subscription.tier}</Badge>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                        {/* Plan Card */}
                        <div className="bg-white rounded-[1.5rem] p-5 border border-neutral-100 shadow-xl shadow-neutral-100/20 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100/50">
                                    <Layers className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Active Plan</p>
                                    <p className="text-sm font-bold text-neutral-900 leading-none mt-1">{subscription.subscriptionPlan.name}</p>
                                </div>
                            </div>
                            <Separator className="bg-neutral-50" />
                            <div className="grid grid-cols-2 gap-2">
                                 <div className="flex flex-col">
                                     <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-tight">Auto Renew</span>
                                     <span className={`text-[10px] font-black mt-0.5 ${subscription.autoRenew ? 'text-emerald-600' : 'text-neutral-500'}`}>
                                         {subscription.autoRenew ? 'YES' : 'NO'}
                                     </span>
                                 </div>
                                 <div className="flex flex-col text-right">
                                     <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-tight">Subscription</span>
                                     <span className="text-[10px] font-black text-neutral-900 mt-0.5 tracking-tight">#{subscription.id.slice(-6)}</span>
                                 </div>
                            </div>
                        </div>

                        {/* Payment Card */}
                        <div className="bg-white rounded-[1.5rem] p-5 border border-neutral-100 shadow-xl shadow-neutral-100/20 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100/50">
                                    <Wallet className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Financials</p>
                                    <p className="text-sm font-bold text-neutral-900 leading-none mt-1">${subscription.payment.amount.toFixed(2)}</p>
                                </div>
                            </div>
                            <Separator className="bg-neutral-50" />
                            <div className="grid grid-cols-2 gap-2">
                                 <div className="flex flex-col">
                                     <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-tight">Status</span>
                                     <span className={`text-[10px] font-black mt-0.5 ${subscription.payment.status === 'COMPLETED' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                         {subscription.payment.status}
                                     </span>
                                 </div>
                                 <div className="flex flex-col text-right">
                                     <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-tight">Gateway</span>
                                     <span className="text-[10px] font-black text-neutral-900 mt-0.5 tracking-tight truncate">{subscription.payment.paymentMethod || 'STRIPE'}</span>
                                 </div>
                            </div>
                        </div>
                    </div>

                    {/* Temporal Timeline */}
                    <div className="relative">
                         <div className="absolute top-1/2 left-0 w-full h-[1px] bg-neutral-100 -translate-y-1/2"></div>
                         <div className="flex justify-between items-center relative z-10 gap-4">
                             <div className="bg-white pl-0 pr-4 py-2">
                                 <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5 leading-none mb-1.5"><Calendar className="h-3 w-3" /> Activated</p>
                                 <p className="text-sm font-bold text-neutral-900 leading-none">{new Date(subscription.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                             </div>
                             <div className="h-2 w-2 rounded-full bg-neutral-200"></div>
                             <div className="bg-white pl-4 pr-0 py-2 text-right">
                                 <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest flex items-center justify-end gap-1.5 leading-none mb-1.5">Renews/Expires <Clock className="h-3 w-3" /></p>
                                 <p className="text-sm font-bold text-neutral-900 leading-none">{new Date(subscription.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                             </div>
                         </div>
                    </div>

                    {/* Metadata Trace */}
                    <div className="bg-neutral-50 rounded-[1.25rem] p-4 border border-neutral-100 flex items-center justify-between">
                        <div className="flex flex-col gap-1">
                             <div className="flex items-center gap-1.5">
                                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                 <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Transaction Signature</span>
                             </div>
                             <span className="text-xs font-mono font-bold text-indigo-500 pl-3 truncate max-w-[200px]">{subscription.payment.transactionId || 'NONE_PROVIDED'}</span>
                        </div>
                        <div className="text-right flex flex-col gap-1">
                            <span className="text-[10px] font-bold text-neutral-400">System Recorded</span>
                            <span className="text-[10px] font-bold text-neutral-700">{new Date(subscription.createdAt).toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

const Separator = ({ className }: { className?: string }) => <div className={`h-[1px] w-full ${className}`}></div>

export default ViewSubscriptionModal
