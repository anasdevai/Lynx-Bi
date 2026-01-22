'use client';

import { useMemo } from 'react';

interface SparkLineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  showArea?: boolean;
  showDots?: boolean;
}

export function SparkLine({ 
  data, 
  width = 120, 
  height = 32, 
  color = '#6366f1',
  showArea = true,
  showDots = false 
}: SparkLineProps) {
  const { path, areaPath, points, min, max, lastValue, change } = useMemo(() => {
    if (data.length === 0) return { path: '', areaPath: '', points: [], min: 0, max: 0, lastValue: 0, change: 0 };
    
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    
    const padding = 2;
    const effectiveWidth = width - padding * 2;
    const effectiveHeight = height - padding * 2;
    
    const points = data.map((value, i) => ({
      x: padding + (i / (data.length - 1)) * effectiveWidth,
      y: padding + effectiveHeight - ((value - min) / range) * effectiveHeight,
      value
    }));
    
    const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const areaPath = `${path} L ${points[points.length - 1].x} ${height - padding} L ${padding} ${height - padding} Z`;
    
    const lastValue = data[data.length - 1];
    const firstValue = data[0];
    const change = firstValue === 0 ? 0 : ((lastValue - firstValue) / firstValue) * 100;
    
    return { path, areaPath, points, min, max, lastValue, change };
  }, [data, width, height]);

  if (data.length === 0) return null;

  return (
    <div className="inline-flex items-center gap-2">
      <svg width={width} height={height} className="overflow-visible">
        {showArea && (
          <path
            d={areaPath}
            fill={color}
            fillOpacity={0.1}
          />
        )}
        <path
          d={path}
          fill="none"
          stroke={color}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {showDots && points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={2}
            fill={color}
          />
        ))}
        {/* Last point highlight */}
        <circle
          cx={points[points.length - 1]?.x}
          cy={points[points.length - 1]?.y}
          r={3}
          fill={color}
        />
      </svg>
      <span className={`text-xs font-medium ${change >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
        {change >= 0 ? '+' : ''}{change.toFixed(1)}%
      </span>
    </div>
  );
}
