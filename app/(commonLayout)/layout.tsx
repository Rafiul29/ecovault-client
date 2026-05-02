import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { getUserInfo } from "@/services/auth.service";

export const dynamic = "force-dynamic";

export default async function CommonLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUserInfo();

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <TooltipProvider>
        <div className="flex min-h-screen flex-col">
          <Header user={user} />
          <main className="flex-1 pt-20">
            {children}
          </main>
          <Footer />
        </div>
      </TooltipProvider>

    </ThemeProvider>

  );
}