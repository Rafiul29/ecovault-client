"use client"
import { registerAction } from "@/app/(commonLayout)/(auth)/register/_action"
import AppField from "@/components/shared/form/AppField"
import AppSubmitButton from "@/components/shared/form/AppSubmitButton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { IRegisterPayload, registerZodSchema } from "@/zod/auth.validation"
import { useForm } from "@tanstack/react-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { API_BASE_URL } from "@/lib/env"

const RegisterForm = () => {
    const queryClient = useQueryClient()

    const [serverError, setServerError] = useState<string | null>(null)
    const [showPassword, setShowPassword] = useState<boolean>(false)

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (payload: IRegisterPayload) => registerAction(payload)
    })

    const form = useForm({
        defaultValues: {
            name: "",
            email: "",
            password: ""
        },
        onSubmit: async ({ value }) => {
            setServerError(null)
            try {
                const result = await mutateAsync(value) as any
                if (!result.success) {
                    setServerError(result.message || "Registration failed")
                }
            } catch (error: any) {
                console.log(error.message)
                setServerError(error.message || "Registration failed")
            }

        }
    })


    return (
        <div className="w-full max-w-md flex flex-col gap-8">
            <div className="flex flex-col gap-3">
                <div className="w-12 h-12 bg-emerald-600/10 rounded-xl flex items-center justify-center mb-2 animate-in fade-in zoom-in duration-500">
                    <div className="w-6 h-6 bg-emerald-600 rounded-lg" />
                </div>
                <div className="space-y-1">
                    <h2 className="text-3xl font-extrabold tracking-tight text-foreground">Create account</h2>
                    <p className="text-sm text-muted-foreground font-medium">Enter your details below to create your account and join EcoVault.</p>
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

                    <form.Field name='name' validators={{ onChange: registerZodSchema.shape.name }}>
                        {(field) => (
                            <AppField
                                field={field}
                                label="Name"
                                type="text"
                                placeholder="Enter your name"
                            />
                        )}
                    </form.Field>

                    <form.Field name="email" validators={{ onChange: registerZodSchema.shape.email }}>
                        {(field) => (
                            <AppField
                                field={field}
                                label="Email"
                                type="email"
                                placeholder="Enter your email"
                            />
                        )}
                    </form.Field>

                    <form.Field name="password" validators={{ onChange: registerZodSchema.shape.password }}>
                        {(field) => (
                            <AppField
                                field={field}
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                append={
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="h-full px-3 py-2 hover:bg-transparent text-muted-foreground hover:text-emerald-600 transition-colors"
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
                    <form.Subscribe
                        selector={(s) => [s.canSubmit, s.isSubmitting] as const}
                    >
                        {([canSubmit, isSubmitting]) => (
                            <AppSubmitButton isPending={isSubmitting || isPending} pendingLabel="Registering...." disabled={!canSubmit || isSubmitting} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-10 transition-all duration-300 shadow-lg shadow-emerald-600/20">
                                Register
                            </AppSubmitButton>
                        )}
                    </form.Subscribe>
                </form>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-muted-foreground/10"></span>
                    </div>
                    <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
                        <span className="bg-background px-3 text-muted-foreground/60">Or continue with</span>
                    </div>
                </div>

                <Button variant="outline" className="w-full h-11 font-semibold border-muted-foreground/20 hover:bg-emerald-50/50 hover:border-emerald-600/30 transition-all duration-200 flex items-center justify-center gap-3" onClick={() => {
                    //TODO redirect path after login in frontend
                    window.location.href = `${API_BASE_URL}/auth/login/google`;
                }}>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                            fill="currentColor"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                            fill="currentColor"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                            fill="currentColor"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                            fill="currentColor"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                    </svg>
                    Google Account
                </Button>
            </div>

            <p className="text-center text-sm text-muted-foreground font-medium">
                Already have an account?{" "}
                <Link
                    href="/login"
                    className="text-emerald-600 font-extrabold hover:underline underline-offset-4 transition-all"
                >
                    Login here
                </Link>
            </p>
        </div>
    )
}

export default RegisterForm