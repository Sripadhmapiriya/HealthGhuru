"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number; // 0 to 100
  height?: string;
  colorClass?: string;
  trackClass?: string;
}

export default function ProgressBar({ 
  progress, 
  height = "h-2", 
  colorClass = "bg-primary", 
  trackClass = "bg-surface-alt border border-border" 
}: ProgressBarProps) {
  
  // Clamp progress between 0 and 100
  const safeProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={`w-full rounded-full overflow-hidden ${height} ${trackClass}`}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${safeProgress}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`h-full rounded-full ${colorClass}`}
      />
    </div>
  );
}
