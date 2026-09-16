"use client";

import React, { useEffect, useState } from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';

interface ProgressRingProps {
  value: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  children?: React.ReactNode;
}

export default function ProgressRing({ 
  value, 
  size = 120, 
  strokeWidth = 12,
  color = 'var(--color-primary)',
  trackColor = 'var(--color-border)',
  children
}: ProgressRingProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const data = [
    { name: 'Progress', value: value, fill: color }
  ];

  const innerRadius = `${100 - (strokeWidth / (size / 2)) * 100}%`;
  
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Background Track Ring (drawn via SVG circle since Recharts RadialBar doesn't have a background track natively easily styled this way) */}
      <svg width={size} height={size} className="absolute inset-0 -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={(size - strokeWidth) / 2}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
      </svg>
      
      {mounted && (
        <div className="absolute inset-0">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart 
              cx="50%" 
              cy="50%" 
              innerRadius={innerRadius} 
              outerRadius="100%" 
              barSize={strokeWidth} 
              data={data} 
              startAngle={90} 
              endAngle={-270}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
              <RadialBar 
                background={false}
                dataKey="value" 
                cornerRadius={strokeWidth / 2}
                animationBegin={300}
                animationDuration={800}
              />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
      )}
      
      {children && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
          {children}
        </div>
      )}
    </div>
  );
}
