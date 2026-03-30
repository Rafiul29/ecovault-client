
export default function ModeratorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  return (
    <div className="flex flex-col bg-neutral-50/50 min-h-screen font-sans antialiased text-neutral-900 overflow-hidden">
      {children}
    </div>
  );

}
