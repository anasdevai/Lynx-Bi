'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { getDashboards, createDashboard, deleteDashboard, getDatasets } from '@/lib/api';
import { Loader3D } from '@/components/ui/Loader3D';
import { Select } from '@/components/ui/Select';
import { FloatingCubes3D } from '@/components/ui/FloatingCubes3D';
import { ParticleField } from '@/components/ui/ParticleField';
import {
  PlusIcon,
  Squares2X2Icon,
  TrashIcon,
  XMarkIcon,
  SparklesIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

export default function DashboardsPage() {
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [newDashboard, setNewDashboard] = useState({ name: '', datasetId: '' });

  const { data: dashboards = [], isLoading } = useQuery({
    queryKey: ['dashboards'],
    queryFn: getDashboards,
  });

  const { data: datasets = [] } = useQuery({
    queryKey: ['datasets'],
    queryFn: getDatasets,
  });

  const createMutation = useMutation({
    mutationFn: createDashboard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboards'] });
      setShowCreate(false);
      setNewDashboard({ name: '', datasetId: '' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDashboard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboards'] });
    },
  });

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 3D Background Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <FloatingCubes3D />
        <ParticleField />
      </div>

      {/* Animated Background Orbs */}
      <motion.div
        className="absolute top-20 right-1/4 w-96 h-96 bg-accent-indigo/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 left-1/4 w-80 h-80 bg-accent-purple/10 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          x: [0, -30, 0],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="relative p-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboards</h1>
          <p className="text-surface-400">Create and manage your analytics dashboards</p>
        </div>
        <motion.button
          onClick={() => setShowCreate(true)}
          className="btn-neon text-white flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          <PlusIcon className="w-5 h-5" />
          New Dashboard
        </motion.button>
      </motion.div>

      {/* Create Dashboard Modal */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowCreate(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card rounded-3xl p-8 w-full max-w-md relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowCreate(false)}
                className="absolute top-4 right-4 p-2 rounded-xl text-surface-400 hover:text-white hover:bg-white/5 transition-all"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent-indigo to-accent-purple flex items-center justify-center shadow-neon-purple">
                  <SparklesIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Create Dashboard</h2>
                  <p className="text-sm text-surface-400">Build a new analytics view</p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-2">Name</label>
                  <input
                    type="text"
                    className="input-glass"
                    value={newDashboard.name}
                    onChange={(e) => setNewDashboard({ ...newDashboard, name: e.target.value })}
                    placeholder="Sales Dashboard"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-2">Dataset</label>
                  <Select
                    value={newDashboard.datasetId}
                    onChange={(value) => setNewDashboard({ ...newDashboard, datasetId: value })}
                    options={[
                      { value: '', label: 'Select a dataset' },
                      ...datasets.map((ds: any) => ({ value: ds.id, label: ds.name }))
                    ]}
                    placeholder="Select a dataset"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowCreate(false)}
                    className="flex-1 px-4 py-3 rounded-xl font-medium text-surface-400 bg-white/5 hover:bg-white/10 transition-all"
                  >
                    Cancel
                  </button>
                  <motion.button
                    onClick={() => createMutation.mutate(newDashboard)}
                    disabled={!newDashboard.name || !newDashboard.datasetId}
                    className="flex-1 btn-neon text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Create
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dashboards Grid */}
      {isLoading ? (
        <div className="glass-card rounded-3xl p-16 flex justify-center">
          <Loader3D type="cube" text="Loading dashboards..." />
        </div>
      ) : dashboards.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl p-16 text-center"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-accent-indigo/20 to-accent-purple/10 border border-accent-indigo/20 flex items-center justify-center">
            <Squares2X2Icon className="w-10 h-10 text-accent-indigo" />
          </div>
          <p className="text-xl font-semibold text-white mb-2">No dashboards yet</p>
          <p className="text-surface-400 mb-6">Create your first dashboard to get started</p>
          <motion.button
            onClick={() => setShowCreate(true)}
            className="btn-neon text-white"
            whileHover={{ scale: 1.05 }}
          >
            Create Dashboard
          </motion.button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboards.map((dashboard: any, idx: number) => (
            <motion.div
              key={dashboard.id}
              initial={{ opacity: 0, y: 20, rotateX: -10 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ delay: idx * 0.05, type: 'spring' }}
              style={{ perspective: '1000px' }}
            >
              <Link href={`/dashboards/${dashboard.id}`}>
                <motion.div
                  className="glass-card card-3d rounded-2xl p-6 group cursor-pointer h-full relative overflow-hidden"
                  whileHover={{ 
                    scale: 1.03,
                    rotateY: 5,
                    z: 50,
                  }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Animated Background Gradient */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-accent-indigo/10 to-accent-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    animate={{
                      backgroundPosition: ['0% 0%', '100% 100%'],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatType: 'reverse',
                    }}
                  />

                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <motion.div 
                        className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent-indigo to-accent-purple flex items-center justify-center shadow-neon-purple"
                        whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                        style={{
                          transformStyle: 'preserve-3d',
                          transform: 'translateZ(20px)',
                        }}
                      >
                        <Squares2X2Icon className="w-6 h-6 text-white" />
                      </motion.div>
                      <motion.button
                        onClick={(e) => {
                          e.preventDefault();
                          deleteMutation.mutate(dashboard.id);
                        }}
                        className="p-2 rounded-xl text-surface-500 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <TrashIcon className="w-5 h-5" />
                      </motion.button>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-accent-indigo transition-colors">
                      {dashboard.name}
                    </h3>
                    <p className="text-sm text-surface-400 mb-4 flex items-center gap-2">
                      <ChartBarIcon className="w-4 h-4" />
                      {dashboard.widgets?.length || 0} widgets
                    </p>
                    
                    {/* Mini Preview with 3D effect */}
                    <div className="grid grid-cols-3 gap-1.5 mb-4">
                      {[...Array(6)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="h-6 rounded bg-white/5 border border-white/5"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.05 + i * 0.02 }}
                          whileHover={{ 
                            scale: 1.1,
                            backgroundColor: 'rgba(99, 102, 241, 0.1)',
                          }}
                        />
                      ))}
                    </div>
                    
                    <p className="text-xs text-surface-500">
                      Updated {new Date(dashboard.updatedAt).toLocaleDateString()}
                    </p>
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
      )}
    </div>
    </div>
  );
}
