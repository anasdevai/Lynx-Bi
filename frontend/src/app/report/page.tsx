'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { getDatasets, getMeasures, getDimensions, executeQuery, BIQuery } from '@/lib/api';
import { ChartWrapper } from '@/components/charts/ChartWrapper';
import { KPICard } from '@/components/charts/KPICard';
import { Loader3D } from '@/components/ui/Loader3D';
import {
  PlayIcon,
  ChartBarIcon,
  TableCellsIcon,
  CubeIcon,
  SparklesIcon,
  PresentationChartLineIcon,
} from '@heroicons/react/24/outline';

export default function ReportBuilderPage() {
  const [selectedDataset, setSelectedDataset] = useState('');
  const [query, setQuery] = useState<BIQuery>({
    measures: [],
    groupBy: [],
    filters: {},
  });
  const [result, setResult] = useState<any>(null);
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie' | 'area'>('bar');

  const { data: datasets = [] } = useQuery({
    queryKey: ['datasets'],
    queryFn: getDatasets,
  });

  const { data: measuresData } = useQuery({
    queryKey: ['measures', selectedDataset],
    queryFn: () => getMeasures(selectedDataset),
    enabled: !!selectedDataset,
  });

  const { data: dimensionsData } = useQuery({
    queryKey: ['dimensions', selectedDataset],
    queryFn: () => getDimensions(selectedDataset),
    enabled: !!selectedDataset,
  });

  const executeMutation = useMutation({
    mutationFn: () => executeQuery(selectedDataset, query),
    onSuccess: (data) => setResult(data.result),
  });

  const toggleMeasure = (measure: string) => {
    setQuery(prev => ({
      ...prev,
      measures: prev.measures?.includes(measure)
        ? prev.measures.filter(m => m !== measure)
        : [...(prev.measures || []), measure],
    }));
  };

  const toggleGroupBy = (dim: string) => {
    setQuery(prev => ({
      ...prev,
      groupBy: prev.groupBy?.includes(dim)
        ? prev.groupBy.filter(d => d !== dim)
        : [...(prev.groupBy || []), dim],
    }));
  };

  const getChartData = () => {
    if (!result) return null;

    if (result.groups?.length > 0) {
      return {
        labels: result.groups.map((g: any) => {
          const keyValues = Object.entries(g).filter(([k]) => !k.includes('('));
          return keyValues.map(([, v]) => v).join(' - ');
        }),
        datasets: query.measures?.map((measure) => ({
          label: measure,
          data: result.groups.map((g: any) => g[measure] || 0),
        })) || [],
      };
    }

    return {
      labels: query.measures || [],
      datasets: [{
        label: 'Values',
        data: query.measures?.map(m => result.measures?.[m] || 0) || [],
      }],
    };
  };

  const chartTypes = [
    { id: 'bar', icon: ChartBarIcon },
    { id: 'line', icon: PresentationChartLineIcon },
    { id: 'pie', icon: CubeIcon },
    { id: 'area', icon: SparklesIcon },
  ];

  return (
    <div className="flex h-full">
      {/* Left Panel - Query Builder */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-80 bg-dark-200/50 backdrop-blur-xl border-r border-white/5 p-6 overflow-y-auto"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-indigo to-accent-purple flex items-center justify-center shadow-neon-purple">
            <SparklesIcon className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white">Report Builder</h2>
        </div>

        {/* Dataset Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-surface-300 mb-2">Dataset</label>
          <select
            className="input-glass"
            value={selectedDataset}
            onChange={(e) => {
              setSelectedDataset(e.target.value);
              setQuery({ measures: [], groupBy: [], filters: {} });
              setResult(null);
            }}
          >
            <option value="">Select dataset</option>
            {datasets.map((ds: any) => (
              <option key={ds.id} value={ds.id}>{ds.name}</option>
            ))}
          </select>
        </div>

        {selectedDataset && (
          <>
            {/* Measures */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-surface-300 mb-3 flex items-center gap-2">
                <ChartBarIcon className="w-4 h-4 text-accent-purple" />
                Measures
              </label>
              <div className="space-y-1 max-h-48 overflow-y-auto pr-2">
                {measuresData?.measures?.map((measure: string) => (
                  <motion.label
                    key={measure}
                    className={`
                      flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all
                      ${query.measures?.includes(measure) 
                        ? 'bg-accent-indigo/10 border border-accent-indigo/30' 
                        : 'bg-white/[0.02] border border-transparent hover:bg-white/5'
                      }
                    `}
                    whileHover={{ x: 2 }}
                  >
                    <input
                      type="checkbox"
                      checked={query.measures?.includes(measure)}
                      onChange={() => toggleMeasure(measure)}
                      className="w-4 h-4 rounded border-white/20 bg-white/5 text-accent-indigo focus:ring-accent-indigo/50"
                    />
                    <span className="text-sm text-surface-300">{measure}</span>
                  </motion.label>
                ))}
              </div>
            </div>

            {/* Dimensions (Group By) */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-surface-300 mb-3 flex items-center gap-2">
                <TableCellsIcon className="w-4 h-4 text-accent-pink" />
                Group By
              </label>
              <div className="space-y-1 max-h-48 overflow-y-auto pr-2">
                {dimensionsData?.dimensions?.map((dim: any) => (
                  <motion.label
                    key={dim.name}
                    className={`
                      flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all
                      ${query.groupBy?.includes(dim.name) 
                        ? 'bg-accent-pink/10 border border-accent-pink/30' 
                        : 'bg-white/[0.02] border border-transparent hover:bg-white/5'
                      }
                    `}
                    whileHover={{ x: 2 }}
                  >
                    <input
                      type="checkbox"
                      checked={query.groupBy?.includes(dim.name)}
                      onChange={() => toggleGroupBy(dim.name)}
                      className="w-4 h-4 rounded border-white/20 bg-white/5 text-accent-pink focus:ring-accent-pink/50"
                    />
                    <span className="text-sm text-surface-300">{dim.name}</span>
                    <span className="text-xs text-surface-500 ml-auto">({dim.type})</span>
                  </motion.label>
                ))}
              </div>
            </div>

            {/* Chart Type */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-surface-300 mb-3">Chart Type</label>
              <div className="grid grid-cols-4 gap-2">
                {chartTypes.map((ct) => (
                  <motion.button
                    key={ct.id}
                    onClick={() => setChartType(ct.id as any)}
                    className={`
                      p-3 rounded-xl flex items-center justify-center transition-all
                      ${chartType === ct.id
                        ? 'bg-gradient-to-br from-accent-indigo to-accent-purple shadow-neon-purple'
                        : 'bg-white/5 hover:bg-white/10 border border-white/5'
                      }
                    `}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ct.icon className={`w-5 h-5 ${chartType === ct.id ? 'text-white' : 'text-surface-400'}`} />
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Execute Button */}
            <motion.button
              onClick={() => executeMutation.mutate()}
              disabled={!query.measures?.length || executeMutation.isPending}
              className="w-full btn-neon text-white flex items-center justify-center gap-2 disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {executeMutation.isPending ? (
                <Loader3D type="bars" size="sm" />
              ) : (
                <>
                  <PlayIcon className="w-5 h-5" />
                  Run Query
                </>
              )}
            </motion.button>
          </>
        )}
      </motion.div>

      {/* Right Panel - Results */}
      <div className="flex-1 p-8 overflow-y-auto">
        {!selectedDataset ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-accent-indigo/20 to-accent-purple/10 border border-accent-indigo/20 flex items-center justify-center">
                <ChartBarIcon className="w-10 h-10 text-accent-indigo" />
              </div>
              <p className="text-xl font-semibold text-white mb-2">Select a Dataset</p>
              <p className="text-surface-400">Choose a dataset to start building your report</p>
            </div>
          </div>
        ) : !result ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-accent-purple/20 to-accent-pink/10 border border-accent-purple/20 flex items-center justify-center">
                <SparklesIcon className="w-10 h-10 text-accent-purple" />
              </div>
              <p className="text-xl font-semibold text-white mb-2">Configure Your Query</p>
              <p className="text-surface-400">Select measures and click "Run Query" to see results</p>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* KPI Cards */}
            {result.measures && Object.keys(result.measures).length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(result.measures).map(([key, value], idx) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <KPICard
                      title={key}
                      value={value as number}
                      status="green"
                    />
                  </motion.div>
                ))}
              </div>
            )}

            {/* Chart */}
            {getChartData() && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card rounded-2xl p-6"
              >
                <div className="h-96">
                  <ChartWrapper
                    type={chartType}
                    data={getChartData()!}
                    title="Query Results"
                  />
                </div>
              </motion.div>
            )}

            {/* Data Table */}
            {result.groups?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-2xl overflow-hidden"
              >
                <div className="p-4 border-b border-white/5">
                  <h3 className="font-semibold text-white flex items-center gap-2">
                    <TableCellsIcon className="w-5 h-5 text-accent-indigo" />
                    Data Table
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/5">
                        {query.groupBy?.map(col => (
                          <th key={col} className="px-4 py-3 text-left text-sm font-medium text-surface-400">{col}</th>
                        ))}
                        {query.measures?.map(m => (
                          <th key={m} className="px-4 py-3 text-right text-sm font-medium text-surface-400">{m}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {result.groups.slice(0, 50).map((row: any, idx: number) => (
                        <motion.tr
                          key={idx}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: idx * 0.02 }}
                          className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                        >
                          {query.groupBy?.map(col => (
                            <td key={col} className="px-4 py-3 text-sm text-white">{row[col]}</td>
                          ))}
                          {query.measures?.map(m => (
                            <td key={m} className="px-4 py-3 text-sm text-surface-300 text-right font-mono">
                              {typeof row[m] === 'number' ? row[m].toLocaleString(undefined, { maximumFractionDigits: 2 }) : row[m]}
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
        )}
      </div>
    </div>
  );
}
