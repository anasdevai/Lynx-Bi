'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlobalLoader, useLoading } from '@/components';
import { Button } from '@/components';

export default function LoaderDemoPage() {
  const { showLoading, hideLoading } = useLoading();
  const [localVariant, setLocalVariant] = useState<'mips' | 'data' | 'analytics'>('mips');

  const handleGlobalLoader = (variant: 'mips' | 'data' | 'analytics', text: string) => {
    showLoading(text, variant);
    // Auto hide after 3 seconds for demo
    setTimeout(() => hideLoading(), 3000);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">3D Loader Showcase</h1>
        <p className="text-surface-400">Explore the unique 3D loaders designed for Lynx BI</p>
      </motion.div>

      {/* Global Loaders Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-semibold text-white mb-6">Global Loaders</h2>
        <div className="glass-card rounded-3xl p-8">
          <p className="text-surface-400 mb-6">
            Click any button to trigger a full-screen global loader (auto-hides after 3 seconds)
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={() => handleGlobalLoader('mips', 'Processing with MIPS Engine...')}
              className="bg-gradient-to-r from-accent-indigo to-accent-purple hover:shadow-neon-purple"
            >
              MIPS Loader
            </Button>
            <Button
              onClick={() => handleGlobalLoader('data', 'Analyzing Data...')}
              className="bg-gradient-to-r from-accent-purple to-accent-pink hover:shadow-neon-pink"
            >
              Data Loader
            </Button>
            <Button
              onClick={() => handleGlobalLoader('analytics', 'Running Analytics...')}
              className="bg-gradient-to-r from-neon-cyan to-accent-indigo hover:shadow-neon-cyan"
            >
              Analytics Loader
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Local Loaders Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-2xl font-semibold text-white mb-6">Local Loaders</h2>
        
        {/* Variant Selector */}
        <div className="glass-card rounded-2xl p-6 mb-6">
          <p className="text-surface-400 mb-4">Select a variant to preview:</p>
          <div className="flex gap-3">
            {(['mips', 'data', 'analytics'] as const).map((variant) => (
              <button
                key={variant}
                onClick={() => setLocalVariant(variant)}
                className={`
                  px-6 py-2 rounded-xl font-medium transition-all
                  ${localVariant === variant
                    ? 'bg-gradient-to-r from-accent-indigo to-accent-purple text-white shadow-neon-purple'
                    : 'bg-white/5 text-surface-400 hover:bg-white/10'
                  }
                `}
              >
                {variant.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Loader Previews */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Small */}
          <div className="glass-card rounded-2xl p-8">
            <h3 className="text-lg font-semibold text-white mb-6 text-center">Small</h3>
            <div className="flex justify-center">
              <GlobalLoader variant={localVariant} size="sm" text="Loading..." />
            </div>
          </div>

          {/* Medium */}
          <div className="glass-card rounded-2xl p-8">
            <h3 className="text-lg font-semibold text-white mb-6 text-center">Medium</h3>
            <div className="flex justify-center">
              <GlobalLoader variant={localVariant} size="md" text="Processing..." />
            </div>
          </div>

          {/* Large */}
          <div className="glass-card rounded-2xl p-8">
            <h3 className="text-lg font-semibold text-white mb-6 text-center">Large</h3>
            <div className="flex justify-center">
              <GlobalLoader variant={localVariant} size="lg" text="Analyzing..." />
            </div>
          </div>
        </div>

        {/* Variant Descriptions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-card rounded-2xl p-6 border border-accent-indigo/30">
            <h4 className="text-accent-indigo font-semibold mb-2">MIPS Loader</h4>
            <p className="text-sm text-surface-400">
              Features a rotating hexagonal frame with MIPS chip core, data streams, and orbiting particles. 
              Perfect for MIPS engine operations.
            </p>
          </div>
          <div className="glass-card rounded-2xl p-6 border border-accent-purple/30">
            <h4 className="text-accent-purple font-semibold mb-2">Data Loader</h4>
            <p className="text-sm text-surface-400">
              Animated 3D bar chart with pulsing effects. Ideal for data processing and upload operations.
            </p>
          </div>
          <div className="glass-card rounded-2xl p-6 border border-neon-cyan/30">
            <h4 className="text-neon-cyan font-semibold mb-2">Analytics Loader</h4>
            <p className="text-sm text-surface-400">
              Rotating rings with pulsing center and orbiting data points. Best for analytics and calculations.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Usage Example */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-12"
      >
        <h2 className="text-2xl font-semibold text-white mb-6">Usage Example</h2>
        <div className="glass-card rounded-2xl p-6">
          <pre className="text-sm text-surface-300 overflow-x-auto">
{`// Import the hook
import { useLoading } from '@/components';

// In your component
const { showLoading, hideLoading } = useLoading();

// Show loader
showLoading('Processing data...', 'data');

// Hide loader when done
hideLoading();

// Or use locally
import { GlobalLoader } from '@/components';

<GlobalLoader 
  variant="mips" 
  size="md" 
  text="Loading..." 
/>`}
          </pre>
        </div>
      </motion.div>
    </div>
  );
}
