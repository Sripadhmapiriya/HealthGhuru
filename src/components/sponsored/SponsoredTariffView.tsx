'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Send,
  Download,
  Mail,
  Check,
  Sparkles,
  Newspaper,
  Calendar,
  Search,
  Building2,
  Rocket,
  Flame,
  Video,
  Play,
  ArrowRight,
  ShieldCheck,
  PhoneCall,
  ChevronRight,
} from 'lucide-react';

const INCLUSIVE_BENEFITS = [
  {
    title: 'Professionally Formatted Article',
    description: 'Crafted by our expert editorial desk with clinical precision and engaging storytelling.',
  },
  {
    title: 'SEO Optimization',
    description: 'High search authority & index ranking across Google for targeted medical queries.',
  },
  {
    title: 'Featured HD Image',
    description: 'Custom media header graphic, clinical infographics, and responsive thumbnail.',
  },
  {
    title: 'Brand Backlink',
    description: 'Direct SEO link to your official website, clinic portal, or patient booking desk.',
  },
  {
    title: 'Category Placement',
    description: 'Targeted publishing in relevant news hub (Heart, Cancer, Diabetes, Pediatrics, etc.).',
  },
  {
    title: 'Social Media Sharing',
    description: 'Multi-platform push to active health-conscious readers across HealthGhuru channels.',
  },
  {
    title: 'Permanent Website Publishing',
    description: 'Lifetime archives, search indexing, and citation authority on HealthGhuru.',
  },
];

const ARTICLE_PACKAGES = [
  {
    id: 'standard',
    title: 'Sponsored News Article',
    badge: 'Standard',
    badgeStyle: 'bg-amber-50 text-amber-800 border-amber-200',
    price: '₹1',
    unit: '/ publication',
    highlight: 'Standard corporate healthcare & clinical news coverage formatted for high reader engagement.',
    popular: false,
  },
  {
    id: 'event',
    title: 'Event Coverage',
    badge: 'Event Special',
    badgeStyle: 'bg-orange-50 text-orange-800 border-orange-200',
    price: '₹14,999',
    unit: '/ publication',
    highlight: 'Complete medical camp, clinical symposium, or hospital event writeup with photo highlights and registration backlinks.',
    popular: false,
  },
  {
    id: 'seo_premium',
    title: 'SEO Premium Article',
    badge: 'Popular',
    badgeStyle: 'bg-[#f06d2f]/10 text-[#f06d2f] border-[#f06d2f]/30',
    price: '₹14,999',
    unit: '/ publication',
    highlight: 'High-authority clinical keyword targeting & search ranking optimization for maximum web discoverability.',
    popular: true,
  },
  {
    id: 'profile',
    title: 'Company Profile Feature',
    badge: 'Corporate',
    badgeStyle: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    price: '₹17,999',
    unit: '/ publication',
    highlight: 'Comprehensive hospital or diagnostic center overview and institutional milestone feature.',
    popular: false,
  },
  {
    id: 'product_launch',
    title: 'Product Launch Coverage',
    badge: 'New Launch',
    badgeStyle: 'bg-blue-50 text-blue-800 border-blue-200',
    price: '₹19,999',
    unit: '/ publication',
    highlight: 'Dedicated healthtech, medical device, or pharmaceutical product launch coverage with purchase/inquiry CTAs.',
    popular: false,
  },
  {
    id: 'brand_story',
    title: 'Brand Story',
    badge: 'High Impact',
    badgeStyle: 'bg-purple-50 text-purple-800 border-purple-200',
    price: '₹19,999',
    unit: '/ publication',
    highlight: 'In-depth healthcare brand story feature with photo gallery, surgical facility tour, and homepage spotlight.',
    popular: false,
  },
];

const COMBO_PACKAGES = [
  {
    id: 'starter',
    title: 'Starter Combo',
    badge: 'Starter',
    price: '₹25,000',
    unit: '/ campaign',
    popular: false,
    items: [
      '1 Sponsored Health Article',
      'Instagram Post',
      'Facebook Post',
      'Sidebar Banner (7 Days)',
    ],
  },
  {
    id: 'growth',
    title: 'Business Growth',
    badge: 'Growth',
    price: '₹50,000',
    unit: '/ campaign',
    popular: true,
    items: [
      '2 Sponsored Articles',
      'Homepage Banner (15 Days)',
      'Instagram Reel',
      'Facebook Promotion',
      'WhatsApp Broadcast',
    ],
  },
  {
    id: 'premium',
    title: 'Premium Brand',
    badge: 'Premium',
    price: '₹1,00,000',
    unit: '/ campaign',
    popular: false,
    items: [
      '4 Sponsored Articles',
      'Homepage Banner (30 Days)',
      'Clinical Press Release',
      'Instagram Reel',
      'Facebook Promotion',
      'YouTube Community Post',
      'WhatsApp Broadcast',
    ],
  },
];

