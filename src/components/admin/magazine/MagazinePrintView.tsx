/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';

interface MagazineArticle {
  id: string;
  title: string;
  slug: string;
  category: string;
  author_name: string;
  image_url: string | null;
  excerpt: string | null;
  description: string | null;
  reading_time: number | null;
  published_at: string;
}

interface MagazinePrintViewProps {
  year: number;
  month: number;
  monthName: string;
  issueVolume: string;
  issueTitle: string;
  editorNote: string;
  articles: MagazineArticle[];
}

export function MagazinePrintView({
  year,
  month,
  monthName,
  issueVolume,
  issueTitle,
  editorNote,
  articles,
}: MagazinePrintViewProps) {
  const coverArticle = articles[0] || null;
  const insideArticles = articles;

  // Group articles into pairs for 2-column or double-spread pages
  const articlePages: MagazineArticle[][] = [];
  for (let i = 0; i < insideArticles.length; i += 2) {
    articlePages.push(insideArticles.slice(i, i + 2));
  }

  return (
    <div id="magazine-print-root" className="bg-white text-slate-900 print:text-black">
      {/* Print-specific style rules */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 0;
          }
          body {
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            background: #ffffff !important;
          }
          .magazine-page {
            page-break-after: always;
            break-after: page;
            height: 297mm;
            max-height: 297mm;
            box-sizing: border-box;
            overflow: hidden;
            position: relative;
          }
          .no-print {
            display: none !important;
          }
        }
        @media screen {
          .magazine-page {
            width: 210mm;
            min-height: 297mm;
            margin: 0 auto 30px auto;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            position: relative;
            background: #ffffff;
            box-sizing: border-box;
          }
        }
      `}</style>

      {/* ─────────────────────────────────────────────────────────────
          PAGE 1: MAGAZINE COVER PAGE
         ───────────────────────────────────────────────────────────── */}
      <div className="magazine-page flex flex-col justify-between p-10 sm:p-14 bg-gradient-to-b from-[#04281E] via-[#064E3B] to-[#022218] text-white">
        {/* Top Header Bar */}
        <div className="border-b border-emerald-500/30 pb-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center p-1.5 shadow-md">
                <img
                  src="/images/logo_transparent.png"
                  alt="HealthGhuru"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="text-3xl font-black tracking-tight text-white font-heading">
                  HEALTH<span className="text-orange-500">GHURU</span>
                </span>
                <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-300">
                  Digital Periodical &bull; Medical Digest
                </span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="inline-block bg-orange-500/20 border border-orange-400/40 text-orange-300 text-xs font-bold uppercase px-3 py-1 rounded-full mb-1">
              Official Edition
            </span>
            <div className="text-xs font-semibold text-emerald-200 uppercase tracking-wider">
              {monthName.toUpperCase()} {year} &bull; {issueVolume}
            </div>
          </div>
        </div>

        {/* Cover Central Story */}
        <div className="my-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs font-bold uppercase tracking-wider">
            <span>Special Monthly Feature</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold leading-[1.12] tracking-tight text-white font-heading">
            {issueTitle}
          </h1>

          {coverArticle && (
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row gap-6 items-center">
                {coverArticle.image_url ? (
                  <div className="w-full sm:w-48 h-36 rounded-xl overflow-hidden bg-emerald-900/40 shrink-0 relative">
                    <img
                      src={coverArticle.image_url}
                      alt={coverArticle.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : null}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">
                    {coverArticle.category || 'Clinical Spotlight'}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                    {coverArticle.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-emerald-100/90 line-clamp-2 leading-relaxed">
                    {coverArticle.excerpt || coverArticle.description}
                  </p>
                  <div className="text-[11px] text-emerald-300 font-medium">
                    By {coverArticle.author_name || 'HealthGhuru Medical Board'} &bull; {coverArticle.reading_time || 5} min read
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Key Teasers / In This Issue */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {articles.slice(1, 4).map((art, idx) => (
              <div
                key={art.id || idx}
                className="bg-black/25 border border-white/10 rounded-xl p-3 text-left space-y-1"
              >
                <span className="text-[10px] font-bold text-orange-300 uppercase tracking-wider block">
                  {art.category || 'Wellness'}
                </span>
                <p className="text-xs font-semibold text-white line-clamp-2 leading-snug">
                  {art.title}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Cover Footer */}
        <div className="border-t border-emerald-500/30 pt-4 flex items-center justify-between text-xs text-emerald-300/80">
          <div>
            <span className="font-bold text-white">HealthGhuru Media</span> &bull; Verified Preventive Science
          </div>
          <div>
            Published Month: {monthName} {year} &bull; Total Articles: {articles.length}
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          PAGE 2: TABLE OF CONTENTS & EDITORIAL NOTE
         ───────────────────────────────────────────────────────────── */}
      <div className="magazine-page p-10 sm:p-14 flex flex-col justify-between bg-[#FAFDFB]">
        {/* Top Header */}
        <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-black tracking-tight text-emerald-800">
              HEALTH<span className="text-orange-500">GHURU</span> MAGAZINE
            </span>
          </div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {monthName} {year} &bull; Table of Contents
          </div>
        </div>

        {/* Contents Grid */}
        <div className="my-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Editorial Note (Left Col) */}
          <div className="lg:col-span-5 bg-emerald-50 border border-emerald-200 rounded-2xl p-6 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="inline-block bg-emerald-200 text-emerald-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                Letter from the Editorial Desk
              </span>
              <h3 className="text-xl font-bold text-emerald-950 leading-snug">
                Advancing Preventive Healthcare in {monthName}
              </h3>
              <p className="text-xs text-emerald-900/80 leading-relaxed">
                {editorNote ||
                  `Welcome to the ${monthName} ${year} edition of HealthGhuru Magazine. This issue curates ${articles.length} science-backed reports, physician-reviewed health guidance, and lifestyle breakthroughs published on our platform. From nutritional precision to cardiovascular wellness and mental health, each story is selected to empower proactive health choices.`}
              </p>
              <p className="text-xs text-emerald-900/80 leading-relaxed">
                Every article undergoes clinical editorial fact-checking to ensure our readers receive actionable, trustworthy medical education.
              </p>
            </div>

            <div className="pt-4 border-t border-emerald-200/60 mt-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-black flex items-center justify-center text-xs">
                HG
              </div>
              <div>
                <div className="text-xs font-bold text-emerald-950">HealthGhuru Editorial Board</div>
                <div className="text-[10px] text-emerald-700">Medical Review &amp; Publishing Council</div>
              </div>
            </div>
          </div>

          {/* Table of Contents List (Right Col) */}
          <div className="lg:col-span-7 space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 border-b pb-1.5">
              Index of Articles in This Issue ({articles.length})
            </h4>

            <div className="space-y-2.5 max-h-[500px] overflow-hidden">
              {articles.slice(0, 10).map((art, idx) => (
                <div
                  key={art.id || idx}
                  className="flex items-start justify-between gap-4 border-b border-slate-100 pb-2 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-orange-600 uppercase">
                        {art.category || 'Feature'}
                      </span>
                      <span className="text-slate-300">&bull;</span>
                      <span className="text-[10px] text-slate-500">
                        {new Date(art.published_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </span>
                    </div>
                    <div className="font-bold text-slate-800 line-clamp-1">{art.title}</div>
                    <div className="text-[11px] text-slate-500 line-clamp-1">
                      By {art.author_name || 'Staff Editor'} &bull; {art.reading_time || 4} min read
                    </div>
                  </div>
                  <div className="font-mono font-bold text-emerald-700 text-xs shrink-0">
                    p. {Math.floor(idx / 2) + 3}
                  </div>
                </div>
              ))}
            </div>

            {articles.length > 10 && (
              <p className="text-[10px] text-slate-400 italic pt-1">
                + {articles.length - 10} additional verified clinical reports in this digital volume.
              </p>
            )}
          </div>
        </div>

        {/* Page Footer */}
        <div className="border-t border-slate-200 pt-3 flex items-center justify-between text-xs text-slate-400">
          <span>HealthGhuru Digital Magazine</span>
          <span className="font-mono font-bold text-slate-700">Page 2</span>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          PAGES 3+: ARTICLE SPREADS (2 articles per page)
         ───────────────────────────────────────────────────────────── */}
      {articlePages.map((pagePair, pageIdx) => {
        const pageNumber = pageIdx + 3;

        return (
          <div
            key={`page-${pageIdx}`}
            className="magazine-page p-10 sm:p-14 flex flex-col justify-between bg-white"
          >
            {/* Page Header */}
            <div className="border-b border-slate-200 pb-3 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2 font-bold text-emerald-800">
                <span>HEALTHGHURU MONTHLY</span>
                <span className="text-slate-300">&bull;</span>
                <span className="text-slate-500 font-normal">
                  {monthName} {year} &bull; Clinical Articles
                </span>
              </div>
              <span className="font-mono font-bold text-slate-700">Page {pageNumber}</span>
            </div>

            {/* Articles Stack (2 per page) */}
            <div className="my-auto space-y-8">
              {pagePair.map((art, aIdx) => (
                <div
                  key={art.id || aIdx}
                  className="space-y-3 pb-6 border-b border-slate-100 last:border-b-0 last:pb-0"
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-block bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full">
                      {art.category || 'General Health'}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Published: {new Date(art.published_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug tracking-tight font-heading">
                    {art.title}
                  </h3>

                  <div className="flex items-center gap-3 text-xs text-slate-500 pb-1">
                    <span className="font-semibold text-slate-700">By {art.author_name || 'HealthGhuru Medical Team'}</span>
                    <span>&bull;</span>
                    <span>{art.reading_time || 4} min read</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start">
                    {art.image_url ? (
                      <div className="sm:col-span-4 h-32 rounded-xl overflow-hidden bg-slate-100 relative shrink-0">
                        <img
                          src={art.image_url}
                          alt={art.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : null}

                    <div className={art.image_url ? 'sm:col-span-8 space-y-2' : 'sm:col-span-12 space-y-2'}>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed line-clamp-4">
                        {art.excerpt || art.description || 'Verified evidence-based healthcare insights published on HealthGhuru. Consult licensed practitioners for personalized clinical interventions.'}
                      </p>

                      <div className="bg-slate-50 border-l-3 border-emerald-500 p-2.5 rounded-r-lg">
                        <span className="text-[11px] font-bold text-emerald-900 block mb-0.5">Key Health Takeaway:</span>
                        <p className="text-[11px] text-slate-600 line-clamp-2">
                          Consistent, preventative habits and professional consultation form the foundation of sustainable well-being.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Page Footer */}
            <div className="border-t border-slate-200 pt-3 flex items-center justify-between text-xs text-slate-400">
              <span>HealthGhuru &bull; {monthName} {year} Edition</span>
              <span className="font-mono font-bold text-slate-700">Page {pageNumber}</span>
            </div>
          </div>
        );
      })}

      {/* ─────────────────────────────────────────────────────────────
          FINAL PAGE: BACK COVER
         ───────────────────────────────────────────────────────────── */}
      <div className="magazine-page p-10 sm:p-14 flex flex-col justify-between bg-gradient-to-b from-slate-900 via-[#064E3B] to-slate-950 text-white">
        {/* Top Branding */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-white mx-auto flex items-center justify-center p-2 shadow-lg mb-3">
            <img
              src="/images/logo_transparent.png"
              alt="HealthGhuru"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-3xl font-black tracking-tight text-white font-heading">
            HEALTH<span className="text-orange-500">GHURU</span>
          </span>
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-300 font-semibold">
            Live Better &bull; Feel Stronger &bull; Every Day
          </p>
        </div>

        {/* Center Backcover Content */}
        <div className="my-auto max-w-lg mx-auto text-center space-y-6">
          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-white">
              Your Daily Partner in Evidence-Based Health
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
              HealthGhuru publishes verified clinical reports, medical breakthroughs, preventive wellness protocols, and digital periodicals designed to bridge the gap between complex science and daily living.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 space-y-3">
            <div className="text-xs font-bold text-orange-400 uppercase tracking-wider">
              Digital Periodical Archive Access
            </div>
            <p className="text-xs text-emerald-100">
              Subscribers enjoy unlimited access to full-issue PDF downloads, digital flipbooks, and searchable medical archives.
            </p>
            <div className="text-xs font-mono font-bold text-emerald-200">
              www.healthghuru.com/magazines
            </div>
          </div>

          <div className="pt-2 text-[11px] text-slate-300/80 space-y-1">
            <p>
              <strong>Medical Disclaimer:</strong> The articles in this magazine are intended for informational and educational purposes only and do not constitute medical diagnosis or treatment advice.
            </p>
          </div>
        </div>

        {/* Back Cover Footer */}
        <div className="border-t border-emerald-500/30 pt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-emerald-300/70 gap-2">
          <div>&copy; {year} HealthGhuru Publishing Network. All rights reserved.</div>
          <div className="font-mono text-[11px]">ISSN 2841-9214 &bull; {monthName} {year}</div>
        </div>
      </div>
    </div>
  );
}
