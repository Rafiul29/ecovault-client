import RegisterForm from "@/components/modules/Auth/RegisterForm"
import Image from "next/image"

const RegisterPage = () => {
  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row overflow-hidden">
      {/* Left Column: Image (Desktop only) */}
      <div className="hidden lg:block lg:w-1/2 relative bg-muted overflow-hidden">
        <Image
          src="/assets/auth/register-bg.png"
          alt="Sustainability and Community"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-12 text-white">
          <h1 className="text-4xl font-bold mb-4">Join our Green Community</h1>
          <p className="text-lg opacity-90 max-w-md">
            EcoVault is a portal for sharing and launching sustainable ideas. Create an account to start contributing to the environment today.
          </p>
        </div>
      </div>

      {/* Right Column: Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-background relative overflow-y-auto overflow-x-hidden lg:shadow-[-20px_0_50px_rgba(0,0,0,0.05)] z-10">
        {/* Subtle decorative background element */}
        <div className="absolute top-0 right-0 -z-10 h-[600px] w-[600px] translate-x-[20%] -translate-y-[20%] rounded-full bg-emerald-500/5 blur-[120px]" />
        <div className="absolute bottom-0 left-0 -z-10 h-[600px] w-[600px] -translate-x-[20%] translate-y-[20%] rounded-full bg-blue-500/5 blur-[120px]" />
        
        <RegisterForm />
      </div>
    </div>
  )
}

export default RegisterPage