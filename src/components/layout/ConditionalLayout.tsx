"use client";

import { usePathname } from "next/navigation";
import { TopAdBar } from "@/components/layout/TopAdBar";
import { FloatingFooterAd } from "@/components/ads/FloatingFooterAd";
import { PopupAdModal } from "@/components/ads/PopupAdModal";

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
  
  // Hide site navbar/footer and ads within the Admin console
  const isAdmin = pathname?.startsWith('/admin');

  return (
    <>
      {!isAdmin && <TopAdBar />}
      {!isAdmin && navbar}
      <main className="flex-grow">
        {children}
      </main>
      {!isAdmin && <FloatingFooterAd />}
      {!isAdmin && <PopupAdModal />}
      {!isAdmin && footer}
    </>
  );
}
