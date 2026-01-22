'use client';

import { motion } from 'framer-motion';

export function Database3D() {
  return (
    <div className="relative w-full h-full flex items-center justify-center" style={{ perspective: '1000px' }}>
      <motion.div
        className="relative"
        animate={{
          rotateY: [0, 360],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Database Cylinders Stack */}
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="relative"
            style={{
              transformStyle: 'preserve-3d',
            }}
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.2, type: 'spring' }}
          >
            {/* Cylinder */}
            <motion.div
              className="relative w-32 h-12 mb-2"
              animate={{
                y: [0, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.3,
              }}
              style={{
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Top Ellipse */}
              <div
                className="absolute top-0 left-0 w-full h-6 bg-gradient-to-r from-accent-indigo to-accent-purple rounded-full border-2 border-accent-indigo/50"
                style={{
                  transform: 'rotateX(60deg)',
                  boxShadow: '0 10px 30px rgba(99, 102, 241, 0.4)',
                }}
              />
              
              {/* Cylinder Body */}
              <div
                className="absolute top-3 left-0 w-full h-6 bg-gradient-to-b from-accent-indigo to-accent-purple"
                style={{
                  borderLeft: '2px solid rgba(99, 102, 241, 0.5)',
                  borderRight: '2px solid rgba(99, 102, 241, 0.5)',
                }}
              />
              
              {/* Bottom Ellipse */}
              <div
                className="absolute bottom-0 left-0 w-full h-6 bg-gradient-to-r from-accent-purple to-accent-indigo rounded-full border-2 border-accent-purple/50"
                style={{
                  transform: 'rotateX(60deg)',
                  boxShadow: '0 10px 30px rgba(168, 85, 247, 0.4)',
                }}
              />

              {/* Data Lines */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute left-1/4 w-1/2 h-0.5 bg-neon-cyan"
                  style={{
                    top: `${30 + i * 20}%`,
                  }}
                  animate={{
                    opacity: [0.3, 1, 0.3],
                    scaleX: [0.8, 1, 0.8],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        ))}

        {/* Data Flow Particles */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-neon-green rounded-full"
            style={{
              left: '50%',
              top: '0%',
            }}
            animate={{
              y: [0, 150],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.4,
              ease: 'easeInOut',
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}
