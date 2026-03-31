"use client"

import { createSubscriptionPlanAction } from "@/app/(dashboardLayout)/admin/dashboard/plan-management/_action"
import AppField from "@/components/shared/form/AppField"
import AppSubmitButton from "@/components/shared/form/AppSubmitButton"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
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
import { useForm } from "@tanstack/react-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

const CreatePlanFormModal = () => {
    const [open, setOpen] = useState(false)
    const queryClient = useQueryClient()
    const router = useRouter()

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (payload: any) => createSubscriptionPlanAction(payload),
    })

    const form = useForm({
        defaultValues: {
            name: "",
            description: "",
            tier: SubscriptionTier.BASIC,
            price: 0,
            durationDays: 30,
        },
        onSubmit: async ({ value }) => {
            const result = await mutateAsync(value)

            if (!result.success) {
                toast.error(result.message || "Failed to create subscription plan")
                return
            }

            toast.success(result.message || "Subscription plan created successfully")
            setOpen(false)
            form.reset()
            void queryClient.invalidateQueries({ queryKey: ["subscription-plans"] })
            router.refresh()
        },
    })

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2 h-11 px-6 rounded-xl font-black shadow-xl shadow-emerald-500/20 bg-emerald-600 hover:bg-emerald-700 font-sans transition-all active:scale-95">
                    <Plus className="h-5 w-5" />
                    New Subscription Plan
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader className="pb-2">
                    <DialogTitle className="text-3xl font-black text-neutral-950 tracking-tight font-heading">Construct New Plan</DialogTitle>
                    <DialogDescription className="text-neutral-500 font-medium italic">
                        Define pricing tiers and duration for your platform's subscription model.
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

                    <div className="flex items-center justify-end gap-3 pt-6 mt-4 border-t border-neutral-100">
                        <Button type="button" variant="ghost" className="h-11 px-6 rounded-xl font-bold text-neutral-500 hover:text-neutral-900 transition-all font-sans" onClick={() => setOpen(false)}>
                            Dismiss
                        </Button>
                        <AppSubmitButton isPending={isPending} className="w-auto h-11 px-8 rounded-xl font-black shadow-xl shadow-emerald-500/20 bg-emerald-600 hover:bg-emerald-700 font-sans">
                            Create Plan
                        </AppSubmitButton>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default CreatePlanFormModal
