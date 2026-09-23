/* eslint-disable @next/next/no-img-element */
/* eslint-disable @next/next/no-page-custom-font */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';

interface MagazineArticle {
  id: string;
  title: string;
  slug: string;
  content_type?: string;
  category: string;
  author_name: string;
  author_credential?: string | null;
  image_url: string | null;
  excerpt: string | null;
  description: string | null;
  reading_time: number | null;
  published_at: string;
  article_blocks?: any[] | null;
  raw_metadata?: any;
  source_name?: string | null;
}

interface MagazinePrintViewProps {
  year: number;
  month: number;
  monthName: string;
  issueVolume: string;
  issueTitle: string;
  editorNote?: string;
  articles: MagazineArticle[];
  coverageText?: string;
  isMidMonth?: boolean;
}

function decodeHtml(html: string): string {
  if (!html) return '';
  return html
    .replace(/&#038;/g, '&')
    .replace(/&amp;/g, '&')
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&quot;/g, '"')
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ');
}

/**
 * Paragraph extractor:
 * Extracts clean, readable paragraphs from blocks or descriptions.
 */
function getArticleParagraphs(article: MagazineArticle, maxCharsPerPara = 500): string[] {
  // If article has structured blocks from articles table
  if (Array.isArray(article.article_blocks) && article.article_blocks.length > 0) {
    const texts = article.article_blocks
      .map((b: any) => (typeof b === 'string' ? b : b.text || ''))
      .filter((t: string) => t && t.trim().length > 0);
    if (texts.length > 0) return texts.map(decodeHtml);
  }

  const rawText = article.description || article.excerpt || '';
  if (!rawText || rawText.trim().length === 0) {
    return ['Verified evidence-based clinical guidance published by HealthGhuru Medical Bureau.'];
  }

  // Parse if JSON stringified
  if (rawText.startsWith('[') || rawText.startsWith('{')) {
    try {
      const parsed = JSON.parse(rawText);
      if (Array.isArray(parsed)) {
        const texts = parsed
          .map((b: any) => (typeof b === 'string' ? b : b.text || ''))
          .filter((t: string) => t && t.trim().length > 0);
        if (texts.length > 0) return texts.map(decodeHtml);
      }
    } catch {
      // Continue to plain text splitting
    }
  }

  // Split on double newlines
  const initialParas = rawText
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  if (initialParas.length >= 2) {
    return initialParas.map(decodeHtml);
  }

  // Split dense single blocks into readable editorial paragraphs
  const refined: string[] = [];
  for (const p of initialParas) {
    if (p.length > maxCharsPerPara) {
      const sentences = p.match(/[^.!?]+[.!?]+(\s+|$)/g) || [p];
      let currentChunk = '';

      for (const s of sentences) {
        if ((currentChunk + s).length > maxCharsPerPara && currentChunk.length >= 250) {
          refined.push(decodeHtml(currentChunk.trim()));
          currentChunk = s;
        } else {
          currentChunk += s;
        }
      }
      if (currentChunk.trim().length > 0) {
        refined.push(decodeHtml(currentChunk.trim()));
      }
    } else {
      refined.push(decodeHtml(p));
    }
  }

  return refined.length > 0 ? refined : [decodeHtml(rawText)];
}

