"use client"

import { motion } from "framer-motion"
import { CheckCircle2, ShoppingBag, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface SuccessContentProps {
    redirectUrl: string
}

export default function SuccessContent({ redirectUrl }: SuccessContentProps) {
    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full bg-background border border-emerald-100 dark:border-emerald-900/30 shadow-2xl shadow-emerald-500/10 rounded-3xl p-8 text-center relative overflow-hidden"
            >
                {/* Background decorative elements */}
                <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-emerald-400 to-teal-500" />
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl" />

                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                        delay: 0.2
                    }}
                    className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner"
                >
                    <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                </motion.div>

                <h1 className="text-3xl font-extrabold tracking-tight mb-2 text-foreground">
                    Payment Successful!
                </h1>
                <p className="text-muted-foreground mb-8 text-sm font-medium leading-relaxed px-4">
                    Thank you for your purchase. Your account has been updated and a receipt has been sent to your email.
                </p>

                <div className="space-y-3 mb-8">
                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-muted-foreground/5">
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Order Status</span>
                        <span className="text-sm font-extrabold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-full">Completed</span>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <Button asChild className="h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold shadow-lg shadow-emerald-600/20 group transition-all duration-300">
                        <Link href="/dashboard" className="flex items-center justify-center gap-2">
                            Go to Dashboard
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </Button>
                    <Button asChild variant="ghost" className="h-12 rounded-2xl font-semibold hover:bg-emerald-50 dark:hover:bg-emerald-900/10 text-muted-foreground hover:text-emerald-600 transition-colors">
                        <Link href={redirectUrl} className="flex items-center justify-center gap-2">
                            <ShoppingBag className="w-4 h-4" />
                            View Purchased Items
                        </Link>
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}
