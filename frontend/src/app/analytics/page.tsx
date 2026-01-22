'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { getDatasets, getMeasures } from '@/lib/api';
import { ChartWrapper } from '@/components/charts/ChartWrapper';
import { Heatmap } from '@/components/charts/Heatmap';
import { GaugeChart } from '@/components/charts/GaugeChart';
import { SparkLine } from '@/components/charts/SparkLine';
import { Loader3D } from '@/components/ui/Loader3D';
import { Select } from '@/components/ui/Select';
import axios from 'axios';
import {
  ChartBarIcon,
  CalculatorIcon,
  ArrowTrendingUpIcon,
  TableCellsIcon,
  SparklesIcon,
  BeakerIcon,
} from '@heroicons/react/24/outline';

const api = axios.create({ baseURL: 'http://localhost:3000/api' });

export default function AnalyticsPage() {
  const [selectedDataset, setSelectedDataset] = useState('');
  const [selectedColumn, setSelectedColumn] = useState('');
  const [selectedColumn2, setSelectedColumn2] = useState('');
  const [operation, setOperation] = useState('statistics');
  const [result, setResult] = useState<any>(null);
  const [correlationMatrix, setCorrelationMatrix] = useState<any>(null);
  const [description, setDescription] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { data: datasets = [] } = useQuery({
    queryKey: ['datasets'],
    queryFn: getDatasets,
  });

  const { data: measuresData } = useQuery({
    queryKey: ['measures', selectedDataset],
    queryFn: () => getMeasures(selectedDataset),
    enabled: !!selectedDataset,
  });

  const numericColumns = measuresData?.numericColumns || [];

  const runAnalysis = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.post('/query/advanced', {
        datasetId: selectedDataset,
        operation,
        columns: selectedColumn2 ? [selectedColumn, selectedColumn2] : [selectedColumn],
        params: { alpha: 0.2, window: 3, periods: 5, n: 4, period: 12 }
      });
      setResult(data.result);
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCorrelationMatrix = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get(`/query/correlation-matrix/${selectedDataset}`);
      setCorrelationMatrix(data);
    } catch (error) {
      console.error('Correlation matrix error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadDescription = async () => {
    if (!selectedColumn) return;
    setIsLoading(true);
    try {
      const { data } = await api.get(`/query/describe/${selectedDataset}/${selectedColumn}`);
      setDescription(data);
    } catch (error) {
      console.error('Description error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const operations = [
    { id: 'statistics', name: 'Descriptive Statistics', icon: CalculatorIcon },
    { id: 'correlation', name: 'Correlation', icon: TableCellsIcon, needsTwo: true },
    { id: 'regression', name: 'Linear Regression', icon: ArrowTrendingUpIcon, needsTwo: true },
    { id: 'growth', name: 'Growth Analysis', icon: ChartBarIcon },
    { id: 'forecast', name: 'Forecast', icon: ArrowTrendingUpIcon },
    { id: 'quartiles', name: 'Quartiles', icon: ChartBarIcon },
    { id: 'rank', name: 'Ranking', icon: TableCellsIcon },
    { id: 'normalize', name: 'Normalization', icon: CalculatorIcon },
    { id: 'ema', name: 'Exponential MA', icon: ArrowTrendingUpIcon },
    { id: 'cumsum', name: 'Cumulative Sum', icon: ChartBarIcon },
  ];

  const currentOp = operations.find(o => o.id === operation);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Advanced Analytics</h1>
        <p className="text-surface-400">Statistical analysis powered by MIPS assembly</p>
      </motion.div>

      <div className="grid grid-cols-12 gap-6">
        {/* Controls Panel */}
        <motion.div 
          className="col-span-4 space-y-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-indigo to-accent-purple flex items-center justify-center shadow-neon-purple">
                <BeakerIcon className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-white">Configuration</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-surface-300 mb-2">Dataset</label>
                <Select
                  value={selectedDataset}
                  onChange={(value) => {
                    setSelectedDataset(value);
                    setSelectedColumn('');
                    setSelectedColumn2('');
                    setResult(null);
                  }}
                  options={[
                    { value: '', label: 'Select dataset' },
                    ...datasets.map((ds: any) => ({ value: ds.id, label: ds.name }))
                  ]}
                  placeholder="Select dataset"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-300 mb-2">Operation</label>
                <Select
                  value={operation}
                  onChange={(value) => {
                    setOperation(value);
                    setResult(null);
                  }}
                  options={operations.map((op) => ({ value: op.id, label: op.name }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-300 mb-2">
                  Column {currentOp?.needsTwo ? '(X)' : ''}
                </label>
                <Select
                  value={selectedColumn}
                  onChange={setSelectedColumn}
                  options={[
                    { value: '', label: 'Select column' },
                    ...numericColumns.map((col: string) => ({ value: col, label: col }))
                  ]}
                  placeholder="Select column"
                />
              </div>

              {currentOp?.needsTwo && (
                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-2">Column (Y)</label>
                  <Select
                    value={selectedColumn2}
                    onChange={setSelectedColumn2}
                    options={[
                      { value: '', label: 'Select column' },
                      ...numericColumns.map((col: string) => ({ value: col, label: col }))
                    ]}
                    placeholder="Select column"
                  />
                </div>
              )}

              <motion.button
                onClick={runAnalysis}
                disabled={!selectedDataset || !selectedColumn || isLoading}
                className="w-full btn-neon text-white flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? (
                  <Loader3D type="bars" size="sm" />
                ) : (
                  <>
                    <SparklesIcon className="w-5 h-5" />
                    Run Analysis
                  </>
                )}
              </motion.button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <TableCellsIcon className="w-4 h-4 text-accent-purple" />
              Quick Actions
            </h3>
            <div className="space-y-2">
              <motion.button
                onClick={loadCorrelationMatrix}
                disabled={!selectedDataset || isLoading}
                className="w-full p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/5 hover:border-accent-indigo/30 text-left text-sm text-surface-300 flex items-center gap-3 transition-all disabled:opacity-50"
                whileHover={{ x: 2 }}
              >
                <TableCellsIcon className="w-4 h-4 text-accent-indigo" />
                Correlation Matrix
              </motion.button>
              <motion.button
                onClick={loadDescription}
                disabled={!selectedDataset || !selectedColumn || isLoading}
                className="w-full p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/5 hover:border-accent-purple/30 text-left text-sm text-surface-300 flex items-center gap-3 transition-all disabled:opacity-50"
                whileHover={{ x: 2 }}
              >
                <CalculatorIcon className="w-4 h-4 text-accent-purple" />
                Describe Column
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Results Panel */}
        <div className="col-span-8 space-y-6">
          {/* Description Card */}
          {description && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <CalculatorIcon className="w-5 h-5 text-accent-indigo" />
                Statistics: {description.column}
              </h3>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: 'Count', value: description.count },
                  { label: 'Mean', value: description.mean?.toFixed(2) },
                  { label: 'Std Dev', value: description.std?.toFixed(2) },
                  { label: 'Min', value: description.min?.toFixed(2) },
                  { label: 'Q1', value: description.q1?.toFixed(2) },
                  { label: 'Median', value: description.median?.toFixed(2) },
                  { label: 'Q3', value: description.q3?.toFixed(2) },
                  { label: 'Max', value: description.max?.toFixed(2) },
                ].map((stat) => (
                  <div key={stat.label} className="text-center p-3 bg-white/5 rounded-xl border border-white/5">
                    <div className="text-xs text-surface-500">{stat.label}</div>
                    <div className="text-lg font-semibold text-white">{stat.value}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Correlation Matrix */}
          {correlationMatrix && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <TableCellsIcon className="w-5 h-5 text-accent-purple" />
                Correlation Matrix
              </h3>
              <Heatmap
                data={correlationMatrix.matrix.map((row: number[]) => 
                  row.map(v => Math.round(v * 100) / 100)
                )}
                xLabels={correlationMatrix.columns}
                yLabels={correlationMatrix.columns}
                colorScale="blue"
              />
            </motion.div>
          )}

          {/* Analysis Results */}
          {result && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <SparklesIcon className="w-5 h-5 text-neon-green" />
                Results: {currentOp?.name}
              </h3>
              
              {/* Statistics */}
              {operation === 'statistics' && (
                <div className="grid grid-cols-3 gap-4">
                  {Object.entries(result).map(([key, value]) => (
                    <div key={key} className="p-4 bg-white/5 rounded-xl border border-white/5">
                      <div className="text-xs text-surface-500 uppercase">{key}</div>
                      <div className="text-xl font-semibold text-white">
                        {typeof value === 'number' ? value.toFixed(4) : String(value)}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Correlation */}
              {operation === 'correlation' && (
                <div className="flex items-center justify-center py-8">
                  <GaugeChart
                    value={result.correlation * 100}
                    min={-100}
                    max={100}
                    thresholds={{ yellow: 50, red: -50 }}
                    label={`Correlation: ${result.correlation.toFixed(4)}`}
                    format="number"
                  />
                </div>
              )}

              {/* Regression */}
              {operation === 'regression' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-white/5 rounded-xl border border-white/5 text-center">
                      <div className="text-xs text-surface-500">Slope</div>
                      <div className="text-xl font-semibold text-white">{result.slope?.toFixed(4)}</div>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/5 text-center">
                      <div className="text-xs text-surface-500">Intercept</div>
                      <div className="text-xl font-semibold text-white">{result.intercept?.toFixed(4)}</div>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/5 text-center">
                      <div className="text-xs text-surface-500">R²</div>
                      <div className="text-xl font-semibold text-neon-green">{result.rSquared?.toFixed(4)}</div>
                    </div>
                  </div>
                  <p className="text-sm text-surface-400">
                    Equation: Y = {result.slope?.toFixed(2)}X + {result.intercept?.toFixed(2)}
                  </p>
                </div>
              )}

              {/* Growth */}
              {operation === 'growth' && (
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-br from-accent-indigo/20 to-accent-purple/10 rounded-xl border border-accent-indigo/20 text-center">
                    <div className="text-sm text-accent-indigo">CAGR</div>
                    <div className="text-3xl font-bold text-white">
                      {result.cagr?.toFixed(2)}%
                    </div>
                  </div>
                  {result.growthRates && (
                    <div className="h-48">
                      <ChartWrapper
                        type="line"
                        data={{
                          labels: result.growthRates.map((_: any, i: number) => `Period ${i}`),
                          datasets: [{
                            label: 'Growth Rate %',
                            data: result.growthRates
                          }]
                        }}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Forecast */}
              {operation === 'forecast' && result.forecast && (
                <div className="h-64">
                  <ChartWrapper
                    type="line"
                    data={{
                      labels: result.forecast.map((_: any, i: number) => `+${i + 1}`),
                      datasets: [{
                        label: 'Forecast',
                        data: result.forecast,
                        borderColor: '#6366f1',
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                        fill: true
                      }]
                    }}
                  />
                </div>
              )}

              {/* Quartiles */}
              {operation === 'quartiles' && (
                <div className="grid grid-cols-5 gap-4">
                  {['min', 'q1', 'q2', 'q3', 'max'].map((key) => (
                    <div key={key} className="p-4 bg-white/5 rounded-xl border border-white/5 text-center">
                      <div className="text-xs text-surface-500 uppercase">{key}</div>
                      <div className="text-lg font-semibold text-white">
                        {result[key]?.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Arrays (EMA, Cumsum, etc.) */}
              {(result.ema || result.cumsum || result.sma) && (
                <div className="h-64">
                  <ChartWrapper
                    type="area"
                    data={{
                      labels: (result.ema || result.cumsum || result.sma).map((_: any, i: number) => i),
                      datasets: [{
                        label: operation.toUpperCase(),
                        data: result.ema || result.cumsum || result.sma
                      }]
                    }}
                  />
                </div>
              )}

              {/* Normalization */}
              {operation === 'normalize' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                    <h4 className="font-medium text-white mb-2">Z-Score</h4>
                    <SparkLine data={result.zScore?.slice(0, 50) || []} width={200} height={60} />
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                    <h4 className="font-medium text-white mb-2">Min-Max (0-1)</h4>
                    <SparkLine data={result.minMax?.slice(0, 50) || []} width={200} height={60} color="#10b981" />
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Empty State */}
          {!result && !correlationMatrix && !description && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card rounded-2xl p-16 text-center"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-accent-indigo/20 to-accent-purple/10 border border-accent-indigo/20 flex items-center justify-center">
                <CalculatorIcon className="w-10 h-10 text-accent-indigo" />
              </div>
              <p className="text-xl font-semibold text-white mb-2">Select a dataset and run an analysis</p>
              <p className="text-surface-400">
                Choose from correlation, regression, forecasting, and more
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
