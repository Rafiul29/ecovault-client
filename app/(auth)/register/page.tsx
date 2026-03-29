import { Leaf, Mail, Lock, User, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
   return (
      <div className="flex min-h-screen bg-neutral-50/50">
         {/* Right side: Form (Swapped for variety) */}
         <div className="flex flex-1 flex-col justify-center px-8 py-12 sm:px-12 lg:flex-none lg:px-24">
            <div className="mx-auto w-full max-w-sm lg:w-96">
               <div className="mb-12">
                  <Link href="/" className="flex items-center gap-2 text-2xl font-black text-emerald-600">
                     <Leaf className="h-8 w-8" />
                     EcoVault
                  </Link>
                  <h2 className="mt-8 text-3xl font-black tracking-tight text-neutral-900 uppercase">Join the movement</h2>
                  <p className="mt-2 text-sm font-semibold text-neutral-500 uppercase tracking-widest">Create your innovation vault</p>
               </div>

               <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-neutral-500 ml-1">First Name</label>
                        <input
                           type="text"
                           placeholder="John"
                           className="w-full rounded-2xl border bg-white py-4 px-5 text-sm font-semibold outline-none transition-all focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-neutral-500 ml-1">Last Name</label>
                        <input
                           type="text"
                           placeholder="Doe"
                           className="w-full rounded-2xl border bg-white py-4 px-5 text-sm font-semibold outline-none transition-all focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500"
                        />
                     </div>
                  </div>

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
                     <label className="text-xs font-black uppercase tracking-widest text-neutral-500 ml-1">Password</label>
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

                  <div className="flex items-center gap-3 py-2">
                     <input type="checkbox" className="h-5 w-5 rounded-lg border-neutral-300 text-emerald-600 focus:ring-4 focus:ring-emerald-500/10" />
                     <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Accept <Link href="/terms" className="text-emerald-600 hover:underline">Vault Terms</Link></span>
                  </div>

                  <button className="flex w-full items-center justify-center gap-3 rounded-2xl bg-indigo-900 py-4 text-sm font-black text-white shadow-xl shadow-indigo-100 transition-all hover:bg-indigo-950 hover:scale-[1.02] active:scale-[0.98]">
                     Create My Vault
                     <ArrowRight className="h-5 w-5" />
                  </button>

                  <div className="relative my-8">
                     <div className="absolute inset-0 flex items-center"><span className="w-full border-t"></span></div>
                     <div className="relative flex justify-center text-xs uppercase"><span className="bg-neutral-50 px-3 font-black tracking-widest text-neutral-400">Or join with</span></div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <button className="flex items-center justify-center gap-2 rounded-2xl border bg-white py-3 text-sm font-black text-neutral-800 transition-all hover:bg-neutral-50">
                        {/* <Github className="h-5 w-5" /> */}
                        Github
                     </button>
                     <button className="flex items-center justify-center gap-2 rounded-2xl border bg-white py-3 text-sm font-black text-neutral-800 transition-all hover:bg-neutral-50">
                        <div className="h-5 w-5 rounded-full bg-rose-500" />
                        Google
                     </button>
                  </div>
               </div>

               <p className="mt-12 text-center text-sm font-bold text-neutral-500">
                  Already have a vault?{" "}
                  <Link href="/login" className="text-emerald-600 hover:underline">Login here</Link>
               </p>
            </div>
         </div>

         {/* Left side: Image/Info */}
         <div className="relative hidden w-0 flex-1 lg:block">
            <div className="absolute inset-0 h-full w-full bg-emerald-950 p-16 flex flex-col justify-between overflow-hidden">
               <div className="space-y-6">
                  <div className="h-16 w-16 rounded-3xl bg-emerald-500 shadow-2xl shadow-emerald-500/20 flex items-center justify-center">
                     <ShieldCheck className="h-8 w-8 text-emerald-950" />
                  </div>
                  <h1 className="text-5xl font-black text-white leading-tight uppercase tracking-tighter">
                     Securing Tomorrow's <br />
                     <span className="bg-gradient-to-r from-emerald-400 to-indigo-400 bg-clip-text text-transparent">Innovations</span> Today.
                  </h1>
               </div>

               <div className="grid grid-cols-2 gap-12 relative z-10">
                  <div className="space-y-2">
                     <h4 className="text-3xl font-black text-white">50k+</h4>
                     <p className="text-xs font-black text-emerald-500 uppercase tracking-[0.2em]">Active Innovators</p>
                  </div>
                  <div className="space-y-2">
                     <h4 className="text-3xl font-black text-white">120+</h4>
                     <p className="text-xs font-black text-emerald-500 uppercase tracking-[0.2em]">Countries Reached</p>
                  </div>
                  <div className="space-y-2 text-white/40 italic text-sm">
                     Trusted by top environmental research institutions worldwide.
                  </div>
               </div>

               {/* Large decorative element */}
               <div className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full border-[40px] border-emerald-500/5 rotate-45 pointer-events-none" />
               <div className="absolute top-1/2 right-0 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-emerald-400/5 blur-[140px] pointer-events-none" />
            </div>
         </div>
      </div>
   );
}
