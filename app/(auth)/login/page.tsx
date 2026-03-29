import { Leaf, Mail, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
   return (
      <div className="flex min-h-screen bg-neutral-50/50">
         {/* Left side: Form */}
         <div className="flex flex-1 flex-col justify-center px-8 py-12 sm:px-12 lg:flex-none lg:px-24">
            <div className="mx-auto w-full max-w-sm lg:w-96">
               <div className="mb-12">
                  <Link href="/" className="flex items-center gap-2 text-2xl font-black text-emerald-600">
                     <Leaf className="h-8 w-8" />
                     EcoVault
                  </Link>
                  <h2 className="mt-8 text-3xl font-black tracking-tight text-neutral-900 uppercase">Welcome back</h2>
                  <p className="mt-2 text-sm font-semibold text-neutral-500 uppercase tracking-widest">Login to access your vault</p>
               </div>

               <div className="space-y-6">
                  <div className="space-y-2">
                     <label className="text-xs font-black uppercase tracking-widest text-neutral-500 ml-1">Email Address</label>
                     <div className="relative group">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-neutral-400 group-focus-within:text-emerald-500 transition-colors">
                           <Mail className="h-5 w-5" />
                        </div>
                        <input
                           type="email"
                           placeholder="name@example.com"
                           className="w-full rounded-2xl border bg-white py-4 pl-12 pr-4 text-sm font-semibold outline-none transition-all focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500"
                        />
                     </div>
                  </div>

                  <div className="space-y-2">
                     <div className="flex items-center justify-between px-1">
                        <label className="text-xs font-black uppercase tracking-widest text-neutral-500">Password</label>
                        <Link href="/forgot-password" title="Forgot password?" className="text-xs font-black text-emerald-600 hover:underline">Reset?</Link>
                     </div>
                     <div className="relative group">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-neutral-400 group-focus-within:text-emerald-500 transition-colors">
                           <Lock className="h-5 w-5" />
                        </div>
                        <input
                           type="password"
                           placeholder="••••••••"
                           className="w-full rounded-2xl border bg-white py-4 pl-12 pr-4 text-sm font-semibold outline-none transition-all focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500"
                        />
                     </div>
                  </div>

                  <button className="flex w-full items-center justify-center gap-3 rounded-2xl bg-emerald-600 py-4 text-sm font-black text-white shadow-xl shadow-emerald-100 transition-all hover:bg-emerald-700 hover:scale-[1.02] active:scale-[0.98]">
                     Login to Vault
                     <ArrowRight className="h-5 w-5" />
                  </button>

                  <div className="relative my-8">
                     <div className="absolute inset-0 flex items-center"><span className="w-full border-t"></span></div>
                     <div className="relative flex justify-center text-xs uppercase"><span className="bg-neutral-50 px-3 font-black tracking-widest text-neutral-400">Or continue with</span></div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     {/* <button className="flex items-center justify-center gap-2 rounded-2xl border bg-white py-3 text-sm font-black text-neutral-800 transition-all hover:bg-neutral-50">
                   <Github className="h-5 w-5" />
                   Github
                </button> */}
                     <button className="flex items-center justify-center gap-2 rounded-2xl border bg-white py-3 text-sm font-black text-neutral-800 transition-all hover:bg-neutral-50">
                        <div className="h-5 w-5 rounded-full bg-rose-500" />
                        Google
                     </button>
                  </div>
               </div>

               <p className="mt-12 text-center text-sm font-bold text-neutral-500">
                  Don't have an account?{" "}
                  <Link href="/register" className="text-emerald-600 hover:underline">Create Vault</Link>
               </p>
            </div>
         </div>

         {/* Right side: Image/Quote */}
         <div className="relative hidden w-0 flex-1 lg:block">
            <div className="absolute inset-0 h-full w-full bg-neutral-950 p-16 flex flex-col justify-between">
               <div className="space-y-4">
                  <div className="h-16 w-16 rounded-3xl bg-emerald-600 shadow-2xl shadow-emerald-500/20" />
                  <h1 className="text-5xl font-black text-white leading-tight uppercase tracking-tighter">
                     Accelerating the <br />
                     <span className="text-emerald-500 underline underline-offset-8">Green</span> Revolution.
                  </h1>
               </div>

               <div className="max-w-md">
                  <p className="text-xl font-medium text-neutral-400 leading-relaxed italic">
                     "Innovation is the child of curiosity and the mother of sustainability. Join 50,000+ others today."
                  </p>
                  <div className="mt-8 flex items-center gap-4">
                     <div className="h-12 w-12 rounded-full bg-neutral-800 border boder-neutral-700" />
                     <div>
                        <h4 className="font-bold text-white">David Miller</h4>
                        <span className="text-xs font-black text-emerald-500 uppercase tracking-widest">Sustainability Lead</span>
                     </div>
                  </div>
               </div>

               {/* Animated blobs */}
               <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />
            </div>
         </div>
      </div>
   );
}
