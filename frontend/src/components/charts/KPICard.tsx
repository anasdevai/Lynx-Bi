'use client';

import { motion } from 'framer-motion';
import { ArrowUpIcon, ArrowDownIcon, MinusIcon } from '@heroicons/react/24/solid';
import { clsx } from 'clsx';

interface KPICardProps {
  title: string;
  value: number | string;
  target?: number;
  status?: 'green' | 'yellow' | 'red';
  change?: number;
  format?: 'number' | 'currency' | 'percent';
  icon?: React.ReactNode;
}

export function KPICard({ title, value, target, status = 'green', change, format = 'number', icon }: KPICardProps) {
  const formatValue = (val: number | string) => {
    if (typeof val === 'string') return val;
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
      case 'percent':
        return `${val.toFixed(1)}%`;
      default:
        return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(val);
    }
  };

  const statusConfig = {
    green: {
      bg: 'from-neon-green/10 to-emerald-500/5',
      border: 'border-neon-green/30',
      glow: 'shadow-neon-green',
      dot: 'bg-neon-green',
      text: 'text-neon-green',
    },
    yellow: {
      bg: 'from-neon-orange/10 to-amber-500/5',
      border: 'border-neon-orange/30',
      glow: 'shadow-[0_0_20px_rgba(251,146,60,0.3)]',
      dot: 'bg-neon-orange',
      text: 'text-neon-orange',
    },
    red: {
      bg: 'from-red-500/10 to-rose-500/5',
      border: 'border-red-500/30',
      glow: 'shadow-[0_0_20px_rgba(239,68,68,0.3)]',
      dot: 'bg-red-500',
      text: 'text-red-400',
    },
  };

  const config = statusConfig[status];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02, y: -2 }}
      className={clsx(
        'glass-card rounded-2xl p-6 border',
        `bg-gradient-to-br ${config.bg}`,
        config.border
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <motion.div
              className={clsx('w-2.5 h-2.5 rounded-full', config.dot)}
              animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-sm font-medium text-surface-400">{title}</span>
          </div>
          
          <motion.div
            className="text-4xl font-bold text-white mb-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {formatValue(value)}
          </motion.div>
          
          {target && (
            <div className="text-sm text-surface-500">
              Target: <span className={config.text}>{formatValue(target)}</span>
            </div>
          )}
        </div>
        
        {icon && (
          <motion.div
            className={clsx(
              'w-14 h-14 rounded-2xl flex items-center justify-center',
              'bg-white/5 border border-white/10'
            )}
            whileHover={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.4 }}
          >
            {icon}
          </motion.div>
        )}
      </div>
      
      {change !== undefined && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-4 pt-4 border-t border-white/5"
        >
          <div className={clsx(
            'flex items-center gap-2 text-sm font-medium',
            change > 0 ? 'text-neon-green' : change < 0 ? 'text-red-400' : 'text-surface-500'
          )}>
            <div className={clsx(
              'w-6 h-6 rounded-lg flex items-center justify-center',
              change > 0 ? 'bg-neon-green/10' : change < 0 ? 'bg-red-500/10' : 'bg-white/5'
            )}>
              {change > 0 ? (
                <ArrowUpIcon className="w-3.5 h-3.5" />
              ) : change < 0 ? (
                <ArrowDownIcon className="w-3.5 h-3.5" />
              ) : (
                <MinusIcon className="w-3.5 h-3.5" />
              )}
            </div>
            <span>{Math.abs(change).toFixed(1)}%</span>
            <span className="text-surface-500 font-normal">vs last period</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
