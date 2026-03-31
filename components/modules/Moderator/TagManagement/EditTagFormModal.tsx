"use client"

import { updateTagAction } from "@/app/(dashboardLayout)/admin/dashboard/tag-management/_action"
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
} from "@/components/ui/dialog"
import { updateTagZodSchema } from "@/zod/tag.validation"
import { ITag } from "@/types/tag.types"
import { useForm } from "@tanstack/react-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface EditTagFormModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    tag: ITag | null
}

const EditTagFormModal = ({ open, onOpenChange, tag }: EditTagFormModalProps) => {
    const queryClient = useQueryClient()
    const router = useRouter()

    const { mutateAsync, isPending } = useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: any }) => updateTagAction(id, payload),
    })

    const form = useForm({
        defaultValues: {
            name: tag?.name || "",
        },
        onSubmit: async ({ value }) => {
            if (!tag) return

            const formData = new FormData()
            formData.append("data", JSON.stringify({ name: value.name }))

            const result = await mutateAsync({ id: tag.id, payload: formData })

            if (!result.success) {
                toast.error(result.message || "Failed to update tag")
                return
            }

            toast.success(result.message || "Tag updated successfully")
            onOpenChange(false)
            void queryClient.invalidateQueries({ queryKey: ["tags"] })
            router.refresh()
        },
    })

    if (!tag) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader className="pb-2">
                    <DialogTitle className="text-3xl font-black text-neutral-950 tracking-tight font-heading">Edit Tag</DialogTitle>
                    <DialogDescription className="text-neutral-500 font-medium font-sans">
                        Update the tag identification.
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
                                const res = updateTagZodSchema.shape.name.safeParse(value)
                                return res.success ? undefined : res.error.issues[0]?.message
                            }
                        }}
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
                        <Button type="button" variant="ghost" className="h-11 px-6 rounded-xl font-bold text-neutral-500 hover:text-neutral-900 transition-all font-sans" onClick={() => onOpenChange(false)} disabled={isPending}>
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

export default EditTagFormModal
