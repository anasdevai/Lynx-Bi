'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';

interface HeatmapProps {
  data: number[][];
  xLabels: string[];
  yLabels: string[];
  title?: string;
  colorScale?: 'blue' | 'green' | 'red' | 'purple';
}

export function Heatmap({ data, xLabels, yLabels, title, colorScale = 'blue' }: HeatmapProps) {
  const { min, max, colors } = useMemo(() => {
    const flat = data.flat();
    const min = Math.min(...flat);
    const max = Math.max(...flat);
    
    const colorScales = {
      blue: ['#eff6ff', '#bfdbfe', '#60a5fa', '#2563eb', '#1e40af'],
      green: ['#f0fdf4', '#bbf7d0', '#4ade80', '#16a34a', '#166534'],
      red: ['#fef2f2', '#fecaca', '#f87171', '#dc2626', '#991b1b'],
      purple: ['#faf5ff', '#e9d5ff', '#c084fc', '#9333ea', '#6b21a8'],
    };
    
    return { min, max, colors: colorScales[colorScale] };
  }, [data, colorScale]);

  const getColor = (value: number) => {
    const normalized = (value - min) / (max - min || 1);
    const index = Math.min(Math.floor(normalized * (colors.length - 1)), colors.length - 1);
    return colors[index];
  };

  return (
    <div className="w-full">
      {title && <h3 className="font-semibold text-surface-900 mb-4">{title}</h3>}
      
      <div className="overflow-x-auto">
        <div className="inline-block">
          {/* X-axis labels */}
          <div className="flex ml-20">
            {xLabels.map((label, i) => (
              <div key={i} className="w-12 text-xs text-surface-500 text-center truncate">
                {label}
              </div>
            ))}
          </div>
          
          {/* Grid */}
          <div className="flex">
            {/* Y-axis labels */}
            <div className="w-20 flex flex-col">
              {yLabels.map((label, i) => (
                <div key={i} className="h-10 flex items-center justify-end pr-2 text-xs text-surface-500 truncate">
                  {label}
                </div>
              ))}
            </div>
            
            {/* Cells */}
            <div>
              {data.map((row, i) => (
                <div key={i} className="flex">
                  {row.map((value, j) => (
                    <motion.div
                      key={j}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: (i * row.length + j) * 0.01 }}
                      className="w-12 h-10 flex items-center justify-center text-xs font-medium border border-white/50 cursor-pointer hover:ring-2 hover:ring-primary-400 hover:z-10 relative"
                      style={{ backgroundColor: getColor(value) }}
                      title={`${yLabels[i]} × ${xLabels[j]}: ${value.toLocaleString()}`}
                    >
                      <span className={value > (max - min) / 2 + min ? 'text-white' : 'text-surface-700'}>
                        {value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value.toFixed(0)}
                      </span>
                    </motion.div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex items-center justify-end mt-4 gap-2">
            <span className="text-xs text-surface-500">{min.toLocaleString()}</span>
            <div className="flex h-3 rounded overflow-hidden">
              {colors.map((color, i) => (
                <div key={i} className="w-6" style={{ backgroundColor: color }} />
              ))}
            </div>
            <span className="text-xs text-surface-500">{max.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
