"use client"

import { updateCommentAction } from "@/app/(dashboardLayout)/admin/dashboard/comment-management/_action"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { IComment } from "@/types/comment"
import { useForm } from "@tanstack/react-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { toast } from "sonner"

interface EditCommentFormModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    comment: IComment | null
}

const EditCommentFormModal = ({ open, onOpenChange, comment }: EditCommentFormModalProps) => {
    const queryClient = useQueryClient()
    const router = useRouter()

    useEffect(() => {
        if (comment) {
            form.reset({
                content: comment.content,
            })
        }
    }, [comment])

    const { mutateAsync, isPending } = useMutation({
        mutationFn: ({ id, content }: { id: string; content: string }) => updateCommentAction(id, content),
    })

    const form = useForm({
        defaultValues: {
            content: comment?.content || "",
        },
        onSubmit: async ({ value }) => {
            if (!comment) return

            const result = await mutateAsync({ id: comment.id, content: value.content })

            if (!result.success) {
                toast.error(result.message || "Failed to update comment")
                return
            }

            toast.success(result.message || "Comment updated successfully")
            onOpenChange(false)
            void queryClient.invalidateQueries({ queryKey: ["comments"] })
            router.refresh()
        },
    })

    if (!comment) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader className="pb-2">
                    <DialogTitle className="text-2xl font-bold">Edit Comment</DialogTitle>
                    <DialogDescription>
                        Update the content of the comment by <span className="font-semibold">{comment.author.name}</span>.
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
                        name="content"
                        validators={{
                            onChange: ({ value }) => {
                                if (value.length < 1) return "Content is required"
                                return undefined
                            }
                        }}
                    >
                        {(field) => (
                            <div className="space-y-2">
                                <Label htmlFor="edit-comment-content">Comment Content</Label>
                                <Textarea
                                    id="edit-comment-content"
                                    placeholder="Update comment content..."
                                    rows={5}
                                    className="resize-none"
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

                    <DialogFooter className="gap-2 sm:gap-0 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isPending || form.state.isSubmitting} className="min-w-[100px]">
                            {isPending ? "Saving..." : "Update Comment"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default EditCommentFormModal
