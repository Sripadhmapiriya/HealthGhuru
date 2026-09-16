"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, ExternalLink } from "lucide-react";

export function TopAdBar() {
  const [ad, setAd] = useState<{
    headline: string;
    description: string;
    cta_text: string;
    target_url: string;
    image_url: string;
    sponsor_name: string;
  }>({
    headline: "Apex Heart & Vascular Institute — Comprehensive 64-Slice Cardiac Screening",
    description: "Advanced early detection for coronary plaque, arterial calcium scoring, and cardiovascular risk assessment.",
    cta_text: "Book Cardiac Consultation",
    target_url: "/hospitals/apex-heart-vascular-institute",
    image_url: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80",
    sponsor_name: "Apex Heart & Vascular Institute",
  });

  useEffect(() => {
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
  }, []);

  return (
    <div className="w-full bg-[#0a1a0d] border-b border-[#2E7D32]/30 text-white pt-1.5 pb-2 px-4 sm:px-6">
      <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto">
        {/* Top Centered Label: ADVERTISEMENT / SPONSORED */}
        <div className="text-center mb-1">
          <span className="text-[9px] uppercase tracking-[0.2em] text-[#ffd6c1] font-mono font-semibold bg-white/10 px-2 py-0.5 rounded-full border border-white/10">
            ADVERTISEMENT • SPONSORED HEALTHCARE
          </span>
        </div>

        {/* Banner Card */}
        <a
          href={ad.target_url}
          className="group block bg-gradient-to-r from-[#143419] via-[#1B5E20] to-[#0f2e15] border border-emerald-500/30 hover:border-emerald-400/60 rounded-xl sm:rounded-2xl p-2 sm:p-3 transition-all duration-300 shadow-md hover:shadow-emerald-950/50"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Left: Thumbnail and Content */}
            <div className="flex items-center gap-3 w-full sm:w-auto min-w-0">
              {ad.image_url && (
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden shrink-0 border border-white/20 bg-black/40 shadow-sm">
                  <Image
                    src={ad.image_url}
                    alt={ad.sponsor_name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    unoptimized
                  />
                </div>
              )}

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-300 font-semibold bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/30">
                    HOSPITAL SPONSOR
                  </span>
                  <span className="text-[11px] text-gray-300 hidden md:inline truncate">
                    {ad.sponsor_name}
                  </span>
                </div>
                <h3 className="text-xs sm:text-sm md:text-base font-heading font-bold text-white group-hover:text-emerald-200 transition-colors line-clamp-1">
                  {ad.headline}
                </h3>
                <p className="text-[11px] text-gray-300 hidden lg:line-clamp-1 mt-0.5">
                  {ad.description}
                </p>
              </div>
            </div>

            {/* Right: Action CTA */}
            <div className="shrink-0 w-full sm:w-auto flex justify-end">
              <span className="inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-[#f06d2f] to-[#ff8a57] hover:brightness-110 text-white font-heading font-bold text-xs px-4 py-2 rounded-full shadow-sm group-hover:scale-105 active:scale-95 transition-all duration-200 w-full sm:w-auto text-center">
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
