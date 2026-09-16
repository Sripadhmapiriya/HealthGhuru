'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function ReadingProgressBar({ targetRef }: { targetRef: React.RefObject<HTMLElement> }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const el = targetRef.current;
      if (!el) return;
      const { top, height } = el.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const scrolled = Math.min(Math.max(-top, 0), height - viewportHeight);
      const total = Math.max(height - viewportHeight, 1);
      setProgress(Math.min(100, (scrolled / total) * 100));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // init
    return () => window.removeEventListener('scroll', handleScroll);
  }, [targetRef]);

  return (
    <div className="fixed top-0 left-0 w-full h-[4px] z-50 bg-transparent pointer-events-none">
      <motion.div
        className="h-full"
        style={{ backgroundColor: 'var(--color-primary)', width: `${progress}%` }}
        transition={{ ease: 'linear', duration: 0.1 }}
      />
    </div>
  );
}
