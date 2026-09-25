/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { Flame, ChevronRight, ChevronLeft, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export interface BreakingItem {
  id: string;
  title: string;
  slug: string;
  category?: string;
  source_name?: string;
  canonical_url?: string;
  is_external?: boolean;
  published_at?: string;
  [key: string]: any;
}

export function BreakingNewsTicker({ items }: { items: (BreakingItem | any)[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  useEffect(() => {
    if (items.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [items.length, isPaused]);

  if (!items || items.length === 0) {
    return null;
  }

  const current = items[currentIndex];
  const targetHref = current.is_external && current.canonical_url ? current.canonical_url : `/article/${current.slug}`;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setIsPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsPaused(false);
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (diff > 40) {
      handleNext();
    } else if (diff < -40) {
      handlePrev();
    }
    setTouchStartX(null);
  };

  return (
    <div
      className="w-full pt-1.5 sm:pt-4 pb-1 sm:pb-2 px-2 sm:px-6 lg:px-8 relative z-30 flex justify-center"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div 
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="w-full max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto bg-gradient-to-r from-[#052315] via-[#09321e] to-[#1c1109] rounded-full border border-emerald-500/30 sm:border-2 py-1 sm:py-2 px-2 sm:px-4 shadow-md shadow-emerald-950/20 flex items-center justify-between gap-1.5 sm:gap-3 text-white select-none sm:select-auto"
      >
        {/* Left: Breaking News Pill Badge */}
        <div className="flex items-center gap-1.5 sm:gap-3 overflow-hidden flex-1 min-w-0">
          <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-gradient-to-r from-red-600 via-[#ea580c] to-[#f06d2f] text-white font-heading font-black text-[9.5px] sm:text-xs shrink-0 uppercase tracking-wider shadow-sm sm:shadow-md shadow-orange-500/40">
            <Flame size={11} className="text-amber-200 fill-amber-200 animate-bounce shrink-0 sm:w-3 sm:h-3" style={{ animationDuration: '2s' }} />
            <span className="hidden sm:inline">BREAKING NEWS</span>
            <span className="sm:hidden tracking-tight font-extrabold">BREAKING</span>
            <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-white"></span>
            </span>
          </div>

          <span className="text-amber-400 font-bold text-xs sm:text-sm hidden sm:inline select-none">✦</span>

          {/* Animated Headline with Dynamic Colored Tags */}
          <div className="flex-1 min-w-0 overflow-hidden relative h-5 sm:h-6 flex items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="truncate text-[11.5px] sm:text-[13.5px] font-medium flex items-center min-w-0 w-full text-slate-100"
              >
                {current.category && (
                  <span className="hidden md:inline-block bg-emerald-500/25 text-emerald-300 border border-emerald-400/40 font-bold px-2 py-0.5 rounded text-[10.5px] mr-2 shrink-0 font-heading uppercase tracking-wider">
                    {current.category}
                  </span>
                )}

                <Link
                  href={targetHref}
                  target={current.is_external ? '_blank' : '_self'}
                  className="hover:underline text-white sm:hover:text-amber-300 font-semibold sm:font-bold truncate transition-colors flex-1 min-w-0 block"
                  title={current.title}
                >
                  {current.title}
                </Link>

                {current.source_name && (
                  <span className="text-emerald-400/70 text-xs ml-2 shrink-0 hidden md:inline font-mono">
                    ✦ via {current.source_name}
                  </span>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Right: Controls (Previous, Counter, Next) */}
        {items.length > 1 && (
          <div className="flex items-center shrink-0 text-emerald-300/80">
            {/* Desktop Previous Button */}
            <button
              onClick={handlePrev}
              className="hidden sm:flex p-1 rounded-full sm:hover:bg-white/15 text-emerald-300 hover:text-white transition-colors items-center justify-center active:scale-90 focus:outline-none"
              aria-label="Previous breaking news"
            >
              <ChevronLeft size={14} />
            </button>

            {/* Desktop Counter */}
            <span className="hidden sm:inline text-xs font-mono font-bold text-emerald-200/90 px-1 select-none">
              {currentIndex + 1}/{items.length}
            </span>

            {/* Desktop Next Button */}
            <button
              onClick={handleNext}
              className="hidden sm:flex p-1 rounded-full sm:hover:bg-white/15 text-emerald-300 hover:text-white transition-colors items-center justify-center active:scale-90 focus:outline-none"
              aria-label="Next breaking news"
            >
              <ChevronRight size={14} />
            </button>

            {/* Mobile: Ultra-slim seamless inline tap target (no bulky capsule or border) */}
            <button
              onClick={handleNext}
              className="sm:hidden flex items-center gap-0.5 text-emerald-300 hover:text-white active:opacity-60 focus:outline-none py-0.5 pl-1 pr-0.5"
              aria-label="Next breaking news"
            >
              <span className="text-[10.5px] font-mono font-bold select-none text-emerald-300/90">
                {currentIndex + 1}/{items.length}
              </span>
              <ChevronRight size={12} className="shrink-0 text-emerald-400" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
