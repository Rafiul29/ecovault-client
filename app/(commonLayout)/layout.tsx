import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getUserInfo } from "@/services/auth.service";

export const dynamic = "force-dynamic";

export default async function CommonLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUserInfo();

  return (
    <TooltipProvider>
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <Header user={user} />
        <main className="flex-1 pt-20">
          {children}
        </main>
        <Footer />
      </div>
    </TooltipProvider>
  );
}