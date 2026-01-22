'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FloatingCubes3D } from '@/components/ui/FloatingCubes3D';
import { ParticleField } from '@/components/ui/ParticleField';
import {
  CpuChipIcon,
  ServerIcon,
  PaintBrushIcon,
  BellIcon,
  CheckCircleIcon,
  CubeTransparentIcon,
} from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    mipsEnabled: true,
    theme: 'dark',
    chartAnimations: true,
    autoRefresh: false,
    refreshInterval: 30,
    cacheEnabled: true,
    parallelExecution: true,
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleSetting = (key: string) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 3D Background Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <FloatingCubes3D />
        <ParticleField />
      </div>

      {/* Animated Background Orbs */}
      <motion.div
        className="absolute top-20 left-1/4 w-96 h-96 bg-accent-indigo/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, -50, 0],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 right-1/4 w-96 h-96 bg-accent-purple/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, 50, 0],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="relative p-6 lg:p-8">
        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="mb-8">
            <motion.h1 
              className="text-3xl font-bold text-white"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              Settings
            </motion.h1>
            <motion.p 
              className="text-surface-400 mt-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              Configure your Lynx BI experience
            </motion.p>
          </div>

          <div className="space-y-6">
            {/* MIPS Engine Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card rounded-3xl p-6 card-3d"
              whileHover={{ y: -2 }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-indigo to-accent-purple flex items-center justify-center shadow-neon-purple">
                  <CpuChipIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">MIPS Analytics Engine</h2>
                  <p className="text-sm text-surface-400">Configure the assembly-powered computation engine</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/[0.07] transition-colors">
                  <div>
                    <p className="font-semibold text-white">Enable MIPS Execution</p>
                    <p className="text-sm text-surface-400">Use MIPS assembly for computations</p>
                  </div>
                  <button
                    onClick={() => toggleSetting('mipsEnabled')}
                    className={clsx(
                      'relative w-14 h-7 rounded-full transition-all duration-300',
                      settings.mipsEnabled 
                        ? 'bg-gradient-to-r from-accent-indigo to-accent-purple shadow-neon-purple' 
                        : 'bg-surface-700'
                    )}
                  >
                    <motion.div
                      className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg"
                      animate={{ x: settings.mipsEnabled ? 30 : 4 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/[0.07] transition-colors">
                  <div>
                    <p className="font-semibold text-white">Parallel Execution</p>
                    <p className="text-sm text-surface-400">Run multiple MIPS procedures simultaneously</p>
                  </div>
                  <button
                    onClick={() => toggleSetting('parallelExecution')}
                    className={clsx(
                      'relative w-14 h-7 rounded-full transition-all duration-300',
                      settings.parallelExecution 
                        ? 'bg-gradient-to-r from-accent-indigo to-accent-purple shadow-neon-purple' 
                        : 'bg-surface-700'
                    )}
                  >
                    <motion.div
                      className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg"
                      animate={{ x: settings.parallelExecution ? 30 : 4 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/[0.07] transition-colors">
                  <div>
                    <p className="font-semibold text-white">Cache Results</p>
                    <p className="text-sm text-surface-400">Store computed results for faster access</p>
                  </div>
                  <button
                    onClick={() => toggleSetting('cacheEnabled')}
                    className={clsx(
                      'relative w-14 h-7 rounded-full transition-all duration-300',
                      settings.cacheEnabled 
                        ? 'bg-gradient-to-r from-accent-indigo to-accent-purple shadow-neon-purple' 
                        : 'bg-surface-700'
                    )}
                  >
                    <motion.div
                      className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg"
                      animate={{ x: settings.cacheEnabled ? 30 : 4 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Performance Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card rounded-3xl p-6 card-3d"
              whileHover={{ y: -2 }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-cyan to-accent-indigo flex items-center justify-center shadow-neon-cyan">
                  <ServerIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Performance</h2>
                  <p className="text-sm text-surface-400">Optimize data processing and rendering</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/[0.07] transition-colors">
                  <div>
                    <p className="font-semibold text-white">Chart Animations</p>
                    <p className="text-sm text-surface-400">Enable smooth transitions and effects</p>
                  </div>
                  <button
                    onClick={() => toggleSetting('chartAnimations')}
                    className={clsx(
                      'relative w-14 h-7 rounded-full transition-all duration-300',
                      settings.chartAnimations 
                        ? 'bg-gradient-to-r from-neon-cyan to-accent-indigo shadow-neon-cyan' 
                        : 'bg-surface-700'
                    )}
                  >
                    <motion.div
                      className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg"
                      animate={{ x: settings.chartAnimations ? 30 : 4 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/[0.07] transition-colors">
                  <div>
                    <p className="font-semibold text-white">Auto Refresh</p>
                    <p className="text-sm text-surface-400">Automatically update dashboards</p>
                  </div>
                  <button
                    onClick={() => toggleSetting('autoRefresh')}
                    className={clsx(
                      'relative w-14 h-7 rounded-full transition-all duration-300',
                      settings.autoRefresh 
                        ? 'bg-gradient-to-r from-neon-cyan to-accent-indigo shadow-neon-cyan' 
                        : 'bg-surface-700'
                    )}
                  >
                    <motion.div
                      className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg"
                      animate={{ x: settings.autoRefresh ? 30 : 4 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>

                {settings.autoRefresh && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 bg-white/5 rounded-xl border border-white/10"
                  >
                    <label className="block text-sm font-medium text-surface-300 mb-3">
                      Refresh Interval (seconds)
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="300"
                      step="10"
                      value={settings.refreshInterval}
                      onChange={(e) => setSettings(prev => ({ ...prev, refreshInterval: parseInt(e.target.value) }))}
                      className="w-full h-2 bg-surface-700 rounded-lg appearance-none cursor-pointer accent-accent-indigo"
                    />
                    <div className="flex justify-between text-xs text-surface-400 mt-2">
                      <span>10s</span>
                      <span className="text-accent-indigo font-semibold">{settings.refreshInterval}s</span>
                      <span>5m</span>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Appearance Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card rounded-3xl p-6 card-3d"
              whileHover={{ y: -2 }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center shadow-neon-pink">
                  <PaintBrushIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Appearance</h2>
                  <p className="text-sm text-surface-400">Customize the visual experience</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <label className="block text-sm font-medium text-surface-300 mb-3">
                    Theme
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {['dark', 'light', 'auto'].map((theme) => (
                      <button
                        key={theme}
                        onClick={() => setSettings(prev => ({ ...prev, theme }))}
                        className={clsx(
                          'p-4 rounded-xl font-medium capitalize transition-all',
                          settings.theme === theme
                            ? 'bg-gradient-to-br from-accent-purple to-accent-pink text-white shadow-neon-pink'
                            : 'bg-white/5 text-surface-400 hover:bg-white/10 border border-white/10'
                        )}
                      >
                        {theme}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* About Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card rounded-3xl p-6 card-3d"
              whileHover={{ y: -2 }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-green to-neon-cyan flex items-center justify-center shadow-neon-green">
                  <CubeTransparentIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">About Lynx BI</h2>
                  <p className="text-sm text-surface-400">Version and system information</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                  <span className="text-surface-400">Version</span>
                  <span className="text-white font-semibold">1.0.0</span>
                </div>
                <div className="flex justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                  <span className="text-surface-400">MIPS Engine</span>
                  <span className="text-neon-green font-semibold">Active</span>
                </div>
                <div className="flex justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                  <span className="text-surface-400">Backend</span>
                  <span className="text-neon-green font-semibold">Connected</span>
                </div>
              </div>
            </motion.div>

            {/* Save Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex justify-end gap-3"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                className="btn-neon text-white flex items-center gap-2 px-8"
              >
                {saved ? (
                  <>
                    <CheckCircleIcon className="w-5 h-5" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <BellIcon className="w-5 h-5" />
                    <span>Save Settings</span>
                  </>
                )}
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
