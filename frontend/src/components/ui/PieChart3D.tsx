'use client';

import { motion } from 'framer-motion';

export function PieChart3D() {
  const segments = [
    { percent: 35, color: 'from-accent-indigo to-accent-purple', rotation: 0 },
    { percent: 25, color: 'from-neon-cyan to-neon-blue', rotation: 126 },
    { percent: 20, color: 'from-neon-green to-neon-cyan', rotation: 216 },
    { percent: 20, color: 'from-neon-orange to-neon-pink', rotation: 288 },
  ];

  return (
    <div className="relative w-full h-full flex items-center justify-center" style={{ perspective: '1200px' }}>
      <motion.div
        className="relative w-48 h-48"
        animate={{
          rotateY: [0, 360],
          rotateX: [60, 65, 60],
        }}
        transition={{
          rotateY: { duration: 20, repeat: Infinity, ease: 'linear' },
          rotateX: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
        }}
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Pie Chart Base */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            transformStyle: 'preserve-3d',
            transform: 'translateZ(0px)',
          }}
        >
          {segments.map((segment, index) => (
            <motion.div
              key={index}
              className={`absolute inset-0 rounded-full bg-gradient-to-br ${segment.color}`}
              style={{
                clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos((segment.rotation * Math.PI) / 180)}% ${50 + 50 * Math.sin((segment.rotation * Math.PI) / 180)}%, ${50 + 50 * Math.cos(((segment.rotation + segment.percent * 3.6) * Math.PI) / 180)}% ${50 + 50 * Math.sin(((segment.rotation + segment.percent * 3.6) * Math.PI) / 180)}%)`,
                transformStyle: 'preserve-3d',
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.2, type: 'spring' }}
              whileHover={{
                scale: 1.1,
                z: 20,
                transition: { duration: 0.3 },
              }}
            >
              {/* 3D Depth */}
              <div
                className={`absolute inset-0 bg-gradient-to-b ${segment.color} opacity-80`}
                style={{
                  transform: 'translateZ(-10px)',
                  clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos((segment.rotation * Math.PI) / 180)}% ${50 + 50 * Math.sin((segment.rotation * Math.PI) / 180)}%, ${50 + 50 * Math.cos(((segment.rotation + segment.percent * 3.6) * Math.PI) / 180)}% ${50 + 50 * Math.sin(((segment.rotation + segment.percent * 3.6) * Math.PI) / 180)}%)`,
                }}
              />
            </motion.div>
          ))}

          {/* Center Hole */}
          <motion.div
            className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-dark-300 border-2 border-white/10"
            style={{
              transform: 'translateZ(5px)',
            }}
            animate={{
              boxShadow: [
                '0 0 20px rgba(99, 102, 241, 0.3)',
                '0 0 40px rgba(99, 102, 241, 0.6)',
                '0 0 20px rgba(99, 102, 241, 0.3)',
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />
        </div>

        {/* Floating Labels */}
        {segments.map((segment, index) => {
          const angle = segment.rotation + (segment.percent * 3.6) / 2;
          const radius = 110;
          const x = radius * Math.cos((angle * Math.PI) / 180);
          const y = radius * Math.sin((angle * Math.PI) / 180);

          return (
            <motion.div
              key={`label-${index}`}
              className="absolute w-12 h-12 flex items-center justify-center"
              style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                transform: 'translate(-50%, -50%) translateZ(30px)',
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.2 + 0.5 }}
            >
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${segment.color} flex items-center justify-center text-white text-xs font-bold shadow-lg`}>
                {segment.percent}%
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
