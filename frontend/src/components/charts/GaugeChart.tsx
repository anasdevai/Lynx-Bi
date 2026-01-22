'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';

interface GaugeChartProps {
  value: number;
  min?: number;
  max?: number;
  thresholds?: { yellow: number; red: number };
  label?: string;
  format?: 'number' | 'percent' | 'currency';
}

export function GaugeChart({ 
  value, 
  min = 0, 
  max = 100, 
  thresholds = { yellow: 60, red: 30 },
  label,
  format = 'number'
}: GaugeChartProps) {
  const { percentage, color, formattedValue } = useMemo(() => {
    const percentage = Math.min(Math.max((value - min) / (max - min), 0), 1);
    
    let color = '#10b981'; // green
    if (value < thresholds.red) color = '#ef4444'; // red
    else if (value < thresholds.yellow) color = '#f59e0b'; // yellow
    
    let formattedValue = value.toLocaleString();
    if (format === 'percent') formattedValue = `${value.toFixed(1)}%`;
    if (format === 'currency') formattedValue = `$${value.toLocaleString()}`;
    
    return { percentage, color, formattedValue };
  }, [value, min, max, thresholds, format]);

  const radius = 80;
  const strokeWidth = 12;
  const circumference = Math.PI * radius; // Half circle
  const offset = circumference * (1 - percentage);

  return (
    <div className="flex flex-col items-center">
      <svg width="200" height="120" viewBox="0 0 200 120">
        {/* Background arc */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        
        {/* Value arc */}
        <motion.path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
        
        {/* Threshold markers */}
        {[thresholds.red, thresholds.yellow].map((threshold, i) => {
          const angle = Math.PI * (1 - (threshold - min) / (max - min));
          const x = 100 + (radius - strokeWidth / 2 - 8) * Math.cos(angle);
          const y = 100 - (radius - strokeWidth / 2 - 8) * Math.sin(angle);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={3}
              fill={i === 0 ? '#ef4444' : '#f59e0b'}
            />
          );
        })}
        
        {/* Value text */}
        <text x="100" y="85" textAnchor="middle" className="text-2xl font-bold fill-surface-900">
          {formattedValue}
        </text>
        
        {/* Min/Max labels */}
        <text x="25" y="115" textAnchor="middle" className="text-xs fill-surface-400">
          {min}
        </text>
        <text x="175" y="115" textAnchor="middle" className="text-xs fill-surface-400">
          {max}
        </text>
      </svg>
      
      {label && (
        <span className="text-sm text-surface-600 mt-1">{label}</span>
      )}
    </div>
  );
}
