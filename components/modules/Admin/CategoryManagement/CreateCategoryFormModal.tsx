"use client"

import { createCategoryAction } from "@/app/(dashboardLayout)/admin/dashboard/category-management/_action"
import AppField from "@/components/shared/form/AppField"
import AppSubmitButton from "@/components/shared/form/AppSubmitButton"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { createCategoryZodSchema } from "@/zod/category.validation"
import { useForm } from "@tanstack/react-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Plus, Upload } from "lucide-react"
import { useRouter } from "next/navigation"
import { useCallback, useState } from "react"
import { toast } from "sonner"
import Image from "next/image"

const CreateCategoryFormModal = () => {
    const [open, setOpen] = useState(false)
    const [iconPreview, setIconPreview] = useState<string | null>(null)
    const queryClient = useQueryClient()
    const router = useRouter()

    const { mutateAsync, isPending } = useMutation({
        mutationFn: createCategoryAction,
    })

    const form = useForm({
        defaultValues: {
            name: "",
            description: "",
            color: "#10b981", // default emerald
            icon: null as File | null,
        },
        onSubmit: async ({ value }) => {
            const formData = new FormData()
            
            const data = {
                name: value.name,
                description: value.description,
                color: value.color,
            }

            formData.append("data", JSON.stringify(data))
            
            if (value.icon) {
                formData.append("file", value.icon)
            }

            const result = await mutateAsync(formData)

            if (!result.success) {
                toast.error(result.message || "Failed to create category")
                return
            }

            toast.success(result.message || "Category created successfully")
            setOpen(false)
            form.reset()
            setIconPreview(null)

            void queryClient.invalidateQueries({ queryKey: ["categories"] })
            router.refresh()
        },
    })

    const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
        const file = e.target.files?.[0]
        if (file) {
            field.handleChange(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setIconPreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="h-11 px-6 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-500/10 gap-2">
                    <Plus className="h-4 w-4" />
                    Add Category
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader className="pb-2">
                    <DialogTitle className="text-3xl font-black text-neutral-950 tracking-tight font-heading">Create Category</DialogTitle>
                    <DialogDescription className="text-neutral-500 font-medium">
                        Create a new category to organize ideas and make them discoverable.
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
                            onChange: ({ value }) => {
                                const res = createCategoryZodSchema.shape.name.safeParse(value)
                                return res.success ? undefined : res.error.issues[0]?.message
                            }
                        }}
                    >
                        {(field) => (
                            <AppField
                                field={field}
                                label="Category Name"
                                placeholder="e.g. Renewable Energy"
                            />
                        )}
                    </form.Field>

                    <form.Field
                        name="description"
                        validators={{
                            onChange: ({ value }) => {
                                const res = createCategoryZodSchema.shape.description.safeParse(value)
                                return res.success ? undefined : res.error.issues[0]?.message
                            }
                        }}
                    >
                        {(field) => (
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Briefly describe what this category covers..."
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                />
                                {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                                    <p className="text-[12px] font-medium text-destructive mt-0.5">
                                        {String(field.state.meta.errors[0])}
                                    </p>
                                )}
                            </div>
                        )}
                    </form.Field>

                    <div className="grid grid-cols-2 gap-4">
                        <form.Field
                            name="color"
                            validators={{
                                onChange: ({ value }) => {
                                    const res = createCategoryZodSchema.shape.color.safeParse(value)
                                    return res.success ? undefined : res.error.issues[0]?.message
                                }
                            }}
                        >
                            {(field) => (
                                <div className="space-y-2">
                                    <Label htmlFor="color">Theme Color</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="color"
                                            type="color"
                                            className="h-10 w-10 p-1 cursor-pointer"
                                            value={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                        />
                                        <Input
                                            type="text"
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            placeholder="#000000"
                                        />
                                    </div>
                                    {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                                        <p className="text-[12px] font-medium text-destructive mt-0.5">
                                            {String(field.state.meta.errors[0])}
                                        </p>
                                    )}
                                </div>
                            )}
                        </form.Field>

                        <form.Field name="icon">
                            {(field) => (
                                <div className="space-y-2">
                                    <Label>Category Icon</Label>
                                    <div className="flex items-center gap-3">
                                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md border bg-muted">
                                            {iconPreview ? (
                                                <Image
                                                    src={iconPreview}
                                                    alt="Preview"
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center">
                                                    <Upload className="h-4 w-4 text-muted-foreground" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="relative flex-1">
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                onChange={(e) => handleIconChange(e, field)}
                                            />
                                            <Button type="button" variant="outline" className="w-full text-xs">
                                                Upload Icon
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </form.Field>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-6 mt-4 border-t border-neutral-100">
                        <DialogClose asChild>
                            <Button type="button" variant="ghost" className="h-11 px-6 rounded-xl font-bold text-neutral-500 hover:text-neutral-900 transition-all font-sans" disabled={isPending}>
                                Cancel
                            </Button>
                        </DialogClose>
                        <AppSubmitButton isPending={isPending} className="w-auto h-11 px-8 rounded-xl font-black shadow-xl shadow-emerald-500/20 bg-emerald-600 hover:bg-emerald-700 font-sans">
                            Create Category
                        </AppSubmitButton>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default CreateCategoryFormModal
