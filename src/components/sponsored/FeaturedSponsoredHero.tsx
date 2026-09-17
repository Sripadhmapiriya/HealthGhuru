import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Building2, User, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { SponsoredArticleWithSponsor } from '@/lib/types/sponsored';
import { SponsoredBadge } from './SponsoredBadge';

interface FeaturedSponsoredHeroProps {
  article: SponsoredArticleWithSponsor;
}

export function FeaturedSponsoredHero({ article }: FeaturedSponsoredHeroProps) {
  const publishedDate = article.published_at
    ? new Date(article.published_at).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : '';

  const isDoctor = article.sponsor_type === 'DOCTOR';

  return (
    <section className="mb-10 w-full" aria-labelledby="featured-heading">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2.5 h-2.5 rounded-full bg-[#f06d2f]" />
        <h2 id="featured-heading" className="text-xs font-mono font-bold uppercase tracking-widest text-[#16A34A]">
          FEATURED SPONSORED STORY
        </h2>
      </div>

      <div className="bg-white rounded-2xl border border-emerald-200/80 shadow-xs hover:shadow-lg transition-all duration-300 overflow-hidden group">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left: Large Image (5 cols) */}
          <div className="lg:col-span-6 relative aspect-[16/10] lg:aspect-auto lg:min-h-[400px] w-full bg-emerald-50 overflow-hidden">
            <Image
              src={article.featured_image || 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80'}
              alt={article.title}
              fill
              priority
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute top-4 left-4 z-10">
              <SponsoredBadge label={article.sponsored_label || 'SPONSORED'} size="md" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent lg:hidden" />
          </div>

          {/* Right: Editorial Content (6 cols) */}
          <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between bg-white">
            <div>
              {/* Category & Sponsor Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-emerald-100">
                <span className="text-xs font-heading font-bold text-[#16A34A] uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                  {article.category}
                </span>

                {article.sponsor_name && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-600">
                    <div className="w-5 h-5 rounded-full overflow-hidden relative bg-gray-100 shrink-0 border border-gray-200">
                      {article.sponsor_logo_url ? (
                        <Image
                          src={article.sponsor_logo_url}
                          alt={article.sponsor_name}
                          fill
                          className="object-cover"
                        />
                      ) : isDoctor ? (
                        <User size={12} className="text-emerald-700 m-auto mt-0.5" />
                      ) : (
                        <Building2 size={12} className="text-emerald-700 m-auto mt-0.5" />
                      )}
                    </div>
                    <span className="font-heading font-semibold text-gray-900 truncate max-w-[180px]">
                      {article.sponsor_name}
                    </span>
                    {article.sponsor_verified && (
                      <CheckCircle2 size={13} className="text-blue-500 shrink-0" />
                    )}
                  </div>
                )}
              </div>

              {/* Title */}
              <h3 className="font-heading font-bold text-xl sm:text-2xl lg:text-3xl text-gray-900 leading-tight group-hover:text-[#16A34A] transition-colors mb-4">
                <Link href={`/sponsored-articles/${article.slug}`}>
                  {article.title}
                </Link>
              </h3>

              {/* Excerpt */}
              <p className="text-sm sm:text-base text-gray-600 line-clamp-3 leading-relaxed mb-6 font-normal">
                {article.excerpt}
              </p>
            </div>

            {/* Bottom Meta & CTA */}
            <div className="pt-4 border-t border-emerald-100 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-xs text-gray-500 font-medium">
                {publishedDate && <span>{publishedDate}</span>}
                <span className="flex items-center gap-1">
                  <Clock size={13} className="text-gray-400" />
                  {article.reading_time || 5} min read
                </span>
              </div>

              <Link
                href={`/sponsored-articles/${article.slug}`}
                className="inline-flex items-center gap-2 text-sm font-heading font-bold text-[#f06d2f] hover:text-[#e05b1d] group-hover:translate-x-1 transition-all duration-200"
              >
                <span>{article.cta_text || 'READ ARTICLE →'}</span>
                <ArrowRight size={15} />
              </Link>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
