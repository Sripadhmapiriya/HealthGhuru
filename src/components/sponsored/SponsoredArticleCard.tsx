import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Building2, User, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { SponsoredArticleWithSponsor } from '@/lib/types/sponsored';
import { SponsoredBadge } from './SponsoredBadge';

interface SponsoredArticleCardProps {
  article: SponsoredArticleWithSponsor;
}

export function SponsoredArticleCard({ article }: SponsoredArticleCardProps) {
  const publishedDate = article.published_at
    ? new Date(article.published_at).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : '';

  const isDoctor = article.sponsor_type === 'DOCTOR';

  return (
    <article className="bg-white rounded-2xl border border-emerald-100/90 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between overflow-hidden group">
      <div>
        {/* Card Thumbnail */}
        <div className="relative aspect-[16/10] w-full bg-emerald-50/50 overflow-hidden">
          <Image
            src={article.featured_image || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80'}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
            <SponsoredBadge label={article.sponsored_label || 'SPONSORED'} size="sm" />
          </div>
          <div className="absolute bottom-2.5 right-2.5 z-10 bg-black/60 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded-sm flex items-center gap-1">
            <Clock size={10} />
            <span>{article.reading_time || 5} min</span>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-5">
          {/* Category Pill */}
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <span className="text-[11px] font-heading font-bold text-[#16A34A] uppercase tracking-wider">
              {article.category}
            </span>
            {publishedDate && (
              <span className="text-[11px] text-gray-400 font-medium">
                {publishedDate}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-heading font-bold text-base sm:text-lg text-gray-900 group-hover:text-[#16A34A] transition-colors line-clamp-2 leading-snug mb-2">
            <Link href={`/sponsored-articles/${article.slug}`}>
              {article.title}
            </Link>
          </h3>

          {/* Excerpt */}
          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed mb-4">
            {article.excerpt}
          </p>
        </div>
      </div>

      {/* Card Footer: Sponsor info & CTA */}
      <div className="px-5 pb-5 pt-3 border-t border-emerald-50 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded-full overflow-hidden relative bg-gray-100 shrink-0 border border-emerald-200/60">
            {article.sponsor_logo_url ? (
              <Image
                src={article.sponsor_logo_url}
                alt={article.sponsor_name || 'Sponsor'}
                fill
                sizes="24px"
                className="object-cover"
                unoptimized
              />
            ) : isDoctor ? (
              <User size={13} className="text-emerald-700 m-auto mt-0.5" />
            ) : (
              <Building2 size={13} className="text-emerald-700 m-auto mt-0.5" />
            )}
          </div>
          <div className="truncate">
            <div className="flex items-center gap-1">
              <span className="text-xs font-heading font-semibold text-gray-800 truncate block">
                {article.sponsor_name || 'Healthcare Partner'}
              </span>
              {article.sponsor_verified && (
                <CheckCircle2 size={12} className="text-blue-500 shrink-0" />
              )}
            </div>
            {article.sponsor_city && (
              <span className="text-[10px] text-gray-400 block leading-tight">
                {article.sponsor_city}
              </span>
            )}
          </div>
        </div>

        <Link
          href={`/sponsored-articles/${article.slug}`}
          className="inline-flex items-center gap-1 text-xs font-heading font-bold text-[#f06d2f] hover:text-[#e05b1d] shrink-0 group-hover:translate-x-0.5 transition-transform"
        >
          <span>Read</span>
          <ArrowRight size={13} />
        </Link>
      </div>
    </article>
  );
}
