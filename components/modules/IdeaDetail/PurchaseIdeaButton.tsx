"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { BadgeDollarSign, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createCheckoutSession } from "@/services/payment.service";

interface PurchaseIdeaButtonProps {
    ideaId: string;
    price: number;
    isLoggedIn: boolean;
}

export default function PurchaseIdeaButton({
    ideaId,
    price,
    isLoggedIn,
}: PurchaseIdeaButtonProps) {
    const router = useRouter();
    const [pending, startTransition] = useTransition();

    const handlePurchase = async () => {
        if (!isLoggedIn) {
            toast.info("Please login to purchase this idea.");
            // Redirect to login with current path as redirect parameter
            router.push(`/login?redirect=/ideas/${ideaId}`);
            return;
        }

        startTransition(async () => {
            try {
                const result = await createCheckoutSession(ideaId);

                if (result.data?.url) {
                    // Redirect to Stripe checkout URL
                    window.location.href = result.data.url;
                } else {
                    toast.error(result.message || "Something went wrong. Please try again.");
                }
            } catch (error: any) {
                console.error("Purchase error:", error);
                toast.error(error?.message || "Failed to initiate purchase.");
            }
        });
    };

    return (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
            <div className="mb-2 flex items-center gap-2">
                <BadgeDollarSign className="size-5 text-primary" />
                <span className="text-xl font-bold text-primary">${price}</span>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
                Unlock full business plan, financial projections, and exclusive resources.
            </p>
            <Button
                className="w-full"
                size="sm"
                onClick={handlePurchase}
                disabled={pending}
            >
                {pending ? (
                    <>
                        <Loader2 className="mr-2 size-4 animate-spin" />
                        Processing...
                    </>
                ) : (
                    "Purchase Idea"
                )}
            </Button>
        </div>
    );
}
