"use client"

import { deleteSubscriptionPlanAction } from "@/app/(dashboardLayout)/admin/dashboard/plan-management/_action"
import AppSubmitButton from "@/components/shared/form/AppSubmitButton"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { ISubscriptionPlan } from "@/types/subscription"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AlertTriangle } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface DeletePlanModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    plan: ISubscriptionPlan | null
}

const DeletePlanModal = ({ open, onOpenChange, plan }: DeletePlanModalProps) => {
    const queryClient = useQueryClient()
    const router = useRouter()

    const { mutateAsync, isPending } = useMutation({
        mutationFn: async (id: string) => {
            console.log("[DeletePlanModal] Calling server action with ID:", id)
            return await deleteSubscriptionPlanAction(id)
        },
    })

    const handleDelete = async () => {
        console.log("[DeletePlanModal] handleDelete triggered for plan:", plan?.name)
        if (!plan) return

        try {
            const result = await mutateAsync(plan.id)
            console.log("[DeletePlanModal] Result:", result)

            if (!result.success) {
                toast.error(result.message || "Failed to terminate the selected plan.")
                return
            }

            toast.success(result.message || "Subscription plan removed permanently.")
            onOpenChange(false)

            await queryClient.invalidateQueries({ queryKey: ["subscription-plans"] })
            router.refresh()
        } catch (error: any) {
            console.error("[DeletePlanModal] Error:", error)
            toast.error(error?.message || "An unexpected error occurred during termination.")
        }
    }

    if (!plan) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[440px] rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden bg-white">
                <div className="bg-rose-50/50 p-10 flex flex-col items-center text-center">
                    <div className="h-16 w-16 rounded-[1.5rem] bg-rose-100 flex items-center justify-center mb-6">
                        <AlertTriangle className="h-8 w-8 text-rose-600" />
                    </div>
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black text-neutral-900 tracking-tight font-heading leading-tight">Terminate Plan?</DialogTitle>
                        <DialogDescription className="text-neutral-500 font-medium mt-3 leading-relaxed">
                            This action will permanently delete <span className="text-rose-600 font-black">"{plan.name}"</span>.
                            Active memberships will not be affected until their next renewal cycle.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        handleDelete()
                    }}
                    className="p-8 pt-0 flex flex-col gap-3"
                >
                    <div className="grid grid-cols-2 gap-3 mt-4">
                        <Button
                            type="button"
                            variant="secondary"
                            className="h-12 rounded-xl font-bold text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 font-sans border-none transition-all active:scale-95"
                            onClick={() => onOpenChange(false)}
                            disabled={isPending}
                        >
                            Keep Plan
                        </Button>
                        <AppSubmitButton
                            isPending={isPending}
                            type="submit"
                            className="h-12 rounded-xl font-black bg-rose-600 hover:bg-rose-700 shadow-xl shadow-rose-500/20 font-sans transition-all active:scale-95"
                            pendingLabel="Terminating..."
                        >
                            Terminate Plan
                        </AppSubmitButton>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default DeletePlanModal
