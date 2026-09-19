'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from 'react';
import { X, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { Advertisement } from '@/lib/types/advertisement';
import { trackAdEvent } from './adTracking';
import Image from 'next/image';
import { useSubscription } from '@/lib/hooks/useSubscription';
import { getSafeImageUrl } from '@/lib/utils';

interface FloatingFooterAdProps {
  initialAd?: Advertisement | null;
  category?: string;
}

export function FloatingFooterAd({ initialAd, category }: FloatingFooterAdProps) {
  const { isAdFree } = useSubscription();
  const [ads, setAds] = useState<Advertisement[]>(initialAd ? [initialAd] : []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [rotationSeconds, setRotationSeconds] = useState(8);
  const [isPaused, setIsPaused] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [visible, setVisible] = useState(false);
  const trackedMap = useRef<Record<string, boolean>>({});

  useEffect(() => {
    if (isAdFree) return;

    const timer = setTimeout(() => {
      setVisible(true);
    }, 300);

    const fetchAds = async () => {
      try {
        const url = category
          ? `/api/ads/active?placement=floating_footer&category=${category}&t=${Date.now()}`
          : `/api/ads/active?placement=floating_footer&t=${Date.now()}`;
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

    return () => clearTimeout(timer);
  }, [category]);

  // Auto-rotation timer
  useEffect(() => {
    if (ads.length <= 1 || isPaused || dismissed) return;

    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % ads.length);
        setFade(true);
      }, 250);
    }, Math.max(3000, rotationSeconds * 1000));

    return () => clearInterval(interval);
  }, [ads.length, rotationSeconds, isPaused, dismissed]);

  const ad = ads[currentIndex] || null;

  useEffect(() => {
    if (ad && !dismissed && visible && !trackedMap.current[ad.id]) {
      trackedMap.current[ad.id] = true;
      trackAdEvent(ad.id, 'impression');
    }
  }, [ad, dismissed, visible]);

  if (isAdFree || dismissed || !ad) return null;

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setVisible(false);
    setTimeout(() => {
      setDismissed(true);
    }, 300);
  };

  const handleClick = () => {
    if (ad) {
      trackAdEvent(ad.id, 'click');
    }
  };

  return (
    <aside
      aria-label="Bottom Right Floating Advertisement"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-32px)] sm:w-[360px] md:w-[380px] max-w-[380px] pointer-events-auto transition-all duration-500 transform ${
        visible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-12 opacity-0 scale-95'
      }`}
    >
      <div className="relative bg-white rounded-3xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.35)] border-2 border-primary/30 ring-1 ring-black/10 overflow-hidden group hover:shadow-[0_25px_70px_-10px_rgba(0,0,0,0.45)] transition-all">
        {/* Top Header Bar with Sponsor Label and Close Button */}
        <div className="px-4 py-2.5 bg-surface/90 border-b border-border/80 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-primary">
            <Sparkles size={12} className="text-primary" />
            <span>SPONSORED</span>
          </div>

          <div className="flex items-center gap-2">
            {ads.length > 1 && (
              <div className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-full">
                {ads.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setFade(false);
                      setTimeout(() => {
                        setCurrentIndex(idx);
                        setFade(true);
                      }, 200);
                    }}
                    className={`h-1.5 rounded-full transition-all ${
                      currentIndex === idx ? 'w-3 bg-primary' : 'w-1 bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Prominent Close Button */}
            <button
              onClick={handleDismiss}
              className="w-6 h-6 flex items-center justify-center bg-black/70 hover:bg-black text-white rounded-full transition-transform hover:scale-110 active:scale-95 shadow-md"
              aria-label="Close Floating Banner"
              title="Dismiss Advertisement"
            >
              <X size={13} />
            </button>
          </div>
        </div>

        {/* Ad Body Link */}
        <a
          href={ad.target_url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          className={`block p-4 sm:p-5 space-y-3.5 cursor-pointer transition-all duration-300 ${
            fade ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Large Creative Image */}
          {ad.image_url && (
            <div className="relative w-full h-44 sm:h-48 rounded-2xl overflow-hidden border border-border shadow-inner bg-surface group-hover:scale-[1.02] transition-transform duration-300">
              <Image
                src={getSafeImageUrl(ad.image_url, 'advertisement')}
                alt={ad.title}
                fill
                sizes="(max-width: 640px) 100vw, 360px"
                className="object-cover"
                unoptimized
              />
              <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-mono text-white flex items-center gap-1">
                <ShieldCheck size={11} className="text-emerald-400" /> Health Partner
              </div>
            </div>
          )}

          {/* Headline & Description */}
          <div className="space-y-1.5">
            <h4 className="font-heading font-bold text-base sm:text-lg text-dark leading-snug group-hover:text-primary transition-colors line-clamp-2">
              {ad.headline || ad.title}
            </h4>

            {ad.description && (
              <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
                {ad.description}
              </p>
            )}
          </div>

          {/* Full-Width Large Gradient CTA Button */}
          <div className="pt-1">
            <div className="w-full py-3 px-5 rounded-2xl font-heading font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-primary via-[#16a34a] to-emerald-600 hover:brightness-110 shadow-lg shadow-primary/25 group-hover:shadow-primary/40 flex items-center justify-center gap-2 transition-all group-hover:scale-[1.01] active:scale-[0.99]">
              <span>{ad.cta_text || 'Book Appointment'}</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </a>
      </div>
    </aside>
  );
}
