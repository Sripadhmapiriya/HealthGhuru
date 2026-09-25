'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Advertisement } from '@/lib/types/advertisement';
import { trackAdEvent } from '@/components/ads/adTracking';
import { useSubscription } from '@/lib/hooks/useSubscription';
import { getSafeImageUrl } from '@/lib/utils';

const DEFAULT_FALLBACK_ADS: Advertisement[] = [
  {
    id: 'd813e939-e5a8-4327-b4fd-e765e10bc04d',
    title: 'Apex Heart & Vascular Institute',
    placement: 'top_banner',
    image_url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=728&q=80',
    target_url: '/hospitals/apex-heart-vascular-institute',
    headline: 'Apex Heart & Vascular — 64-Slice Cardiac CT & Prevention',
    description: 'Advanced early detection for coronary plaque and cardiac wellness consultations.',
    cta_text: 'Book Consultation',
    category: 'Heart',
    html_code: null,
    is_active: true,
    impressions_count: 0,
    clicks_count: 0,
    start_date: new Date().toISOString(),
    end_date: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    advertiser_type: 'hospital',
    advertiser_name: 'Apex Heart & Vascular Institute',
    status: 'active',
    payment_status: 'paid',
    priority: 'medium',
  },
  {
    id: 'dd664fed-4400-4ad9-8ba0-5ab5d859030c',
    title: 'National Cancer Research Care Centre',
    placement: 'top_banner',
    image_url: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=728&q=80',
    target_url: '/hospitals/national-cancer-research-care-centre',
    headline: 'National Cancer Institute — Molecular Biomarker Screening',
    description: 'Accredited oncology panel with leading clinical trial specialists.',
    cta_text: 'Schedule Evaluation',
    category: 'Cancer',
    html_code: null,
    is_active: true,
    impressions_count: 0,
    clicks_count: 0,
    start_date: new Date().toISOString(),
    end_date: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    advertiser_type: 'hospital',
    advertiser_name: 'National Cancer Care Centre',
    status: 'active',
    payment_status: 'paid',
    priority: 'medium',
  },
];

interface NavbarHeaderAdProps {
  isMobile?: boolean;
}

export function NavbarHeaderAd({ isMobile = false }: NavbarHeaderAdProps) {
  const { isAdFree } = useSubscription();
  const [ads, setAds] = useState<Advertisement[]>(DEFAULT_FALLBACK_ADS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [rotationSeconds, setRotationSeconds] = useState(8);
  const [isPaused, setIsPaused] = useState(false);
  const trackedMap = useRef<Record<string, boolean>>({});

  useEffect(() => {
    if (isAdFree) return;

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
        if (data.success && Array.isArray(data.ads) && data.ads.length > 0) {
          const bannerAds = data.ads.filter(
            (a: Advertisement) =>
              (a.placement === 'hero_banner' ||
                a.placement === 'top_banner' ||
                (a.placement as string) === 'header_banner') &&
              a.is_active === true &&
              (a.status === 'active' || !a.status)
          );
          if (bannerAds.length > 0) {
            setAds(bannerAds);
          }
          if (data.rotation_interval && typeof data.rotation_interval === 'number') {
            setRotationSeconds(data.rotation_interval);
          }
        }
      } catch {
        // keep fallback ads
      }
    };

    loadActiveAds();
  }, [isAdFree]);

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

  const currentAd = ads[currentIndex] || DEFAULT_FALLBACK_ADS[0];

  useEffect(() => {
    if (currentAd && currentAd.id && !trackedMap.current[currentAd.id]) {
      trackedMap.current[currentAd.id] = true;
      trackAdEvent(currentAd.id, 'impression');
    }
  }, [currentAd]);

  if (isAdFree || !currentAd) return null;

  const handleClick = () => {
    if (currentAd && currentAd.id) {
      trackAdEvent(currentAd.id, 'click');
    }
  };

  // MOBILE VERSION (< lg)
  if (isMobile) {
    return (
      <div
        className="w-full"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <a
          href={currentAd.target_url || '#'}
          target={currentAd.target_url?.startsWith('http') ? '_blank' : '_self'}
          rel={currentAd.target_url?.startsWith('http') ? 'noopener noreferrer' : undefined}
          onClick={handleClick}
          className={`w-full bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950 text-white rounded-xl p-1.5 px-2.5 sm:px-3 flex items-center justify-between gap-2 transition-all duration-300 shadow-xs border border-emerald-500/20 ${
            fade ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.99]'
          }`}
        >
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-emerald-400/30 bg-white/5">
              {currentAd.image_url ? (
                <Image
                  src={getSafeImageUrl(currentAd.image_url, 'advertisement')}
                  alt={currentAd.title || 'Header Advertisement'}
                  fill
                  sizes="32px"
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-emerald-900 text-white font-bold text-[9px]">
                  AD
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-[8px] font-mono uppercase tracking-wider font-bold bg-[#f06d2f] text-white px-1 py-0.5 rounded shrink-0">
                  SPONSORED
                </span>
                <span className="text-[10px] font-bold text-amber-300 truncate">
                  {currentAd.advertiser_name || currentAd.title}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs font-heading font-semibold text-white truncate mt-0.5">
                {currentAd.headline || currentAd.title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <span className="bg-gradient-to-r from-[#f06d2f] to-[#ff8a57] text-white text-[9.5px] sm:text-[10px] font-heading font-bold px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg shadow-sm inline-flex items-center gap-1">
              <span>{currentAd.cta_text || 'Explore'}</span>
              <ArrowRight size={10} />
            </span>
          </div>
        </a>
      </div>
    );
  }

  // DESKTOP VERSION (lg+)
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
                  src={getSafeImageUrl(currentAd.image_url, 'advertisement')}
                  alt={currentAd.title || 'Header Advertisement'}
                  fill
                  sizes="48px"
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
