'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Advertisement } from '@/lib/types/advertisement';
import { trackAdEvent } from './adTracking';
import Image from 'next/image';
import { useSubscription } from '@/lib/hooks/useSubscription';
import { getSafeImageUrl } from '@/lib/utils';

interface TopBannerAdProps {
  initialAd?: Advertisement | null;
  category?: string;
}

export function TopBannerAd({ initialAd, category }: TopBannerAdProps) {
  const { isAdFree } = useSubscription();
  const [ads, setAds] = useState<Advertisement[]>(initialAd ? [initialAd] : []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [rotationSeconds, setRotationSeconds] = useState(8);
  const [isPaused, setIsPaused] = useState(false);
  const trackedMap = useRef<Record<string, boolean>>({});

  useEffect(() => {
    if (isAdFree) return;

    const fetchAds = async () => {
      try {
        const url = category
          ? `/api/ads/active?placement=top_banner&category=${category}&t=${Date.now()}`
          : `/api/ads/active?placement=top_banner&t=${Date.now()}`;
        const res = await fetch(url, {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' },
        });
        const json = await res.json();
        if (json.success && Array.isArray(json.ads) && json.ads.length > 0) {
          setAds(json.ads);
          if (json.rotation_interval && typeof json.rotation_interval === 'number') {
            setRotationSeconds(json.rotation_interval);
          }
        } else {
          setAds([]);
        }
      } catch {
        setAds([]);
      }
    };

    fetchAds();
  }, [category, isAdFree]);

  // Auto-rotation timer
  useEffect(() => {
    if (ads.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % ads.length);
        setFade(true);
      }, 250);
    }, Math.max(3000, rotationSeconds * 1000));

    return () => clearInterval(interval);
  }, [ads.length, rotationSeconds, isPaused]);

  const ad = ads[currentIndex] || null;

  useEffect(() => {
    if (ad && !trackedMap.current[ad.id]) {
      trackedMap.current[ad.id] = true;
      trackAdEvent(ad.id, 'impression');
    }
  }, [ad]);

  if (isAdFree || !ad) return null;

  const handleClick = () => {
    if (ad) {
      trackAdEvent(ad.id, 'click');
    }
  };

  // If custom HTML embed code is provided
  if (ad.html_code) {
    return (
      <div className="w-full py-3 px-4 flex items-center justify-center bg-transparent z-40">
        <div className="max-w-5xl lg:max-w-6xl xl:max-w-7xl 2xl:max-w-[1600px] w-full bg-white rounded-2xl border border-border p-4 text-center shadow-md">
          <div dangerouslySetInnerHTML={{ __html: ad.html_code }} />
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full py-1 sm:py-2 px-2 sm:px-6 flex items-center justify-center bg-transparent z-40"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Contained Centered Sleek Pill Banner */}
      <div
        className={`max-w-5xl lg:max-w-6xl xl:max-w-7xl 2xl:max-w-[1600px] w-full mx-auto bg-gradient-to-r from-[#0a1b0e] via-[#143419] to-[#0a1b0e] text-white border border-primary/40 rounded-full shadow-md px-2.5 sm:px-6 py-1 sm:py-2 transition-all duration-300 hover:border-primary/60 hover:shadow-lg ${
          fade ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.99]'
        }`}
      >
        <a
          href={ad.target_url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          className="w-full flex flex-row items-center justify-between gap-2 sm:gap-4 text-left group cursor-pointer"
        >
          {/* Left: Sponsored Badge & Image Thumbnail */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <span className="text-[9px] sm:text-[11px] font-mono font-bold uppercase tracking-wider bg-white/10 text-emerald-300 px-1.5 sm:px-2 py-0.5 rounded-full border border-white/15 flex items-center gap-1 shadow-xs">
              <Sparkles size={9} className="text-emerald-400" />
              <span className="hidden xs:inline">SPONSORED</span>
              <span className="xs:hidden">AD</span>
            </span>

            {ad.image_url && (
              <div className="relative w-6 h-6 sm:w-9 sm:h-9 rounded-full overflow-hidden border border-white/25 shrink-0 shadow bg-white/5">
                <Image
                  src={getSafeImageUrl(ad.image_url, 'advertisement')}
                  alt={ad.title}
                  fill
                  sizes="36px"
                  className="object-cover"
                  unoptimized
                />
              </div>
            )}
          </div>

          {/* Middle: Prominent Bold Headline */}
          <div className="flex-1 min-w-0 text-left">
            <p className="text-[11px] sm:text-sm md:text-base font-heading font-semibold sm:font-bold text-white leading-tight group-hover:text-emerald-300 transition-colors truncate">
              {ad.headline || ad.title}
            </p>
          </div>

          {/* Right: Sleek Gradient CTA Button & Indicators */}
          <div className="flex items-center gap-2 shrink-0">
            {ads.length > 1 && (
              <div className="hidden sm:flex items-center gap-1 bg-white/10 px-2 py-1 rounded-full">
                {ads.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setCurrentIndex(idx);
                    }}
                    className={`h-1 rounded-full transition-all ${
                      currentIndex === idx ? 'w-3 bg-emerald-400' : 'w-1 bg-white/40'
                    }`}
                  />
                ))}
              </div>
            )}

            <span className="inline-flex items-center justify-center gap-1 text-[10px] sm:text-xs font-heading font-bold text-white bg-gradient-to-r from-accent via-[#ff6f3c] to-[#ff8a57] hover:brightness-110 px-2.5 sm:px-5 py-1 sm:py-2 rounded-full shadow-sm group-hover:scale-105 active:scale-95 transition-all whitespace-nowrap">
              <span>{ad.cta_text || 'Claim Offer'}</span>
              <ArrowRight size={12} className="hidden xs:inline" />
            </span>
          </div>
        </a>
      </div>
    </div>
  );
}
