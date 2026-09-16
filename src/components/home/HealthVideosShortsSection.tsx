/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play, Video, Smartphone, Sparkles, ArrowRight } from 'lucide-react';

interface HealthVideosShortsSectionProps {
  videos: any[];
  shorts: any[];
}

export function HealthVideosShortsSection({ videos, shorts }: HealthVideosShortsSectionProps) {
  const [activeVideoModal, setActiveVideoModal] = useState<string | null>(null);

  return (
    <section className="w-full py-8 sm:py-10 bg-[#1A2E1A] text-white">
      <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 mb-6 border-b border-emerald-800/80">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-[#f06d2f]" />
            <div>
              <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-white uppercase tracking-wide">
                HEALTH VIDEOS & SHORTS
              </h2>
              <p className="text-xs text-emerald-300/80 font-medium hidden sm:block">
                Clinical explainers, physician webinars, and 30-second evidence-based health shorts
              </p>
            </div>
          </div>

          <Link
            href="/videos"
            className="inline-flex items-center gap-1.5 text-xs font-heading font-bold text-emerald-300 hover:text-white transition-colors"
          >
            <span>Explore Video Theater</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* 2-Tier Layout: Full-Length Videos (Left 7 cols) + Vertical Health Shorts (Right 5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: 16:9 Full-Length Feature Video + Grid */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-1">
              <Video size={16} className="text-[#f06d2f]" />
              <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-emerald-200">
                Medical Documentaries & Explainers
              </h3>
            </div>

            {videos && videos.length > 0 && (
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-black/60 border border-emerald-800/60 shadow-lg group">
                <Image
                  src={videos[0].image_url || "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80"}
                  alt={videos[0].title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-95"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                {/* Center Play Button */}
                <Link
                  href={`/video/${videos[0].slug}`}
                  className="absolute inset-0 flex items-center justify-center cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-full bg-[#f06d2f] text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                    <Play size={28} className="fill-white translate-x-0.5" />
                  </div>
                </Link>

                {/* Bottom Story Info */}
                <div className="absolute bottom-4 left-4 right-4 text-left pointer-events-none">
                  <span className="bg-[#1B5E20] text-emerald-200 text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded">
                    {videos[0].category || "CLINICAL EXPLAINER"}
                  </span>
                  <h4 className="font-heading font-bold text-sm sm:text-lg text-white mt-1.5 line-clamp-2">
                    {videos[0].title}
                  </h4>
                  <p className="text-xs text-gray-300 line-clamp-1 mt-1">
                    {videos[0].source_name || "HealthGhuru Studio"} • 14 min documentary
                  </p>
                </div>
              </div>
            )}

            {/* Smaller video row underneath */}
            <div className="grid grid-cols-2 gap-3 mt-1">
              {videos.slice(1, 3).map((vid, i) => (
                <Link
                  key={vid.id || i}
                  href={`/video/${vid.slug}`}
                  className="group bg-white/5 hover:bg-white/10 p-2.5 rounded-xl border border-emerald-900/60 transition-all flex gap-2.5 items-center"
                >
                  <div className="relative w-20 h-14 rounded-lg overflow-hidden shrink-0 bg-black">
                    {vid.image_url && (
                      <Image
                        src={vid.image_url}
                        alt={vid.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <Play size={12} className="fill-white text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-heading font-bold text-xs text-white group-hover:text-emerald-300 transition-colors line-clamp-2 leading-snug">
                      {vid.title}
                    </h5>
                    <span className="text-[10px] font-mono text-emerald-400/80 mt-1 block truncate">
                      {vid.category || "Video"}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* RIGHT: Health Shorts (Vertical 9:16 carousel) */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <Smartphone size={15} className="text-[#f06d2f]" />
                <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-emerald-200">
                  HEALTH SHORTS (30s REELS)
                </h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400">SWIPEABLE</span>
            </div>

            {/* Horizontal scroll container for 9:16 cards */}
            <div className="flex items-center gap-3.5 overflow-x-auto pb-3 scrollbar-none">
              {shorts && shorts.slice(0, 4).map((short, i) => {
                const slug = short.slug || `short-${i}`;
                return (
                  <Link
                    key={short.id || i}
                    href={`/video/${slug}`}
                    className="group relative w-36 sm:w-40 aspect-[9/16] rounded-2xl overflow-hidden shrink-0 bg-black/60 border border-emerald-800/80 shadow-md hover:border-[#f06d2f] transition-all duration-300"
                  >
                    {short.image_url && (
                      <Image
                        src={short.image_url}
                        alt={short.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-75 group-hover:opacity-90"
                        unoptimized
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                    {/* Top Pill */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                      <span className="text-[9px] font-mono font-bold bg-[#f06d2f] text-white px-1.5 py-0.5 rounded">
                        SHORT
                      </span>
                      <Sparkles size={11} className="text-amber-300" />
                    </div>

                    {/* Play Icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-xs text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play size={14} className="fill-white translate-x-0.5" />
                      </div>
                    </div>

                    {/* Bottom Caption */}
                    <div className="absolute bottom-2.5 left-2.5 right-2.5">
                      <p className="text-[11px] font-heading font-bold text-white line-clamp-2 leading-tight">
                        {short.title}
                      </p>
                      <span className="text-[9px] text-emerald-300/80 font-mono mt-0.5 block">
                        30 sec tip
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
