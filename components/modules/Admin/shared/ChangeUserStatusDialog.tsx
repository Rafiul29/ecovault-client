"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changeUserStatus } from "@/services/admin.service";
import { toast } from "sonner";
import { Loader2, ShieldCheck, ShieldOff, AlertTriangle } from "lucide-react";
import { UserStatus } from "@/types/enums";

interface ChangeUserStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: any | null;
  targetStatus: UserStatus.ACTIVE | UserStatus.BLOCKED;
  /** Which react-query key to invalidate on success */
  queryKey: string;
}

const STATUS_CONFIG = {
  [UserStatus.BLOCKED]: {
    icon: ShieldOff,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
    title: "Block Account?",
    description: (name: string) =>
      `You are about to block <strong>${name}</strong>'s account. They will immediately lose access to all platform features until unblocked.`,
    confirmLabel: "Block Account",
    confirmClass:
      "bg-amber-500 hover:bg-amber-600 text-white font-black shadow-lg shadow-amber-500/20",
  },
  [UserStatus.ACTIVE]: {
    icon: ShieldCheck,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-500",
    title: "Activate Account?",
    description: (name: string) =>
      `You are about to restore <strong>${name}</strong>'s account access. They will be able to use the platform normally again.`,
    confirmLabel: "Activate Account",
    confirmClass:
      "bg-emerald-600 hover:bg-emerald-700 text-white font-black shadow-lg shadow-emerald-600/20",
  },
};

const ChangeUserStatusDialog = ({
  open,
  onOpenChange,
  user,
  targetStatus,
  queryKey,
}: ChangeUserStatusDialogProps) => {
  const queryClient = useQueryClient();
  const config = STATUS_CONFIG[targetStatus];
  const Icon = config.icon;

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      changeUserStatus({ userId: user?.userId ?? user?.id, userStatus: targetStatus }),
    onSuccess: () => {
      toast.success(`Account status changed to ${targetStatus.toLowerCase()} successfully`);
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      onOpenChange(false);
    },
    onError: (error: any) => {
      const msg =
        error?.response?.data?.message ||
        `Failed to ${targetStatus === UserStatus.BLOCKED ? "block" : "activate"} account`;
      toast.error(msg);
    },
  });

  const userName = user?.name ?? user?.user?.name ?? "this user";

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-4xl border-neutral-100 shadow-2xl p-8 max-w-md">
        <AlertDialogHeader className="flex flex-col items-center text-center">
          <div
            className={`h-16 w-16 rounded-full ${config.iconBg} flex items-center justify-center mb-4`}
          >
            <Icon className={`h-8 w-8 ${config.iconColor} animate-pulse`} />
          </div>
          <AlertDialogTitle className="text-2xl font-black text-neutral-900 leading-tight">
            {config.title}
          </AlertDialogTitle>
          <AlertDialogDescription
            className="text-neutral-500 font-medium px-4"
            dangerouslySetInnerHTML={{ __html: config.description(userName) }}
          />
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-8 flex flex-col sm:flex-row gap-3">
          <AlertDialogCancel className="h-12 rounded-xl flex-1 border-neutral-200 font-bold hover:bg-neutral-50 transition-all">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              mutate();
            }}
            disabled={isPending}
            className={`h-12 rounded-xl flex-1 transition-all ${config.confirmClass}`}
          >
            {isPending ? (
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
            ) : (
              <Icon className="h-5 w-5 mr-2" />
            )}
            {config.confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ChangeUserStatusDialog;
