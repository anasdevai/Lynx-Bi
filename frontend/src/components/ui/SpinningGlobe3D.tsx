'use client';

import { motion } from 'framer-motion';

export function SpinningGlobe3D() {
  return (
    <div className="relative w-full h-full flex items-center justify-center" style={{ perspective: '1000px' }}>
      <motion.div
        className="relative w-40 h-40"
        animate={{
          rotateY: [0, 360],
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
        {/* Globe Sphere */}
        <div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-accent-indigo/30 to-accent-purple/30 border-2 border-accent-indigo/40"
          style={{
            transformStyle: 'preserve-3d',
            boxShadow: '0 0 60px rgba(99, 102, 241, 0.4), inset 0 0 40px rgba(99, 102, 241, 0.2)',
          }}
        >
          {/* Latitude Lines */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={`lat-${i}`}
              className="absolute left-0 right-0 border-t border-accent-indigo/30"
              style={{
                top: `${20 + i * 15}%`,
                transform: `rotateX(${-60 + i * 30}deg) translateZ(80px)`,
              }}
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}

          {/* Longitude Lines */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`long-${i}`}
              className="absolute inset-0 border-2 border-accent-purple/20 rounded-full"
              style={{
                transform: `rotateY(${i * 22.5}deg) rotateX(90deg)`,
              }}
              animate={{
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.1,
              }}
            />
          ))}

          {/* Data Points */}
          {[...Array(12)].map((_, i) => {
            const lat = (Math.random() - 0.5) * 140;
            const long = Math.random() * 360;
            const radius = 80;
            const x = radius * Math.cos((lat * Math.PI) / 180) * Math.cos((long * Math.PI) / 180);
            const y = radius * Math.sin((lat * Math.PI) / 180);
            const z = radius * Math.cos((lat * Math.PI) / 180) * Math.sin((long * Math.PI) / 180);

            return (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-neon-cyan rounded-full"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: `translate(-50%, -50%) translate3d(${x}px, ${y}px, ${z}px)`,
                }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.15,
                }}
              />
            );
          })}

          {/* Glow Core */}
          <motion.div
            className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-gradient-to-br from-accent-indigo to-accent-purple"
            style={{
              filter: 'blur(20px)',
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
          />
        </div>

        {/* Orbiting Ring */}
        <motion.div
          className="absolute inset-0 border-2 border-neon-cyan/40 rounded-full"
          style={{
            transform: 'rotateX(75deg)',
          }}
          animate={{
            rotateZ: [0, 360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* Outer Ring */}
        <motion.div
          className="absolute inset-0 -m-4 border border-accent-purple/30 rounded-full"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
          }}
        />
      </motion.div>
    </div>
  );
}