const VIDEO_RATES = [
  {
    name: 'Promotional Video Embed',
    features: 'HD Video Embed inside article • Autoplay enabled on desktop • Responsive mobile player',
    price: '₹9,999',
  },
  {
    name: 'Homepage Featured Video',
    features: 'Prime placement in Homepage Video section • High conversion player • Dedicated Video Tag',
    price: '₹19,999',
  },
  {
    name: 'Doctor & Specialist Interview Video',
    features: 'Exclusive Specialist Video Interview Embed • Cover Story Integration • Social Video Highlights',
    price: '₹34,999',
  },
  {
    name: 'Event & Health Camp Video Coverage',
    features: 'Event summary reel embed • Multi-platform distribution • High visibility tag',
    price: '₹39,999',
  },
  {
    name: 'Documentary / Hospital Brand Film',
    features: 'Full-length hospital documentary showcase • Custom landing highlight • VIP Distribution',
    price: '₹75,001',
  },
];

interface SponsoredTariffViewProps {
  onSwitchToArticles?: () => void;
}

export function SponsoredTariffView({ onSwitchToArticles }: SponsoredTariffViewProps) {
  const [downloading, setDownloading] = useState(false);

  const handleDownloadTariff = () => {
    setDownloading(true);
    // Simulating quick instant PDF ratecard generation
    setTimeout(() => {
      const element = document.createElement('a');
      const file = new Blob(
        [
          `HEALTHGHURU COMMERCIAL RATE CARD & SPONSORED ARTICLES TARIFF 2026\n\n` +
          `1. SPONSORED ARTICLE PACKAGES:\n` +
          `- Sponsored News Article: ₹7,999\n` +
          `- Event Coverage: ₹14,999\n` +
          `- SEO Premium Article: ₹14,999\n` +
          `- Company Profile Feature: ₹17,999\n` +
          `- Product Launch Coverage: ₹19,999\n` +
          `- Brand Story: ₹19,999\n\n` +
          `2. COMBO BUNDLES:\n` +
          `- Starter Combo: ₹24,999\n` +
          `- Business Growth (Popular): ₹49,999\n` +
          `- Premium Brand: ₹99,999\n\n` +
          `3. VIDEO PROMOTIONS:\n` +
          `- Video Embed: ₹9,999\n` +
          `- Homepage Video: ₹19,999\n` +
          `- Doctor Interview: ₹34,999\n` +
          `- Event Coverage: ₹39,999\n` +
          `- Documentary Film: ₹75,001\n\n` +
          `Contact: partnerships@healthghuru.com | +91 44 2829 0200`
        ],
        { type: 'text/plain' }
      );
      element.href = URL.createObjectURL(file);
      element.download = 'HealthGhuru_Sponsored_Tariff_2026.txt';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      setDownloading(false);
    }, 600);
  };

  return (
    <div className="space-y-12 sm:space-y-16">
      
      {/* ── 1. HERO SECTION (Matching Screenshot 1) ── */}
      <section className="bg-white rounded-3xl border border-emerald-100/90 p-6 sm:p-10 lg:p-12 shadow-xs text-center relative overflow-hidden">
        {/* Subtle decorative accents */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50/50 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-50/40 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-4 sm:space-y-5">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200/80 px-3.5 py-1 rounded-full text-amber-800 text-[11px] font-mono font-bold uppercase tracking-wider">
            <Sparkles size={13} className="text-[#f06d2f]" />
            <span>PREMIUM HEALTHCARE SPONSORSHIPS</span>
          </div>

          {/* Heading */}
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-gray-900 tracking-tight leading-tight">
            Sponsored Articles &amp; Video Promotion
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-2xl mx-auto font-normal">
            Promote your hospital, clinical milestones, doctor breakthroughs, diagnostic advancements, or healthcare brand to millions of engaged health-conscious readers across India.
          </p>

          {/* 3 Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/sponsored-request"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#f06d2f] hover:bg-[#e05b1d] text-white font-heading font-bold text-xs sm:text-sm shadow-md shadow-orange-500/10 transition-all duration-200"
            >
              <Send size={15} />
              <span>Submit Sponsor Request</span>
            </Link>

            <button
              type="button"
              onClick={handleDownloadTariff}
              disabled={downloading}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-emerald-50 text-gray-800 border border-emerald-200 font-heading font-bold text-xs sm:text-sm shadow-2xs transition-colors"
            >
              <Download size={15} className="text-[#16A34A]" />
              <span>{downloading ? 'Preparing Tariff...' : 'Download Tariff (PDF)'}</span>
            </button>

            <a
              href="mailto:partnerships@healthghuru.com?subject=Healthcare Sponsored Campaign Inquiry"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 text-emerald-900 border border-emerald-200/80 font-heading font-bold text-xs sm:text-sm transition-colors"
            >
              <Mail size={15} className="text-[#16A34A]" />
              <span>Contact Admin / Get Quote</span>
            </a>
          </div>

          {/* Published Stories Shortcut */}
          {onSwitchToArticles && (
            <div className="pt-2">
              <button
                type="button"
                onClick={onSwitchToArticles}
                className="text-xs font-heading font-bold text-[#16A34A] hover:underline inline-flex items-center gap-1"
              >
                <span>Or explore live published partner stories</span>
                <ArrowRight size={13} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── 2. ALL-INCLUSIVE BENEFITS (Matching Screenshot 1 & 2) ── */}
      <section className="bg-white rounded-3xl border border-emerald-100/90 p-6 sm:p-10 lg:p-12 shadow-xs space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-[#f06d2f]">
            <span>✈ ALL-INCLUSIVE BENEFITS</span>
          </div>
          <h2 className="font-heading font-extrabold text-xl sm:text-2xl lg:text-3xl text-gray-900">
            Every Sponsored Article Package Includes
          </h2>
          <p className="text-xs sm:text-sm text-gray-600">
            All our publication tiers come standard with complete editorial, SEO, and multi-channel marketing support.
          </p>
        </div>

        {/* Benefit Cards Grid (2-column on tablet, 3-column on desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
          {INCLUSIVE_BENEFITS.map((benefit, idx) => (
            <div
              key={idx}
              className="bg-emerald-50/40 rounded-2xl border border-emerald-100 p-4 sm:p-5 flex items-start gap-3.5 hover:bg-emerald-50/80 transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-[#16A34A] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                <Check size={14} strokeWidth={3} />
              </div>
              <div className="space-y-1">
                <h3 className="font-heading font-bold text-sm text-gray-900 leading-snug">
                  {benefit.title}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. SPONSORED ARTICLE SERVICES & PRICING (Matching Screenshot 2 & 3) ── */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 text-base sm:text-lg font-heading font-bold text-gray-900">
            <span className="text-xl">📰</span>
            <h2>Sponsored Article Services &amp; Pricing</h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-600">
            Select the specific publishing service tailored to your campaign objectives.
          </p>
        </div>

        {/* 6-Card Grid (3 columns on desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ARTICLE_PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className={`bg-white rounded-3xl border p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 ${
                pkg.popular
                  ? 'border-[#f06d2f] shadow-md shadow-orange-500/5 ring-1 ring-[#f06d2f]/30'
                  : 'border-emerald-100 shadow-xs hover:border-emerald-200 hover:shadow-md'
              }`}
            >
              <div>
                {/* Header: Title + Badge */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <h3 className="font-heading font-extrabold text-lg text-gray-900 leading-snug">
                    {pkg.title}
                  </h3>
                  <span
                    className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase border shrink-0 ${pkg.badgeStyle}`}
                  >
                    {pkg.badge}
                  </span>
                </div>

                {/* Price */}
                <div className="mb-5">
                  <span className="font-heading font-extrabold text-3xl sm:text-4xl text-[#f06d2f]">
                    {pkg.price}
                  </span>
                  <span className="text-xs text-gray-500 font-medium ml-1.5 font-mono">
                    {pkg.unit}
                  </span>
                </div>

                {/* Core Highlight */}
                <div className="pt-4 border-t border-gray-100 mb-6">
                  <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider block mb-1">
                    CORE HIGHLIGHT:
                  </span>
                  <p className="text-xs text-gray-700 leading-relaxed font-normal">
                    {pkg.highlight}
                  </p>
                </div>
              </div>

              {/* Action button */}
              <Link
                href={`/sponsored-request?package=${pkg.id}`}
                className="w-full py-2.5 sm:py-3 rounded-xl bg-[#f06d2f] hover:bg-[#e05b1d] text-white text-center text-xs sm:text-sm font-heading font-bold shadow-xs transition-colors block"
              >
                Select Package
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. PREMIUM COMBO PACKAGES (Matching Screenshot 4) ── */}
      <section className="bg-white rounded-3xl border border-emerald-100/90 p-6 sm:p-10 lg:p-12 shadow-xs space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-orange-50 text-[#f06d2f] border border-orange-200/80 px-3 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider">
            <span>🔥 BEST VALUE BUNDLES</span>
          </div>
          <h2 className="font-heading font-extrabold text-xl sm:text-2xl lg:text-3xl text-gray-900 flex items-center justify-center gap-2">
            <span>🚀</span>
            <span>Premium Combo Packages</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-600">
            Maximize your brand's outreach with cross-platform promotions, social campaigns, and website sponsorships.
          </p>
        </div>

        {/* 3 Combo Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {COMBO_PACKAGES.map((combo) => (
            <div
              key={combo.id}
              className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative transition-all duration-300 ${
                combo.popular
                  ? 'bg-white border-2 border-[#f06d2f] shadow-xl shadow-orange-500/10 lg:-translate-y-2'
                  : 'bg-white border border-emerald-100 shadow-xs hover:border-emerald-200'
              }`}
            >
              {combo.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#f06d2f] text-white font-mono text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
                  POPULAR
                </div>
              )}

              <div>
                {/* Header */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <h3 className="font-heading font-extrabold text-xl text-gray-900">
                    {combo.title}
                  </h3>
                  <span className="text-[10px] font-mono font-bold bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md uppercase">
                    {combo.badge}
                  </span>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <span className="font-heading font-extrabold text-3xl sm:text-4xl text-[#f06d2f]">
                    {combo.price}
                  </span>
                  <span className="text-xs text-gray-500 font-medium ml-1.5 font-mono">
                    {combo.unit}
                  </span>
                </div>

                {/* Features List */}
                <ul className="space-y-3 pt-4 border-t border-gray-100 mb-8 text-xs text-gray-700">
                  {combo.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-[#16A34A]/15 text-[#16A34A] flex items-center justify-center shrink-0">
                        <Check size={11} strokeWidth={3} />
                      </div>
                      <span className="font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Button */}
              <Link
                href={`/sponsored-request?combo=${encodeURIComponent(combo.title)}`}
                className={`w-full py-3 rounded-xl text-center text-xs sm:text-sm font-heading font-bold shadow-xs transition-colors block ${
                  combo.popular
                    ? 'bg-[#f06d2f] hover:bg-[#e05b1d] text-white'
                    : 'bg-[#16A34A] hover:bg-[#15803D] text-white'
                }`}
              >
                Choose Package
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. VIDEO PROMOTION RATES TABLE (Matching Screenshot 5) ── */}
      <section className="bg-white rounded-3xl border border-emerald-100/90 p-6 sm:p-10 lg:p-12 shadow-xs space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-[#16A34A] border border-emerald-200 px-3 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider">
            <span>🎥 HIGH-CONVERSION VIDEO MEDIA</span>
          </div>
          <h2 className="font-heading font-extrabold text-xl sm:text-2xl lg:text-3xl text-gray-900">
            Video Promotion Rates
          </h2>
          <p className="text-xs sm:text-sm text-gray-600">
            Pair your article with dedicated high-impact video media embeds and video channel highlights.
          </p>
        </div>

        {/* Pricing Table */}
        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-[11px] font-mono font-bold uppercase text-gray-500 tracking-wider">
                <th className="py-3 px-4 sm:px-6">Video Service Package</th>
                <th className="py-3 px-4 sm:px-6">Key Features</th>
                <th className="py-3 px-4 sm:px-6 text-right">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {VIDEO_RATES.map((rate, i) => (
                <tr key={i} className="hover:bg-emerald-50/40 transition-colors">
                  <td className="py-4 px-4 sm:px-6 font-heading font-bold text-gray-900 flex items-center gap-2">
                    <Play size={12} className="text-[#f06d2f] shrink-0 fill-current" />
                    <span>{rate.name}</span>
                  </td>
                  <td className="py-4 px-4 sm:px-6 text-gray-600 leading-relaxed">
                    {rate.features}
                  </td>
                  <td className="py-4 px-4 sm:px-6 text-right font-heading font-extrabold text-base text-[#f06d2f] whitespace-nowrap">
                    {rate.price}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── 6. BOTTOM CONVERSION CTA ── */}
      <section className="bg-emerald-50/80 rounded-3xl border border-emerald-200 p-6 sm:p-10 text-center space-y-4">
        <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-gray-900">
          Ready to Promote Your Healthcare Brand?
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 max-w-xl mx-auto leading-relaxed font-normal">
          Join leading hospitals, certified clinicians, diagnostic networks, and health organizations already reaching millions of engaged readers across India.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/sponsored-request"
            className="px-6 py-3 bg-[#16A34A] hover:bg-[#15803D] text-white text-xs sm:text-sm font-heading font-bold rounded-xl shadow-xs transition-colors"
          >
            Submit Campaign Request
          </Link>
          <a
            href="tel:+914428290200"
            className="px-5 py-3 bg-white hover:bg-gray-50 text-gray-800 border border-emerald-200 text-xs sm:text-sm font-heading font-semibold rounded-xl shadow-2xs transition-colors inline-flex items-center gap-2"
          >
            <PhoneCall size={14} className="text-[#16A34A]" />
            <span>Call Healthcare Desk: +91 44 2829 0200</span>
          </a>
        </div>
      </section>

    </div>
  );
}
