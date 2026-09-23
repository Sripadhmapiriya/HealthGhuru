'use client';

import React, { useEffect } from 'react';
import { Printer, X, BookOpen } from 'lucide-react';

interface PrintActionHeaderProps {
  issueTitle: string;
  articleCount: number;
  totalPages: number;
  autoPrint: boolean;
}

export function PrintActionHeader({
  issueTitle,
  articleCount,
  totalPages,
  autoPrint,
}: PrintActionHeaderProps) {
  useEffect(() => {
    if (autoPrint && articleCount > 0) {
      const timer = setTimeout(() => {
        window.print();
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [autoPrint, articleCount]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="no-print sticky top-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 py-3 text-white flex flex-wrap items-center justify-between gap-4 shadow-xl">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white shadow-xs shrink-0">
          <BookOpen size={16} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-heading font-black text-sm text-white">{issueTitle}</span>
            <span className="bg-emerald-950 border border-emerald-700 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {articleCount} Stories &bull; {totalPages} A4 Pages
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Complete Multi-Page Magazine PDF &bull; Choose &quot;Save as PDF&quot; in destination printer
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-black shadow-lg shadow-orange-500/30 transition-all cursor-pointer"
        >
          <Printer size={15} />
          <span>Download All Pages as PDF</span>
        </button>

        <button
          onClick={() => window.close()}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all text-xs"
          title="Close window"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
