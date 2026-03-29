import { Navbar } from "@/components/shared/navbar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <footer className="bg-primary/5 py-4 text-center text-sm text-neutral-500">
        &copy; {new Date().getFullYear()} EcoVault. All rights reserved.
      </footer>
    </div>
  );
}
