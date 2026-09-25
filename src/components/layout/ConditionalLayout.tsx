"use client";

import { usePathname } from "next/navigation";
import { FloatingFooterAd } from "@/components/ads/FloatingFooterAd";
import { PopupAdModal } from "@/components/ads/PopupAdModal";
import { AuthModal } from "@/components/auth/AuthModal";

export default function ConditionalLayout({
  children,
  navbar,
  footer,
}: {
  children: React.ReactNode;
  navbar: React.ReactNode;
  footer: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Hide site navbar/footer and ads within the Admin console or on print routes
  const isExcluded = pathname?.startsWith('/admin') || pathname?.includes('/print');

  return (
    <>
      {!isExcluded && navbar}
      <main className="flex-grow">
        {children}
      </main>
      {!isExcluded && <FloatingFooterAd />}
      {!isExcluded && <PopupAdModal />}
      <AuthModal />
      {!isExcluded && footer}
    </>
  );
}
