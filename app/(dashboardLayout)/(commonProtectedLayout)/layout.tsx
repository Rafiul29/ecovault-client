import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";

export const dynamic = "force-dynamic";
export default function CommonDashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <TooltipProvider>
                {children}
            </TooltipProvider>
            <Toaster richColors />
        </>
    );
}