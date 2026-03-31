"use client"

import { deleteCategoryAction } from "@/app/(dashboardLayout)/admin/dashboard/category-management/_action"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { ICategory } from "@/types/category"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AlertTriangle, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

interface DeleteCategoryConfirmationDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    category: ICategory | null
}

const DeleteCategoryConfirmationDialog = ({
    open,
    onOpenChange,
    category,
}: DeleteCategoryConfirmationDialogProps) => {
    const [permanent, setPermanent] = useState(false)
    const queryClient = useQueryClient()
    const router = useRouter()

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (id: string) => deleteCategoryAction(id, permanent),
    })

    const handleDelete = async () => {
        if (!category) return

        const result = await mutateAsync(category.id)

        if (!result.success) {
            toast.error(result.message || "Failed to delete category")
            return
        }

        toast.success(result.message || "Category deleted successfully")
        onOpenChange(false)
        void queryClient.invalidateQueries({ queryKey: ["categories"] })
        router.refresh()
    }

    if (!category) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader className="flex flex-col items-center gap-2 pt-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                        <AlertTriangle className="h-6 w-6 text-destructive" />
                    </div>
                    <DialogTitle className="text-xl">Delete Category</DialogTitle>
                    <DialogDescription className="text-center">
                        Are you sure you want to delete <span className="font-semibold text-foreground">"{category.name}"</span>?
                        This action will hide the category from the marketplace.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex items-center gap-2 rounded-lg border bg-muted/50 p-3 my-2">
                    <input
                        type="checkbox"
                        id="permanent"
                        checked={permanent}
                        onChange={(e) => setPermanent(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-destructive focus:ring-destructive"
                    />
                    <label htmlFor="permanent" className="text-sm font-medium leading-none cursor-pointer">
                        Permanent Delete (Admin only)
                    </label>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDelete} disabled={isPending} className="gap-2">
                        {isPending ? "Deleting..." : "Delete Category"}
                        {!isPending && <Trash2 className="h-4 w-4" />}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteCategoryConfirmationDialog
