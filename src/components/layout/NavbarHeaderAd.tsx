'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Advertisement } from '@/lib/types/advertisement';
import { trackAdEvent } from '@/components/ads/adTracking';

export function NavbarHeaderAd() {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [rotationSeconds, setRotationSeconds] = useState(8);
  const [isPaused, setIsPaused] = useState(false);
  const trackedMap = useRef<Record<string, boolean>>({});

  useEffect(() => {
    const loadActiveAds = async () => {
      try {
        const res = await fetch(`/api/ads/active?t=${Date.now()}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
          },
        });
        const data = await res.json();
        if (data.success && Array.isArray(data.ads)) {
          const bannerAds = data.ads.filter(
            (a: Advertisement) =>
              (a.placement === 'hero_banner' ||
                a.placement === 'top_banner' ||
                (a.placement as string) === 'header_banner') &&
              a.is_active === true &&
              (a.status === 'active' || !a.status)
          );
          setAds(bannerAds);
          if (data.rotation_interval && typeof data.rotation_interval === 'number') {
            setRotationSeconds(data.rotation_interval);
          }
        } else {
          setAds([]);
        }
      } catch {
        setAds([]);
      }
    };

    loadActiveAds();
  }, []);

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

  const currentAd = ads[currentIndex] || null;

  useEffect(() => {
    if (currentAd && currentAd.id && !trackedMap.current[currentAd.id]) {
      trackedMap.current[currentAd.id] = true;
      trackAdEvent(currentAd.id, 'impression');
    }
  }, [currentAd]);

  if (!currentAd) return null;

  const handleClick = () => {
    if (currentAd && currentAd.id) {
      trackAdEvent(currentAd.id, 'click');
    }
  };

  return (
    <div
      className="hidden lg:flex flex-1 items-center justify-center max-w-2xl xl:max-w-3xl px-2"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="w-full relative">
        <a
          href={currentAd.target_url || '#'}
          target={currentAd.target_url?.startsWith('http') ? '_blank' : '_self'}
          rel={currentAd.target_url?.startsWith('http') ? 'noopener noreferrer' : undefined}
          onClick={handleClick}
          className={`w-full bg-slate-900 text-white rounded-xl p-2.5 px-4 flex items-center justify-between gap-4 group transition-all duration-300 shadow-sm hover:shadow-md border border-slate-800 hover:border-slate-700 ${
            fade ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.99]'
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-emerald-400/30 bg-white/5">
              {currentAd.image_url ? (
                <Image
                  src={currentAd.image_url}
                  alt={currentAd.title || 'Header Advertisement'}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-emerald-900 text-white font-bold text-xs">
                  AD
                </div>
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono uppercase tracking-wider font-bold bg-[#f06d2f] text-white px-1.5 py-0.5 rounded">
                  ADVERTISEMENT
                </span>
                <span className="text-xs font-bold text-amber-300 truncate">
                  {currentAd.advertiser_name || currentAd.title}
                </span>
              </div>
              <p className="text-xs font-heading font-semibold text-white group-hover:text-emerald-300 truncate mt-0.5">
                {currentAd.headline || currentAd.title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {ads.length > 1 && (
              <div className="flex items-center gap-1 bg-black/40 px-2 py-1 rounded-full">
                {ads.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setCurrentIndex(idx);
                    }}
                    className={`h-1.5 rounded-full transition-all ${
                      currentIndex === idx ? 'w-4 bg-emerald-400' : 'w-1.5 bg-white/40 hover:bg-white/70'
                    }`}
                    title={`Ad ${idx + 1} of ${ads.length}`}
                  />
                ))}
              </div>
            )}

            <span className="bg-gradient-to-r from-[#f06d2f] to-[#ff8a57] text-white text-xs font-bold px-3.5 py-2 rounded-lg group-hover:brightness-110 shadow-sm inline-flex items-center gap-1">
              <span>{currentAd.cta_text || 'Explore'}</span>
              <ArrowRight size={12} />
            </span>
          </div>
        </a>
      </div>
    </div>
  );
}
