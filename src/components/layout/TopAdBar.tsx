"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, ExternalLink } from "lucide-react";
import { useSubscription } from "@/lib/hooks/useSubscription";
import { getSafeImageUrl } from "@/lib/utils";

export function TopAdBar() {
  const { isAdFree } = useSubscription();
  const [ad, setAd] = useState<{
    headline: string;
    description: string;
    cta_text: string;
    target_url: string;
    image_url: string;
    sponsor_name: string;
  } | null>({
    headline: "Apex Heart & Vascular Institute — Comprehensive 64-Slice Cardiac Screening",
    description: "Advanced early detection for coronary plaque, arterial calcium scoring, and cardiovascular risk assessment.",
    cta_text: "Book Cardiac Consultation",
    target_url: "/hospitals/apex-heart-vascular-institute",
    image_url: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80",
    sponsor_name: "Apex Heart & Vascular Institute",
  });

  useEffect(() => {
    if (isAdFree) return;

    // Attempt dynamic fetch from advertisements table
    fetch("/api/ads/active?placement=top_banner")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.ads && data.ads.length > 0) {
          const first = data.ads[0];
          setAd({
            headline: first.headline || first.title,
            description: first.description || "Accredited healthcare program and clinical evaluation.",
            cta_text: first.cta_text || "Learn More",
            target_url: first.target_url || "#",
            image_url: first.image_url || "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80",
            sponsor_name: "Apex Heart & Vascular Institute",
          });
        }
      })
      .catch(() => {});
  }, [isAdFree]);

  if (isAdFree || !ad) return null;

  return (
    <div className="w-full bg-emerald-50/50 border-b border-emerald-500/20 text-slate-800 pt-1 pb-2 px-4 sm:px-6 relative">
      {/* Top 2px Mint Green Line */}
      <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-[#CBF2DB]" />

      <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto mt-1">
        {/* Top Centered Label: ADVERTISEMENT / SPONSORED */}
        <div className="text-center mb-1">
          <span className="text-[9px] uppercase tracking-[0.2em] text-emerald-800 font-mono font-bold bg-emerald-100/90 px-2.5 py-0.5 rounded-full border border-emerald-200">
            ADVERTISEMENT • SPONSORED HEALTHCARE
          </span>
        </div>

        {/* Banner Card */}
        <a
          href={ad.target_url}
          className="group block bg-white hover:bg-emerald-50/30 border border-emerald-600/25 hover:border-emerald-600/50 rounded-xl sm:rounded-2xl p-2 sm:p-3 transition-all duration-300 shadow-xs hover:shadow-md"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Left: Thumbnail and Content */}
            <div className="flex items-center gap-3 w-full sm:w-auto min-w-0">
              {ad.image_url && (
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden shrink-0 border border-emerald-200 bg-gray-100 shadow-xs">
                  <Image
                    src={getSafeImageUrl(ad.image_url, 'hospital', 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=400&q=80')}
                    alt={ad.sponsor_name}
                    fill
                    sizes="56px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    unoptimized
                  />
                </div>
              )}

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-800 font-bold bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-200">
                    HOSPITAL SPONSOR
                  </span>
                  <span className="text-[11px] text-slate-500 hidden md:inline truncate font-medium">
                    {ad.sponsor_name}
                  </span>
                </div>
                <h3 className="text-xs sm:text-sm md:text-base font-heading font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                  {ad.headline}
                </h3>
                <p className="text-[11px] text-slate-600 hidden lg:line-clamp-1 mt-0.5">
                  {ad.description}
                </p>
              </div>
            </div>

            {/* Right: Action CTA */}
            <div className="shrink-0 w-full sm:w-auto flex justify-end">
              <span className="inline-flex items-center justify-center gap-1.5 bg-[#16A34A] hover:bg-[#15803D] text-white font-heading font-bold text-xs px-4 py-2 rounded-full shadow-xs group-hover:scale-105 active:scale-95 transition-all duration-200 w-full sm:w-auto text-center">
                <span>{ad.cta_text}</span>
                <ArrowRight size={13} className="shrink-0" />
              </span>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
}
