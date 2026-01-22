'use client';

import { motion } from 'framer-motion';
import { CpuChipIcon } from '@heroicons/react/24/outline';

export function MIPSChip3D() {
  return (
    <div className="relative w-full h-full flex items-center justify-center" style={{ perspective: '1500px' }}>
      <motion.div
        className="relative w-48 h-48"
        animate={{
          rotateY: [0, 360],
          rotateX: [0, 15, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Main Chip Body */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-accent-indigo via-accent-purple to-accent-pink rounded-3xl"
          style={{
            transformStyle: 'preserve-3d',
            boxShadow: '0 25px 50px -12px rgba(99, 102, 241, 0.5)',
          }}
        >
          {/* Front Face */}
          <div className="absolute inset-0 rounded-3xl border-2 border-white/20 backdrop-blur-sm flex items-center justify-center">
            <CpuChipIcon className="w-20 h-20 text-white" />
          </div>

          {/* Circuit Lines */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-neon-cyan/50"
              style={{
                width: i % 2 === 0 ? '2px' : '100%',
                height: i % 2 === 0 ? '100%' : '2px',
                left: i % 2 === 0 ? `${20 + i * 10}%` : 0,
                top: i % 2 === 0 ? 0 : `${20 + (i - 1) * 10}%`,
              }}
              animate={{
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}

          {/* Corner Pins */}
          {[
            { top: '-4px', left: '-4px' },
            { top: '-4px', right: '-4px' },
            { bottom: '-4px', left: '-4px' },
            { bottom: '-4px', right: '-4px' },
          ].map((pos, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 bg-neon-green rounded-full"
              style={pos}
              animate={{
                scale: [1, 1.3, 1],
                boxShadow: [
                  '0 0 10px rgba(16, 185, 129, 0.5)',
                  '0 0 20px rgba(16, 185, 129, 0.8)',
                  '0 0 10px rgba(16, 185, 129, 0.5)',
                ],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}

          {/* Glow Effect */}
          <motion.div
            className="absolute inset-0 rounded-3xl bg-gradient-to-br from-accent-indigo/50 to-accent-purple/50 blur-2xl"
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
            style={{
              transform: 'translateZ(-20px)',
            }}
          />
        </motion.div>

        {/* Side Pins */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`left-${i}`}
            className="absolute w-8 h-2 bg-gradient-to-r from-surface-600 to-surface-500 rounded-r"
            style={{
              left: '-32px',
              top: `${20 + i * 12}%`,
              transform: 'translateZ(10px)',
            }}
            animate={{
              x: [-2, 0, -2],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.1,
            }}
          />
        ))}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`right-${i}`}
            className="absolute w-8 h-2 bg-gradient-to-l from-surface-600 to-surface-500 rounded-l"
            style={{
              right: '-32px',
              top: `${20 + i * 12}%`,
              transform: 'translateZ(10px)',
            }}
            animate={{
              x: [2, 0, 2],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.1,
            }}
          />
        ))}
      </motion.div>

      {/* Orbiting Particles */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 bg-neon-cyan rounded-full"
          style={{
            left: '50%',
            top: '50%',
          }}
          animate={{
            rotate: [0, 360],
            x: [0, 120 * Math.cos((i * 120 * Math.PI) / 180)],
            y: [0, 120 * Math.sin((i * 120 * Math.PI) / 180)],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'linear',
            delay: i * 0.5,
          }}
        />
      ))}
    </div>
  );
}
