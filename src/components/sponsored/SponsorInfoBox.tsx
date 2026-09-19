import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Building2,
  User,
  CheckCircle2,
  ExternalLink,
  MapPin,
  Phone,
  Globe,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import { SponsoredArticleWithSponsor } from '@/lib/types/sponsored';
import { getSafeImageUrl } from '@/lib/utils';

interface SponsorInfoBoxProps {
  article: SponsoredArticleWithSponsor;
}

export function SponsorInfoBox({ article }: SponsorInfoBoxProps) {
  const isDoctor = article.sponsor_type === 'DOCTOR';
  const isHospital = article.sponsor_type === 'HOSPITAL';

  const typeLabel = isDoctor
    ? 'DOCTOR SPONSOR'
    : isHospital
    ? 'HOSPITAL HEALTHCARE PARTNER'
    : article.sponsor_type === 'DIAGNOSTIC_CENTRE'
    ? 'DIAGNOSTIC LAB PARTNER'
    : article.sponsor_type === 'WELLNESS_BRAND'
    ? 'WELLNESS RESEARCH PARTNER'
    : 'COMMERCIAL HEALTHCARE PARTNER';

  return (
    <section
      className="my-10 bg-emerald-50/60 rounded-2xl border-2 border-emerald-200/80 p-6 sm:p-8"
      aria-labelledby="about-sponsor-heading"
    >
      {/* Eyebrow badge */}
      <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-emerald-200/60">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-[#16A34A]" />
          <h3
            id="about-sponsor-heading"
            className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-900"
          >
            ABOUT THE SPONSOR
          </h3>
        </div>
        <span className="text-[10px] font-mono font-bold bg-[#16A34A] text-white px-2.5 py-0.5 rounded-full uppercase">
          {typeLabel}
        </span>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Sponsor Avatar / Logo */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-white shadow-xs border border-emerald-200 shrink-0">
          {article.sponsor_logo_url ? (
            <Image
              src={getSafeImageUrl(article.sponsor_logo_url, 'hospital', '/images/logo_transparent.png')}
              alt={article.sponsor_name || 'Sponsor Logo'}
              fill
              sizes="96px"
              className="object-cover"
            />
          ) : isDoctor ? (
            <div className="w-full h-full flex items-center justify-center bg-emerald-100 text-[#16A34A]">
              <User size={36} />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-emerald-100 text-[#16A34A]">
              <Building2 size={36} />
            </div>
          )}
        </div>

        {/* Sponsor Bio & Credentials */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <h4 className="font-heading font-bold text-lg sm:text-xl text-gray-900">
              {article.sponsor_name || 'Healthcare Partner'}
            </h4>
            {article.sponsor_verified && (
              <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-md text-[11px] font-bold">
                <CheckCircle2 size={13} className="text-blue-500" />
                Verified Partner
              </span>
            )}
          </div>

          {/* Location */}
          {(article.sponsor_city || article.sponsor_state) && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
              <MapPin size={13} className="text-emerald-700 shrink-0" />
              <span>
                {[article.sponsor_city, article.sponsor_state, article.sponsor_country]
                  .filter(Boolean)
                  .join(', ')}
              </span>
            </div>
          )}

          {/* Description */}
          {article.sponsor_description && (
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mb-4">
              {article.sponsor_description}
            </p>
          )}

          {/* Specializations Tags */}
          {article.sponsor_specializations && article.sponsor_specializations.length > 0 && (
            <div className="mb-4">
              <span className="text-[11px] font-mono font-bold text-gray-400 uppercase block mb-1.5">
                Clinical Specializations:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {article.sponsor_specializations.map((spec, i) => (
                  <span
                    key={i}
                    className="text-xs bg-white text-emerald-900 border border-emerald-200 px-2.5 py-0.5 rounded-full font-medium"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-emerald-200/60">
            {article.sponsor_website && (
              <a
                href={article.sponsor_website}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#16A34A] text-white text-xs font-heading font-bold hover:bg-[#15803D] shadow-xs transition-colors"
              >
                <span>VISIT WEBSITE</span>
                <ExternalLink size={13} />
              </a>
            )}

            {article.cta_url && article.cta_text && (
              <a
                href={article.cta_url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#f06d2f] text-white text-xs font-heading font-bold hover:bg-[#e05b1d] shadow-xs transition-colors"
              >
                <span>{article.cta_text}</span>
              </a>
            )}

            {article.sponsor_phone && (
              <a
                href={`tel:${article.sponsor_phone}`}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 text-xs font-heading font-semibold hover:bg-gray-50 transition-colors"
              >
                <Phone size={13} className="text-gray-500" />
                <span>Call Center</span>
              </a>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
