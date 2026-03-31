import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import QueryProviders from "@/providers/QueryProvider";
import type { Metadata } from "next";
import { Toaster } from "sonner";


const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});



export const metadata: Metadata = {
  title: "EcoVault",
  description: "EcoVault",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${outfit.variable} antialiased`}
      >
        <QueryProviders>{children}</QueryProviders>
        <Toaster richColors />
      </body>
    </html>
  );
}
