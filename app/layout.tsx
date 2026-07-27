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
  title: "Millennium Furniture | Premium E-Commerce & Wholesale CRM",
  description:
    "Production-grade furniture e-commerce and wholesale CRM based in Bhubaneswar, Odisha, India. Discover custom-designed, premium crafted furniture.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

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
      </body>
    </html>
  );
}
