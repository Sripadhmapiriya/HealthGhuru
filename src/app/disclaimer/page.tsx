/* eslint-disable @typescript-eslint/no-explicit-any */
import { Metadata } from 'next';
import Link from 'next/link';
import {
  AlertTriangle,
  ShieldCheck,
  Clock,
  PhoneCall,
  ArrowLeft,
  Share2,
  Printer,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { sql } from '@/lib/db';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Medical Disclaimer | HealthGhuru — Evidence-Based Intelligence',
  description:
    'Crucial medical disclaimer regarding educational content, doctor-patient relationships, and emergency healthcare contacts.',
};

export default async function DisclaimerPage() {
  let pageData: any = null;
  try {
    const rows = await sql`
      SELECT slug, title, subtitle, content, meta_description, updated_at
      FROM website_pages
      WHERE slug = 'disclaimer'
      LIMIT 1
    `;
    if (rows.length > 0) {
      pageData = rows[0];
    }
  } catch (err) {
    console.error('Error loading disclaimer page from database:', err);
  }

  const title = pageData?.title || 'Medical & Clinical Disclaimer';
  const lastUpdated = pageData?.updated_at
    ? new Date(pageData.updated_at).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'September 2026';

  const contentHtml =
    pageData?.content ||
    `<h2>Medical & Clinical Advice Disclaimer</h2>
<p class="highlight"><strong>IMPORTANT NOTICE:</strong> HealthGhuru is an educational digital media portal. The content provided on this website is NOT intended to be a substitute for professional medical advice, clinical diagnosis, or medical treatment.</p>
<h3>1. No Doctor-Patient Relationship</h3>
<p>Viewing articles, utilizing health calculators, reading clinical summaries, or contacting HealthGhuru staff does not establish a doctor-patient relationship. Always seek the direct guidance of your physician, licensed specialist, or qualified health practitioner with any questions you may have regarding symptoms, medications, or therapeutic regimens.</p>
<h3>2. Do Not Delay Seeking Care</h3>
<p>Never disregard professional medical advice or delay seeking clinical attention because of something you have read, watched, or calculated on HealthGhuru.</p>
<h3>3. Immediate Medical Emergencies</h3>
<p>If you believe you or someone in your care may be experiencing a medical emergency (such as severe chest pain, acute shortness of breath, signs of stroke, severe allergic reaction, or sudden trauma):</p>
<ul>
  <li><strong>Immediately call your local emergency medical services (112 / 911 / 108).</strong></li>
  <li>Proceed immediately to the nearest hospital emergency department or urgent care facility.</li>
  <li>Do not rely on digital media or wait for online responses in acute health emergencies.</li>
</ul>`;

  return (
    <div className="bg-[#FAFDF9] min-h-screen text-dark relative selection:bg-primary/20 selection:text-primary-dark">
      {/* Hero Header Area */}
      <header className="border-b border-primary/10 bg-white/80 backdrop-blur-md pt-8 pb-10 sm:py-12">
        <div className="site-container max-w-5xl 2xl:max-w-6xl">
          {/* Breadcrumb & Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-primary transition-colors group"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
          </div>

          <ScrollReveal variant="fadeUp">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 text-amber-800 font-heading font-semibold text-xs mb-4">
                <AlertTriangle size={14} className="text-amber-600" />
                <span>Essential Clinical &amp; Legal Notice</span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-dark tracking-tight leading-[1.15] mb-4">
                {title}
              </h1>

              <p className="text-text-secondary text-base sm:text-lg leading-relaxed mb-6">
                HealthGhuru is an educational digital healthcare publication. Please review our clinical policies regarding health guidance and emergency medical procedures.
              </p>

              <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-text-muted font-heading font-medium">
                <span className="flex items-center gap-1.5">
                  <Clock size={14} className="text-primary" /> Last Updated: <strong className="text-dark font-semibold">{lastUpdated}</strong>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-primary" /> Medically Vetted Standards
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <BookOpen size={14} /> Educational Publication
                </span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </header>

      {/* Main Document Content */}
      <div className="site-container max-w-5xl 2xl:max-w-6xl py-10 sm:py-14">
        {/* Emergency Callout Banner */}
        <div className="mb-8 p-6 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-500 text-white shrink-0 mt-0.5">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-amber-950">
                Experiencing an Acute Medical Emergency?
              </h3>
              <p className="text-xs sm:text-sm text-amber-900/80 leading-relaxed mt-0.5">
                Do not wait for online responses. Call your national emergency number (<strong>112 / 911 / 108</strong>) or proceed to the nearest emergency room immediately.
              </p>
            </div>
          </div>
          <a
            href="tel:112"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-heading font-bold shrink-0 transition-colors shadow-xs"
          >
            <PhoneCall size={14} /> Emergency Helpline (112)
          </a>
        </div>

        {/* Paper Document Container */}
        <main className="bg-white rounded-3xl border border-primary/15 shadow-[0_4px_24px_rgba(46,125,50,0.06)] overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-amber-500 to-emerald-600 w-full" />

          <div className="p-6 sm:p-12 lg:p-16">
            <div
              dangerouslySetInnerHTML={{ __html: contentHtml }}
              className="text-slate-700 leading-relaxed text-sm sm:text-base selection:bg-emerald-100 selection:text-emerald-900 prose prose-slate max-w-none
                [&_h1]:font-display [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-slate-900 [&_h1]:mb-4 [&_h1]:mt-6
                [&_h2]:font-heading [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:mb-3 [&_h2]:mt-6
                [&_h3]:font-heading [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-slate-900 [&_h3]:mb-2 [&_h3]:mt-6
                [&_p]:mb-4 [&_p]:text-slate-600 [&_p]:leading-relaxed
                [&_p.highlight]:bg-amber-500/10 [&_p.highlight]:border-l-4 [&_p.highlight]:border-amber-500 [&_p.highlight]:p-4 [&_p.highlight]:rounded-r-xl [&_p.highlight]:text-amber-950 [&_p.highlight]:font-medium
                [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:space-y-1.5 [&_ul_li]:text-slate-600
                [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:space-y-1.5 [&_ol_li]:text-slate-600
                [&_a]:text-emerald-600 [&_a]:underline [&_a]:font-medium hover:[&_a]:text-emerald-700
                [&_strong]:text-slate-900 [&_strong]:font-bold"
            />
          </div>
        </main>
      </div>
    </div>
  );
}
