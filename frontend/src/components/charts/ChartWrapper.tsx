'use client';

import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ChartWrapperProps {
  type: 'bar' | 'line' | 'pie' | 'doughnut' | 'area';
  data: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      backgroundColor?: string | string[];
      borderColor?: string;
      fill?: boolean;
    }>;
  };
  options?: any;
  title?: string;
}

// Neon color palette
const neonColors = [
  'rgba(99, 102, 241, 0.8)',   // Indigo
  'rgba(168, 85, 247, 0.8)',   // Purple
  'rgba(236, 72, 153, 0.8)',   // Pink
  'rgba(56, 189, 248, 0.8)',   // Cyan
  'rgba(52, 211, 153, 0.8)',   // Green
  'rgba(251, 146, 60, 0.8)',   // Orange
];

const neonBorderColors = [
  'rgb(99, 102, 241)',
  'rgb(168, 85, 247)',
  'rgb(236, 72, 153)',
  'rgb(56, 189, 248)',
  'rgb(52, 211, 153)',
  'rgb(251, 146, 60)',
];

const gradientColors = [
  ['rgba(99, 102, 241, 0.3)', 'rgba(99, 102, 241, 0)'],
  ['rgba(168, 85, 247, 0.3)', 'rgba(168, 85, 247, 0)'],
  ['rgba(236, 72, 153, 0.3)', 'rgba(236, 72, 153, 0)'],
];

export function ChartWrapper({ type, data, options, title }: ChartWrapperProps) {
  const chartRef = useRef<any>(null);

  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          font: { size: 12, family: 'Inter' },
          color: 'rgba(148, 163, 184, 1)',
        },
      },
      title: {
        display: !!title,
        text: title,
        font: { size: 14, weight: '600', family: 'Inter' },
        color: 'rgba(248, 250, 252, 1)',
        padding: { bottom: 20 },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 15, 20, 0.95)',
        titleColor: 'rgba(248, 250, 252, 1)',
        bodyColor: 'rgba(148, 163, 184, 1)',
        borderColor: 'rgba(99, 102, 241, 0.3)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 12,
        displayColors: true,
        boxPadding: 6,
      },
    },
    scales: type !== 'pie' && type !== 'doughnut' ? {
      x: {
        grid: { 
          display: true,
          color: 'rgba(255, 255, 255, 0.03)',
          drawBorder: false,
        },
        ticks: { 
          font: { size: 11, family: 'Inter' },
          color: 'rgba(100, 116, 139, 1)',
        },
        border: { display: false },
      },
      y: {
        grid: { 
          color: 'rgba(255, 255, 255, 0.03)',
          drawBorder: false,
        },
        ticks: { 
          font: { size: 11, family: 'Inter' },
          color: 'rgba(100, 116, 139, 1)',
        },
        border: { display: false },
      },
    } : undefined,
  };

  // Apply neon colors if not provided
  const processedData = {
    ...data,
    datasets: data.datasets.map((dataset, idx) => ({
      ...dataset,
      backgroundColor: dataset.backgroundColor || (
        type === 'pie' || type === 'doughnut' 
          ? neonColors 
          : neonColors[idx % neonColors.length]
      ),
      borderColor: dataset.borderColor || neonBorderColors[idx % neonBorderColors.length],
      borderWidth: type === 'pie' || type === 'doughnut' ? 0 : 2,
      tension: type === 'line' || type === 'area' ? 0.4 : undefined,
      fill: type === 'area' ? true : dataset.fill,
      pointBackgroundColor: neonBorderColors[idx % neonBorderColors.length],
      pointBorderColor: 'rgba(15, 15, 20, 1)',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
      borderRadius: type === 'bar' ? 8 : undefined,
    })),
  };

  const mergedOptions = { ...defaultOptions, ...options };

  const ChartComponent = {
    bar: Bar,
    line: Line,
    pie: Pie,
    doughnut: Doughnut,
    area: Line,
  }[type];

  return (
    <div className="w-full h-full min-h-[200px]">
      <ChartComponent ref={chartRef} data={processedData} options={mergedOptions} />
    </div>
  );
}
