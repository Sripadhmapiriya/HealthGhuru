import React from 'react';
import { Lock } from 'lucide-react';
import { Button } from './Button';
import { useToast } from '@/components/providers/ToastProvider';
import { IconAction } from '@/components/ui/IconAction';

interface LockedFeatureCardProps {
  message: string;
  upgradeText?: string;
  onUpgrade?: () => void;
  className?: string;
  inline?: boolean;
}

export function LockedFeatureCard({ 
  message, 
  upgradeText = "Upgrade to Pro →", 
  onUpgrade,
  className = "",
  inline = false
}: LockedFeatureCardProps) {
  const { toast } = useToast();

  // Mock upgrade logic for now if not provided
  const handleUpgrade = onUpgrade || (() => {
    toast.info("Mock Upgrade Triggered");
  });

  return (
    <div className={`bg-white border border-border-strong rounded-[14px] p-5 shadow-[0_4px_24px_rgba(46,125,50,0.08)] opacity-90 transition-all hover:opacity-100 ${inline ? 'flex items-center justify-between gap-4' : 'flex flex-col items-center text-center gap-3'} ${className}`}>
      <div className={`flex items-center gap-3 ${inline ? '' : 'flex-col'}`}>
        <div className="w-10 h-10 rounded-full bg-surface-alt flex items-center justify-center text-text-muted shrink-0">
          <IconAction context="decorative"><Lock size={18} /></IconAction>
        </div>
        <p className="text-text-primary font-medium">{message}</p>
      </div>
      <Button variant="ghost" size="sm" onClick={handleUpgrade} className={inline ? 'shrink-0' : ''}>
        {upgradeText}
      </Button>
    </div>
  );
}
