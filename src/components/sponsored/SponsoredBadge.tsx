import React from 'react';
import { Sparkles } from 'lucide-react';

interface SponsoredBadgeProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'solid' | 'subtle' | 'outline';
  className?: string;
}

export function SponsoredBadge({
  label = 'SPONSORED',
  size = 'sm',
  variant = 'solid',
  className = '',
}: SponsoredBadgeProps) {
  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-bold',
  };

  const variantClasses = {
    solid: 'bg-[#f06d2f] text-white shadow-xs',
    subtle: 'bg-orange-50 text-[#f06d2f] border border-orange-200/80 font-bold',
    outline: 'border border-[#f06d2f] text-[#f06d2f] bg-white font-bold',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-mono font-bold tracking-wider uppercase ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      <Sparkles size={size === 'lg' ? 14 : 11} className="shrink-0" />
      <span>{label}</span>
    </span>
  );
}
