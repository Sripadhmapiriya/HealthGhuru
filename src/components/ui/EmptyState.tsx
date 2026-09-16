import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionText,
  onAction,
  className = ""
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-6 md:p-8 bg-surface border border-dashed border-border rounded-xl md:rounded-[14px] ${className}`}>
      <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white flex items-center justify-center text-text-muted mb-3 md:mb-4 shadow-sm">
        <Icon size={24} />
      </div>
      <h3 className="font-heading font-semibold text-text-primary text-base md:text-lg mb-1 md:mb-2">{title}</h3>
      <p className="text-text-secondary text-xs md:text-sm max-w-sm mb-4 md:mb-6">{description}</p>
      
      {actionText && onAction && (
        <Button variant="ghost" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
}
