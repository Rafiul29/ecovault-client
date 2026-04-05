"use client"
import { verifyEmailAction } from "@/app/(commonLayout)/(auth)/verify-email/_action"
import AppField from "@/components/shared/form/AppField"
import AppSubmitButton from "@/components/shared/form/AppSubmitButton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { IVerifyEmailPayload, verifyEmailZodSchema } from "@/zod/auth.validation"
import { useForm } from "@tanstack/react-form"
import { useMutation } from "@tanstack/react-query"
import { MailCheck, RefreshCcw } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useRef, useState } from "react"

interface VerifyEmailFormProps {
    email?: string
}

const VerifyEmailForm = ({ email: initialEmail }: VerifyEmailFormProps) => {
    const router = useRouter()
    const [serverError, setServerError] = useState<string | null>(null)
    const [serverSuccess, setServerSuccess] = useState<string | null>(null)
    const inputsRef = useRef<(HTMLInputElement | null)[]>([])

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (payload: IVerifyEmailPayload) => verifyEmailAction(payload)
    })

    const form = useForm({
        defaultValues: {
            email: initialEmail || "",
            otp: ""
        },
        onSubmit: async ({ value }) => {
            setServerError(null)
            setServerSuccess(null)
            try {
                const result = await mutateAsync(value)
                if (result.success) {
                    setServerSuccess(result.message || "Email verified successfully!")
                    setTimeout(() => {
                        router.push("/dashboard")
                        router.refresh()
                    }, 1500)
                } else {
                    setServerError(result.message || "Verification failed")
                }
            } catch (error: any) {
                setServerError(error.message || "Verification failed")
            }
        }
    })

    const handleOtpChange = (index: number, value: string, field: any) => {
        // Only allow numbers
        if (value && !/^\d+$/.test(value)) return

        const currentOtp = field.state.value.split("")
        // If pasting more than one character
        if (value.length > 1) {
            const pastedData = value.slice(0, 6).split("")
            field.handleChange(pastedData.join(""))
            // Focus the last input or the next available one
            const nextIndex = Math.min(pastedData.length, 5)
            inputsRef.current[nextIndex]?.focus()
            return
        }

        currentOtp[index] = value
        const newOtp = currentOtp.join("").slice(0, 6)
        field.handleChange(newOtp)

        // Move to next input if value is entered
        if (value && index < 5) {
            inputsRef.current[index + 1]?.focus()
        }
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>, field: any) => {
        if (e.key === "Backspace") {
            if (!field.state.value[index] && index > 0) {
                inputsRef.current[index - 1]?.focus()
            }
        }
    }

    return (
        <div className="w-full max-w-md flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out">
            <div className="flex flex-col gap-3">
                <div className="w-14 h-14 bg-emerald-600/10 rounded-2xl flex items-center justify-center mb-2 shadow-inner">
                    <MailCheck className="w-7 h-7 text-emerald-600" />
                </div>
                <div className="space-y-1.5">
                    <h2 className="text-3xl font-extrabold tracking-tight text-foreground">Verify your email</h2>
                    <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                        We've sent a 6-digit verification code to
                        <span className="text-foreground font-bold ml-1">{initialEmail || "your email"}</span>.
                    </p>
                </div>
            </div>

            <div className="grid gap-8">
                <form method="POST" action="#"
                    noValidate
                    onSubmit={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        form.handleSubmit()
                    }} className="space-y-6">

                    <div className="space-y-3">
                        <Label className="text-sm font-semibold text-foreground/80 ml-0.5">Verification Code</Label>
                        <form.Field name="otp" validators={{ onChange: verifyEmailZodSchema.shape.otp }}>
                            {(field) => (
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center gap-2 sm:gap-3">
                                        {[0, 1, 2, 3, 4, 5].map((index) => (
                                            <input
                                                key={index}
                                                ref={(el) => {
                                                    inputsRef.current[index] = el
                                                }}
                                                type="text"
                                                inputMode="numeric"
                                                autoComplete="one-time-code"
                                                maxLength={1}
                                                value={field.state.value[index] || ""}
                                                onChange={(e) => handleOtpChange(index, e.target.value, field)}
                                                onKeyDown={(e) => handleKeyDown(index, e, field)}
                                                className={cn(
                                                    "w-full aspect-square sm:w-12 sm:h-14 text-center text-2xl font-bold rounded-xl border-2 bg-background/50 backdrop-blur-sm transition-all duration-300 outline-none focus:ring-4 placeholder:text-muted-foreground/30",
                                                    field.state.meta.errors.length > 0 && field.state.meta.isTouched
                                                        ? "border-destructive/50 focus:border-destructive focus:ring-destructive/10"
                                                        : "border-muted-foreground/20 focus:border-emerald-500 focus:ring-emerald-500/10 shadow-sm"
                                                )}
                                            />
                                        ))}
                                    </div>
                                    {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                                        <p className="text-[12px] font-medium text-destructive mt-1.5 animate-in fade-in slide-in-from-top-1">
                                            Code required
                                        </p>
                                    )}
                                </div>
                            )}
                        </form.Field>
                    </div>

                    {serverError && (
                        <Alert variant="destructive" className="bg-destructive/5 border-destructive/20 text-destructive animate-in zoom-in-95">
                            <AlertDescription className="font-medium">{serverError}</AlertDescription>
                        </Alert>
                    )}

                    {serverSuccess && (
                        <Alert className="bg-emerald-50/50 border-emerald-200 text-emerald-800 animate-in zoom-in-95 backdrop-blur-sm">
                            <AlertDescription className="font-semibold flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                {serverSuccess}
                            </AlertDescription>
                        </Alert>
                    )}

                    <form.Subscribe
                        selector={(s) => [s.canSubmit, s.isSubmitting] as const}
                    >
                        {([canSubmit, isSubmitting]) => (
                            <AppSubmitButton
                                isPending={isSubmitting || isPending}
                                pendingLabel="Verifying..."
                                disabled={!canSubmit || isSubmitting}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12 text-base transition-all duration-500 shadow-[0_8px_30px_rgb(16,185,129,0.3)] hover:shadow-[0_8px_40px_rgb(16,185,129,0.4)] hover:-translate-y-0.5"
                            >
                                Verify Email
                            </AppSubmitButton>
                        )}
                    </form.Subscribe>
                </form>
            </div>

            <div className="flex flex-col gap-6 items-center">
                <p className="text-center text-sm text-muted-foreground font-medium">
                    Didn't receive the code?{" "}
                    <Button
                        variant="link"
                        className="text-emerald-600 p-0 h-auto font-extrabold hover:text-emerald-700 transition-colors inline-flex items-center gap-1 group"
                        onClick={() => {/* TODO: resend logic */ }}
                    >
                        Resend Code
                        <RefreshCcw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
                    </Button>
                </p>

                <Link
                    href="/login"
                    className="text-xs font-semibold text-muted-foreground hover:text-emerald-600 transition-all duration-300 py-2 px-4 rounded-full hover:bg-emerald-50"
                >
                    Return to login
                </Link>
            </div>
        </div>
    )
}

export default VerifyEmailForm

