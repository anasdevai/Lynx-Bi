'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Cube {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  rotateX: number;
  rotateY: number;
  color: string;
}

export function FloatingCubes3D() {
  const [cubes, setCubes] = useState<Cube[]>([]);

  useEffect(() => {
    const colors = [
      'from-accent-indigo/20 to-accent-purple/10',
      'from-accent-purple/20 to-accent-pink/10',
      'from-neon-cyan/20 to-neon-blue/10',
      'from-neon-green/20 to-neon-cyan/10',
    ];

    const newCubes = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 60 + Math.random() * 80,
      duration: 15 + Math.random() * 10,
      delay: Math.random() * 5,
      rotateX: Math.random() * 360,
      rotateY: Math.random() * 360,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    setCubes(newCubes);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {cubes.map((cube) => (
        <motion.div
          key={cube.id}
          className="absolute"
          style={{
            left: `${cube.x}%`,
            top: `${cube.y}%`,
            width: cube.size,
            height: cube.size,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, 50, 0],
            rotateX: [cube.rotateX, cube.rotateX + 360],
            rotateY: [cube.rotateY, cube.rotateY + 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: cube.duration,
            repeat: Infinity,
            delay: cube.delay,
            ease: 'easeInOut',
          }}
        >
          <div
            className={`w-full h-full bg-gradient-to-br ${cube.color} rounded-2xl backdrop-blur-sm border border-white/5`}
            style={{
              transform: 'perspective(1000px) rotateX(45deg) rotateZ(45deg)',
              transformStyle: 'preserve-3d',
              boxShadow: '0 25px 50px -12px rgba(99, 102, 241, 0.25)',
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}
