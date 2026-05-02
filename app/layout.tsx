import { Inter, Outfit, Space_Grotesk } from "next/font/google";
import "./globals.css";
import QueryProviders from "@/providers/QueryProvider";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Metadata } from "next";


const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});



export const metadata: Metadata = {
  title: {
    default: "EcoVault | Sustainable Ideas & Green Innovation",
    template: "%s | EcoVault",
  },
  description: "EcoVault is a leading platform for sharing and implementing sustainable ideas and green innovations to protect our planet.",
  keywords: ["Sustainability", "Eco-friendly", "Green Innovation", "EcoVault", "Sustainable Ideas", "Environmental Protection", "Renewable Energy"],
  authors: [{ name: "EcoVault Team", url: "https://ecovault.vercel.app" }],
  creator: "EcoVault",
  publisher: "EcoVault",
  metadataBase: new URL("https://ecovault.vercel.app"),

  alternates: {
    canonical: "/",
  },

  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2322c55e' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'><path d='M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z'/><path d='M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12'/></svg>",
  },

  openGraph: {
    title: "EcoVault | Sustainable Ideas & Green Innovation",
    description: "Discover and share sustainable ideas and green innovations to protect our planet with EcoVault.",
    url: "https://ecovault.vercel.app",
    siteName: "EcoVault",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 1200,
        alt: "EcoVault Social Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "EcoVault | Sustainable Ideas & Green Innovation",
    description: "Discover and share sustainable ideas and green innovations to protect our planet with EcoVault.",
    images: ["/images/og-image.png"],
    creator: "@ecovault",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  verification: {
    google: "google-site-verification-placeholder", // User should replace this with their actual code
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${outfit.variable} ${spaceGrotesk.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProviders>{children}</QueryProviders>
        </ThemeProvider>
        <Toaster richColors />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "EcoVault",
              url: "https://ecovault.vercel.app",
              logo: "https://ecovault.vercel.app/images/og-image.png",
              description: "EcoVault is a leading platform for sharing and implementing sustainable ideas and green innovations.",
              sameAs: [
                "https://twitter.com/ecovault",
                "https://facebook.com/ecovault",
                "https://linkedin.com/company/ecovault",
              ],
            }),
          }}
        />
      </body>
    </html>
  );
}
