'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FloatingCubes3D } from '@/components/ui/FloatingCubes3D';
import { ParticleField } from '@/components/ui/ParticleField';
import { AnimatedGrid3D } from '@/components/ui/AnimatedGrid3D';
import { DataVisualization3D } from '@/components/ui/DataVisualization3D';
import { MIPSChip3D } from '@/components/ui/MIPSChip3D';
import { Database3D } from '@/components/ui/Database3D';
import { PieChart3D } from '@/components/ui/PieChart3D';
import { DataFlow3D } from '@/components/ui/DataFlow3D';
import { HolographicCard } from '@/components/ui/HolographicCard';
import { SpinningGlobe3D } from '@/components/ui/SpinningGlobe3D';
import {
  CloudArrowUpIcon,
  ChartBarIcon,
  CpuChipIcon,
  BoltIcon,
  ArrowRightIcon,
  SparklesIcon,
  CubeTransparentIcon,
  RocketLaunchIcon,
  CircleStackIcon,
  ChartPieIcon,
} from '@heroicons/react/24/outline';

const features = [
  {
    icon: CloudArrowUpIcon,
    title: 'Data Ingestion',
    description: 'Upload CSV, Excel, and TXT files with automatic schema inference',
    href: '/upload',
    gradient: 'from-emerald-400 to-cyan-400',
    glow: 'shadow-neon-green',
  },
  {
    icon: ChartBarIcon,
    title: 'Interactive Dashboards',
    description: 'Build Power BI-style dashboards with drag-and-drop widgets',
    href: '/dashboards',
    gradient: 'from-orange-400 to-amber-400',
    glow: 'shadow-[0_0_30px_rgba(251,146,60,0.3)]',
  },
  {
    icon: CpuChipIcon,
    title: 'MIPS Analytics',
    description: 'High-performance computations powered by MIPS assembly',
    href: '/report',
    gradient: 'from-violet-400 to-purple-400',
    glow: 'shadow-neon-purple',
  },
  {
    icon: BoltIcon,
    title: 'Real-time KPIs',
    description: 'Track metrics with intelligent thresholds and alerts',
    href: '/analytics',
    gradient: 'from-pink-400 to-rose-400',
    glow: 'shadow-neon-pink',
  },
];

const stats = [
  { value: '7+', label: 'Aggregation Functions', icon: SparklesIcon },
  { value: '6+', label: 'Chart Types', icon: CubeTransparentIcon },
  { value: '100%', label: 'MIPS Powered', icon: RocketLaunchIcon },
];

