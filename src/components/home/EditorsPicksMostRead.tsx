/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Award, BookOpen, Clock, ShieldCheck, ArrowRight } from 'lucide-react';
import { getSafeImageUrl } from '@/lib/utils';

interface EditorsPicksMostReadProps {
  editorPicks: any[];
  mostRead: any[];
  title?: string;
  mostReadTitle?: string;
  displayViewsBadge?: boolean;
}

export function EditorsPicksMostRead({
  editorPicks,
  mostRead,
  title,
  mostReadTitle,
  displayViewsBadge = true,
}: EditorsPicksMostReadProps) {
  return (
    <section className="w-full py-8 sm:py-10 bg-white">
      <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT 7 COLS: EDITOR'S PICKS */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="flex items-center justify-between pb-3 mb-5 border-b-2 border-[#2E7D32]">
              <div className="flex items-center gap-2">
                <Award size={20} className="text-[#f06d2f]" />
                <h2 className="font-heading font-extrabold text-lg sm:text-xl text-[#1B5E20] uppercase tracking-wide">
                  {title || "EDITOR'S PICKS"}
                </h2>
              </div>
              <span className="text-[11px] font-mono text-gray-400">CURATED EDITORIAL</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {editorPicks && editorPicks.slice(0, 4).map((story, i) => {
                const slug = story.slug || `editor-pick-${i}`;
                return (
                  <article
                    key={story.id || i}
                    className="bg-[#F5FAF5] rounded-xl p-4 border border-[#2E7D32]/15 hover:border-[#2E7D32]/40 hover:shadow-sm transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {story.image_url && (
                        <div className="relative aspect-[16/10] w-full rounded-lg overflow-hidden mb-3 bg-gray-200">
                          <Image
                            src={getSafeImageUrl(story.image_url, story.category)}
                            alt={story.title}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            unoptimized
                          />
                          {story.category && (
                            <span className="absolute top-2 left-2 bg-[#1B5E20] text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded">
                              {story.category}
                            </span>
                          )}
                        </div>
                      )}

                      <Link href={`/article/${slug}`}>
                        <h3 className="font-heading font-bold text-xs sm:text-sm text-[#1A2E1A] group-hover:text-[#2E7D32] transition-colors line-clamp-2 leading-snug">
                          {story.title}
                        </h3>
                      </Link>

                      <p className="text-[11px] text-[#4A6741] line-clamp-2 mt-1.5 leading-relaxed">
                        {story.excerpt || story.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-gray-200/60 flex items-center justify-between text-[10px] text-gray-400">
                      <span>{story.source_name || "Special Report"}</span>
                      <Link href={`/article/${slug}`} className="text-[#f06d2f] font-bold hover:underline">
                        Read →
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          {/* RIGHT 5 COLS: MOST READ 01-05 */}
          <div className="lg:col-span-5 flex flex-col bg-[#F5FAF5] rounded-2xl p-5 border border-[#2E7D32]/20">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#2E7D32]/20">
              <div className="flex items-center gap-2">
                <BookOpen size={18} className="text-[#2E7D32]" />
                <h2 className="font-heading font-extrabold text-lg text-[#1B5E20] uppercase tracking-wide">
                  {mostReadTitle || "MOST READ THIS WEEK"}
                </h2>
              </div>
              <span className="text-[10px] font-mono text-[#4A6741] font-semibold">BY ENGAGEMENT</span>
            </div>

            <div className="divide-y divide-gray-200 space-y-3">
              {mostRead && mostRead.slice(0, 5).map((story, i) => {
                const rank = String(i + 1).padStart(2, '0');
                const slug = story.slug || `most-read-${i}`;
                return (
                  <Link
                    key={story.id || i}
                    href={`/article/${slug}`}
                    className="pt-3 first:pt-0 flex items-start gap-3.5 group cursor-pointer"
                  >
                    <span className="font-display font-black text-2xl sm:text-3xl text-[#2E7D32]/40 group-hover:text-[#f06d2f] transition-colors leading-none shrink-0 w-8">
                      {rank}
                    </span>
                    <div className="flex-1 min-w-0">
                      {story.category && (
                        <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-[#f06d2f]">
                          {story.category}
                        </span>
                      )}
                      <h4 className="font-heading font-bold text-xs sm:text-sm text-[#1A2E1A] group-hover:text-[#2E7D32] transition-colors line-clamp-2 leading-snug mt-0.5">
                        {story.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] text-gray-400 font-mono mt-1">
                        {displayViewsBadge && (
                          <>
                            <span>{story.view_count ? `${story.view_count} views` : '3.8k views'}</span>
                            <span>•</span>
                          </>
                        )}
                        <span>5 min read</span>
                      </div>
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
