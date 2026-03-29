import ResetPasswordForm from "@/components/modules/Auth/ResetPasswordForm"
import Image from "next/image"

interface ResetPasswordParams {
    searchParams: Promise<{ email?: string }>
}

const ResetPasswordPage = async ({ searchParams }: ResetPasswordParams) => {
    const { email } = await searchParams || {};

    return (
        <div className="flex min-h-screen w-full flex-col lg:flex-row overflow-hidden">
            {/* Left Column: Image (Desktop only) */}
            <div className="hidden lg:block lg:w-1/2 relative bg-muted overflow-hidden">
                <Image
                    src="/assets/auth/register-bg.png"
                    alt="Reset Password"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-12 text-white">
                    <h1 className="text-4xl font-bold mb-4">Secure New Password</h1>
                    <p className="text-lg opacity-90 max-w-md">
                        Setting a strong password is the easiest way to keep your account safe and secure on our sustainable platform.
                    </p>
                </div>
            </div>

            {/* Right Column: Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-background relative overflow-y-auto overflow-x-hidden lg:shadow-[-20px_0_50px_rgba(0,0,0,0.05)] z-10">
                {/* Subtle decorative background element */}
                <div className="absolute top-0 right-0 -z-10 h-[600px] w-[600px] translate-x-[20%] -translate-y-[20%] rounded-full bg-emerald-500/5 blur-[120px]" />
                <div className="absolute bottom-0 left-0 -z-10 h-[600px] w-[600px] -translate-x-[202%] translate-y-[20%] rounded-full bg-blue-500/5 blur-[120px]" />

                <ResetPasswordForm email={email} />
            </div>
        </div>
    )
}

export default ResetPasswordPage