'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Advertisement } from '@/lib/types/advertisement';
import { trackAdEvent } from './adTracking';
import Image from 'next/image';
import { useSubscription } from '@/lib/hooks/useSubscription';

interface SidebarAdProps {
  initialAd?: Advertisement | null;
  category?: string;
  className?: string;
  sticky?: boolean;
}

export function SidebarAd({ initialAd, category, className = '', sticky = false }: SidebarAdProps) {
  const { isAdFree } = useSubscription();
  const [ads, setAds] = useState<Advertisement[]>(initialAd ? [initialAd] : []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [rotationSeconds, setRotationSeconds] = useState(8);
  const [isPaused, setIsPaused] = useState(false);
  const trackedMap = useRef<Record<string, boolean>>({});

  useEffect(() => {
    if (isAdFree) return;

    if (!initialAd) {
      const fetchAds = async () => {
        try {
          const url = category
            ? `/api/ads/active?placement=sidebar&category=${category}&t=${Date.now()}`
            : `/api/ads/active?placement=sidebar&t=${Date.now()}`;
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
    }
  }, [initialAd, category, isAdFree]);

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

  if (ad.html_code) {
    return (
      <div className={`bg-white rounded-2xl p-4 border border-border shadow-sm text-center ${sticky ? 'sticky top-28' : ''} ${className}`}>
        <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted mb-2 block">
          ADVERTISEMENT
        </span>
        <div dangerouslySetInnerHTML={{ __html: ad.html_code }} />
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-2xl border border-border/80 shadow-sm overflow-hidden group hover:shadow-md transition-shadow ${sticky ? 'sticky top-28' : ''} ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Top Tag & Rotation Indicators */}
      <div className="px-4 py-2 bg-surface/60 border-b border-border/60 flex items-center justify-between">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-primary flex items-center gap-1">
          <Sparkles size={10} /> SPONSORED
        </span>

        {ads.length > 1 ? (
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
                title={`Ad ${idx + 1} of ${ads.length}`}
              />
            ))}
          </div>
        ) : (
          <span className="text-[10px] text-text-muted">Ad</span>
        )}
      </div>

      <a
        href={ad.target_url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className={`block p-5 space-y-4 transition-all duration-300 ${
          fade ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Creative Image */}
        {ad.image_url && (
          <div className="relative w-full h-44 rounded-xl overflow-hidden border border-border bg-surface group-hover:scale-[1.02] transition-transform duration-300">
            <Image
              src={ad.image_url}
              alt={ad.title}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        )}

        {/* Content */}
        <div className="space-y-2">
          <h4 className="font-heading font-bold text-dark text-base leading-snug group-hover:text-primary transition-colors">
            {ad.headline || ad.title}
          </h4>

          {ad.description && (
            <p className="text-xs text-text-secondary leading-relaxed line-clamp-3">
              {ad.description}
            </p>
          )}
        </div>

        {/* CTA Button */}
        <div className="pt-1">
          <div className="w-full py-2.5 px-4 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-heading font-semibold text-center transition-all flex items-center justify-center gap-1.5 shadow-sm shadow-primary/20">
            <span>{ad.cta_text || 'Learn More'}</span>
            <ArrowRight size={13} />
          </div>
        </div>
      </a>
    </div>
  );
}
