"use client"

import { deleteIdeaAction } from "@/app/(dashboardLayout)/admin/dashboard/idea-management/_action"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { IIdea } from "@/types/idea.types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AlertCircle, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

interface DeleteIdeaConfirmationDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    idea: IIdea | null
}

const DeleteIdeaConfirmationDialog = ({
    open,
    onOpenChange,
    idea,
}: DeleteIdeaConfirmationDialogProps) => {
    const [permanent, setPermanent] = useState(false)
    const queryClient = useQueryClient()
    const router = useRouter()

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (id: string) => deleteIdeaAction(id, permanent),
    })

    const handleDelete = async () => {
        if (!idea) return

        const result = await mutateAsync(idea.id)

        if (!result.success) {
            toast.error(result.message || "Failed to delete idea")
            return
        }

        toast.success(result.message || "Idea deleted successfully")
        onOpenChange(false)
        void queryClient.invalidateQueries({ queryKey: ["ideas"] })
        router.refresh()
    }

    if (!idea) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader className="flex flex-col items-center gap-2 pt-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                        <AlertCircle className="h-6 w-6" />
                    </div>
                    <DialogTitle className="text-xl">Delete Idea</DialogTitle>
                    <DialogDescription className="text-center">
                        This will delete <span className="font-semibold text-foreground">"{idea.title}"</span>.
                        Are you sure?
                    </DialogDescription>
                </DialogHeader>

                <div className="flex items-center gap-2 rounded-lg border bg-muted/50 p-3 my-2">
                    <input
                        type="checkbox"
                        id="idea-permanent"
                        checked={permanent}
                        onChange={(e) => setPermanent(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-destructive focus:ring-destructive"
                    />
                    <label htmlFor="idea-permanent" className="text-sm font-medium leading-none cursor-pointer">
                        Permanent Delete (Admin only)
                    </label>
                </div>

                <DialogFooter className="gap-2 sm:gap-0 mt-4">
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDelete} disabled={isPending} className="gap-2">
                        {isPending ? "Deleting..." : "Delete Idea"}
                        {!isPending && <Trash2 className="h-4 w-4" />}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteIdeaConfirmationDialog