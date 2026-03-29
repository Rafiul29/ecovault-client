import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Package, 
  AlertCircle, 
  ShoppingBag, 
  ArrowUpRight,
  MoreVertical,
  Download,
  Settings2
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

export default function AdminDashboardPage() {
  const adminStats = [
    { label: "Total Revenue", value: "$45,289", icon: DollarSign, change: "+12.5%", color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Active Users", value: "2,468", icon: Users, change: "+4.2%", color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Total Ideas", value: "856", icon: Package, change: "+1.8%", color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Pending Issues", value: "3", icon: AlertCircle, change: "-20%", color: "text-rose-600", bg: "bg-rose-50" },
  ];

  const recentTransactions = [
    { user: "Alice Green", email: "alice@example.com", type: "Subscription", amount: "$199.00", status: "Success", date: "2 mins ago" },
    { user: "Bob Smith", email: "bob@tech.io", type: "Idea Purchase", amount: "$49.00", status: "Pending", date: "15 mins ago" },
    { user: "EcoVentures", email: "contact@ecov.org", type: "Enterprise", amount: "$1,499.00", status: "Success", date: "1 hour ago" },
    { user: "Sarah Sun", email: "sarah@solar.com", type: "Subscription", amount: "$199.00", status: "Success", date: "3 hours ago" },
  ];

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col justify-between gap-6 border-b pb-8 md:flex-row md:items-center">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 font-sans">Platform Analytics</h1>
          <p className="mt-2 text-lg text-neutral-500 font-medium tracking-tight">System overview and performance metrics.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" className="rounded-2xl px-6 h-12 font-bold shadow-sm">
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>
          <Button className="rounded-2xl bg-emerald-600 px-6 h-12 font-bold text-white shadow-lg shadow-emerald-100/50 hover:bg-emerald-700 transition-all border-none">
            <Settings2 className="mr-2 h-4 w-4" />
            Manage System
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {adminStats.map((stat, i) => (
          <Card key={i} className="group overflow-hidden rounded-[2.5rem] border-none bg-white shadow-sm transition-all hover:shadow-2xl hover:shadow-emerald-500/10 relative">
            <CardContent className="p-8">
              <div className={`mb-6 inline-flex h-16 w-16 items-center justify-center rounded-3xl ${stat.bg} ${stat.color} transition-all group-hover:bg-emerald-600 group-hover:text-white`}>
                <stat.icon className="h-8 w-8 text-current" />
              </div>
              
              <div className="flex flex-col">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-neutral-400">{stat.label}</span>
                <div className="mt-3 flex items-baseline gap-3">
                  <span className="text-4xl font-black text-neutral-900">{stat.value}</span>
                  <Badge variant={stat.change.startsWith('+') ? "default" : "destructive"} className="px-2 py-0.5 font-black text-[10px] rounded-lg bg-opacity-20 border-none">
                    {stat.change}
                  </Badge>
                </div>
              </div>
              
              <div className="absolute top-8 right-8 text-neutral-200 group-hover:text-emerald-500 transition-colors">
                <TrendingUp className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-2 rounded-[2.5rem] border-none bg-white shadow-sm overflow-hidden relative group">
          <CardHeader className="p-10 pb-4 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-black text-neutral-950 flex items-center gap-3">
                <ShoppingBag className="h-7 w-7 text-emerald-600" />
                Recent Transactions
              </CardTitle>
              <CardDescription className="text-sm font-medium mt-1">Real-time revenue monitoring</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="h-3 w-3 rounded-full bg-emerald-500" />
              <div className="h-3 w-3 rounded-full bg-blue-500" />
              <div className="h-3 w-3 rounded-full bg-amber-500" />
            </div>
          </CardHeader>

          <CardContent className="p-10 pt-4">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-neutral-100">
                  <TableHead className="text-xs font-black uppercase tracking-widest text-neutral-400">User</TableHead>
                  <TableHead className="text-xs font-black uppercase tracking-widest text-neutral-400">Type</TableHead>
                  <TableHead className="text-xs font-black uppercase tracking-widest text-neutral-400">Amount</TableHead>
                  <TableHead className="text-xs font-black uppercase tracking-widest text-neutral-400">Status</TableHead>
                  <TableHead className="text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransactions.map((item, i) => (
                  <TableRow key={i} className="group/row hover:bg-neutral-50/50 border-neutral-50 transition-colors">
                    <TableCell className="py-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-neutral-800">{item.user}</span>
                        <span className="text-[10px] text-neutral-400 font-medium">{item.email}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-6 font-medium text-neutral-500">{item.type}</TableCell>
                    <TableCell className="py-6 font-black text-emerald-600">{item.amount}</TableCell>
                    <TableCell className="py-6">
                      <Badge className={`rounded-xl px-3 py-1 text-[10px] font-black uppercase tracking-tighter shadow-none ${item.status === 'Success' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'}`}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-6 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl hover:bg-white border hover:border-neutral-200">
                            <MoreVertical className="h-4 w-4 text-neutral-400" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-2xl p-2 min-w-[160px] shadow-xl border-neutral-100">
                          <DropdownMenuItem className="rounded-xl font-bold text-xs py-3 px-4 focus:bg-emerald-50 focus:text-emerald-700">
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="rounded-xl font-bold text-xs py-3 px-4 focus:bg-emerald-50 focus:text-emerald-700">
                            Download Invoice
                          </DropdownMenuItem>
                          <DropdownMenuItem className="rounded-xl font-bold text-xs py-3 px-4 text-rose-600 focus:bg-rose-50 focus:text-rose-700">
                            Flag Transaction
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Sidebar Cards */}
        <div className="flex flex-col gap-8">
          <Card className="rounded-[2.5rem] bg-neutral-950 p-10 text-white relative overflow-hidden group border-none shadow-xl">
            <div className="absolute bottom-0 right-0 p-6 opacity-20 transition-transform group-hover:scale-110 pointer-events-none">
              <BarChart3 className="h-32 w-32" />
            </div>
            <CardHeader className="p-0 mb-6">
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 font-black tracking-widest text-[10px] mb-4 w-fit px-3 py-1">
                MEMBERSHIP
              </Badge>
              <CardTitle className="text-2xl font-black">Member Growth</CardTitle>
              <CardDescription className="text-neutral-400 text-sm font-medium leading-relaxed">
                Your platform expanded by 450 new members this week.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 pt-4">
              <div className="flex items-center gap-6">
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4].map(u => (
                    <div key={u} className="h-12 w-12 rounded-full bg-neutral-800 border-[3px] border-neutral-950 shadow-2xl" />
                  ))}
                  <div className="h-12 w-12 rounded-full bg-emerald-600 border-[3px] border-neutral-950 flex items-center justify-center text-[10px] font-black">
                    +42
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-black text-emerald-400">+12%</span>
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Growth rate</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="flex-1 rounded-[2.5rem] border-2 border-dashed border-neutral-200 p-8 flex flex-col items-center justify-center text-center gap-4 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all group cursor-pointer bg-white">
            <div className="h-20 w-20 rounded-[2rem] bg-neutral-50 flex items-center justify-center text-neutral-400 transition-all group-hover:bg-emerald-600 group-hover:text-white group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-emerald-200">
              <AlertCircle className="h-8 w-8" />
            </div>
            <h4 className="font-black text-neutral-900 text-xl tracking-tight">System Logs</h4>
            <p className="text-xs font-medium text-neutral-500 max-w-[180px] leading-relaxed">
              Monitor server performance and platform error logs in real-time.
            </p>
            <Button variant="ghost" className="mt-4 font-black text-xs text-emerald-600 group-hover:translate-x-1 transition-transform">
               View Logs <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
