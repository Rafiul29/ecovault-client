"use client"
import { forgotPasswordAction } from "@/app/(commonLayout)/(auth)/forgot-password/_action"
import AppField from "@/components/shared/form/AppField"
import AppSubmitButton from "@/components/shared/form/AppSubmitButton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { IForgotPasswordPayload, forgotPasswordZodSchema } from "@/zod/auth.validation"
import { useForm } from "@tanstack/react-form"
import { useMutation } from "@tanstack/react-query"
import { HelpCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

const ForgotPasswordForm = () => {
    const router = useRouter()
    const [serverError, setServerError] = useState<string | null>(null)
    const [serverSuccess, setServerSuccess] = useState<string | null>(null)

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (payload: IForgotPasswordPayload) => forgotPasswordAction(payload)
    })

    const form = useForm({
        defaultValues: {
            email: ""
        },
        onSubmit: async ({ value }) => {
            setServerError(null)
            setServerSuccess(null)
            try {
                const result = await mutateAsync(value)
                if (result.success) {
                    setServerSuccess(result.message || "OTP sent successfully! Please check your email.")
                    setTimeout(() => {
                        router.push(`/reset-password?email=${value.email}`)
                    }, 2000)
                } else {
                    setServerError(result.message || "Failed to send OTP")
                }
            } catch (error: any) {
                setServerError(error.message || "Something went wrong")
            }
        }
    })

    return (
        <div className="w-full max-w-md flex flex-col gap-8 animate-in fade-in duration-700">
            <div className="flex flex-col gap-3">
                <div className="w-12 h-12 bg-emerald-600/10 rounded-xl flex items-center justify-center mb-2">
                    <HelpCircle className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="space-y-1">
                    <h2 className="text-3xl font-extrabold tracking-tight text-foreground">Forgot Password?</h2>
                    <p className="text-sm text-muted-foreground font-medium">No worries, it happens. Enter your email to get a reset code.</p>
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

                    <form.Field name="email" validators={{ onChange: forgotPasswordZodSchema.shape.email }}>
                        {(field) => (
                            <AppField
                                field={field}
                                label="Email"
                                type="email"
                                placeholder="Enter your email"
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
                            <AppSubmitButton isPending={isSubmitting || isPending} pendingLabel="Sending Code...." disabled={!canSubmit || isSubmitting} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-10 transition-all duration-300 shadow-lg shadow-emerald-600/20">
                                Send Reset Code
                            </AppSubmitButton>
                        )}
                    </form.Subscribe>
                </form>
            </div>

            <p className="text-center text-sm text-muted-foreground font-medium">
                Wait, I remember it now!{" "}
                <Link href="/login" className="text-emerald-600 font-extrabold hover:underline underline-offset-4">Back to Login</Link>
            </p>
        </div>
    )
}

export default ForgotPasswordForm
