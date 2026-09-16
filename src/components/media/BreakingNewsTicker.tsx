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
    }, 5500);
    return () => clearInterval(interval);
  }, [items.length, isPaused]);

  if (!items || items.length === 0) {
    return null;
  }

  const current = items[currentIndex];
  const targetHref = current.is_external && current.canonical_url ? current.canonical_url : `/article/${current.slug}`;

  return (
    <div
      className="bg-[#fff6f0] border-b border-[#f06d2f]/20 py-2 px-3 sm:px-6 relative z-30 shadow-xs"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto flex items-center justify-between gap-3">
        {/* Left: Flame Icon + Breaking Badge */}
        <div className="flex items-center gap-2.5 overflow-hidden flex-1 min-w-0">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-red-600 to-[#f06d2f] text-white font-heading font-extrabold text-[10px] sm:text-xs shrink-0 uppercase tracking-wider shadow-xs">
            <Flame size={13} className="fill-white animate-bounce text-amber-200" />
            <span className="hidden sm:inline">BREAKING HEALTH NEWS</span>
            <span className="sm:hidden">BREAKING</span>
          </div>

          <span className="text-[#f06d2f] font-bold hidden sm:inline">|</span>

          {/* Animated Headline */}
          <div className="flex-1 min-w-0 overflow-hidden relative h-6 flex items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="truncate text-xs sm:text-sm font-medium flex items-center min-w-0 w-full"
              >
                {current.category && (
                  <span className="text-[#1B5E20] font-bold mr-2 shrink-0 font-heading text-[11px] sm:text-xs">
                    [{current.category.toUpperCase()}]
                  </span>
                )}

                <Link
                  href={targetHref}
                  target={current.is_external ? '_blank' : '_self'}
                  className="hover:underline text-[#1A2E1A] hover:text-[#f06d2f] font-semibold truncate transition-colors flex-1 min-w-0"
                  title={current.title}
                >
                  {current.title}
                </Link>

                {current.source_name && (
                  <span className="text-gray-500 text-[11px] ml-2 shrink-0 hidden md:inline font-mono">
                    via {current.source_name}
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
              className="p-1 rounded-md hover:bg-[#f06d2f]/15 text-[#f06d2f] transition-colors flex items-center justify-center active:scale-90"
              aria-label="Previous breaking news"
            >
              <ChevronLeft size={16} />
            </button>

            <span className="text-[10px] sm:text-xs font-mono font-bold text-[#f06d2f] px-1 select-none">
              {currentIndex + 1}/{items.length}
            </span>

            <button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % items.length)}
              className="p-1 rounded-md hover:bg-[#f06d2f]/15 text-[#f06d2f] transition-colors flex items-center justify-center active:scale-90"
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