export default function HomePage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 3D Background Elements */}
      <FloatingCubes3D />
      <ParticleField />
      <AnimatedGrid3D />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated Background Orbs */}
        <motion.div
          className="absolute top-20 left-1/4 w-96 h-96 bg-accent-indigo/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-40 right-1/4 w-80 h-80 bg-accent-purple/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -30, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 left-1/2 w-72 h-72 bg-accent-pink/15 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 40, 0],
          }}
          transition={{ duration: 12, repeat: Infinity }}
        />

        <div className="relative max-w-7xl mx-auto px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-indigo/10 border border-accent-indigo/20 mb-8"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              >
                <SparklesIcon className="w-4 h-4 text-accent-indigo" />
              </motion.div>
              <span className="text-sm text-accent-indigo font-medium">Powered by MIPS Assembly</span>
            </motion.div>

            {/* Main Heading with 3D MIPS Chip */}
            <div className="flex items-center justify-center gap-8 mb-6">
              <motion.div
                initial={{ opacity: 0, x: -50, rotateY: -90 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                transition={{ delay: 0.4, duration: 1 }}
                className="hidden lg:block w-32 h-32"
              >
                <MIPSChip3D />
              </motion.div>

              <h1 className="text-6xl md:text-7xl font-bold leading-tight">
                <span className="text-white">Business Intelligence</span>
                <br />
                <span className="gradient-text-glow">Reimagined</span>
              </h1>

              <motion.div
                initial={{ opacity: 0, x: 50, rotateY: 90 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                transition={{ delay: 0.4, duration: 1 }}
                className="hidden lg:block w-32 h-32"
              >
                <MIPSChip3D />
              </motion.div>
            </div>

            <p className="text-xl text-surface-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Lynx BI combines the elegance of modern BI tools with the raw performance
              of MIPS assembly. Upload your data, build dashboards, and gain insights
              at unprecedented speed.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/upload">
                <motion.button
                  className="btn-neon text-white flex items-center gap-2 group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Get Started
                  <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
              <Link href="/dashboards">
                <motion.button
                  className="px-6 py-3 rounded-xl font-semibold text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  View Dashboards
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* 3D Floating Card Preview with Data Visualization */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-20 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-dark-300 via-transparent to-transparent z-10 pointer-events-none" />
            
            {/* Floating 3D Dashboard Card */}
            <motion.div
              className="glass-card rounded-3xl p-8 max-w-5xl mx-auto relative"
              animate={{ 
                y: [0, -15, 0],
                rotateX: [5, 8, 5],
              }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                transform: 'perspective(1500px) rotateX(5deg)',
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Animated Glow */}
              <motion.div
                className="absolute -inset-1 bg-gradient-to-r from-accent-indigo/20 via-accent-purple/20 to-accent-pink/20 rounded-3xl blur-2xl"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [0.98, 1.02, 0.98],
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />

              <div className="relative">
                {/* KPI Cards Row */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {[
                    { icon: CircleStackIcon, value: '2.4M', label: 'Records', color: 'from-neon-blue to-neon-cyan' },
                    { icon: ChartPieIcon, value: '94%', label: 'Accuracy', color: 'from-neon-green to-neon-cyan' },
                    { icon: BoltIcon, value: '0.3ms', label: 'Query Time', color: 'from-neon-orange to-neon-pink' },
                  ].map((kpi, i) => (
                    <motion.div
                      key={i}
                      className="glass-card rounded-xl p-4 border border-white/10"
                      initial={{ opacity: 0, scale: 0.8, z: -50 }}
                      animate={{ 
                        opacity: 1, 
                        scale: 1,
                        z: 0,
                      }}
                      transition={{ 
                        delay: 0.7 + i * 0.15,
                        type: 'spring',
                      }}
                      whileHover={{ 
                        scale: 1.05,
                        z: 20,
                        transition: { duration: 0.2 }
                      }}
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${kpi.color} flex items-center justify-center`}>
                          <kpi.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-white">{kpi.value}</div>
                          <div className="text-xs text-surface-400">{kpi.label}</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* 3D Data Visualization */}
                <motion.div
                  className="glass-card rounded-2xl p-6 border border-accent-indigo/20 bg-gradient-to-br from-accent-indigo/5 to-accent-purple/5"
                  initial={{ opacity: 0, z: -100 }}
                  animate={{ opacity: 1, z: 0 }}
                  transition={{ delay: 1.2 }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <DataVisualization3D />
                </motion.div>
              </div>
            </motion.div>

            {/* Floating Elements Around Card */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-indigo/10 to-accent-purple/5 border border-accent-indigo/20 backdrop-blur-sm"
                style={{
                  left: `${15 + (i % 3) * 35}%`,
                  top: `${i < 3 ? -10 : 110}%`,
                  transform: 'perspective(1000px)',
                  transformStyle: 'preserve-3d',
                }}
                animate={{
                  y: [0, -20, 0],
                  rotateX: [0, 360],
                  rotateY: [0, 360],
                }}
                transition={{
                  duration: 8 + i * 2,
                  repeat: Infinity,
                  delay: i * 0.5,
                }}
              />
            ))}
          </motion.div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="relative max-w-7xl mx-auto px-8 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-white mb-4">Platform Features</h2>
          <p className="text-surface-400 max-w-xl mx-auto">
            Everything you need to transform raw data into actionable insights
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30, rotateX: -15 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, type: 'spring' }}
              style={{ 
                perspective: '1000px',
                transformStyle: 'preserve-3d',
              }}
            >
              <Link href={feature.href}>
                <motion.div
                  className="glass-card card-3d rounded-2xl p-6 h-full group cursor-pointer relative overflow-hidden"
                  whileHover={{ 
                    scale: 1.03,
                    rotateY: 5,
                    z: 50,
                  }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Animated Background Gradient */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                    animate={{
                      backgroundPosition: ['0% 0%', '100% 100%'],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatType: 'reverse',
                    }}
                  />

                  <div className="relative flex items-start gap-5">
                    <motion.div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} ${feature.glow} flex items-center justify-center flex-shrink-0`}
                      whileHover={{ 
                        rotate: [0, -10, 10, -10, 0],
                        scale: 1.1,
                      }}
                      transition={{ duration: 0.6 }}
                      style={{
                        transformStyle: 'preserve-3d',
                        transform: 'translateZ(20px)',
                      }}
                    >
                      <feature.icon className="w-7 h-7 text-white" />
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-accent-indigo transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-surface-400 text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                    <motion.div
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ArrowRightIcon className="w-5 h-5 text-surface-600 group-hover:text-accent-indigo transition-all" />
                    </motion.div>
                  </div>

                  {/* 3D Corner Accent */}
                  <motion.div
                    className="absolute -bottom-2 -right-2 w-20 h-20 bg-gradient-to-br from-accent-indigo/20 to-transparent rounded-tl-3xl opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{
                      transform: 'translateZ(-10px)',
                    }}
                  />
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 3D Technology Showcase */}
      <div className="relative max-w-7xl mx-auto px-8 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-white mb-4">Powered by Advanced Technology</h2>
          <p className="text-surface-400 max-w-xl mx-auto">
            Experience the future of data analytics with our cutting-edge 3D visualizations
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Database 3D */}
          <HolographicCard delay={0}>
            <div className="text-center">
              <div className="h-48 mb-4">
                <Database3D />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Data Storage</h3>
              <p className="text-sm text-surface-400">
                Efficient multi-layer database architecture with real-time data flow
              </p>
            </div>
          </HolographicCard>

          {/* Pie Chart 3D */}
          <HolographicCard delay={0.1}>
            <div className="text-center">
              <div className="h-48 mb-4">
                <PieChart3D />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">3D Analytics</h3>
              <p className="text-sm text-surface-400">
                Interactive 3D charts with depth perception and hover effects
              </p>
            </div>
          </HolographicCard>

          {/* Globe 3D */}
          <HolographicCard delay={0.2}>
            <div className="text-center">
              <div className="h-48 mb-4">
                <SpinningGlobe3D />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Global Reach</h3>
              <p className="text-sm text-surface-400">
                Analyze data from anywhere with distributed processing
              </p>
            </div>
          </HolographicCard>
        </div>

        {/* Data Flow Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <HolographicCard delay={0.3}>
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold text-white mb-2">Data Processing Pipeline</h3>
              <p className="text-sm text-surface-400">
                Watch how your data flows through our MIPS-powered analytics engine
              </p>
            </div>
            <DataFlow3D />
          </HolographicCard>
        </motion.div>
      </div>

      {/* Stats Section */}
      <div className="relative py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-accent-indigo/5 via-accent-purple/5 to-accent-pink/5" />
        
        {/* 3D Floating Rings */}
        <motion.div
          className="absolute left-1/4 top-1/2 w-64 h-64 border-2 border-accent-indigo/20 rounded-full"
          style={{
            transform: 'perspective(1000px) rotateX(75deg)',
          }}
          animate={{
            rotateZ: [0, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        <motion.div
          className="absolute right-1/4 top-1/2 w-48 h-48 border-2 border-accent-purple/20 rounded-full"
          style={{
            transform: 'perspective(1000px) rotateY(75deg)',
          }}
          animate={{
            rotateZ: [360, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-3 gap-8">
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20, rotateX: -20 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, type: 'spring' }}
                className="text-center"
                style={{
                  perspective: '1000px',
                  transformStyle: 'preserve-3d',
                }}
              >
                <motion.div
                  className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-accent-indigo/20 to-accent-purple/10 border border-accent-indigo/20 flex items-center justify-center relative"
                  whileHover={{ 
                    scale: 1.15, 
                    rotateY: 180,
                  }}
                  transition={{ duration: 0.6 }}
                  style={{
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {/* Front */}
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{
                      backfaceVisibility: 'hidden',
                    }}
                  >
                    <stat.icon className="w-8 h-8 text-accent-indigo" />
                  </motion.div>
                  
                  {/* Back */}
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-accent-purple to-accent-indigo rounded-2xl"
                    style={{
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                    }}
                  >
                    <SparklesIcon className="w-8 h-8 text-white" />
                  </motion.div>

                  {/* Glow */}
                  <motion.div
                    className="absolute inset-0 bg-accent-indigo/30 rounded-2xl blur-xl"
                    animate={{
                      opacity: [0.3, 0.6, 0.3],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: idx * 0.3,
                    }}
                  />
                </motion.div>
                
                <motion.div
                  className="text-4xl font-bold gradient-text mb-2"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 + 0.2, type: 'spring' }}
                  whileHover={{ scale: 1.1 }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-surface-400 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative max-w-7xl mx-auto px-8 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-card rounded-3xl p-12 text-center relative overflow-hidden"
          style={{
            perspective: '1000px',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Animated 3D Background */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-accent-indigo/10 via-accent-purple/10 to-accent-pink/10"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{
              backgroundSize: '200% 200%',
            }}
          />

          {/* Floating 3D Cubes */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-12 h-12 bg-gradient-to-br from-accent-indigo/20 to-accent-purple/10 rounded-lg border border-accent-indigo/30"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 2) * 40}%`,
                transform: 'perspective(500px)',
                transformStyle: 'preserve-3d',
              }}
              animate={{
                rotateX: [0, 360],
                rotateY: [0, 360],
                y: [0, -20, 0],
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            />
          ))}
          
          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-accent-indigo to-accent-purple flex items-center justify-center shadow-neon-purple"
              style={{
                transform: 'translateZ(50px)',
              }}
            >
              <RocketLaunchIcon className="w-10 h-10 text-white" />
            </motion.div>

            <motion.h2 
              className="text-3xl font-bold text-white mb-4"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              Ready to Transform Your Data?
            </motion.h2>
            
            <motion.p 
              className="text-surface-400 mb-8 max-w-xl mx-auto"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              Start building powerful analytics dashboards with the speed of assembly language
            </motion.p>
            
            <Link href="/upload">
              <motion.button
                className="btn-neon text-white text-lg px-8 py-4 relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                style={{
                  transform: 'translateZ(30px)',
                }}
              >
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-accent-indigo via-accent-purple to-accent-pink rounded-xl blur-xl opacity-50"
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />
                <span className="relative flex items-center gap-2">
                  Start Analyzing Now
                  <ArrowRightIcon className="w-5 h-5" />
                </span>
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
