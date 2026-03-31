"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteUserAccount } from "@/services/admin.service"
import { toast } from "sonner"
import { Loader2, Trash2, AlertTriangle } from "lucide-react"

interface DeleteModeratorConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  moderator: any | null
}

const DeleteModeratorConfirmationDialog = ({
  open,
  onOpenChange,
  moderator,
}: DeleteModeratorConfirmationDialogProps) => {
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteUserAccount(moderator?.userId),
    onSuccess: () => {
      toast.success("Moderator account successfully deleted")
      queryClient.invalidateQueries({ queryKey: ["moderators"] })
      onOpenChange(false)
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete moderator account")
    },
  })

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-[2rem] border-neutral-100 shadow-2xl p-8 max-w-md">
        <AlertDialogHeader className="flex flex-col items-center text-center">
            <div className="h-16 w-16 rounded-full bg-rose-50 flex items-center justify-center mb-4">
                <AlertTriangle className="h-8 w-8 text-rose-500 animate-pulse" />
            </div>
          <AlertDialogTitle className="text-2xl font-black text-neutral-900 leading-tight">Delete Account?</AlertDialogTitle>
          <AlertDialogDescription className="text-neutral-500 font-medium px-4">
            You are about to delete <span className="font-bold text-rose-600">{moderator?.name}</span>'s account. This action will permanently remove their access and data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-8 flex flex-col sm:flex-row gap-3">
          <AlertDialogCancel className="h-12 rounded-xl flex-1 border-neutral-200 font-bold hover:bg-neutral-50 transition-all">
            Keep Account
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              mutate()
            }}
            disabled={isPending}
            className="h-12 rounded-xl flex-1 bg-rose-600 hover:bg-rose-700 text-white font-black shadow-lg shadow-rose-600/20 transition-all"
          >
            {isPending ? (
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
            ) : (
              <Trash2 className="h-5 w-5 mr-2" />
            )}
            Confirm Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteModeratorConfirmationDialog
