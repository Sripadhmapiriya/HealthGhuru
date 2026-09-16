import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { IconAction } from '@/components/ui/IconAction';

interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  sublabel: string;
  color?: 'primary' | 'accent' | 'blue' | 'purple' | 'red';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export default function StatCard({ 
  icon, value, label, sublabel, color = 'primary', trend 
}: StatCardProps) {
  
  const borderColors = {
    primary: 'border-l-primary',
    accent: 'border-l-accent',
    blue: 'border-l-[#29B6F6]',
    purple: 'border-l-[#7C4DFF]',
    red: 'border-l-[#FF6B6B]',
  };

  const textColors = {
    primary: 'text-primary',
    accent: 'text-accent',
    blue: 'text-[#29B6F6]',
    purple: 'text-[#7C4DFF]',
    red: 'text-[#FF6B6B]',
  };

  return (
    <div className={cn(
      "bg-white rounded-[14px] shadow-sm hover:shadow-card-hover transition-shadow border border-border border-l-4 p-5 flex flex-col",
      borderColors[color]
    )}>
      <div className="flex items-start justify-between mb-2">
        <div className={cn("p-2 rounded-lg bg-surface", textColors[color])}>
          <IconAction context="decorative">{icon}</IconAction>
        </div>
        
        {trend && (
          <div className={cn(
            "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
            trend.isPositive ? "text-status-good bg-status-good/10" : "text-status-danger bg-status-danger/10"
          )}>
            {trend.isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {trend.value}%
          </div>
        )}
      </div>
      
      <div className="mt-auto">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="font-mono text-2xl font-bold text-dark">{value}</span>
          <span className="text-sm font-medium text-text-primary">{label}</span>
        </div>
        <p className="text-xs text-text-muted">{sublabel}</p>
      </div>
    </div>
  );
}
