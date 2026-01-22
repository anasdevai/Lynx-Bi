'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface HolographicCardProps {
  children: ReactNode;
  delay?: number;
}

export function HolographicCard({ children, delay = 0 }: HolographicCardProps) {
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 50, rotateX: -20 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ delay, type: 'spring', stiffness: 100 }}
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
      }}
    >
      <motion.div
        className="relative glass-card rounded-2xl p-6 overflow-hidden"
        whileHover={{
          rotateY: 5,
          rotateX: 5,
          scale: 1.02,
          z: 50,
        }}
        transition={{ duration: 0.3 }}
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Holographic Shimmer Effect */}
        <motion.div
          className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500"
          style={{
            background: 'linear-gradient(45deg, transparent 30%, rgba(99, 102, 241, 0.1) 50%, transparent 70%)',
            backgroundSize: '200% 200%',
          }}
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* Scanline Effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(99, 102, 241, 0.03) 2px, rgba(99, 102, 241, 0.03) 4px)',
          }}
          animate={{
            y: ['-100%', '100%'],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* Corner Accents */}
        {[
          { top: 0, left: 0, rotate: 0 },
          { top: 0, right: 0, rotate: 90 },
          { bottom: 0, right: 0, rotate: 180 },
          { bottom: 0, left: 0, rotate: 270 },
        ].map((pos, i) => (
          <motion.div
            key={i}
            className="absolute w-8 h-8"
            style={{
              ...pos,
              transform: `rotate(${pos.rotate}deg)`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + i * 0.1 }}
          >
            <div className="w-full h-0.5 bg-gradient-to-r from-accent-indigo to-transparent" />
            <div className="w-0.5 h-full bg-gradient-to-b from-accent-indigo to-transparent" />
          </motion.div>
        ))}

        {/* Glow Border */}
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{
            border: '1px solid transparent',
            backgroundImage: 'linear-gradient(45deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2), rgba(236, 72, 153, 0.2))',
            backgroundOrigin: 'border-box',
            backgroundClip: 'border-box',
            WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />

        {/* Content */}
        <div className="relative z-10" style={{ transform: 'translateZ(20px)' }}>
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}
