import React from 'react';

export function AdSlot({ className }: { className?: string }) {
  return (
    <div className={`bg-surface-alt border border-border rounded-[14px] p-4 flex flex-col items-center justify-center text-center min-h-[250px] ${className || ''}`}>
      <span className="text-xs text-text-muted font-heading uppercase tracking-wider mb-2">Advertisement</span>
      <div className="w-full h-full min-h-[200px] bg-white/50 border border-dashed border-border-strong rounded flex items-center justify-center">
        <p className="text-text-muted text-sm px-4">Support HealthGhuru by viewing our sponsors.</p>
      </div>
    </div>
  );
}
