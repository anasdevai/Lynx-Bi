'use client';

import { motion } from 'framer-motion';

interface AdvancedLoader3DProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function AdvancedLoader3D({ text, size = 'md' }: AdvancedLoader3DProps) {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className={`relative ${sizeClasses[size]}`} style={{ perspective: '1000px' }}>
        {/* Outer Ring */}
        <motion.div
          className="absolute inset-0 border-4 border-accent-indigo/30 rounded-full"
          animate={{
            rotateX: [0, 360],
            rotateY: [0, 360],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            transformStyle: 'preserve-3d',
          }}
        />

        {/* Middle Ring */}
        <motion.div
          className="absolute inset-2 border-4 border-accent-purple/40 rounded-full"
          animate={{
            rotateX: [360, 0],
            rotateZ: [0, 360],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            transformStyle: 'preserve-3d',
          }}
        />

        {/* Inner Ring */}
        <motion.div
          className="absolute inset-4 border-4 border-accent-pink/50 rounded-full"
          animate={{
            rotateY: [0, 360],
            rotateZ: [360, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            transformStyle: 'preserve-3d',
          }}
        />

        {/* Center Core */}
        <motion.div
          className="absolute inset-0 m-auto w-8 h-8 rounded-full bg-gradient-to-br from-accent-indigo via-accent-purple to-accent-pink"
          animate={{
            scale: [1, 1.2, 1],
            boxShadow: [
              '0 0 20px rgba(99, 102, 241, 0.5)',
              '0 0 40px rgba(168, 85, 247, 0.8)',
              '0 0 20px rgba(236, 72, 153, 0.5)',
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Orbiting Particles */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 bg-neon-cyan rounded-full"
            style={{
              left: '50%',
              top: '50%',
              marginLeft: '-6px',
              marginTop: '-6px',
            }}
            animate={{
              rotate: [0, 360],
              x: [0, 40 * Math.cos((i * 90 * Math.PI) / 180)],
              y: [0, 40 * Math.sin((i * 90 * Math.PI) / 180)],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
              delay: i * 0.2,
            }}
          />
        ))}
      </div>

      {text && (
        <motion.p
          className="text-surface-400 font-medium"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}
