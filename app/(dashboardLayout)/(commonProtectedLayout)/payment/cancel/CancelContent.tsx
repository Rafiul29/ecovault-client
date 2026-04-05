"use client"

import { motion } from "framer-motion"
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function CancelContent() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full bg-background border border-amber-100 dark:border-amber-900/30 shadow-2xl shadow-amber-500/5 rounded-3xl p-8 text-center relative overflow-hidden"
            >
                {/* Background decorative elements */}
                <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-amber-400 to-orange-500" />
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl" />

                <motion.div
                    initial={{ rotate: -15, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                        delay: 0.2
                    }}
                    className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner"
                >
                    <AlertCircle className="w-10 h-10 text-amber-600" />
                </motion.div>

                <h1 className="text-3xl font-extrabold tracking-tight mb-2 text-foreground">
                    Payment Cancelled
                </h1>
                <p className="text-muted-foreground mb-8 text-sm font-medium leading-relaxed px-4">
                    The payment process was cancelled. No charges were made to your account. If you experienced an issue, please try again or contact support.
                </p>

                <div className="grid grid-cols-1 gap-3">
                    <Button asChild className="h-12 bg-foreground hover:bg-foreground/90 text-background rounded-2xl font-bold shadow-lg shadow-foreground/10 group transition-all duration-300">
                        <Link href="/pricing" className="flex items-center justify-center gap-2">
                            <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                            Try Checkout Again
                        </Link>
                    </Button>
                    <Button asChild variant="outline" className="h-12 rounded-2xl font-semibold border-muted-foreground/20 hover:bg-amber-50/50 dark:hover:bg-amber-900/10 hover:border-amber-500/30 transition-all">
                        <Link href="/dashboard" className="flex items-center justify-center gap-2">
                            <ArrowLeft className="w-4 h-4" />
                            Return to Dashboard
                        </Link>
                    </Button>
                </div>

                <p className="mt-8 text-xs text-muted-foreground font-medium">
                    Need help? <Link href="/support" className="text-amber-600 hover:underline">Contact Support</Link>
                </p>
            </motion.div>
        </div>
    );
}
