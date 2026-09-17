/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

interface CategorySectionBlockProps {
  title: string;
  categorySlug: string;
  description?: string;
  items: any[];
  accentColor?: string;
}

export function CategorySectionBlock({
  title,
  categorySlug,
  description,
  items,
}: CategorySectionBlockProps) {
  if (!items || items.length === 0) return null;

  const featured = items[0];
  const supporting = items.slice(1, 4);

  return (
    <section className="w-full py-6 sm:py-8">
      {/* Category Header with Gradient Underline and View All */}
      <div className="flex items-center justify-between pb-3.5 mb-6 relative">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-6 rounded-full bg-[#CBF2DB]" />
          <div>
            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-slate-900 tracking-tight uppercase">
              {title}
            </h2>
            {description && (
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                {description}
              </p>
            )}
          </div>
        </div>

        <Link
          href={`/category/${categorySlug}`}
          className="inline-flex items-center gap-1.5 text-xs font-heading font-bold text-[#16A34A] hover:text-[#f06d2f] transition-colors py-1.5 px-3.5 rounded-full hover:bg-emerald-50 border border-emerald-500/20"
        >
          <span>View All {title}</span>
          <ArrowRight size={13} />
        </Link>

        {/* Mint Green Underline */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#CBF2DB] rounded-full opacity-70" />
      </div>

      {/* Grid: 1 Large Story (left) + 2 or 3 Supporting Stories (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Large Featured Story */}
        {featured && (
          <div className="lg:col-span-6 flex flex-col">
            <Link
              href={`/article/${featured.slug}`}
              className="group block bg-white rounded-2xl overflow-hidden border border-emerald-500/20 shadow-xs hover:shadow-lg transition-all duration-300 h-full flex flex-col justify-between"
            >
              <div className="relative aspect-[16/10] w-full bg-gray-100 overflow-hidden">
                {featured.image_url && (
                  <Image
                    src={featured.image_url}
                    alt={featured.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    unoptimized
                  />
                )}
                <div className="absolute top-3 left-3">
                  <span className="bg-gradient-to-r from-[#16A34A] to-[#15803D] text-white text-[10px] font-heading font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
                    {title}
                  </span>
                </div>
              </div>

              <div className="p-5 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="font-heading font-bold text-base sm:text-lg text-slate-900 group-hover:text-[#16A34A] transition-colors line-clamp-2 leading-snug">
                    {featured.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed">
                    {featured.excerpt || featured.description || featured.summary}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="truncate">{featured.source_name || "HealthGhuru Bureau"}</span>
                  <span className="text-[#f06d2f] font-bold group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                    <span>Read More</span>
                    <ArrowRight size={11} />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Right: Supporting Stories Stack */}
        <div className="lg:col-span-6 flex flex-col gap-3.5">
          {supporting.map((item, idx) => (
            <article
              key={item.id || idx}
              className="group bg-white rounded-xl p-3.5 sm:p-4 border border-emerald-500/15 hover:border-emerald-500/40 shadow-xs hover:shadow-md transition-all duration-200"
            >
              <Link href={`/article/${item.slug}`} className="flex gap-3 sm:gap-4 items-center">
                {item.image_url && (
                  <div className="relative w-20 h-20 sm:w-24 sm:h-20 rounded-lg overflow-hidden shrink-0 bg-gray-100 border border-gray-100">
                    <Image
                      src={item.image_url}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      unoptimized
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-mono text-[#f06d2f] font-bold uppercase tracking-wider">
                    {item.subcategory || title}
                  </span>
                  <h4 className="font-heading font-bold text-xs sm:text-sm text-slate-900 group-hover:text-[#16A34A] transition-colors line-clamp-2 leading-snug mt-0.5">
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-slate-400 mt-1 font-medium">
                    <span className="truncate">{item.source_name || "Clinical Wire"}</span>
                    <span>•</span>
                    <span>Recent</span>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
