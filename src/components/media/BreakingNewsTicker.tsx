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

  return (
    <div
      className="w-full pt-4 pb-2 px-4 sm:px-6 lg:px-8 relative z-30 flex justify-center"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="w-full max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto bg-gradient-to-r from-[#052315] via-[#09321e] to-[#1c1109] rounded-2xl sm:rounded-full border-2 border-emerald-500/30 py-2 sm:py-2.5 px-3.5 sm:px-5 shadow-md shadow-emerald-950/15 flex items-center justify-between gap-3 text-white">
        {/* Left: Breaking News Pill Badge */}
        <div className="flex items-center gap-3 overflow-hidden flex-1 min-w-0">
          <div className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-red-600 via-[#ea580c] to-[#f06d2f] text-white font-heading font-black text-xs shrink-0 uppercase tracking-wider shadow-md shadow-orange-500/40">
            <Flame size={13} className="text-amber-200 fill-amber-200 animate-bounce" style={{ animationDuration: '2s' }} />
            <span>BREAKING NEWS</span>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
          </div>

          <span className="text-amber-400 font-bold text-sm hidden sm:inline select-none">✦</span>

          {/* Animated Headline with Dynamic Colored Tags */}
          <div className="flex-1 min-w-0 overflow-hidden relative h-6 flex items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="truncate text-xs sm:text-[13.5px] font-medium flex items-center min-w-0 w-full text-slate-100"
              >
                {current.category && (
                  <span className="bg-emerald-500/25 text-emerald-300 border border-emerald-400/40 font-bold px-2 py-0.5 rounded text-[10.5px] mr-2 shrink-0 font-heading uppercase tracking-wider">
                    {current.category}
                  </span>
                )}

                <Link
                  href={targetHref}
                  target={current.is_external ? '_blank' : '_self'}
                  className="hover:underline text-white hover:text-amber-300 font-bold truncate transition-colors flex-1 min-w-0"
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
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)}
              className="p-1 rounded-md hover:bg-white/15 text-emerald-300 hover:text-white transition-colors flex items-center justify-center active:scale-90"
              aria-label="Previous breaking news"
            >
              <ChevronLeft size={16} />
            </button>

            <span className="text-xs font-mono font-bold text-emerald-200/90 px-1 select-none">
              {currentIndex + 1}/{items.length}
            </span>

            <button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % items.length)}
              className="p-1 rounded-md hover:bg-white/15 text-emerald-300 hover:text-white transition-colors flex items-center justify-center active:scale-90"
              aria-label="Next breaking news"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
