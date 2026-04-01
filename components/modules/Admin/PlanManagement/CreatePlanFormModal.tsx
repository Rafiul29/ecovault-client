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
import { Plus, X, ListPlus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { ScrollArea } from "@/components/ui/scroll-area"

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
            features: [] as string[],
            order: 0,
            isPopular: false,
            buttonText: "Subscribe",
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

    const [featureInput, setFeatureInput] = useState("")

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2 h-11 px-6 rounded-xl font-black shadow-xl shadow-emerald-500/20 bg-emerald-600 hover:bg-emerald-700 font-sans transition-all active:scale-95">
                    <Plus className="h-5 w-5" />
                    New Subscription Plan
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
                <ScrollArea className="max-h-[90vh]">
                    <div className="p-8">
                        <DialogHeader className="pb-6 border-b border-neutral-100">
                            <DialogTitle className="text-3xl font-black text-neutral-950 tracking-tight font-heading">Construct New Plan</DialogTitle>
                            <DialogDescription className="text-neutral-500 font-medium italic mt-2">
                                Define pricing tiers, duration, and features for your platform's subscription model.
                            </DialogDescription>
                        </DialogHeader>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                form.handleSubmit()
                            }}
                            className="space-y-6 pt-8"
                        >
                            <div className="grid grid-cols-2 gap-4">
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

                                <form.Field name="buttonText">
                                    {(field) => (
                                        <AppField
                                            field={field}
                                            label="Button Text"
                                            placeholder="e.g. Subscribe Now"
                                        />
                                    )}
                                </form.Field>
                            </div>

                            <form.Field name="description">
                                {(field) => (
                                    <div className="space-y-2">
                                        <Label htmlFor="description" className="text-xs font-black uppercase tracking-widest text-neutral-400">Description</Label>
                                        <Textarea
                                            id="description"
                                            placeholder="Outline the benefits of this plan..."
                                            className="resize-none h-24 rounded-xl border-neutral-200 bg-neutral-50 transition-all focus:bg-white"
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                        />
                                    </div>
                                )}
                            </form.Field>

                            <div className="grid grid-cols-2 gap-6">
                                <form.Field name="tier">
                                    {(field) => (
                                        <div className="space-y-2">
                                            <Label htmlFor="tier" className="text-xs font-black uppercase tracking-widest text-neutral-400">Tier Level</Label>
                                            <Select
                                                value={field.state.value}
                                                onValueChange={(val) => field.handleChange(val as SubscriptionTier)}
                                            >
                                                <SelectTrigger id="tier" className="h-11 rounded-xl border-neutral-200 bg-neutral-50 font-bold focus:bg-white">
                                                    <SelectValue placeholder="Select access level" />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-xl border-neutral-100 shadow-xl">
                                                    {Object.values(SubscriptionTier).map((tier) => (
                                                        <SelectItem key={tier} value={tier} className="rounded-lg font-bold text-xs py-2 focus:bg-emerald-50 focus:text-emerald-700">
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
                                            <Label htmlFor="price" className="text-xs font-black uppercase tracking-widest text-neutral-400">Price (USD)</Label>
                                            <input
                                                id="price"
                                                type="number"
                                                step="0.01"
                                                className="flex h-11 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm font-bold transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
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

                            <div className="grid grid-cols-2 gap-6">
                                <form.Field
                                    name="durationDays"
                                    validators={{
                                        onChange: ({ value }) => value <= 0 ? "Duration must be positive" : undefined
                                    }}
                                >
                                    {(field) => (
                                        <div className="space-y-2">
                                            <Label htmlFor="durationDays" className="text-xs font-black uppercase tracking-widest text-neutral-400">Duration (Days)</Label>
                                            <input
                                                id="durationDays"
                                                type="number"
                                                className="flex h-11 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm font-bold transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
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

                                <form.Field name="order">
                                    {(field) => (
                                        <div className="space-y-2">
                                            <Label htmlFor="order" className="text-xs font-black uppercase tracking-widest text-neutral-400">Display Order</Label>
                                            <input
                                                id="order"
                                                type="number"
                                                className="flex h-11 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm font-bold transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.handleChange(Number(e.target.value))}
                                            />
                                        </div>
                                    )}
                                </form.Field>
                            </div>

                            <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-100">
                                <form.Field name="isPopular">
                                    {(field) => (
                                        <div className="flex items-center gap-3 mb-6 bg-white p-3 rounded-xl border border-neutral-100">
                                            <input
                                                id="isPopular"
                                                type="checkbox"
                                                className="h-5 w-5 rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                                                checked={field.state.value}
                                                onChange={(e) => field.handleChange(e.target.checked)}
                                            />
                                            <Label htmlFor="isPopular" className="text-[10px] uppercase font-black tracking-[0.2em] text-neutral-500 cursor-pointer">Mark as Popular/Recommended</Label>
                                        </div>
                                    )}
                                </form.Field>

                                <form.Field name="features">
                                    {(field) => (
                                        <div className="space-y-4">
                                            <Label className="text-xs font-black uppercase tracking-widest text-neutral-400">Plan Features</Label>
                                            <div className="flex gap-2">
                                                <input
                                                    placeholder="Add a feature (e.g. Priority Review Queue)"
                                                    className="flex-1 h-11 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                                    value={featureInput}
                                                    onChange={(e) => setFeatureInput(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            e.preventDefault();
                                                            if (featureInput.trim()) {
                                                                field.handleChange([...field.state.value, featureInput.trim()]);
                                                                setFeatureInput("");
                                                            }
                                                        }
                                                    }}
                                                />
                                                <Button 
                                                    type="button" 
                                                    size="icon" 
                                                    className="h-11 w-11 rounded-xl bg-emerald-600 text-white"
                                                    onClick={() => {
                                                        if (featureInput.trim()) {
                                                            field.handleChange([...field.state.value, featureInput.trim()]);
                                                            setFeatureInput("");
                                                        }
                                                    }}
                                                >
                                                    <ListPlus className="h-5 w-5" />
                                                </Button>
                                            </div>
                                            <div className="space-y-2">
                                                {field.state.value.map((feature, idx) => (
                                                    <div key={idx} className="flex items-center justify-between bg-white px-4 py-2 rounded-xl border border-neutral-100 group">
                                                        <span className="text-sm font-bold text-neutral-700">{feature}</span>
                                                        <button 
                                                            type="button" 
                                                            onClick={() => field.handleChange(field.state.value.filter((_, i) => i !== idx))}
                                                            className="text-neutral-400 hover:text-rose-500 transition-colors"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                                {field.state.value.length === 0 && (
                                                    <p className="text-xs italic text-neutral-400 text-center py-2">No features added yet</p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </form.Field>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-6 border-t border-neutral-100">
                                <Button type="button" variant="ghost" className="h-11 px-6 rounded-xl font-bold text-neutral-500 hover:text-neutral-900 transition-all font-sans" onClick={() => setOpen(false)}>
                                    Dismiss
                                </Button>
                                <AppSubmitButton isPending={isPending} className="w-auto h-11 px-8 rounded-xl font-black shadow-xl shadow-emerald-500/20 bg-emerald-600 hover:bg-emerald-700 font-sans">
                                    Create Plan
                                </AppSubmitButton>
                            </div>
                        </form>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}

export default CreatePlanFormModal
