'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
  HomeIcon,
  CloudArrowUpIcon,
  CircleStackIcon,
  ChartBarIcon,
  Squares2X2Icon,
  CogIcon,
  ChevronLeftIcon,
  SparklesIcon,
  CpuChipIcon,
  CalculatorIcon,
  BeakerIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Home', href: '/', icon: HomeIcon, color: 'from-blue-400 to-cyan-400' },
  { name: 'Upload Data', href: '/upload', icon: CloudArrowUpIcon, color: 'from-green-400 to-emerald-400' },
  { name: 'Data Model', href: '/model', icon: CircleStackIcon, color: 'from-purple-400 to-violet-400' },
  { name: 'Report Builder', href: '/report', icon: ChartBarIcon, color: 'from-orange-400 to-amber-400' },
  { name: 'Analytics', href: '/analytics', icon: CalculatorIcon, color: 'from-pink-400 to-rose-400' },
  { name: 'Dashboards', href: '/dashboards', icon: Squares2X2Icon, color: 'from-indigo-400 to-purple-400' },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <motion.aside
      className={clsx(
        'relative flex flex-col overflow-hidden',
        'bg-gradient-to-b from-dark-200/95 via-dark-300/95 to-dark-400/95',
        'backdrop-blur-2xl border-r border-white/5'
      )}
      animate={{ width: collapsed ? 88 : 280 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Animated Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs */}
        <motion.div
          className="absolute -top-20 -left-20 w-40 h-40 bg-accent-indigo/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/2 -right-10 w-32 h-32 bg-accent-purple/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-10 left-1/4 w-36 h-36 bg-accent-pink/15 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:20px_20px]" />
      </div>

      {/* Collapse Button */}
      <motion.button
        onClick={() => setCollapsed(!collapsed)}
        className={clsx(
          'absolute -right-3 top-24 z-20',
          'w-6 h-6 rounded-full',
          'bg-gradient-to-br from-accent-indigo to-accent-purple',
          'border border-white/20 shadow-neon-purple',
          'flex items-center justify-center',
          'hover:scale-110 transition-transform'
        )}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div animate={{ rotate: collapsed ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronLeftIcon className="w-3.5 h-3.5 text-white" />
        </motion.div>
      </motion.button>

      {/* Logo Section */}
      <div className="relative z-10 h-24 flex items-center px-6 border-b border-white/5">
        <Link href="/" className="flex items-center gap-4">
          {/* 3D Logo */}
          <motion.div
            className="relative"
            whileHover={{ rotateY: 180 }}
            transition={{ duration: 0.6 }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className={clsx(
              'w-12 h-12 rounded-2xl',
              'bg-gradient-to-br from-accent-indigo via-accent-purple to-accent-pink',
              'shadow-neon-purple',
              'flex items-center justify-center',
              'relative overflow-hidden'
            )}>
              {/* Inner Glow */}
              <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20" />
              
              {/* Icon */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              >
                <BeakerIcon className="w-6 h-6 text-white relative z-10" />
              </motion.div>
              
              {/* Shine Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              />
            </div>
          </motion.div>

          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col"
              >
                <span className="text-2xl font-bold gradient-text-glow tracking-tight">Lynx BI</span>
                <span className="text-xs text-surface-500 tracking-wider">MIPS Analytics</span>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navigation.map((item, idx) => {
          const isActive = pathname === item.href;
          const isHovered = hoveredItem === item.name;

          return (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              onMouseEnter={() => setHoveredItem(item.name)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <Link href={item.href}>
                <motion.div
                  className={clsx(
                    'relative flex items-center gap-4 px-4 py-3.5 rounded-2xl',
                    'transition-all duration-300 group',
                    isActive
                      ? 'bg-gradient-to-r from-accent-indigo/20 to-accent-purple/10'
                      : 'hover:bg-white/5'
                  )}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Active/Hover Background Glow */}
                  {(isActive || isHovered) && (
                    <motion.div
                      layoutId="navGlow"
                      className={clsx(
                        'absolute inset-0 rounded-2xl',
                        isActive ? 'opacity-100' : 'opacity-50'
                      )}
                      style={{
                        background: `linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(168, 85, 247, 0.1))`,
                        boxShadow: isActive ? '0 0 30px rgba(99, 102, 241, 0.2)' : 'none',
                      }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}

                  {/* Icon Container */}
                  <motion.div
                    className={clsx(
                      'relative z-10 w-10 h-10 rounded-xl flex items-center justify-center',
                      'transition-all duration-300',
                      isActive
                        ? `bg-gradient-to-br ${item.color} shadow-lg`
                        : 'bg-white/5 group-hover:bg-white/10'
                    )}
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.4 }}
                  >
                    <item.icon
                      className={clsx(
                        'w-5 h-5 transition-colors',
                        isActive ? 'text-white' : 'text-surface-400 group-hover:text-white'
                      )}
                    />
                  </motion.div>

                  {/* Label */}
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={clsx(
                          'relative z-10 font-medium text-sm transition-colors',
                          isActive ? 'text-white' : 'text-surface-400 group-hover:text-white'
                        )}
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {/* Active Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute right-3 w-1.5 h-1.5 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple shadow-neon-blue"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </motion.div>
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* MIPS Engine Status */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="relative z-10 mx-4 mb-4"
          >
            <div className={clsx(
              'p-4 rounded-2xl',
              'bg-gradient-to-br from-accent-indigo/10 via-accent-purple/5 to-transparent',
              'border border-accent-indigo/20',
              'backdrop-blur-sm'
            )}>
              <div className="flex items-center gap-3 mb-3">
                <motion.div
                  className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-indigo to-accent-purple flex items-center justify-center"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                >
                  <CpuChipIcon className="w-4 h-4 text-white" />
                </motion.div>
                <div>
                  <span className="text-sm font-semibold text-white">MIPS Engine</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <motion.div
                      className="w-2 h-2 rounded-full bg-neon-green"
                      animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    <span className="text-xs text-neon-green">Active</span>
                  </div>
                </div>
              </div>
              
              {/* Performance Bar */}
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-neon-green via-neon-blue to-neon-purple rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: '85%' }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings & Footer */}
      <div className="relative z-10 p-4 border-t border-white/5">
        <Link href="/settings">
          <motion.div
            className="flex items-center gap-4 px-4 py-3 rounded-2xl text-surface-400 hover:text-white hover:bg-white/5 transition-all"
            whileHover={{ x: 4 }}
          >
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
              <CogIcon className="w-5 h-5" />
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="font-medium text-sm"
                >
                  Settings
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        </Link>

        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-4 px-4 text-xs text-surface-600"
            >
              <p>Version 1.0.0</p>
              <p className="text-surface-700 mt-1">© 2024 Lynx BI</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
}
