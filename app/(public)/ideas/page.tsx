import { Filter, Search } from "lucide-react";

export default function IdeasPage() {
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <h1 className="text-4xl font-extrabold tracking-tight">Eco-Innovation Marketplace</h1>
          <div className="flex w-full max-w-sm items-center gap-2 rounded-full border bg-white px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-emerald-500">
            <Search className="h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search ideas..."
              className="w-full bg-transparent outline-none border-none"
            />
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          <aside className="w-full lg:w-64">
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2 text-lg font-bold">
                <Filter className="h-5 w-5" />
                Filters
              </div>
              <div className="space-y-4">
                {["Category", "Impact", "Status", "Pricing"].map((filter) => (
                  <div key={filter} className="border-t pt-4">
                    <h3 className="mb-2 text-sm font-semibold text-neutral-500 uppercase">{filter}</h3>
                    <div className="space-y-2">
                       {/* Placeholder checkboxes */}
                       <label className="flex items-center gap-2 text-sm">
                         <input type="checkbox" className="rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500" />
                         Renewable Energy
                       </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <div className="flex-1">
            <div className="grid gap-6 sm:grid-cols-2">
               {/* Placeholder idea cards */}
               {[1, 2, 3, 4].map((i) => (
                 <div key={i} className="group overflow-hidden rounded-2xl border bg-white transition-all hover:border-emerald-200 hover:shadow-xl">
                    <div className="h-48 bg-neutral-100 p-8 flex items-center justify-center">
                       <span className="text-neutral-400">Preview Image {i}</span>
                    </div>
                    <div className="p-6">
                      <div className="mb-2 flex items-center justify-between">
                         <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Solar</span>
                         <span className="font-bold text-emerald-600">$49.00</span>
                      </div>
                      <h3 className="mb-2 text-xl font-bold">Smart Solar Solution {i}</h3>
                      <p className="line-clamp-2 text-sm text-muted-foreground">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.</p>
                      <button className="mt-4 w-full rounded-xl bg-neutral-900 py-3 text-sm font-semibold text-white transition-all hover:bg-neutral-800">
                        View Details
                      </button>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
