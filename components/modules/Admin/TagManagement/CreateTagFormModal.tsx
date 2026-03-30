"use client"

import { createTagAction } from "@/app/(dashboardLayout)/admin/dashboard/tag-management/_action"
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
import { createTagZodSchema } from "@/zod/tag.validation"
import { useForm } from "@tanstack/react-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

const CreateTagFormModal = () => {
    const [open, setOpen] = useState(false)
    const queryClient = useQueryClient()
    const router = useRouter()

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (payload: FormData | any) => createTagAction(payload),
    })

    const form = useForm({
        defaultValues: {
            name: "",
        },
        onSubmit: async ({ value }) => {
            const formData = new FormData()
            formData.append("data", JSON.stringify({ name: value.name }))

            const result = await mutateAsync(formData)

            if (!result.success) {
                toast.error(result.message || "Failed to create tag")
                return
            }

            toast.success(result.message || "Tag created successfully")
            setOpen(false)
            form.reset()

            void queryClient.invalidateQueries({ queryKey: ["tags"] })
            router.refresh()
        },
    })

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="h-11 px-6 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-500/10 gap-2">
                    <Plus className="h-4 w-4" />
                    Add Tag
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader className="pb-2">
                    <DialogTitle className="text-3xl font-black text-neutral-950 tracking-tight font-heading">Create Tag</DialogTitle>
                    <DialogDescription className="text-neutral-500 font-medium font-sans">
                        Create a new tag for detailed idea indexing.
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
                        validators={{ onChange: createTagZodSchema.shape.name }}
                    >
                        {(field) => (
                            <AppField
                                field={field}
                                label="Tag Name"
                                placeholder="e.g. Solar"
                            />
                        )}
                    </form.Field>

                    <div className="flex items-center justify-end gap-3 pt-6 mt-4 border-t border-neutral-100">
                        <DialogClose asChild>
                            <Button type="button" variant="ghost" className="h-11 px-6 rounded-xl font-bold text-neutral-500 hover:text-neutral-900 transition-all font-sans" disabled={isPending}>
                                Cancel
                            </Button>
                        </DialogClose>
                        <AppSubmitButton isPending={isPending} className="w-auto h-11 px-8 rounded-xl font-black shadow-xl shadow-emerald-500/20 bg-emerald-600 hover:bg-emerald-700 font-sans">
                            Create Tag
                        </AppSubmitButton>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default CreateTagFormModal
