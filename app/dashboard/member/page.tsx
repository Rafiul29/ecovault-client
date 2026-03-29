import { Activity, CreditCard, Heart, History, Star, TrendingUp } from "lucide-react";

export default function MemberDashboardPage() {
  const stats = [
    { label: "My Ideas", value: "12", icon: Activity, trend: "+2 this month", color: "text-emerald-500", bg: "bg-emerald-50" },
    { label: "Purchased", value: "48", icon: CreditCard, trend: "View all", color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Followers", value: "256", icon: Heart, trend: "+12.5%", color: "text-rose-500", bg: "bg-fuchsia-50" },
    { label: "Reviews", value: "89", icon: Star, trend: "4.8 avg rating", color: "text-amber-500", bg: "bg-amber-50" },
  ];

  return (
    <div className="space-y-12">
      <div className="flex flex-col justify-between gap-2 border-b pb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 animate-fade-in-up">Member Dashboard</h1>
        <p className="text-lg text-neutral-500 animate-fade-in-up delay-75">Welcome back to your EcoVault innovation center.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 animate-fade-in-up delay-150">
        {stats.map((stat, i) => (
          <div key={i} className="group overflow-hidden rounded-3xl border bg-white p-6 transition-all hover:border-emerald-200 hover:shadow-[0_20px_40px_rgba(0,0,0,0.02)]">
            <div className="mb-4 flex items-center justify-between">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} transition-colors group-hover:bg-emerald-600 group-hover:text-white`}>
                <stat.icon className="h-6 w-6" />
              </div>
               <TrendingUp className="h-4 w-4 text-emerald-500 opacity-60" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-wider text-neutral-400 uppercase">{stat.label}</span>
              <span className="text-3xl font-bold text-neutral-900 mt-2">{stat.value}</span>
              <span className="mt-2 text-xs font-semibold text-neutral-500">{stat.trend}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3 animate-fade-in-up delay-300">
        <div className="lg:col-span-2 rounded-3xl border bg-white p-8 shadow-sm transition-all hover:border-emerald-100">
          <div className="mb-8 flex items-center justify-between border-b pb-6">
            <h2 className="text-2xl font-bold flex items-center gap-3">
               <History className="h-6 w-6 text-emerald-600" />
               Recent Activities
            </h2>
            <button className="text-sm font-bold text-emerald-600 hover:underline">View All</button>
          </div>
          <div className="space-y-8">
             {[1, 2, 3].map((activity) => (
                <div key={activity} className="flex gap-4 border-l-2 border-dashed border-emerald-100 pl-6 relative">
                   <div className="absolute -left-2 top-0 h-4 w-4 rounded-full bg-emerald-500 ring-4 ring-white" />
                   <div className="flex flex-col gap-1">
                      <p className="text-sm font-bold text-neutral-800">Purchased "Smart Water Filter" Idea</p>
                      <span className="text-xs text-neutral-400 font-medium uppercase tracking-wider">Yesterday at 4:30 PM</span>
                   </div>
                </div>
             ))}
          </div>
        </div>

        <div className="rounded-3xl border bg-indigo-900 p-8 text-white shadow-xl shadow-indigo-100 hover:-translate-y-2 transition-transform duration-500 overflow-hidden relative group">
           {/* Decorative elements */}
           <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl" />
           <div className="absolute -top-10 -left-10 h-32 w-32 rounded-full bg-indigo-500/20 blur-2xl" />

           <div className="relative z-10 flex flex-col justify-between h-full">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/30 mb-6">
                   PREMIUM STATUS
                </div>
                <h2 className="text-2xl font-bold mb-4">Upgrade Your Subscription</h2>
                <p className="text-indigo-100 text-sm opacity-80 mb-10 leading-relaxed">Unlock advanced analytics, exclusive idea previews, and higher priority support.</p>
              </div>

              <div className="mt-auto">
                 <button className="w-full rounded-2xl bg-white py-4 text-sm font-bold text-indigo-900 transition-all hover:scale-[1.03] active:scale-[0.98]">
                    Explore Plans
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
