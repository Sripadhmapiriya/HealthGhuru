import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SmoothScroll from "@/components/layout/SmoothScroll";
import ConditionalLayout from "@/components/layout/ConditionalLayout";
import CustomCursor from "@/components/ui/CustomCursor";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { DialogProvider } from "@/components/providers/DialogProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { AuthModalProvider } from "@/context/AuthModalContext";

// Professional Display Font for high-impact headlines and titles
const plusJakartaDisplay = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["600", "700", "800"],
  display: "swap",
});

// Professional Heading Font for clean section titles, cards, and UI
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

// Highly legible, modern Body Font for all reading text and forms
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

// High-precision Monospace Font for counters, metrics, and tickers
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "HealthGhuru — Live Better. Feel Stronger.",
  description: "Science-backed wellness platform covering Nutrition, Sleep, Fitness and Mental Health. 20,000+ expert-reviewed articles.",
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
      { url: "/favicon.png", type: "image/png" }
    ],
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${plusJakartaDisplay.variable} ${plusJakarta.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body suppressHydrationWarning className="antialiased min-h-screen flex flex-col font-body">
        <AuthProvider>
          <AuthModalProvider>
            <ToastProvider>
              <DialogProvider>
                <CustomCursor />
                <SmoothScroll>
                  <ConditionalLayout navbar={<Navbar />} footer={<Footer />}>
                    {children}
                  </ConditionalLayout>
                </SmoothScroll>
              </DialogProvider>
            </ToastProvider>
          </AuthModalProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
