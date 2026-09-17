import React from 'react';
import { ShieldCheck, Stethoscope } from 'lucide-react';

interface MedicalReviewerBadgeProps {
  authorName?: string;
  authorTitle?: string;
  reviewerName?: string | null;
  reviewerCredentials?: string | null;
  reviewedDate?: string | null;
}

export function MedicalReviewerBadge({
  authorName = 'HealthGhuru Partner Content Team',
  authorTitle = 'Health Editorial Desk',
  reviewerName,
  reviewerCredentials,
  reviewedDate,
}: MedicalReviewerBadgeProps) {
  const formattedDate = reviewedDate
    ? new Date(reviewedDate).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : null;

  return (
    <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-4 my-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
      
      {/* Author */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-[#16A34A] shrink-0 font-bold font-mono">
          ✍️
        </div>
        <div>
          <span className="text-gray-400 block text-[10px] uppercase font-mono tracking-wider font-semibold">
            Written by
          </span>
          <span className="font-heading font-bold text-gray-900 block">
            {authorName}
          </span>
          {authorTitle && (
            <span className="text-gray-500 text-[11px] block">{authorTitle}</span>
          )}
        </div>
      </div>

      {/* Medical Reviewer */}
      {reviewerName ? (
        <div className="flex items-center gap-3 sm:border-l sm:border-emerald-200 sm:pl-4">
          <div className="w-8 h-8 rounded-full bg-[#16A34A]/15 flex items-center justify-center text-[#16A34A] shrink-0">
            <ShieldCheck size={18} />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-[#16A34A] text-[10px] uppercase font-mono tracking-wider font-bold">
                Medically Reviewed
              </span>
            </div>
            <span className="font-heading font-bold text-gray-900 block">
              {reviewerName}
            </span>
            <span className="text-gray-500 text-[11px] block">
              {reviewerCredentials || 'Medical Review Board'}
              {formattedDate && ` • Last reviewed: ${formattedDate}`}
            </span>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 sm:border-l sm:border-emerald-200 sm:pl-4 text-gray-500 text-xs">
          <Stethoscope size={16} className="text-gray-400" />
          <span>HealthGhuru Partner Guidelines Verified</span>
        </div>
      )}

    </div>
  );
}
