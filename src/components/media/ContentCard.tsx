'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ExternalLink, Play, Clock, BookOpen, ArrowRight, ShieldCheck, Sparkles, Newspaper, Video as VideoIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDate } from '@/lib/utils';

export interface ContentCardProps {
  item: {
    id: string;
    title: string;
    slug: string;
    content_type: 'news' | 'article' | 'magazine' | 'video';
    subcategory?: string | null;
    excerpt?: string;
    description?: string;
    image_url?: string;
    canonical_url: string;
    published_at: string;
    author_name?: string;
    category?: string;
    source_name?: string;
    duration_seconds?: number;
    video_id?: string;
    is_external?: boolean;
    quality_score?: number;
    view_count?: number;
    reading_time?: number;
  };
  layout?: 'standard' | 'horizontal' | 'compact' | 'short';
  priority?: boolean;
}

function InstagramIcon({ size = 11, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function YouTubeShortsIcon({ size = 12, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.77 10.32l-1.2-.5L18 9.06a3.74 3.74 0 0 0-3.5-5.36 3.7 3.7 0 0 0-2.4 1.1L5.8 9.56a3.75 3.75 0 0 0 2.2 6.74l1.2.5-1.43.76a3.75 3.75 0 0 0 3.5 5.38 3.7 3.7 0 0 0 2.4-1.1l6.3-4.76a3.75 3.75 0 0 0-2.2-6.76zM10 14.65v-5.3l4.5 2.65-4.5 2.65z" />
    </svg>
  );
}

export function ContentCard({ item, layout = 'standard', priority = false }: ContentCardProps) {
  const [imageError, setImageError] = useState(false);

  const isVideo = item.content_type === 'video';
  const isOriginal = !item.is_external;
  const isInstagram = Boolean(item.canonical_url?.includes('instagram.com'));
  const isReelOrShort =
    item.subcategory === 'short' ||
    isInstagram ||
    (isVideo && item.duration_seconds !== undefined && item.duration_seconds !== null && item.duration_seconds > 0 && item.duration_seconds <= 60);

  const targetHref = isVideo
    ? `/video/${item.slug}`
    : isOriginal
    ? `/article/${item.slug}`
    : item.canonical_url || `/article/${item.slug}`;

  const isExternalLink = !isVideo && !isOriginal;

  const recordClick = () => {
    try {
      const actionType = isVideo ? 'watch' : item.content_type === 'magazine' ? 'magazine_read' : 'read';
      fetch('/api/activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentId: item.id,
          action: actionType,
          category: item.category,
        }),
        keepalive: true,
      }).catch(() => {});

      fetch('/api/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentItemId: item.id, metricType: 'click' }),
      }).catch(() => {});
    } catch {
      // non-blocking
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return null;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const displayImage = imageError || !item.image_url ? '/images/exercise_plank.png' : item.image_url;

  // 1. Horizontal List Layout
  if (layout === 'horizontal') {
    return (
      <Link
        href={targetHref}
        target={isExternalLink ? '_blank' : '_self'}
        rel={isExternalLink ? 'noopener noreferrer' : undefined}
        onClick={recordClick}
        className="group bg-white rounded-2xl border border-slate-200/80 hover:border-emerald-500/40 p-3.5 sm:p-4 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row gap-4 items-start block cursor-pointer text-inherit no-underline"
      >
        <div className="w-full sm:w-48 aspect-[16/10] relative rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200/60 block">
          <Image
            src={displayImage}
            alt={item.title}
            fill
            onError={() => setImageError(true)}
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            unoptimized
          />
          {isVideo && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center transition-colors group-hover:bg-black/40">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Play size={16} className="fill-white ml-0.5" />
              </div>
            </div>
          )}
          {isVideo && item.duration_seconds ? (
            <span className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-[9px] font-mono px-1.5 py-0.5 rounded backdrop-blur-xs">
              {formatDuration(item.duration_seconds)}
            </span>
          ) : null}
        </div>

        <div className="flex-1 flex flex-col justify-between h-full space-y-1.5 w-full">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-[10px] font-heading font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-50 text-[#f06d2f] border border-orange-200">
                {item.category || 'Wellness'}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                {isOriginal ? '✦ HealthGuru Original' : item.source_name || 'Medical Wire'}
              </span>
            </div>

            <h3 className="font-heading font-bold text-slate-900 text-sm sm:text-base group-hover:text-[#16A34A] transition-colors leading-snug line-clamp-2">
              {item.title}
            </h3>

            {(item.description || item.excerpt) && (
              <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                {item.description || item.excerpt}
              </p>
            )}
          </div>

          <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100">
            <span className="truncate max-w-[150px] font-medium text-slate-700">
              By {item.author_name || item.source_name || 'HealthGuru Editorial'}
            </span>
            <span className="font-bold text-[#f06d2f] group-hover:text-[#e05a1b] inline-flex items-center gap-1">
              <span>{isExternalLink ? 'Read Source' : isVideo ? 'Watch Video' : 'Read Article'}</span>
              <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
        </div>
      </Link>
    );
  }

  // 2. Dedicated Short / Reel Layout (ONLY when layout === 'short' explicitly)
  if (layout === 'short') {
    return (
      <Link
        href={targetHref}
        onClick={recordClick}
        className="group flex flex-col w-full select-none cursor-pointer block text-inherit no-underline"
      >
        <div className="w-full aspect-[9/16] relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-200/80 shadow-xs group-hover:shadow-xl group-hover:-translate-y-1.5 transition-all duration-300 block">
          <Image
            src={displayImage}
            alt={item.title}
            fill
            onError={() => setImageError(true)}
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            unoptimized
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

          <div className="absolute top-2.5 left-2.5 z-10">
            <span className="text-[10px] font-heading font-bold py-0.5 px-2.5 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 shadow-sm uppercase tracking-wider">
              {item.category || 'Wellness'}
            </span>
          </div>

          <div className="absolute top-2.5 right-2.5 z-10">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-600 text-white shadow-sm">
              {isInstagram ? <InstagramIcon size={10} /> : <YouTubeShortsIcon size={11} />}
              {isInstagram ? 'Reel' : 'Short'}
            </span>
          </div>

          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xl transform scale-75 group-hover:scale-100 transition-all duration-300 ring-4 ring-white/30">
              <Play size={20} className="fill-white ml-0.5" />
            </div>
          </div>

          <div className="absolute bottom-3 left-3 right-3 text-white z-10">
            <h4 className="font-heading font-bold text-xs sm:text-sm leading-snug line-clamp-2 drop-shadow-sm group-hover:text-emerald-300 transition-colors">
              {item.title}
            </h4>
            <p className="text-[11px] text-white/75 truncate mt-1 flex items-center gap-1">
              <span>{item.author_name || item.source_name || 'HealthGuru'}</span>
            </p>
          </div>
        </div>
      </Link>
    );
  }

  // 3. Standard Card Layout (Fixed 16:10 ratio, Uniform Height, Perfectly Aligned Rows across all grids)
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="h-full"
    >
      <Link
        href={targetHref}
        target={isExternalLink ? '_blank' : '_self'}
        rel={isExternalLink ? 'noopener noreferrer' : undefined}
        onClick={recordClick}
        className="group bg-white rounded-2xl border border-slate-200/80 hover:border-emerald-500/40 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer h-full text-inherit no-underline select-none"
      >
        <div>
          {/* Consistent 16:10 Thumbnail Container */}
          <div className="w-full aspect-[16/10] relative overflow-hidden bg-slate-100 block">
            <Image
              src={displayImage}
              alt={item.title}
              fill
              priority={priority}
              onError={() => setImageError(true)}
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              unoptimized
            />

            {/* Gradient vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-75 transition-opacity" />

            {/* Category Badge on Top-Left */}
            <div className="absolute top-3 left-3 z-10">
              <span className="text-[10px] font-heading font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 shadow-xs">
                {item.category || 'Wellness'}
              </span>
            </div>

            {/* Top-Right Badge: Video, Reel, Short, or Original */}
            <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
              {isReelOrShort ? (
                <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-red-600 text-white shadow-xs">
                  {isInstagram ? <InstagramIcon size={9} /> : <YouTubeShortsIcon size={10} />}
                  <span>{isInstagram ? 'Reel' : 'Short'}</span>
                </span>
              ) : isVideo ? (
                <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-700/90 backdrop-blur-xs text-white shadow-xs">
                  <VideoIcon size={10} />
                  <span>Video</span>
                </span>
              ) : isOriginal ? (
                <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-700/90 backdrop-blur-xs text-white shadow-xs">
                  <Sparkles size={9} className="text-amber-300" />
                  <span>Original</span>
                </span>
              ) : null}
            </div>

            {/* Centered Play Button Overlay for Videos */}
            {isVideo && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-emerald-600/90 hover:bg-emerald-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-all ring-2 ring-white/30 backdrop-blur-xs">
                  <Play size={16} className="fill-white ml-0.5" />
                </div>
              </div>
            )}

            {/* Video Duration / Reading Time on Bottom-Right */}
            {isVideo && item.duration_seconds ? (
              <span className="absolute bottom-2.5 right-2.5 bg-black/80 text-white text-[9px] font-mono px-2 py-0.5 rounded-md backdrop-blur-xs font-semibold">
                {formatDuration(item.duration_seconds)}
              </span>
            ) : item.reading_time ? (
              <span className="absolute bottom-2.5 right-2.5 bg-black/80 text-white text-[9px] font-mono px-2 py-0.5 rounded-md backdrop-blur-xs font-semibold">
                {item.reading_time} min read
              </span>
            ) : null}

            {/* Source Tag on Bottom-Left */}
            <div className="absolute bottom-2.5 left-2.5 text-white/90 text-[10px] font-heading font-semibold px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs truncate max-w-[160px]">
              {item.source_name || (isOriginal ? 'HealthGuru' : 'Medical News')}
            </div>
          </div>

          {/* Card Content Area */}
          <div className="p-4 sm:p-5 flex flex-col justify-between">
            <div>
              {/* Date Metadata */}
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 mb-2">
                <Clock size={11} className="text-slate-400" />
                <span suppressHydrationWarning>{formatDate(item.published_at)}</span>
              </div>

              {/* Bold Title */}
              <h3 className="font-heading font-bold text-slate-900 text-sm sm:text-base group-hover:text-[#16A34A] transition-colors leading-snug line-clamp-2 mb-2">
                {item.title}
              </h3>

              {/* Excerpt / Summary */}
              {(item.excerpt || item.description) && (
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-body">
                  {item.excerpt || item.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Card Footer with Verified Medical Author & Action CTA */}
        <div className="px-4 sm:px-5 pb-4 pt-3 mt-auto border-t border-slate-100 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1.5 text-slate-500 min-w-0 max-w-[55%]">
            <ShieldCheck size={13} className="text-[#16A34A] shrink-0" />
            <span className="truncate font-medium text-slate-700">
              {item.author_name || item.source_name || 'Medical Board'}
            </span>
          </div>

          <span className="font-heading font-bold text-xs text-[#f06d2f] group-hover:text-[#e05a1b] inline-flex items-center gap-1 shrink-0">
            <span>{isExternalLink ? 'Source' : isVideo ? 'Watch' : 'Read Full'}</span>
            <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </Link>
    </motion.article>
  );
}
