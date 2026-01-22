'use client';

import { motion } from 'framer-motion';

export function DataVisualization3D() {
  const bars = [65, 85, 45, 90, 70, 55, 80, 60];

  return (
    <div className="relative w-full h-64" style={{ perspective: '1000px' }}>
      <motion.div
        className="absolute inset-0 flex items-end justify-center gap-3"
        style={{
          transformStyle: 'preserve-3d',
        }}
        animate={{
          rotateY: [0, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {bars.map((height, i) => (
          <motion.div
            key={i}
            className="relative"
            style={{
              transformStyle: 'preserve-3d',
            }}
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            transition={{
              delay: i * 0.1,
              duration: 0.8,
              type: 'spring',
            }}
          >
            {/* Front face */}
            <motion.div
              className="w-12 bg-gradient-to-t from-accent-indigo to-accent-purple rounded-t-lg"
              style={{
                height: `${height}%`,
                transformStyle: 'preserve-3d',
              }}
              animate={{
                height: [`${height}%`, `${height + 10}%`, `${height}%`],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeInOut',
              }}
            >
              {/* Top face */}
              <div
                className="absolute top-0 left-0 w-full h-3 bg-accent-purple"
                style={{
                  transform: 'rotateX(90deg) translateZ(1.5px)',
                  transformOrigin: 'top',
                }}
              />
              {/* Right face */}
              <div
                className="absolute top-0 right-0 h-full w-3 bg-accent-indigo/60"
                style={{
                  transform: 'rotateY(90deg) translateZ(1.5px)',
                  transformOrigin: 'right',
                }}
              />
            </motion.div>

            {/* Glow effect */}
            <motion.div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-2 bg-accent-indigo/50 blur-xl"
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
