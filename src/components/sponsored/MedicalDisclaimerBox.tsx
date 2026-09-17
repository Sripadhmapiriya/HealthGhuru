import React from 'react';
import { AlertCircle } from 'lucide-react';

interface MedicalDisclaimerBoxProps {
  sponsorName?: string;
}

export function MedicalDisclaimerBox({ sponsorName = 'HealthGhuru Partner' }: MedicalDisclaimerBoxProps) {
  return (
    <div className="my-8 bg-amber-50/70 border border-amber-200/80 rounded-2xl p-5 text-xs text-amber-900/90 leading-relaxed">
      <div className="flex items-start gap-3">
        <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1.5">
          <h4 className="font-heading font-bold text-amber-950 uppercase tracking-wider text-[11px]">
            HEALTHGHURU PARTNER CONTENT & MEDICAL DISCLAIMER
          </h4>
          <p>
            This article is commercial or educational partner content supported by{' '}
            <strong className="font-semibold">{sponsorName}</strong>. HealthGhuru clearly identifies
            sponsored content so readers can distinguish commercial collaborations from our independent editorial reporting.
          </p>
          <p className="text-amber-800/80">
            The information presented is for educational purposes only and does not constitute medical advice, clinical diagnosis, or treatment recommendations. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read on this website.
          </p>
        </div>
      </div>
    </div>
  );
}