export function MagazinePrintView({
  year,
  monthName,
  issueVolume,
  issueTitle,
  articles,
  coverageText,
  isMidMonth,
}: MagazinePrintViewProps) {
  const fallbackImage = '/images/sample-hospital-1.jpg';

  // 1. Identify Hero Cover Article (first article with an image)
  const coverArticle = articles.find((a) => a.image_url) || articles[0];
  const coverHighlights = articles.filter((a) => a.id !== coverArticle?.id).slice(0, 3);

  return (
    <div className="w-full flex flex-col items-center">
      {/* ─────────────────────────────────────────────────────────────
          PAGE 1: PROFESSIONAL MAGAZINE FRONT COVER (IN FOOTER COLOR #CBF2DB)
         ───────────────────────────────────────────────────────────── */}
      <div className="magazine-cover magazine-page-mint border-b-4 border-[#044E3B] text-slate-900 select-none">
        {/* Masthead Header */}
        <div className="space-y-3 pb-3 border-b-2 border-emerald-900/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white p-1.5 shadow-sm border border-emerald-300/80 flex items-center justify-center shrink-0">
                <img
                  src="/images/logo_transparent.png"
                  alt="HealthGhuru"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="text-3xl sm:text-4xl font-black tracking-tight text-[#044E3B] font-editorial-heading">
                  HEALTH<span className="text-[#f06d2f]">GHURU</span>
                </span>
                <span className="block text-[10px] font-extrabold uppercase tracking-[0.28em] text-emerald-800">
                  Digital Periodical &bull; Medical Digest
                </span>
              </div>
            </div>

            <div className="text-right space-y-0.5">
              <span className="inline-block bg-[#16A34A] text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider shadow-2xs">
                Official Monthly Periodical
              </span>
              <div className="text-[11px] font-bold text-emerald-950 uppercase tracking-wider">
                {issueVolume} &bull; {monthName} {year}
              </div>
            </div>
          </div>

          {/* Dynamic Coverage Ribbon (Day 1 to Current / Full Month) */}
          <div className="py-1 px-3 rounded-lg bg-emerald-800/10 border border-emerald-600/30 flex items-center justify-between text-[11px] font-semibold text-emerald-950">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>
                {coverageText || (isMidMonth ? `Compiled Through ${monthName} ${year}` : `Complete ${monthName} ${year} Edition`)}
              </span>
            </div>
            <div className="font-mono text-[10px] text-emerald-800 uppercase tracking-widest">
              ISSN 2831-9042 &bull; Evidence-Based
            </div>
          </div>
        </div>

        {/* Hero Cover Story Centerpiece */}
        {coverArticle ? (
          <div className="my-auto space-y-3">
            {/* Feature Label & Category */}
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded bg-[#044E3B] text-white text-[10px] font-black uppercase tracking-wider shadow-2xs">
                Special Cover Feature
              </span>
              <span className="px-2.5 py-0.5 rounded bg-orange-100 text-orange-900 border border-orange-300 text-[10px] font-bold uppercase tracking-wider">
                {coverArticle.category || 'Clinical Spotlight'}
              </span>
            </div>

            {/* Bold Headline */}
            <h1 className="text-3xl sm:text-4xl font-black leading-[1.12] tracking-tight text-[#044E3B] font-editorial-heading">
              {decodeHtml(coverArticle.title)}
            </h1>

            {/* Subtitle / Lead Excerpt in Normal Font */}
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal line-clamp-2">
              {decodeHtml(coverArticle.excerpt || coverArticle.description || '')}
            </p>

            {/* Byline */}
            <div className="text-xs text-slate-700 font-medium flex items-center gap-2">
              <span className="font-bold text-slate-900">
                By {coverArticle.author_name || 'HealthGhuru Medical Board'}
              </span>
              <span>&bull;</span>
              <span>{coverArticle.reading_time || 5} min read</span>
            </div>

            {/* Hero Image Container: Complete Non-Cropped Display */}
            {coverArticle.image_url ? (
              <div className="magazine-img-container w-full my-2 flex justify-center items-center bg-white/70 p-2 rounded-xl border border-emerald-400/40 shadow-sm max-h-[290px] overflow-hidden">
                <img
                  src={coverArticle.image_url}
                  alt={coverArticle.title}
                  className="max-h-[270px] w-auto max-w-full object-contain rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = fallbackImage;
                  }}
                />
              </div>
            ) : null}
          </div>
        ) : (
          <div className="my-auto text-center p-8 bg-white/60 rounded-2xl border border-emerald-300">
            <h2 className="text-3xl font-black text-[#044E3B] font-editorial-heading">
              {issueTitle}
            </h2>
            <p className="text-sm text-slate-700 mt-2">
              Official Monthly Health Periodical
            </p>
          </div>
        )}

        {/* Bottom Section: Feature Highlights & Professional Barcode Block */}
        <div className="space-y-3 pt-2 border-t-2 border-emerald-900/20">
          {/* Inside This Issue Highlights */}
          {coverHighlights.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-[10px] font-black uppercase tracking-wider text-emerald-900 flex items-center justify-between">
                <span>Featured Inside This Issue</span>
                <span className="text-[9px] text-emerald-700 font-semibold">{articles.length} Reports Total</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {coverHighlights.map((art, idx) => (
                  <div
                    key={art.id || idx}
                    className="bg-white/80 border border-emerald-500/30 rounded-lg p-2.5 text-left space-y-1 shadow-2xs"
                  >
                    <span className="text-[9px] font-bold text-orange-600 uppercase tracking-wider block">
                      {art.category || 'Report'}
                    </span>
                    <h4 className="text-[11px] font-bold text-slate-900 line-clamp-2 leading-snug font-editorial-heading">
                      {decodeHtml(art.title)}
                    </h4>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Publisher Accreditation, Barcode & Seal */}
          <div className="flex items-center justify-between text-[10px] text-emerald-950 font-medium pt-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#044E3B]">HealthGhuru Publishing Bureau</span>
              <span>&bull;</span>
              <span>Chennai, India</span>
              <span>&bull;</span>
              <span className="font-mono">healthghuru.com</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-mono text-[9px] bg-white/90 px-2 py-0.5 rounded border border-emerald-300 font-bold">
                ISSN 2831-9042
              </span>
              <span className="font-black text-[#16A34A] uppercase tracking-wider text-[9px]">
                Complimentary Issue
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          MAGAZINE CONTENT: CONTINUOUS GAPLESS EDITORIAL STREAM
          No artificial filler pages • No giant empty spaces • No repeated headings
          Pure continuity with bold headings, normal body fonts, non-cropped images
         ───────────────────────────────────────────────────────────── */}
      <div className="magazine-content-flow bg-white">
        {/* Running Editorial Header */}
        <div className="border-b-2 border-emerald-900/20 pb-3 mb-6 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2 font-bold text-[#044E3B] tracking-wide uppercase text-[11px]">
            <span className="font-extrabold tracking-wider">HEALTHGHURU CLINICAL REPORTS</span>
            <span className="text-emerald-400">&bull;</span>
            <span className="text-slate-600 font-semibold">{monthName} {year}</span>
            <span className="text-emerald-400">&bull;</span>
            <span className="text-emerald-800 font-bold">
              {coverageText || `Complete Monthly Edition`}
            </span>
          </div>
          <span className="font-mono font-bold text-[#044E3B] bg-emerald-50 px-2.5 py-0.5 rounded text-[11px] border border-emerald-200">
            {articles.length} Published Reports
          </span>
        </div>

        {/* Continuous Stream of All Articles */}
        <div className="space-y-6">
          {articles.map((art, idx) => {
            const paragraphs = getArticleParagraphs(art);

            return (
              <article
                key={art.id || idx}
                className="magazine-article pb-6 border-b border-slate-200/90 last:border-b-0 last:pb-0"
              >
                {/* Category Badge & Published Date */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-block bg-[#044E3B] text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded shadow-2xs">
                      {art.category || 'Clinical Guidance'}
                    </span>
                    {art.content_type && (
                      <span className="inline-block bg-orange-100 text-orange-900 border border-orange-300 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                        {art.content_type === 'news'
                          ? 'Medical News'
                          : art.content_type === 'health_tip'
                          ? 'Health Tip'
                          : 'Clinical Article'}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {new Date(art.published_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                {/* Bold Headline (ONLY RENDERED ONCE PER ARTICLE!) */}
                <h2 className="text-xl sm:text-2xl font-black text-[#044E3B] leading-[1.22] tracking-tight font-editorial-heading mb-1.5">
                  {decodeHtml(art.title)}
                </h2>

                {/* Author Byline */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 mb-3 pb-2 border-b border-slate-100">
                  <span className="font-bold text-slate-900">
                    By {art.author_name || 'HealthGhuru Medical Bureau'}
                    {art.author_credential ? `, ${art.author_credential}` : ''}
                  </span>
                  <span>&bull;</span>
                  <span>{art.reading_time || 4} min read</span>
                  {art.source_name && (
                    <>
                      <span>&bull;</span>
                      <span className="text-[#044E3B] font-semibold">Source: {art.source_name}</span>
                    </>
                  )}
                </div>

                {/* Full Non-Cropped Adaptive Image (Natural Aspect) */}
                {art.image_url ? (
                  <div className="magazine-img-container w-full my-3 flex justify-center items-center bg-slate-50 p-2 rounded-xl border border-slate-200 shadow-2xs max-h-[300px] overflow-hidden">
                    <img
                      src={art.image_url}
                      alt={art.title}
                      className="max-h-[280px] w-auto max-w-full object-contain rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = fallbackImage;
                      }}
                    />
                  </div>
                ) : null}

                {/* Full Body Content in Normal Font Weight */}
                <div className="text-slate-800 text-[13px] leading-[1.7] font-normal space-y-2.5">
                  {paragraphs.map((p, pIdx) => (
                    <p key={pIdx} className="text-justify font-normal">
                      {pIdx === 0 ? (
                        <>
                          <span className="float-left text-3xl font-black text-[#044E3B] mr-2 leading-none font-editorial-heading">
                            {p.charAt(0)}
                          </span>
                          {p.slice(1)}
                        </>
                      ) : (
                        p
                      )}
                    </p>
                  ))}
                </div>

                {/* Key Clinical Takeaway / Excerpt Box */}
                <div className="bg-emerald-50/80 border-l-4 border-[#044E3B] p-3 rounded-r-xl mt-3 shadow-2xs">
                  <div className="text-[11px] font-bold text-[#044E3B] uppercase tracking-wider mb-0.5">
                    ✦ Clinical Takeaway
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-normal">
                    {decodeHtml(
                      art.excerpt ||
                        'Consult qualified healthcare professionals for diagnosis and personalized guidance.'
                    )}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          FINAL PAGE: PROFESSIONAL MAGAZINE BACK COVER (IN FOOTER COLOR #CBF2DB)
         ───────────────────────────────────────────────────────────── */}
      <div className="magazine-backcover magazine-page-mint border-t-4 border-[#16A34A] text-slate-900 select-none">
        {/* Top Branding Section */}
        <div className="text-center space-y-2 pb-4 border-b-2 border-emerald-900/20">
          <div className="w-14 h-14 rounded-2xl bg-white mx-auto flex items-center justify-center p-2 shadow-sm border border-emerald-300/80 mb-2">
            <img
              src="/images/logo_transparent.png"
              alt="HealthGhuru"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-3xl sm:text-4xl font-black tracking-tight text-[#044E3B] font-editorial-heading">
            HEALTH<span className="text-[#f06d2f]">GHURU</span>
          </span>
          <p className="text-xs uppercase tracking-[0.28em] text-emerald-900 font-bold">
            Live Better &bull; Feel Stronger &bull; Every Day
          </p>
        </div>

        {/* Center Backcover Content Card */}
        <div className="my-auto max-w-xl mx-auto w-full space-y-4">
          <div className="bg-white/85 border border-emerald-400/50 rounded-2xl p-6 sm:p-7 space-y-4 shadow-sm">
            {/* Brand Manifesto */}
            <div className="space-y-1.5 text-center">
              <h3 className="text-xl sm:text-2xl font-black text-[#044E3B] font-editorial-heading">
                Your Trusted Journal in Clinical Truth
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                Honest health news, reliable medical information. We bring you every story for your wellbeing. HealthGhuru publishes verified clinical reports, medical investigations, preventive protocols, and monthly digests designed to bridge the gap between medical science and patient wellness.
              </p>
            </div>

            {/* Monthly Compilation Metrics */}
            <div className="grid grid-cols-2 gap-3 py-3 border-y border-emerald-200/80 text-center">
              <div className="bg-emerald-50/70 p-2.5 rounded-lg">
                <div className="text-2xl font-black text-[#044E3B] font-mono">{articles.length}</div>
                <div className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider">Reports Curated</div>
              </div>
              <div className="bg-emerald-50/70 p-2.5 rounded-lg">
                <div className="text-2xl font-black text-[#16A34A] font-mono">100%</div>
                <div className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider">Fact-Checked</div>
              </div>
            </div>

            {/* Digital Periodical Archive Access */}
            <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/60 text-center space-y-1">
              <div className="text-xs font-black text-[#044E3B] uppercase tracking-wider">
                Digital Periodical Archive Access
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed font-normal">
                Subscribers enjoy full-issue PDF downloads, digital flipbooks, and searchable medical archives across all published editions.
              </p>
              <div className="text-xs font-mono font-bold text-emerald-700">
                www.healthghuru.com/magazines
              </div>
            </div>

            {/* Medical Disclaimer */}
            <div className="text-[10px] text-slate-600 leading-relaxed space-y-1 pt-1 border-t border-slate-100">
              <p>
                <strong>Medical Disclaimer:</strong> The articles published in this magazine are intended strictly for educational and informational purposes and do not constitute clinical diagnosis, personalized medical advice, or treatment regimens. Always consult certified healthcare practitioners for individual medical concerns.
              </p>
            </div>
          </div>
        </div>

        {/* Back Cover Footer */}
        <div className="border-t-2 border-emerald-900/20 pt-3 flex flex-col sm:flex-row items-center justify-between text-xs text-emerald-950 font-medium gap-2">
          <div>
            &copy; {year} HealthGhuru Publishing Network. All rights reserved.
          </div>
          <div className="font-mono text-[11px] flex items-center gap-2">
            <span>Chennai, Tamil Nadu, India</span>
            <span>&bull;</span>
            <span>ISSN 2831-9042</span>
          </div>
        </div>
      </div>
    </div>
  );
}
