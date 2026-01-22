'use client';

import { motion } from 'framer-motion';

interface Loader3DProps {
  type?: 'cube' | 'orbit' | 'dna' | 'pulse' | 'bars';
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export function Loader3D({ type = 'cube', size = 'md', text }: Loader3DProps) {
  const sizes = {
    sm: { cube: 40, orbit: 50, scale: 0.7 },
    md: { cube: 60, orbit: 80, scale: 1 },
    lg: { cube: 80, orbit: 100, scale: 1.3 },
  };

  const s = sizes[size];

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {type === 'cube' && (
        <div className="loader-3d" style={{ transform: `scale(${s.scale})` }}>
          <motion.div
            className="loader-cube"
            animate={{ rotateX: 360, rotateY: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            {[...Array(6)].map((_, i) => (
              <div key={i} className="loader-cube-face" />
            ))}
          </motion.div>
        </div>
      )}

      {type === 'orbit' && (
        <div className="orbit-loader" style={{ width: s.orbit, height: s.orbit }}>
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-neon-blue"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute rounded-full border-2 border-transparent border-t-neon-purple"
            style={{ inset: '15%' }}
            animate={{ rotate: -360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute rounded-full border-2 border-transparent border-t-neon-pink"
            style={{ inset: '30%' }}
            animate={{ rotate: 360 }}
            transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute rounded-full bg-gradient-to-br from-accent-indigo to-accent-purple"
            style={{ inset: '40%' }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </div>
      )}

      {type === 'dna' && (
        <div className="dna-loader" style={{ transform: `scale(${s.scale})` }}>
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="w-3 h-3 rounded-full bg-gradient-to-br from-accent-indigo to-accent-purple"
              animate={{
                y: [-15, 15, -15],
                scale: [1, 1.3, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.1,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      )}

      {type === 'pulse' && (
        <div className="relative" style={{ width: s.orbit, height: s.orbit }}>
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-full border-2 border-accent-indigo"
              initial={{ scale: 0.5, opacity: 1 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.6,
                ease: 'easeOut',
              }}
            />
          ))}
          <motion.div
            className="absolute inset-1/4 rounded-full bg-gradient-to-br from-accent-indigo to-accent-purple"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </div>
      )}

      {type === 'bars' && (
        <div className="flex gap-1 items-end h-12" style={{ transform: `scale(${s.scale})` }}>
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 rounded-full bg-gradient-to-t from-accent-indigo to-accent-purple"
              animate={{ height: ['20%', '100%', '20%'] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.1,
                ease: 'easeInOut',
              }}
              style={{ minHeight: 8 }}
            />
          ))}
        </div>
      )}

      {text && (
        <motion.p
          className="text-sm text-surface-400 font-medium"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}

// Full Page Loader
export function PageLoader({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-300/90 backdrop-blur-xl">
      <div className="flex flex-col items-center gap-6">
        <Loader3D type="orbit" size="lg" />
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h3 className="text-xl font-semibold gradient-text mb-2">Lynx BI</h3>
          <p className="text-surface-400">{text}</p>
        </motion.div>
      </div>
    </div>
  );
}

// Inline Loader
export function InlineLoader({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  return (
    <div className="flex items-center gap-2">
      <motion.div
        className={`rounded-full bg-gradient-to-r from-accent-indigo to-accent-purple ${
          size === 'sm' ? 'w-4 h-4' : 'w-6 h-6'
        }`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}
