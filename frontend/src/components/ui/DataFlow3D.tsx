'use client';

import { motion } from 'framer-motion';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

export function DataFlow3D() {
  const nodes = [
    { id: 1, x: 0, y: 50, label: 'CSV', color: 'from-neon-green to-neon-cyan' },
    { id: 2, x: 33, y: 30, label: 'MIPS', color: 'from-accent-indigo to-accent-purple' },
    { id: 3, x: 33, y: 70, label: 'Parse', color: 'from-neon-cyan to-neon-blue' },
    { id: 4, x: 66, y: 50, label: 'Query', color: 'from-neon-orange to-neon-pink' },
    { id: 5, x: 100, y: 50, label: 'Chart', color: 'from-accent-purple to-accent-pink' },
  ];

  const connections = [
    { from: 0, to: 1 },
    { from: 0, to: 2 },
    { from: 1, to: 3 },
    { from: 2, to: 3 },
    { from: 3, to: 4 },
  ];

  return (
    <div className="relative w-full h-64" style={{ perspective: '1000px' }}>
      <motion.div
        className="relative w-full h-full"
        style={{
          transformStyle: 'preserve-3d',
        }}
        animate={{
          rotateY: [-5, 5, -5],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* Connection Lines */}
        {connections.map((conn, index) => {
          const fromNode = nodes[conn.from];
          const toNode = nodes[conn.to];
          const length = Math.sqrt(
            Math.pow(toNode.x - fromNode.x, 2) + Math.pow(toNode.y - fromNode.y, 2)
          );
          const angle = Math.atan2(toNode.y - fromNode.y, toNode.x - fromNode.x) * (180 / Math.PI);

          return (
            <motion.div
              key={index}
              className="absolute h-1 bg-gradient-to-r from-accent-indigo/50 to-accent-purple/50"
              style={{
                left: `${fromNode.x}%`,
                top: `${fromNode.y}%`,
                width: `${length}%`,
                transformOrigin: 'left center',
                transform: `rotate(${angle}deg) translateZ(-10px)`,
              }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
            >
              {/* Animated Data Packet */}
              <motion.div
                className="absolute w-3 h-3 bg-neon-cyan rounded-full"
                style={{
                  top: '50%',
                  transform: 'translateY(-50%)',
                }}
                animate={{
                  left: ['0%', '100%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.3,
                  ease: 'linear',
                }}
              />
            </motion.div>
          );
        })}

        {/* Nodes */}
        {nodes.map((node, index) => (
          <motion.div
            key={node.id}
            className="absolute"
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
              transform: 'translate(-50%, -50%)',
              transformStyle: 'preserve-3d',
            }}
            initial={{ scale: 0, z: -100, opacity: 0 }}
            animate={{ scale: 1, z: 0, opacity: 1 }}
            transition={{ delay: index * 0.15, type: 'spring' }}
            whileHover={{
              scale: 1.2,
              z: 50,
              transition: { duration: 0.3 },
            }}
          >
            {/* Node Body */}
            <motion.div
              className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${node.color} flex items-center justify-center relative`}
              style={{
                transformStyle: 'preserve-3d',
                boxShadow: '0 10px 30px rgba(99, 102, 241, 0.3)',
              }}
              animate={{
                rotateY: [0, 360],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: 'linear',
                delay: index * 0.5,
              }}
            >
              {/* Front Face */}
              <div
                className="absolute inset-0 rounded-2xl border-2 border-white/20 backdrop-blur-sm flex items-center justify-center"
                style={{
                  backfaceVisibility: 'hidden',
                }}
              >
                <span className="text-white font-bold text-sm">{node.label}</span>
              </div>

              {/* Back Face */}
              <div
                className="absolute inset-0 rounded-2xl border-2 border-white/20 backdrop-blur-sm flex items-center justify-center bg-white/10"
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                }}
              >
                <ArrowRightIcon className="w-8 h-8 text-white" />
              </div>

              {/* 3D Depth */}
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-b ${node.color} opacity-60`}
                style={{
                  transform: 'translateZ(-10px)',
                }}
              />

              {/* Glow */}
              <motion.div
                className="absolute inset-0 rounded-2xl blur-xl opacity-50"
                style={{
                  background: `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
                }}
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.2,
                }}
              />
            </motion.div>

            {/* Orbiting Particles */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-neon-cyan rounded-full"
                style={{
                  left: '50%',
                  top: '50%',
                }}
                animate={{
                  rotate: [0, 360],
                  x: [0, 40 * Math.cos((i * 120 * Math.PI) / 180)],
                  y: [0, 40 * Math.sin((i * 120 * Math.PI) / 180)],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'linear',
                  delay: i * 0.3,
                }}
              />
            ))}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
