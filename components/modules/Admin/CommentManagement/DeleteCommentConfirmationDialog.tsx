"use client"

import { deleteCommentAction } from "@/app/(dashboardLayout)/admin/dashboard/comment-management/_action"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { IComment } from "@/types/comment"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AlertTriangle, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface DeleteCommentConfirmationDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    comment: IComment | null
}

const DeleteCommentConfirmationDialog = ({
    open,
    onOpenChange,
    comment,
}: DeleteCommentConfirmationDialogProps) => {
    const queryClient = useQueryClient()
    const router = useRouter()

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (id: string) => deleteCommentAction(id),
    })

    const handleDelete = async () => {
        if (!comment) return

        const result = await mutateAsync(comment.id)

        if (!result.success) {
            toast.error(result.message || "Failed to delete comment")
            return
        }

        toast.success(result.message || "Comment deleted successfully")
        onOpenChange(false)
        void queryClient.invalidateQueries({ queryKey: ["comments"] })
        router.refresh()
    }

    if (!comment) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader className="flex flex-col items-center gap-2 pt-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                        <AlertTriangle className="h-6 w-6 text-destructive" />
                    </div>
                    <DialogTitle className="text-xl">Delete Comment</DialogTitle>
                    <DialogDescription className="text-center">
                        Are you sure you want to delete this comment by <span className="font-semibold text-foreground">"{comment.author.name}"</span>?
                        This action will mark the comment as deleted.
                    </DialogDescription>
                </DialogHeader>

                <div className="bg-muted p-4 rounded-md text-sm italic line-clamp-3 my-2 border-l-4 border-destructive/50">
                    "{comment.content}"
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDelete} disabled={isPending} className="gap-2">
                        {isPending ? "Deleting..." : "Delete Comment"}
                        {!isPending && <Trash2 className="h-4 w-4" />}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteCommentConfirmationDialog
