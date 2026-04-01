import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
import { TooltipProvider } from "@/components/ui/tooltip";
import { mockCurrentUser } from "@/lib/mock-data";



export default function CommonLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <TooltipProvider>
      <div className="flex min-h-screen flex-col">
        <Header user={mockCurrentUser} />
        <main className="flex-1 pt-20">
          {children}
        </main>
        <Footer />
      </div>
    </TooltipProvider>
  );
}