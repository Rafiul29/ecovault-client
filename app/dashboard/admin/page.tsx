import { BarChart3, TrendingUp, Users, DollarSign, Package, AlertCircle, ShoppingBag, ArrowUpRight } from "lucide-react";

export default function AdminDashboardPage() {
   const adminStats = [
      { label: "Total Revenue", value: "$45,289", icon: DollarSign, change: "+12.5%", color: "text-emerald-600", bg: "bg-emerald-50" },
      { label: "Active Users", value: "2,468", icon: Users, change: "+4.2%", color: "text-blue-600", bg: "bg-blue-50" },
      { label: "Total Ideas", value: "856", icon: Package, change: "+1.8%", color: "text-amber-600", bg: "bg-amber-50" },
      { label: "Pending Issues", value: "3", icon: AlertCircle, change: "-20%", color: "text-rose-600", bg: "bg-rose-50" },
   ];

   return (
      <div className="space-y-12">
         <div className="flex flex-col justify-between gap-4 border-b pb-8 md:flex-row md:items-end">
            <div>
               <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900">Platform Analytics</h1>
               <p className="mt-2 text-lg text-neutral-500 font-medium tracking-tight">System overview and performance metrics.</p>
            </div>
            <div className="flex items-center gap-4">
               <button className="rounded-2xl border bg-white px-6 py-3 text-sm font-bold shadow-sm transition-all hover:bg-neutral-50">Download Report</button>
               <button className="rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-100 transition-all hover:bg-emerald-700">Manage System</button>
            </div>
         </div>

         <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {adminStats.map((stat, i) => (
               <div key={i} className="group overflow-hidden rounded-[2.5rem] border bg-white p-8 transition-all hover:border-emerald-200 hover:shadow-2xl hover:shadow-emerald-50 relative">
                  <div className={`mb-6 inline-flex h-16 w-16 items-center justify-center rounded-3xl ${stat.bg} ${stat.color} transition-all group-hover:bg-emerald-600 group-hover:text-white`}>
                     <stat.icon className="h-8 w-8" />
                  </div>

                  <div className="flex flex-col">
                     <span className="text-sm font-bold uppercase tracking-[0.2em] text-neutral-400">{stat.label}</span>
                     <div className="mt-3 flex items-baseline gap-3">
                        <span className="text-4xl font-black text-neutral-900">{stat.value}</span>
                        <span className={`text-xs font-black px-2 py-1 rounded-lg ${stat.change.startsWith('+') ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                           {stat.change}
                        </span>
                     </div>
                  </div>

                  <div className="absolute top-8 right-8 text-neutral-200 group-hover:text-emerald-500 transition-colors">
                     <TrendingUp className="h-6 w-6" />
                  </div>
               </div>
            ))}
         </div>

         <div className="grid gap-10 lg:grid-cols-3">
            <div className="lg:col-span-2 rounded-[2.5rem] border bg-white p-10 overflow-hidden relative group">
               <div className="absolute top-0 right-0 p-8">
                  <BarChart3 className="h-32 w-32 text-emerald-50 opacity-[0.05] -rotate-12 transition-transform group-hover:scale-125" />
               </div>

               <div className="flex items-center justify-between mb-10">
                  <h2 className="text-2xl font-black text-neutral-950 flex items-center gap-3">
                     <ShoppingBag className="h-7 w-7 text-emerald-600" />
                     Recent Transactions
                  </h2>
                  <div className="flex gap-2">
                     <div className="h-3 w-3 rounded-full bg-emerald-500" />
                     <div className="h-3 w-3 rounded-full bg-blue-500" />
                     <div className="h-3 w-3 rounded-full bg-amber-500" />
                  </div>
               </div>

               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                     <thead>
                        <tr className="border-b text-xs font-black uppercase tracking-widest text-neutral-400">
                           <th className="pb-4 pt-4">User</th>
                           <th className="pb-4 pt-4">Type</th>
                           <th className="pb-4 pt-4">Amount</th>
                           <th className="pb-4 pt-4">Status</th>
                           <th className="pb-4 pt-4"></th>
                        </tr>
                     </thead>
                     <tbody className="divide-y text-sm">
                        {[
                           { user: "Alice Green", type: "Subscription", amount: "$199.00", status: "Success" },
                           { user: "Bob Smith", type: "Idea Purchase", amount: "$49.00", status: "Pending" },
                           { user: "EcoVentures", type: "Enterprise", amount: "$1,499.00", status: "Success" },
                        ].map((item, i) => (
                           <tr key={i} className="group/row hover:bg-neutral-50 transition-colors">
                              <td className="py-5 font-bold text-neutral-800">{item.user}</td>
                              <td className="py-5 font-medium text-neutral-500">{item.type}</td>
                              <td className="py-5 font-black text-emerald-600">{item.amount}</td>
                              <td className="py-5">
                                 <span className={`rounded-xl px-3 py-1.5 text-xs font-black uppercase tracking-tighter ${item.status === 'Success' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                    {item.status}
                                 </span>
                              </td>
                              <td className="py-5 text-right">
                                 <button className="p-2 rounded-xl hover:bg-white border border-transparent hover:border-neutral-200 transition-all">
                                    <ArrowUpRight className="h-5 w-5 text-neutral-400 group-hover/row:text-emerald-600" />
                                 </button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>

            <div className="flex flex-col gap-6">
               <div className="rounded-[2.5rem] bg-neutral-950 p-10 text-white relative overflow-hidden group">
                  <div className="absolute bottom-0 right-0 p-6 opacity-20 transition-transform group-hover:scale-110">
                     {/* <PieChart className="h-24 w-24" /> */}
                  </div>
                  <h3 className="text-xl font-black mb-2">Member Growth</h3>
                  <p className="text-neutral-400 text-sm font-medium mb-10 leading-relaxed">Your platform expanded by 450 new members this week.</p>
                  <div className="flex items-center gap-4">
                     <div className="flex -space-x-3">
                        {[1, 2, 3, 4].map(u => (
                           <div key={u} className="h-10 w-10 rounded-full bg-emerald-700 border-2 border-neutral-900 shadow-xl" />
                        ))}
                     </div>
                     <span className="text-xs font-black text-emerald-400">+12%</span>
                  </div>
               </div>

               <div className="flex-1 rounded-[2.5rem] border border-dashed border-neutral-300 p-8 flex flex-col items-center justify-center text-center gap-4 hover:border-emerald-300 hover:bg-emerald-50 transition-all group">
                  <div className="h-16 w-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 transition-all group-hover:bg-emerald-600 group-hover:text-white group-hover:scale-110">
                     <AlertCircle className="h-8 w-8" />
                  </div>
                  <h4 className="font-black text-neutral-900">System Logs</h4>
                  <p className="text-xs font-medium text-neutral-500 max-w-[140px]">Monitor server performance and error logs in real-time.</p>
               </div>
            </div>
         </div>
      </div>
   );
}
