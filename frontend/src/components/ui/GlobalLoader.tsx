'use client';

import { motion } from 'framer-motion';
import { CpuChipIcon } from '@heroicons/react/24/outline';

interface GlobalLoaderProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'mips' | 'data' | 'analytics';
}

export function GlobalLoader({ text = 'Loading...', size = 'md', variant = 'mips' }: GlobalLoaderProps) {
  const sizeClasses = {
    sm: { container: 'w-24 h-24', core: 'w-12 h-12', text: 'text-sm' },
    md: { container: 'w-32 h-32', core: 'w-16 h-16', text: 'text-base' },
    lg: { container: 'w-48 h-48', core: 'w-24 h-24', text: 'text-lg' },
  };

  const sizes = sizeClasses[size];

  if (variant === 'mips') {
    return (
      <div className="flex flex-col items-center justify-center gap-6">
        <div className={`relative ${sizes.container}`} style={{ perspective: '1000px' }}>
          {/* Rotating Hexagon Frame */}
          <motion.div
            className="absolute inset-0"
            animate={{ rotateY: [0, 360] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute inset-0 border-2 border-accent-indigo/40"
                style={{
                  clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                  transform: `rotateZ(${i * 60}deg) translateZ(${i * 5}px)`,
                }}
                animate={{
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </motion.div>

          {/* MIPS Chip Core */}
          <motion.div
            className={`absolute inset-0 m-auto ${sizes.core} rounded-2xl bg-gradient-to-br from-accent-indigo via-accent-purple to-accent-pink flex items-center justify-center`}
            animate={{
              rotateZ: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotateZ: { duration: 3, repeat: Infinity, ease: 'linear' },
              scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
            }}
            style={{
              transformStyle: 'preserve-3d',
              boxShadow: '0 0 40px rgba(99, 102, 241, 0.6)',
            }}
          >
            <CpuChipIcon className="w-1/2 h-1/2 text-white" />
          </motion.div>

          {/* Data Streams */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`stream-${i}`}
              className="absolute w-1 h-8 bg-gradient-to-b from-neon-cyan to-transparent rounded-full"
              style={{
                left: '50%',
                top: '50%',
                marginLeft: '-2px',
                transformOrigin: 'center -40px',
              }}
              animate={{
                rotateZ: [i * 45, i * 45 + 360],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.25,
                ease: 'linear',
              }}
            />
          ))}

          {/* Orbiting Particles */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute w-2 h-2 bg-neon-green rounded-full"
              style={{
                left: '50%',
                top: '50%',
                marginLeft: '-4px',
                marginTop: '-4px',
              }}
              animate={{
                rotate: [0, 360],
                x: [0, 60 * Math.cos((i * 90 * Math.PI) / 180)],
                y: [0, 60 * Math.sin((i * 90 * Math.PI) / 180)],
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
          <motion.div
            className="text-center"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <p className={`text-white font-semibold ${sizes.text}`}>{text}</p>
            <motion.div
              className="flex justify-center gap-1 mt-2"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 bg-accent-indigo rounded-full"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        )}
      </div>
    );
  }

  if (variant === 'data') {
    return (
      <div className="flex flex-col items-center justify-center gap-6">
        <div className={`relative ${sizes.container}`} style={{ perspective: '1200px' }}>
          {/* Data Bars */}
          {[...Array(8)].map((_, i) => {
            const height = 40 + Math.random() * 60;
            return (
              <motion.div
                key={i}
                className="absolute bottom-0 bg-gradient-to-t from-accent-indigo to-accent-purple rounded-t-lg"
                style={{
                  left: `${10 + i * 11}%`,
                  width: '8%',
                  transformStyle: 'preserve-3d',
                }}
                animate={{
                  height: [`${height}%`, `${height + 20}%`, `${height}%`],
                  rotateY: [0, 360],
                }}
                transition={{
                  height: { duration: 1.5, repeat: Infinity, delay: i * 0.1 },
                  rotateY: { duration: 8, repeat: Infinity, ease: 'linear' },
                }}
              >
                <motion.div
                  className="absolute bottom-0 left-0 w-full h-1 bg-neon-cyan blur-sm"
                  animate={{
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                />
              </motion.div>
            );
          })}

          {/* Center Glow */}
          <motion.div
            className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-gradient-to-br from-accent-indigo/50 to-accent-purple/50 blur-2xl"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />
        </div>

        {text && (
          <motion.p
            className={`text-white font-semibold ${sizes.text}`}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {text}
          </motion.p>
        )}
      </div>
    );
  }

  // Analytics variant
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className={`relative ${sizes.container}`} style={{ perspective: '1000px' }}>
        {/* Rotating Rings */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute inset-${i * 2} border-2 rounded-full`}
            style={{
              borderColor: i === 0 ? 'rgba(99, 102, 241, 0.4)' : i === 1 ? 'rgba(168, 85, 247, 0.4)' : 'rgba(236, 72, 153, 0.4)',
              transformStyle: 'preserve-3d',
            }}
            animate={{
              rotateX: [0, 360],
              rotateY: [0, i % 2 === 0 ? 360 : -360],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}

        {/* Center Pulse */}
        <motion.div
          className="absolute inset-0 m-auto w-8 h-8 rounded-full bg-gradient-to-br from-neon-cyan via-accent-indigo to-accent-purple"
          animate={{
            scale: [1, 1.3, 1],
            boxShadow: [
              '0 0 20px rgba(99, 102, 241, 0.5)',
              '0 0 40px rgba(168, 85, 247, 0.8)',
              '0 0 20px rgba(236, 72, 153, 0.5)',
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />

        {/* Data Points */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 bg-neon-cyan rounded-full"
            style={{
              left: '50%',
              top: '50%',
            }}
            animate={{
              rotate: [0, 360],
              x: [0, 50 * Math.cos((i * 30 * Math.PI) / 180)],
              y: [0, 50 * Math.sin((i * 30 * Math.PI) / 180)],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.1,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {text && (
        <motion.p
          className={`text-white font-semibold ${sizes.text}`}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}
