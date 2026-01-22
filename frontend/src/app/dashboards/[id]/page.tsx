'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { getDashboard, addWidget, deleteWidget, executeQuery, getMeasures, getDimensions } from '@/lib/api';
import { ChartWrapper } from '@/components/charts/ChartWrapper';
import { KPICard } from '@/components/charts/KPICard';
import { AdvancedLoader3D } from '@/components/ui/AdvancedLoader3D';
import { Select } from '@/components/ui/Select';
import { FloatingCubes3D } from '@/components/ui/FloatingCubes3D';
import { ParticleField } from '@/components/ui/ParticleField';
import {
  PlusIcon,
  FunnelIcon,
  TrashIcon,
  Cog6ToothIcon,
  ArrowPathIcon,
  XMarkIcon,
  ChartBarIcon,
  ChartPieIcon,
  PresentationChartLineIcon,
  CubeIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

const chartTypes = [
  { id: 'bar', name: 'Bar', icon: ChartBarIcon },
  { id: 'line', name: 'Line', icon: PresentationChartLineIcon },
  { id: 'pie', name: 'Pie', icon: ChartPieIcon },
  { id: 'doughnut', name: 'Donut', icon: ChartPieIcon },
  { id: 'area', name: 'Area', icon: PresentationChartLineIcon },
  { id: 'horizontal-bar', name: 'H-Bar', icon: ChartBarIcon },
  { id: 'radar', name: 'Radar', icon: CubeIcon },
  { id: 'polar', name: 'Polar', icon: CubeIcon },
];

export default function DashboardViewPage() {
  const params = useParams();
  const dashboardId = params.id as string;
  const queryClient = useQueryClient();
  
  const [showAddWidget, setShowAddWidget] = useState(false);
  const [widgetConfig, setWidgetConfig] = useState({
    title: '',
    type: 'chart' as 'chart' | 'kpi',
    chartType: 'bar' as any,
    measure: '',
    groupBy: '',
  });
  const [widgetResults, setWidgetResults] = useState<Record<string, any>>({});
  const [refreshing, setRefreshing] = useState(false);

  const { data: dashboard, isLoading } = useQuery({
    queryKey: ['dashboard', dashboardId],
    queryFn: () => getDashboard(dashboardId),
  });

  const { data: measuresData } = useQuery({
    queryKey: ['measures', dashboard?.datasetId],
    queryFn: () => getMeasures(dashboard!.datasetId),
    enabled: !!dashboard?.datasetId,
  });

  const { data: dimensionsData } = useQuery({
    queryKey: ['dimensions', dashboard?.datasetId],
    queryFn: () => getDimensions(dashboard!.datasetId),
    enabled: !!dashboard?.datasetId,
  });

  const addWidgetMutation = useMutation({
    mutationFn: (widget: any) => addWidget(dashboardId, widget),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard', dashboardId] });
      setShowAddWidget(false);
      setWidgetConfig({ title: '', type: 'chart', chartType: 'bar', measure: '', groupBy: '' });
    },
  });

  const deleteWidgetMutation = useMutation({
    mutationFn: (widgetId: string) => deleteWidget(dashboardId, widgetId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard', dashboardId] });
    },
  });

  // Execute queries for all widgets
  const refreshWidgets = async () => {
    if (!dashboard?.widgets || !dashboard.datasetId) return;
    setRefreshing(true);

    for (const widget of dashboard.widgets) {
      try {
        const result = await executeQuery(dashboard.datasetId, widget.query);
        setWidgetResults(prev => ({ ...prev, [widget.id]: result.result }));
      } catch (error) {
        console.error('Query error:', error);
      }
    }
    setRefreshing(false);
  };

  useEffect(() => {
    refreshWidgets();
  }, [dashboard]);

  const handleAddWidget = () => {
    if (!widgetConfig.measure) return;
    
    // Generate truly unique ID using timestamp and random string
    const uniqueId = `widget-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    
    const widget = {
      id: uniqueId,
      title: widgetConfig.title || 'New Widget',
      type: widgetConfig.type,
      chartType: widgetConfig.chartType,
      query: {
        measures: [widgetConfig.measure],
        groupBy: widgetConfig.groupBy ? [widgetConfig.groupBy] : [],
      },
      position: { x: 0, y: 0, w: 4, h: 3 },
    };
    
    console.log('Adding widget with ID:', uniqueId); // Debug log
    addWidgetMutation.mutate(widget);
  };

  const renderWidget = (widget: any, index: number) => {
    const result = widgetResults[widget.id];
    
    if (!result) {
      return (
        <div className="flex items-center justify-center h-full">
          <AdvancedLoader3D text="Loading..." size="sm" />
        </div>
      );
    }

    if (widget.type === 'kpi') {
      const measureKey = Object.keys(result.measures)[0];
      const value = result.measures[measureKey] || 0;
      return (
        <KPICard
          title={widget.title}
          value={value}
          status="green"
          format="number"
        />
      );
    }

    // Chart widget
    const chartData = {
      labels: result.groups?.map((g: any) => {
        const keyVal = Object.entries(g).find(([k]) => !k.includes('('));
        return keyVal ? String(keyVal[1]) : 'Total';
      }) || ['Total'],
      datasets: [{
        label: widget.query.measures?.[0] || 'Value',
        data: result.groups?.map((g: any) => {
          const measureKey = widget.query.measures?.[0];
          return g[measureKey] || 0;
        }) || [result.measures?.[widget.query.measures?.[0]] || 0],
      }],
    };

    return (
      <ChartWrapper
        type={widget.chartType || 'bar'}
        data={chartData}
        title={widget.title}
      />
    );
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center min-h-screen">
        <AdvancedLoader3D text="Loading Dashboard..." size="lg" />
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="h-full flex items-center justify-center text-surface-400 min-h-screen">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-accent-indigo/20 to-accent-purple/10 border border-accent-indigo/20 flex items-center justify-center">
            <CubeIcon className="w-10 h-10 text-accent-indigo" />
          </div>
          <p className="text-xl font-semibold text-white">Dashboard not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 3D Background Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <FloatingCubes3D />
        <ParticleField />
      </div>

      {/* Animated Background Orbs */}
      <motion.div
        className="absolute top-20 right-1/4 w-96 h-96 bg-accent-indigo/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <div className="relative p-6 lg:p-8">
      {/* Header */}
      <motion.div 
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-3xl font-bold text-white">{dashboard.name}</h1>
          <p className="text-surface-400 mt-1">{dashboard.widgets?.length || 0} widgets • Last updated just now</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={refreshWidgets}
            disabled={refreshing}
            className="px-4 py-3 rounded-xl font-medium text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center gap-2"
          >
            <ArrowPathIcon className={clsx('w-5 h-5', refreshing && 'animate-spin')} />
            <span className="hidden sm:inline">Refresh</span>
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-3 rounded-xl font-medium text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center gap-2"
          >
            <FunnelIcon className="w-5 h-5" />
            <span className="hidden sm:inline">Filters</span>
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAddWidget(true)} 
            className="btn-neon text-white flex items-center gap-2"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Add Widget</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Add Widget Modal */}
      <AnimatePresence>
        {showAddWidget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddWidget(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="glass-card rounded-3xl w-full max-w-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-accent-indigo to-accent-purple p-6 text-white relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 opacity-20"
                  animate={{
                    backgroundPosition: ['0% 0%', '100% 100%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: 'reverse',
                  }}
                  style={{
                    backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.1) 75%)',
                    backgroundSize: '20px 20px',
                  }}
                />
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                      <SparklesIcon className="w-6 h-6" />
                    </div>
                    <h2 className="text-xl font-bold">Add New Widget</h2>
                  </div>
                  <button onClick={() => setShowAddWidget(false)} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-2">Widget Title</label>
                  <input
                    type="text"
                    className="input-glass"
                    value={widgetConfig.title}
                    onChange={(e) => setWidgetConfig({ ...widgetConfig, title: e.target.value })}
                    placeholder="e.g., Sales by Region"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-300 mb-2">Widget Type</label>
                    <div className="flex gap-2">
                      {['chart', 'kpi'].map((type) => (
                        <button
                          key={type}
                          onClick={() => setWidgetConfig({ ...widgetConfig, type: type as any })}
                          className={clsx(
                            'flex-1 py-2 px-4 rounded-xl font-medium capitalize transition-all',
                            widgetConfig.type === type
                              ? 'bg-gradient-to-r from-accent-indigo to-accent-purple text-white shadow-neon-purple'
                              : 'bg-white/5 text-surface-400 hover:bg-white/10 border border-white/10'
                          )}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {widgetConfig.type === 'chart' && (
                  <div>
                    <label className="block text-sm font-medium text-surface-300 mb-2">Chart Type</label>
                    <div className="grid grid-cols-4 gap-2">
                      {chartTypes.map((chart) => (
                        <motion.button
                          key={chart.id}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setWidgetConfig({ ...widgetConfig, chartType: chart.id })}
                          className={clsx(
                            'p-3 rounded-xl flex flex-col items-center gap-1 transition-all',
                            widgetConfig.chartType === chart.id
                              ? 'bg-gradient-to-br from-accent-indigo to-accent-purple text-white shadow-neon-purple'
                              : 'bg-white/5 text-surface-400 hover:bg-white/10 border border-white/10'
                          )}
                        >
                          <chart.icon className="w-5 h-5" />
                          <span className="text-xs font-medium">{chart.name}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-2">Measure</label>
                  <Select
                    value={widgetConfig.measure}
                    onChange={(value) => setWidgetConfig({ ...widgetConfig, measure: value })}
                    options={[
                      { value: '', label: 'Select a measure' },
                      ...(measuresData?.measures?.map((m: string) => ({ value: m, label: m })) || [])
                    ]}
                    placeholder="Select a measure"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-2">Group By (optional)</label>
                  <Select
                    value={widgetConfig.groupBy}
                    onChange={(value) => setWidgetConfig({ ...widgetConfig, groupBy: value })}
                    options={[
                      { value: '', label: 'No grouping' },
                      ...(dimensionsData?.dimensions?.map((d: any) => ({ value: d.name, label: `${d.name} (${d.type})` })) || [])
                    ]}
                    placeholder="No grouping"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 bg-white/[0.02] border-t border-white/5 flex gap-3">
                <button onClick={() => setShowAddWidget(false)} className="flex-1 px-4 py-3 rounded-xl font-medium text-surface-400 bg-white/5 hover:bg-white/10 transition-all">
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddWidget}
                  disabled={!widgetConfig.measure}
                  className="flex-1 btn-neon text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Add Widget</span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Widgets Grid */}
      {dashboard.widgets?.length === 0 ? (
        <motion.div 
          className="glass-card rounded-3xl text-center py-20"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-accent-indigo/20 to-accent-purple/10 border border-accent-indigo/20 flex items-center justify-center"
          >
            <CubeIcon className="w-10 h-10 text-accent-indigo" />
          </motion.div>
          <p className="text-xl font-semibold text-white mb-2">No widgets yet</p>
          <p className="text-surface-400 mb-6">Add your first widget to start building your dashboard</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddWidget(true)}
            className="btn-neon text-white"
          >
            <span>Add Your First Widget</span>
          </motion.button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {dashboard.widgets?.map((widget: any, idx: number) => (
            <motion.div
              key={widget.id}
              initial={{ opacity: 0, y: 30, scale: 0.9, rotateX: -10 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
              transition={{ delay: idx * 0.1, type: 'spring', stiffness: 100 }}
              whileHover={{ y: -4, scale: 1.02 }}
              style={{ perspective: '1000px' }}
              className={clsx(
                'glass-card card-3d group relative overflow-hidden',
                widget.type === 'kpi' ? 'p-0' : 'min-h-[350px]'
              )}
            >
              {/* Animated Background Gradient */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-accent-indigo/5 to-accent-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                animate={{
                  backgroundPosition: ['0% 0%', '100% 100%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
              />

              {/* Widget Actions */}
              <div className="absolute top-3 right-3 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 bg-white/10 backdrop-blur rounded-xl shadow-sm hover:bg-white/20 border border-white/10"
                >
                  <Cog6ToothIcon className="w-4 h-4 text-white" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => deleteWidgetMutation.mutate(widget.id)}
                  className="p-2 bg-red-500/10 backdrop-blur rounded-xl shadow-sm hover:bg-red-500/20 border border-red-500/20"
                >
                  <TrashIcon className="w-4 h-4 text-red-400" />
                </motion.button>
              </div>
              
              {/* Widget Content */}
              <div className={widget.type === 'kpi' ? '' : 'h-full relative'}>
                {renderWidget(widget, idx)}
              </div>

              {/* 3D Corner Accent */}
              <motion.div
                className="absolute -bottom-2 -right-2 w-20 h-20 bg-gradient-to-br from-accent-indigo/20 to-transparent rounded-tl-3xl opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  transform: 'translateZ(-10px)',
                }}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
    </div>
  );
}
