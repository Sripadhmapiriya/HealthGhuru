'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Hospital } from 'lucide-react';
import { SponsoredArticle } from '@/lib/types/advertisement';
import { getSafeImageUrl } from '@/lib/utils';

interface SponsoredBadgeProps {
  sponsor: SponsoredArticle;
  variant?: 'inline' | 'card' | 'compact';
}

export function SponsoredBadge({ sponsor, variant = 'inline' }: SponsoredBadgeProps) {
  const badgeContent = (
    <div
      className={`flex items-center gap-2 ${
        variant === 'card'
          ? 'bg-blue-50 border border-blue-200 rounded-xl px-4 py-3'
          : variant === 'compact'
          ? 'bg-surface border border-border rounded-lg px-2.5 py-1.5'
          : 'bg-amber-50 border border-amber-200 rounded-lg px-3 py-2'
      }`}
    >
      {sponsor.advertiser_logo_url ? (
        <div className="relative w-6 h-6 rounded-md overflow-hidden border border-border shrink-0 bg-white">
          <Image
            src={getSafeImageUrl(sponsor.advertiser_logo_url, 'hospital', '/images/logo_transparent.png')}
            alt={sponsor.advertiser_name}
            fill
            sizes="24px"
            className="object-contain p-0.5"
            unoptimized
          />
        </div>
      ) : (
        <div className="w-6 h-6 rounded-md bg-blue-100 flex items-center justify-center shrink-0">
          <Hospital size={12} className="text-blue-600" />
        </div>
      )}

      <div className={variant === 'compact' ? '' : 'min-w-0'}>
        <span
          className={`text-text-secondary font-medium block leading-none ${
            variant === 'compact' ? 'text-[10px]' : 'text-[11px]'
          }`}
        >
          {sponsor.sponsor_label}
        </span>
        <span
          className={`font-heading font-bold text-dark block leading-tight ${
            variant === 'compact' ? 'text-[11px]' : 'text-xs'
          }`}
        >
          {sponsor.advertiser_name}
        </span>
      </div>

      {variant === 'card' && sponsor.cta_url && sponsor.cta_text && (
        <Link
          href={sponsor.cta_url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="ml-auto shrink-0 px-3 py-1 bg-primary hover:bg-primary-dark text-white rounded-lg text-[11px] font-heading font-semibold transition-colors"
        >
          {sponsor.cta_text}
        </Link>
      )}
    </div>
  );

  if (sponsor.cta_url && variant !== 'card') {
    return (
      <Link
        href={sponsor.cta_url}
        target="_blank"
        rel="noopener noreferrer sponsored"
        onClick={(e) => e.stopPropagation()}
      >
        {badgeContent}
      </Link>
    );
  }

  return badgeContent;
}
