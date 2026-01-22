'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { getDatasets, getDataset } from '@/lib/api';
import { Loader3D } from '@/components/ui/Loader3D';
import {
  CircleStackIcon,
  TableCellsIcon,
  HashtagIcon,
  CalendarIcon,
  DocumentTextIcon,
  ChartBarIcon,
  FunnelIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

const typeConfig: Record<string, { icon: any; color: string; bg: string }> = {
  integer: { icon: HashtagIcon, color: 'text-neon-blue', bg: 'from-neon-blue to-neon-cyan' },
  float: { icon: HashtagIcon, color: 'text-neon-cyan', bg: 'from-neon-cyan to-neon-green' },
  date: { icon: CalendarIcon, color: 'text-neon-purple', bg: 'from-accent-purple to-accent-pink' },
  string: { icon: DocumentTextIcon, color: 'text-surface-400', bg: 'from-surface-500 to-surface-600' },
};

export default function DataModelPage() {
  const [selectedDatasetId, setSelectedDatasetId] = useState<string | null>(null);

  const { data: datasets = [], isLoading: loadingDatasets } = useQuery({
    queryKey: ['datasets'],
    queryFn: getDatasets,
  });

  const { data: selectedDataset, isLoading: loadingDataset } = useQuery({
    queryKey: ['dataset', selectedDatasetId],
    queryFn: () => getDataset(selectedDatasetId!),
    enabled: !!selectedDatasetId,
  });

  return (
    <div className="flex h-full">
      {/* Left Panel - Dataset List */}
      <motion.div 
        className="w-72 lg:w-80 bg-dark-200/50 backdrop-blur-xl border-r border-white/5 flex flex-col overflow-hidden"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
      >
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-indigo to-accent-purple flex items-center justify-center shadow-neon-purple">
              <CircleStackIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Data Model</h2>
              <p className="text-xs text-surface-500">Explore your schemas</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loadingDatasets ? (
            <div className="py-8 flex justify-center">
              <Loader3D type="orbit" size="sm" />
            </div>
          ) : datasets.length === 0 ? (
            <div className="text-center py-8">
              <CircleStackIcon className="w-12 h-12 mx-auto mb-3 text-surface-600" />
              <p className="text-surface-500 text-sm">No datasets uploaded</p>
            </div>
          ) : (
            <div className="space-y-2">
              {datasets.map((ds: any, idx: number) => (
                <motion.button
                  key={ds.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ x: 4 }}
                  onClick={() => setSelectedDatasetId(ds.id)}
                  className={clsx(
                    'w-full text-left p-4 rounded-xl transition-all',
                    selectedDatasetId === ds.id
                      ? 'bg-gradient-to-r from-accent-indigo to-accent-purple text-white shadow-neon-purple'
                      : 'bg-white/[0.02] border border-white/5 hover:bg-white/5 hover:border-accent-indigo/30'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={clsx(
                      'w-10 h-10 rounded-lg flex items-center justify-center',
                      selectedDatasetId === ds.id
                        ? 'bg-white/20'
                        : 'bg-accent-indigo/10 border border-accent-indigo/20'
                    )}>
                      <CircleStackIcon className={clsx(
                        'w-5 h-5',
                        selectedDatasetId === ds.id ? 'text-white' : 'text-accent-indigo'
                      )} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={clsx(
                        'font-semibold truncate',
                        selectedDatasetId === ds.id ? 'text-white' : 'text-white'
                      )}>
                        {ds.name}
                      </div>
                      <div className={clsx(
                        'text-xs',
                        selectedDatasetId === ds.id ? 'text-white/70' : 'text-surface-500'
                      )}>
                        {ds.rowCount.toLocaleString()} rows • {ds.columnCount} cols
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Right Panel - Schema View */}
      <div className="flex-1 p-6 lg:p-8 overflow-y-auto">
        <AnimatePresence mode="wait">
          {!selectedDatasetId ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex items-center justify-center"
            >
              <div className="text-center">
                <motion.div
                  animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-accent-indigo/20 to-accent-purple/10 border border-accent-indigo/20 flex items-center justify-center"
                >
                  <TableCellsIcon className="w-10 h-10 text-accent-indigo" />
                </motion.div>
                <p className="text-xl font-semibold text-white">Select a dataset</p>
                <p className="text-surface-400 mt-2">Choose from the list to view its schema</p>
              </div>
            </motion.div>
          ) : loadingDataset ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex items-center justify-center"
            >
              <Loader3D type="cube" size="lg" text="Loading schema..." />
            </motion.div>
          ) : selectedDataset ? (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Dataset Header */}
              <div className="glass-card rounded-2xl p-6 bg-gradient-to-r from-accent-indigo/20 to-accent-purple/10 border border-accent-indigo/20">
                <div className="flex items-center gap-5">
                  <motion.div 
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    className="w-16 h-16 bg-gradient-to-br from-accent-indigo to-accent-purple rounded-2xl flex items-center justify-center shadow-neon-purple"
                  >
                    <CircleStackIcon className="w-8 h-8 text-white" />
                  </motion.div>
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-white">{selectedDataset.name}</h1>
                    <p className="text-surface-400 mt-1">
                      {selectedDataset.rowCount.toLocaleString()} rows • {selectedDataset.columnCount} columns
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <div className="text-center px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                      <ChartBarIcon className="w-5 h-5 mx-auto mb-1 text-neon-green" />
                      <p className="text-xs text-surface-400">Measures</p>
                      <p className="font-bold text-white">
                        {selectedDataset.schema.columns.filter((c: any) => c.type === 'integer' || c.type === 'float').length}
                      </p>
                    </div>
                    <div className="text-center px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                      <FunnelIcon className="w-5 h-5 mx-auto mb-1 text-neon-orange" />
                      <p className="text-xs text-surface-400">Dimensions</p>
                      <p className="font-bold text-white">
                        {selectedDataset.schema.columns.filter((c: any) => c.type === 'string' || c.type === 'date').length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Schema Table */}
              <div className="glass-card rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-white/5 flex items-center gap-3">
                  <SparklesIcon className="w-5 h-5 text-accent-indigo" />
                  <h2 className="font-semibold text-white">Schema Definition</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/5">
                        <th className="px-6 py-4 text-left text-sm font-medium text-surface-400">Column</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-surface-400">Type</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-surface-400">Nullable</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-surface-400">Category</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedDataset.schema.columns.map((col: any, idx: number) => {
                        const config = typeConfig[col.type] || typeConfig.string;
                        const Icon = config.icon;
                        const isMeasure = col.type === 'integer' || col.type === 'float';
                        
                        return (
                          <motion.tr 
                            key={col.name} 
                            className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.03 }}
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className={clsx(
                                  'w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br text-white',
                                  config.bg
                                )}>
                                  <Icon className="w-4 h-4" />
                                </div>
                                <span className="font-semibold text-white">{col.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={clsx(
                                'inline-flex px-3 py-1.5 text-xs font-semibold rounded-full text-white bg-gradient-to-r',
                                config.bg
                              )}>
                                {col.type}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={clsx(
                                'inline-flex px-3 py-1 text-xs font-medium rounded-full',
                                col.nullable 
                                  ? 'bg-neon-orange/10 text-neon-orange border border-neon-orange/20' 
                                  : 'bg-neon-green/10 text-neon-green border border-neon-green/20'
                              )}>
                                {col.nullable ? 'Yes' : 'No'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={clsx(
                                'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full',
                                isMeasure
                                  ? 'bg-neon-green/10 text-neon-green border border-neon-green/20'
                                  : 'bg-neon-orange/10 text-neon-orange border border-neon-orange/20'
                              )}>
                                {isMeasure ? (
                                  <><ChartBarIcon className="w-3.5 h-3.5" /> Measure</>
                                ) : (
                                  <><FunnelIcon className="w-3.5 h-3.5" /> Dimension</>
                                )}
                              </span>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Data Preview */}
              {selectedDataset.preview && selectedDataset.preview.length > 0 && (
                <motion.div 
                  className="glass-card rounded-2xl overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="p-6 border-b border-white/5 flex items-center gap-3">
                    <TableCellsIcon className="w-5 h-5 text-accent-purple" />
                    <h2 className="font-semibold text-white">Data Preview</h2>
                    <span className="text-sm text-surface-500">(First 10 rows)</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/5">
                          {selectedDataset.schema.columns.map((col: any) => (
                            <th key={col.name} className="px-4 py-3 text-left font-medium text-surface-400 whitespace-nowrap">
                              {col.name}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {selectedDataset.preview.slice(0, 10).map((row: any, idx: number) => (
                          <motion.tr 
                            key={idx} 
                            className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: idx * 0.02 }}
                          >
                            {selectedDataset.schema.columns.map((col: any) => (
                              <td key={col.name} className="px-4 py-3 text-surface-300 whitespace-nowrap font-mono text-xs">
                                {row[col.name] !== null ? String(row[col.name]).substring(0, 30) : 
                                  <span className="text-surface-600 italic">null</span>
                                }
                              </td>
                            ))}
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
