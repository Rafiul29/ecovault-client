export const dynamic = "force-dynamic";

export default function MemberDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  return (
    <div className="bg-background text-foreground min-h-full">
      {children}
    </div>
  );

}
