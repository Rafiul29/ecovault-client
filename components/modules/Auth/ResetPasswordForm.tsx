"use client"
import { resetPasswordAction } from "@/app/(commonLayout)/(auth)/reset-password/_action"
import AppField from "@/components/shared/form/AppField"
import AppSubmitButton from "@/components/shared/form/AppSubmitButton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { IResetPasswordPayload, resetPasswordZodSchema } from "@/zod/auth.validation"
import { useForm } from "@tanstack/react-form"
import { useMutation } from "@tanstack/react-query"
import { Eye, EyeOff, ShieldCheck } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface ResetPasswordFormProps {
    email?: string
}

const ResetPasswordForm = ({ email: initialEmail }: ResetPasswordFormProps) => {
    const router = useRouter()
    const [serverError, setServerError] = useState<string | null>(null)
    const [serverSuccess, setServerSuccess] = useState<string | null>(null)
    const [showPassword, setShowPassword] = useState<boolean>(false)

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (payload: IResetPasswordPayload) => resetPasswordAction(payload)
    })

    const form = useForm({
        defaultValues: {
            email: initialEmail || "",
            otp: "",
            newPassword: ""
        },
        onSubmit: async ({ value }) => {
            setServerError(null)
            setServerSuccess(null)
            try {
                const result = await mutateAsync(value)
                if (result.success) {
                    setServerSuccess(result.message || "Password reset successfully!")
                    setTimeout(() => router.push("/login"), 2000)
                } else {
                    setServerError(result.message || "Reset failed")
                }
            } catch (error: any) {
                setServerError(error.message || "Reset failed")
            }
        }
    })

    return (
        <div className="w-full max-w-md flex flex-col gap-8 animate-in fade-in duration-700">
            <div className="flex flex-col gap-3">
                <div className="w-12 h-12 bg-emerald-600/10 rounded-xl flex items-center justify-center mb-2">
                    <ShieldCheck className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="space-y-1">
                    <h2 className="text-3xl font-extrabold tracking-tight text-foreground">Set New Password</h2>
                    <p className="text-sm text-muted-foreground font-medium">Reset your password to keep your EcoVault account secure.</p>
                </div>
            </div>

            <div className="grid gap-6">
                <form method="POST" action="#"
                    noValidate
                    onSubmit={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        form.handleSubmit()
                    }} className="space-y-5">

                    <form.Field name="email" validators={{ onChange: resetPasswordZodSchema.shape.email }}>
                        {(field) => (
                            <AppField
                                field={field}
                                label="Email"
                                type="email"
                                placeholder="Enter your email"
                                disabled={!!initialEmail}
                            />
                        )}
                    </form.Field>

                    <form.Field name="otp" validators={{ onChange: resetPasswordZodSchema.shape.otp }}>
                        {(field) => (
                            <AppField
                                field={field}
                                label="OTP Code"
                                type="text"
                                placeholder="Enter 6-digit code"
                            />
                        )}
                    </form.Field>

                    <form.Field name="newPassword" validators={{ onChange: resetPasswordZodSchema.shape.newPassword }}>
                        {(field) => (
                            <AppField
                                field={field}
                                label="New Password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Min. 6 characters"
                                append={
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="h-full px-3 py-2 hover:bg-transparent text-muted-foreground hover:text-emerald-600"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                }
                            />
                        )}
                    </form.Field>

                    {serverError && (
                        <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive">
                            <AlertDescription>{serverError}</AlertDescription>
                        </Alert>
                    )}

                    {serverSuccess && (
                        <Alert className="bg-emerald-50 border-emerald-200 text-emerald-800">
                            <AlertDescription>{serverSuccess}</AlertDescription>
                        </Alert>
                    )}

                    <form.Subscribe
                        selector={(s) => [s.canSubmit, s.isSubmitting] as const}
                    >
                        {([canSubmit, isSubmitting]) => (
                            <AppSubmitButton isPending={isSubmitting || isPending} pendingLabel="Resetting Password...." disabled={!canSubmit || isSubmitting} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-10 transition-all duration-300 shadow-lg shadow-emerald-600/20">
                                Reset Password
                            </AppSubmitButton>
                        )}
                    </form.Subscribe>
                </form>
            </div>

            <p className="text-center text-md text-muted-foreground">
                <Link href="/login" className="hover:text-emerald-600 transition-colors">Return to login</Link>
            </p>
        </div>
    )
}

export default ResetPasswordForm
