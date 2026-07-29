import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import CartDrawer from "../components/CartDrawer";
import LeadCaptureModal from "../components/LeadCaptureModal";
import AddedToCartToast from "../components/AddedToCartToast";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://millennium-furniture.vercel.app"),
  title: {
    default: "Millennium Furniture | Solid Teak Modern Furniture Bhubaneswar",
    template: "%s | Millennium Furniture",
  },
  description:
    "Handcrafting heirloom mid-century modern solid teak wood furniture in Bhubaneswar, Odisha. Explore lounge chairs, executive office desks, dining tables & B2B wholesale supplies.",
  keywords: [
    "Furniture Bhubaneswar",
    "Solid Teak Wood Furniture Odisha",
    "Handcrafted Teak Furniture",
    "B2B Wholesale Furniture Supplier",
    "Mid-Century Modern Lounge Chairs",
    "Executive Office Desks",
  ],
  authors: [{ name: "Millennium Furniture Odisha" }],
  creator: "Millennium Furniture",
  publisher: "Millennium Furniture",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://millennium-furniture.vercel.app",
    title: "Millennium Furniture | Premium Handcrafted Solid Teak Wood Furniture",
    description:
      "Handcrafting heirloom solid teak wood furniture in Bhubaneswar, Odisha. Free insured delivery across Odisha.",
    siteName: "Millennium Furniture",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
        alt: "Millennium Furniture Odisha",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Millennium Furniture | Premium Handcrafted Teak",
    description: "Solid teak wood furniture in Bhubaneswar, Odisha. Free insured transport.",
    images: ["/logo.png"],
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

import FloatingContactWidget from "../components/FloatingContactWidget";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="antialiased bg-cream text-charcoal">
        {children}
        <CartDrawer />
        <AddedToCartToast />
        <LeadCaptureModal />
        <FloatingContactWidget />
      </body>
    </html>
  );
}
