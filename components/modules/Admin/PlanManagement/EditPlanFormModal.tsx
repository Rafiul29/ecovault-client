"use client"

import { updateSubscriptionPlanAction } from "@/app/(dashboardLayout)/admin/dashboard/plan-management/_action"
import AppField from "@/components/shared/form/AppField"
import AppSubmitButton from "@/components/shared/form/AppSubmitButton"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select"
import { SubscriptionTier } from "@/types/enums"
import { ISubscriptionPlan } from "@/types/subscription"
import { useForm } from "@tanstack/react-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { toast } from "sonner"

interface EditPlanFormModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    plan: ISubscriptionPlan | null
}

const EditPlanFormModal = ({ open, onOpenChange, plan }: EditPlanFormModalProps) => {
    const queryClient = useQueryClient()
    const router = useRouter()

    useEffect(() => {
        if (plan) {
            form.reset({
                name: plan.name,
                description: plan.description || "",
                tier: plan.tier,
                price: plan.price,
                durationDays: plan.durationDays,
                isActive: plan.isActive,
            })
        }
    }, [plan])

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (payload: any) => updateSubscriptionPlanAction(plan!.id, payload),
    })

    const form = useForm({
        defaultValues: {
            name: plan?.name || "",
            description: plan?.description || "",
            tier: plan?.tier || SubscriptionTier.BASIC,
            price: plan?.price || 0,
            durationDays: plan?.durationDays || 30,
            isActive: plan?.isActive ?? true,
        },
        onSubmit: async ({ value }) => {
            if (!plan) return

            const result = await mutateAsync(value)

            if (!result.success) {
                toast.error(result.message || "Failed to update subscription plan")
                return
            }

            toast.success(result.message || "Subscription plan updated successfully")
            onOpenChange(false)
            void queryClient.invalidateQueries({ queryKey: ["subscription-plans"] })
            router.refresh()
        },
    })

    if (!plan) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader className="pb-2">
                    <DialogTitle className="text-3xl font-black text-neutral-950 tracking-tight font-heading">Reconfigure Plan</DialogTitle>
                    <DialogDescription className="text-neutral-500 font-medium italic">
                        Modify the details of <span className="text-neutral-900 font-bold">"{plan.name}"</span>.
                    </DialogDescription>
                </DialogHeader>
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        form.handleSubmit()
                    }}
                    className="space-y-4 pt-4"
                >
                    <form.Field
                        name="name"
                        validators={{
                            onChange: ({ value }) => !value ? "Name is required" : undefined
                        }}
                    >
                        {(field) => (
                            <AppField
                                field={field}
                                label="Plan Name"
                                placeholder="e.g. Pro Yearly"
                            />
                        )}
                    </form.Field>

                    <form.Field name="description">
                        {(field) => (
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Outline the benefits of this plan..."
                                    className="resize-none h-24"
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                />
                            </div>
                        )}
                    </form.Field>

                    <div className="grid grid-cols-2 gap-4">
                        <form.Field name="tier">
                            {(field) => (
                                <div className="space-y-2">
                                    <Label htmlFor="tier">Subscription Tier</Label>
                                    <Select
                                        value={field.state.value}
                                        onValueChange={(val) => field.handleChange(val as SubscriptionTier)}
                                    >
                                        <SelectTrigger id="tier">
                                            <SelectValue placeholder="Select access level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.values(SubscriptionTier).map((tier) => (
                                                <SelectItem key={tier} value={tier}>
                                                    {tier} Access
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </form.Field>

                        <form.Field
                            name="price"
                            validators={{
                                onChange: ({ value }) => value < 0 ? "Price cannot be negative" : undefined
                            }}
                        >
                            {(field) => (
                                <div className="space-y-2">
                                    <Label htmlFor="price">Price (USD)</Label>
                                    <input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        className="flex h-11 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm font-medium transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(Number(e.target.value))}
                                    />
                                    {field.state.meta.errors.length > 0 && (
                                        <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mt-1">
                                            {String(field.state.meta.errors[0])}
                                        </p>
                                    )}
                                </div>
                            )}
                        </form.Field>
                    </div>

                    <div className="grid grid-cols-2 gap-4 items-end">
                        <form.Field
                            name="durationDays"
                            validators={{
                                onChange: ({ value }) => value <= 0 ? "Duration must be positive" : undefined
                            }}
                        >
                            {(field) => (
                                <div className="space-y-2">
                                    <Label htmlFor="durationDays">Duration (Days)</Label>
                                    <input
                                        id="durationDays"
                                        type="number"
                                        className="flex h-11 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm font-medium transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(Number(e.target.value))}
                                    />
                                    {field.state.meta.errors.length > 0 && (
                                        <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mt-1">
                                            {String(field.state.meta.errors[0])}
                                        </p>
                                    )}
                                </div>
                            )}
                        </form.Field>

                        <form.Field name="isActive">
                            {(field) => (
                                <div className="flex items-center gap-3 h-11 px-4 rounded-xl border border-neutral-200 bg-neutral-50">
                                    <input
                                        id="isActive"
                                        type="checkbox"
                                        className="h-5 w-5 rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500"
                                        checked={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.checked)}
                                    />
                                    <Label htmlFor="isActive" className="text-xs uppercase font-black tracking-widest cursor-pointer leading-none">Active</Label>
                                </div>
                            )}
                        </form.Field>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-6 mt-4 border-t border-neutral-100">
                        <Button type="button" variant="ghost" className="h-11 px-6 rounded-xl font-bold text-neutral-500 hover:text-neutral-900 transition-all font-sans" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <AppSubmitButton isPending={isPending} className="w-auto h-11 px-8 rounded-xl font-black shadow-xl shadow-emerald-500/20 bg-emerald-600 hover:bg-emerald-700 font-sans">
                            Save Changes
                        </AppSubmitButton>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default EditPlanFormModal
