"use client";

import { createAdmin } from "@/services/admin.service";
import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { createAdminZodSchema } from "@/zod/admin.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserPlus, Upload, X, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import Image from "next/image";

const CreateAdminModal = () => {
    const [open, setOpen] = useState(false);
    const [profilePreview, setProfilePreview] = useState<string | null>(null);
    const queryClient = useQueryClient();
    const router = useRouter();

    const { mutateAsync, isPending } = useMutation({
        mutationFn: createAdmin,
    });

    const form = useForm({
        defaultValues: {
            name: "",
            email: "",
            password: "",
            contactNumber: "",
            profilePhoto: null as File | null,
        },
        onSubmit: async ({ value }) => {
            const formData = new FormData();

            // Append all textual fields
            formData.append("name", value.name);
            formData.append("email", value.email);
            formData.append("password", value.password);
            if (value.contactNumber) {
                formData.append("contactNumber", value.contactNumber);
            }

            // Append the profile photo file if present
            if (value.profilePhoto) {
                formData.append("file", value.profilePhoto);
            }

            const result = await mutateAsync(formData);

            if (!result || result.success === false) {
                toast.error(result?.message || "Failed to create administrator");
                return;
            }

            toast.success(result.message || "Administrator account created successfully");
            setOpen(false);
            form.reset();
            setProfilePreview(null);

            void queryClient.invalidateQueries({ queryKey: ["admins"] });
            router.refresh();
        },
    });

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
        const file = e.target.files?.[0];
        if (file) {
            field.handleChange(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="rounded-2xl bg-emerald-600 px-6 h-12 font-bold text-white shadow-lg shadow-emerald-100/50 hover:bg-emerald-700 transition-all border-none gap-2">
                    <UserPlus className="h-5 w-5" />
                    Add Admin
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px] rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden">
                <div className="bg-linear-to-br from-emerald-600 to-teal-700 p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                    <DialogHeader className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                                <ShieldCheck className="h-6 w-6" />
                            </div>
                            <DialogTitle className="text-3xl font-black tracking-tight font-heading">
                                Register Admin
                            </DialogTitle>
                        </div>
                        <DialogDescription className="text-emerald-50/80 font-medium">
                            Create a new system administrator with specific ecosystem privileges.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        form.handleSubmit();
                    }}
                    className="p-8 space-y-6 bg-white"
                >
                    <div className="flex flex-col items-center justify-center mb-4">
                        <form.Field name="profilePhoto">
                            {(field) => (
                                <div className="relative group">
                                    <div className="h-28 w-28 rounded-4xl border-4 border-emerald-50 bg-neutral-50 overflow-hidden shadow-inner flex items-center justify-center transition-all group-hover:border-emerald-100">
                                        {profilePreview ? (
                                            <Image
                                                src={profilePreview}
                                                alt="Profile Preview"
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <Upload className="h-8 w-8 text-neutral-300 group-hover:text-emerald-400 transition-colors" />
                                        )}
                                    </div>
                                    <Label className="absolute -bottom-2 -right-2 bg-white p-2 rounded-xl shadow-lg border border-neutral-100 cursor-pointer hover:bg-neutral-50 transition-colors">
                                        <Upload className="h-4 w-4 text-emerald-600" />
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => handlePhotoChange(e, field)}
                                        />
                                    </Label>
                                    {profilePreview && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setProfilePreview(null);
                                                field.handleChange(null);
                                            }}
                                            className="absolute -top-2 -right-2 bg-rose-500 text-white p-1 rounded-full shadow-lg hover:bg-rose-600 transition-colors"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    )}
                                </div>
                            )}
                        </form.Field>
                        <p className="mt-3 text-xs font-bold text-neutral-400 uppercase tracking-widest">
                            Admin Identity Image
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <form.Field
                            name="name"
                            validators={{
                                onChange: ({ value }) => {
                                    const res = createAdminZodSchema.shape.name.safeParse(value);
                                    return res.success ? undefined : res.error.issues[0]?.message;
                                },
                            }}
                        >
                            {(field) => <AppField field={field} label="Full Name" placeholder="e.g. John Doe" />}
                        </form.Field>

                        <form.Field
                            name="email"
                            validators={{
                                onChange: ({ value }) => {
                                    const res = createAdminZodSchema.shape.email.safeParse(value);
                                    return res.success ? undefined : res.error.issues[0]?.message;
                                },
                            }}
                        >
                            {(field) => (
                                <AppField
                                    field={field}
                                    label="Email Address"
                                    type="email"
                                    placeholder="john@example.com"
                                />
                            )}
                        </form.Field>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <form.Field
                            name="password"
                            validators={{
                                onChange: ({ value }) => {
                                    const res = createAdminZodSchema.shape.password.safeParse(value);
                                    return res.success ? undefined : res.error.issues[0]?.message;
                                },
                            }}
                        >
                            {(field) => (
                                <AppField
                                    field={field}
                                    label="Security Password"
                                    type="password"
                                    placeholder="••••••••"
                                />
                            )}
                        </form.Field>

                        <form.Field
                            name="contactNumber"
                            validators={{
                                onChange: ({ value }) => {
                                    const res = createAdminZodSchema.shape.contactNumber.safeParse(value);
                                    return res.success ? undefined : res.error.issues[0]?.message;
                                },
                            }}
                        >
                            {(field) => (
                                <AppField
                                    field={field}
                                    label="Contact Line"
                                    placeholder="+1 234 567 890"
                                />
                            )}
                        </form.Field>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-6 mt-4 border-t border-neutral-100">
                        <DialogClose asChild>
                            <Button
                                type="button"
                                variant="ghost"
                                className="h-12 px-6 rounded-2xl font-bold text-neutral-500 hover:text-neutral-900 transition-all font-sans"
                                disabled={isPending}
                            >
                                Cancel
                            </Button>
                        </DialogClose>
                        <AppSubmitButton
                            isPending={isPending}
                            className="w-auto h-12 px-10 rounded-2xl font-black shadow-xl shadow-emerald-500/20 bg-emerald-600 hover:bg-emerald-700 font-sans"
                        >
                            Confirm Registration
                        </AppSubmitButton>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateAdminModal;
