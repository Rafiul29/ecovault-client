"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changeUserRole } from "@/services/admin.service";
import { toast } from "sonner";
import { Loader2, UserCog, Shield, ShieldCheck, ShieldOff, Crown } from "lucide-react";
import { Role } from "@/types/enums";
import { useState, useEffect } from "react";

interface ChangeUserRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: any | null;
  /** Roles to show as options */
  allowedRoles: Role[];
  /** Which react-query key to invalidate on success */
  queryKey: string;
}

const ROLE_META: Record<Role, { label: string; icon: React.ElementType; color: string }> = {
  [Role.MEMBER]: {
    label: "Member",
    icon: ShieldOff,
    color: "text-amber-500",
  },
  [Role.MODERATOR]: {
    label: "Moderator",
    icon: ShieldCheck,
    color: "text-indigo-500",
  },
  [Role.ADMIN]: {
    label: "Admin",
    icon: Shield,
    color: "text-emerald-500",
  },
  [Role.SUPER_ADMIN]: {
    label: "Super Admin",
    icon: Crown,
    color: "text-rose-500",
  },
};

const ChangeUserRoleDialog = ({
  open,
  onOpenChange,
  user,
  allowedRoles,
  queryKey,
}: ChangeUserRoleDialogProps) => {
  const queryClient = useQueryClient();
  const currentRole: Role = user?.user?.role ?? user?.role ?? Role.MEMBER;
  const [selectedRole, setSelectedRole] = useState<Role>(currentRole);

  // Reset to current role whenever modal opens
  useEffect(() => {
    if (open) setSelectedRole(currentRole);
  }, [open, currentRole]);

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      changeUserRole({ userId: user?.userId ?? user?.id, role: selectedRole }),
    onSuccess: () => {
      toast.success(`Role changed to ${ROLE_META[selectedRole].label} successfully`);
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      onOpenChange(false);
    },
    onError: (error: any) => {
      console.log(error)
      const msg =
        error?.response?.data?.message || "Failed to change role. Check your permissions.";
      toast.error(msg);
    },
  });

  const userName = user?.name ?? user?.user?.name ?? "this user";
  const hasChanged = selectedRole !== currentRole;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-4xl border-neutral-100 shadow-2xl p-8 max-w-md sm:max-w-md gap-0">
        <DialogHeader className="flex flex-col items-center text-center mb-6">
          <div className="h-16 w-16 rounded-full bg-indigo-50 flex items-center justify-center mb-4">
            <UserCog className="h-8 w-8 text-indigo-500" />
          </div>
          <DialogTitle className="text-2xl font-black text-neutral-900 leading-tight">
            Change Role
          </DialogTitle>
          <DialogDescription className="text-neutral-500 font-medium px-2 mt-2">
            Assign a new system role for{" "}
            <span className="font-bold text-neutral-800">{userName}</span>.
          </DialogDescription>
        </DialogHeader>

        {/* Current Role */}
        <div className="mb-5 rounded-xl bg-neutral-50 border border-neutral-100 p-4 flex items-center gap-3">
          {(() => {
            const meta = ROLE_META[currentRole];
            const Icon = meta.icon;
            return (
              <>
                <div className="h-9 w-9 rounded-lg bg-white border border-neutral-100 flex items-center justify-center shadow-sm">
                  <Icon className={`h-4.5 w-4.5 ${meta.color}`} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-black text-neutral-400">
                    Current Role
                  </p>
                  <p className="text-sm font-bold text-neutral-800">{meta.label}</p>
                </div>
              </>
            );
          })()}
        </div>

        {/* New Role Selector */}
        <div className="space-y-2 mb-6">
          <Label className="text-xs font-black uppercase tracking-widest text-neutral-500">
            New Role
          </Label>
          <Select
            value={selectedRole}
            onValueChange={(v) => setSelectedRole(v as Role)}
          >
            <SelectTrigger className="h-12 rounded-xl border-neutral-200 font-semibold text-sm focus:ring-indigo-500">
              <SelectValue placeholder="Select a role..." />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-neutral-100 shadow-2xl p-1">
              {allowedRoles.map((role) => {
                const meta = ROLE_META[role];
                const Icon = meta.icon;
                return (
                  <SelectItem
                    key={role}
                    value={role}
                    className="rounded-xl focus:bg-indigo-50 focus:text-indigo-700 cursor-pointer p-3 font-semibold"
                  >
                    <div className="flex items-center gap-2">
                      <Icon className={`h-4 w-4 ${meta.color}`} />
                      {meta.label}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          {!hasChanged && (
            <p className="text-xs text-neutral-400 font-medium mt-1">
              Select a different role to apply changes.
            </p>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-12 rounded-xl flex-1 border-neutral-200 font-bold"
          >
            Cancel
          </Button>
          <Button
            onClick={() => mutate()}
            disabled={isPending || !hasChanged}
            className="h-12 rounded-xl flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-black shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50"
          >
            {isPending ? (
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
            ) : (
              <UserCog className="h-5 w-5 mr-2" />
            )}
            Apply Role
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeUserRoleDialog;
