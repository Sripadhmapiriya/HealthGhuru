import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  getSponsoredArticleBySlug,
  getRelatedSponsoredArticles,
  getEditorialHealthArticles,
  getTrendingHealthEditorial,
} from '@/lib/sponsored/db';
import { SponsoredBadge } from '@/components/sponsored/SponsoredBadge';
import { SponsorInfoBox } from '@/components/sponsored/SponsorInfoBox';
import { MedicalReviewerBadge } from '@/components/sponsored/MedicalReviewerBadge';
import { MedicalDisclaimerBox } from '@/components/sponsored/MedicalDisclaimerBox';
import { SponsoredTracker } from '@/components/sponsored/SponsoredTracker';
import { SponsoredEditorialSidebar } from '@/components/sponsored/SponsoredEditorialSidebar';
import {
  Calendar,
  Clock,
  Share2,
  Bookmark,
  Building2,
  User,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getSponsoredArticleBySlug(slug);

  if (!article) {
    return {
      title: 'Article Not Found | HealthGhuru',
      description: 'The requested sponsored healthcare story could not be found.',
    };
  }

  const title = article.seo_title || `${article.title} | ${article.sponsor_name || 'HealthGhuru Partner'}`;
  const description = article.seo_description || article.excerpt;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      images: article.featured_image ? [article.featured_image] : [],
      publishedTime: article.published_at || undefined,
    },
    alternates: {
      canonical: `/sponsored-articles/${article.slug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function SponsoredArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getSponsoredArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  // Related sponsored and editorial content concurrently
  const [relatedSponsored, relatedEditorial, trendingSidebar, mostReadSidebar] = await Promise.all([
    getRelatedSponsoredArticles(article.category, article.id, 3),
    getEditorialHealthArticles(article.category, 3),
    getTrendingHealthEditorial(5),
    getEditorialHealthArticles(undefined, 5),
  ]);

  const publishedDate = article.published_at
    ? new Date(article.published_at).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '';

  const isDoctor = article.sponsor_type === 'DOCTOR';

  // Article JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: article.featured_image,
    datePublished: article.published_at,
    author: {
      '@type': 'Organization',
      name: article.author_name || 'HealthGhuru Partner Team',
    },
    sponsor: {
      '@type': isDoctor ? 'Person' : 'Organization',
      name: article.sponsor_name,
      url: article.sponsor_website,
    },
    publisher: {
      '@type': 'Organization',
      name: 'HealthGhuru',
      url: 'https://healthghuru.com',
    },
    isAccessibleForFree: true,
  };

  return (
    <div className="min-h-screen bg-[#F5FAF5]">
      {/* JSON-LD Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Analytics view tracker */}
      <SponsoredTracker
        articleId={article.id}
        campaignId={article.campaign_id}
        sponsorId={article.sponsor_id}
      />

      <main className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        
        {/* ── Breadcrumb Navigation ── */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-gray-500 mb-6 flex-wrap font-heading">
          <Link href="/" className="hover:text-[#16A34A] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/sponsored-articles" className="hover:text-[#16A34A] transition-colors font-medium">
            Sponsored Articles
          </Link>
          <span>/</span>
          <span className="text-[#16A34A] font-bold">{article.category}</span>
          <span>/</span>
          <span className="text-gray-400 truncate max-w-[200px] sm:max-w-xs">{article.title}</span>
        </nav>

        {/* ── 2-Column Editorial Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Main Article Content Column (Cols 1 to 8) */}
          <article className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-10 border border-emerald-100 shadow-xs">
            
            {/* Top Sponsor Identification Banner */}
            <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 mb-6 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <SponsoredBadge label={article.sponsored_label || 'SPONSORED'} size="md" />
                <div className="text-xs">
                  <span className="text-gray-500 font-medium mr-1">Health Partner:</span>
                  <strong className="font-heading font-bold text-gray-900">
                    {article.sponsor_name || 'Healthcare Partner'}
                  </strong>
                  {article.sponsor_verified && (
                    <span className="inline-flex items-center gap-1 ml-2 text-blue-600 font-semibold text-[11px]">
                      <CheckCircle2 size={12} />
                      Verified
                    </span>
                  )}
                </div>
              </div>

              <span className="text-[10px] font-mono font-bold bg-white text-emerald-800 px-2.5 py-1 rounded-md border border-emerald-200 uppercase">
                {article.category}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl md:text-4xl text-gray-900 leading-tight tracking-tight mb-4">
              {article.title}
            </h1>

            {/* Subheadline / Lead Excerpt */}
            {article.excerpt && (
              <p className="text-base sm:text-lg text-gray-700 font-normal leading-relaxed border-l-4 border-[#f06d2f] pl-4 py-1 italic mb-6 bg-orange-50/30 rounded-r-lg">
                {article.excerpt}
              </p>
            )}

            {/* Hero Image */}
            {article.featured_image && (
              <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-emerald-50 mb-6 border border-emerald-100">
                <Image
                  src={article.featured_image}
                  alt={article.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
              </div>
            )}

            {/* Medical Reviewer & Author Credentials Strip */}
            <MedicalReviewerBadge
              authorName={article.author_name}
              authorTitle={article.author_title || undefined}
              reviewerName={article.medical_reviewer_name}
              reviewerCredentials={article.medical_reviewer_credentials}
              reviewedDate={article.reviewed_at}
            />

            {/* Secondary Metadata & Actions Strip */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-3 mb-8 border-t border-b border-gray-100 text-xs text-gray-500 font-medium">
              <div className="flex items-center gap-4">
                {publishedDate && (
                  <span className="flex items-center gap-1.5 font-mono">
                    <Calendar size={13} className="text-gray-400" />
                    <span>{publishedDate}</span>
                  </span>
                )}
                <span className="flex items-center gap-1 font-mono">
                  <Clock size={13} className="text-gray-400" />
                  <span>{article.reading_time || 5} min read</span>
                </span>
              </div>

              {/* Share & Save Placeholders */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Share article"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Share2 size={13} />
                  <span>Share</span>
                </button>
                <button
                  type="button"
                  aria-label="Save article"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Bookmark size={13} />
                  <span>Save</span>
                </button>
              </div>
            </div>

            {/* ── ARTICLE CONTENT BODY ── */}
            <div className="prose prose-emerald max-w-none text-gray-800 text-base leading-relaxed space-y-6">
              {article.content ? (
                // Parse markdown-style headers, paragraphs, lists, and quotes
                article.content.split('\n\n').map((block, idx) => {
                  if (block.startsWith('## ')) {
                    return (
                      <h2 key={idx} className="font-heading font-bold text-xl sm:text-2xl text-gray-900 mt-8 mb-3">
                        {block.replace('## ', '')}
                      </h2>
                    );
                  }
                  if (block.startsWith('### ')) {
                    return (
                      <h3 key={idx} className="font-heading font-bold text-lg text-gray-900 mt-6 mb-2">
                        {block.replace('### ', '')}
                      </h3>
                    );
                  }
                  if (block.startsWith('> ')) {
                    return (
                      <blockquote key={idx} className="border-l-4 border-[#16A34A] bg-emerald-50/50 p-4 rounded-r-xl italic my-6 text-gray-700">
                        {block.replace(/> /g, '')}
                      </blockquote>
                    );
                  }
                  if (block.startsWith('* ') || block.startsWith('- ')) {
                    const items = block.split('\n');
                    return (
                      <ul key={idx} className="list-disc list-inside space-y-2 my-4 pl-2 text-gray-700">
                        {items.map((item, i) => (
                          <li key={i} className="leading-relaxed">
                            {item.replace(/^[*|-]\s+/, '')}
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  if (/^\d+\.\s/.test(block)) {
                    const items = block.split('\n');
                    return (
                      <ol key={idx} className="list-decimal list-inside space-y-2 my-4 pl-2 text-gray-700">
                        {items.map((item, i) => (
                          <li key={i} className="leading-relaxed">
                            {item.replace(/^\d+\.\s+/, '')}
                          </li>
                        ))}
                      </ol>
                    );
                  }
                  return (
                    <p key={idx} className="leading-relaxed text-gray-700">
                      {block}
                    </p>
                  );
                })
              ) : (
                <p className="text-gray-600">Full partner article content is being prepared.</p>
              )}
            </div>

            {/* ── ABOUT THE SPONSOR BOX ── */}
            <SponsorInfoBox article={article} />

            {/* ── RELATED HEALTH CONTENT ── */}
            <section className="my-10 pt-8 border-t border-emerald-100" aria-labelledby="related-heading">
              <div className="flex items-center gap-2 mb-6">
                <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A]" />
                <h3 id="related-heading" className="font-heading font-bold text-lg text-gray-900">
                  RELATED HEALTH STORIES
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Related Sponsored */}
                {relatedSponsored.slice(0, 2).map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/sponsored-articles/${rel.slug}`}
                    className="p-4 rounded-xl border border-orange-200/80 bg-orange-50/20 hover:bg-orange-50/50 transition-colors group block"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-mono font-bold bg-[#f06d2f] text-white px-2 py-0.5 rounded-full uppercase">
                        SPONSORED
                      </span>
                      <span className="text-xs text-gray-500 font-medium truncate">
                        {rel.sponsor_name}
                      </span>
                    </div>
                    <h4 className="font-heading font-bold text-sm text-gray-900 group-hover:text-[#16A34A] transition-colors line-clamp-2 mb-1">
                      {rel.title}
                    </h4>
                    <span className="text-xs font-heading font-semibold text-[#f06d2f] inline-flex items-center gap-1 mt-2">
                      <span>Read Story</span>
                      <ArrowRight size={12} />
                    </span>
                  </Link>
                ))}

                {/* Related Editorial */}
                {relatedEditorial.slice(0, 2).map((rel: any) => (
                  <Link
                    key={rel.id}
                    href={`/article/${rel.slug}`}
                    className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/20 hover:bg-emerald-50/50 transition-colors group block"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-mono font-bold bg-[#16A34A] text-white px-2 py-0.5 rounded-full uppercase">
                        EDITORIAL
                      </span>
                      <span className="text-xs text-[#16A34A] font-bold">
                        {rel.category}
                      </span>
                    </div>
                    <h4 className="font-heading font-bold text-sm text-gray-900 group-hover:text-[#16A34A] transition-colors line-clamp-2 mb-1">
                      {rel.title}
                    </h4>
                    <span className="text-xs font-heading font-semibold text-[#16A34A] inline-flex items-center gap-1 mt-2">
                      <span>Read Independent Story</span>
                      <ArrowRight size={12} />
                    </span>
                  </Link>
                ))}
              </div>
            </section>

            {/* ── MEDICAL DISCLAIMER ── */}
            <MedicalDisclaimerBox sponsorName={article.sponsor_name} />

          </article>

          {/* Right Column: Editorial Sidebar (Cols 9 to 12) */}
          <div className="lg:col-span-4">
            <SponsoredEditorialSidebar
              trendingItems={trendingSidebar as any[]}
              mostReadItems={mostReadSidebar as any[]}
            />
          </div>

        </div>

      </main>
    </div>
  );
}
