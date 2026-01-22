'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FunnelIcon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

interface Filter {
  column: string;
  type: 'string' | 'date' | 'number';
  values?: string[];
  range?: { min: number; max: number };
}

interface FilterPanelProps {
  filters: Filter[];
  activeFilters: Record<string, any>;
  onFilterChange: (column: string, value: any) => void;
  onClearFilters: () => void;
}

export function FilterPanel({ filters, activeFilters, onFilterChange, onClearFilters }: FilterPanelProps) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const activeCount = Object.keys(activeFilters).length;

  return (
    <div className="bg-white border border-surface-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FunnelIcon className="w-5 h-5 text-surface-500" />
          <span className="font-medium text-surface-900">Filters</span>
          {activeCount > 0 && (
            <span className="px-2 py-0.5 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={onClearFilters}
            className="text-sm text-surface-500 hover:text-surface-700"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-2">
        {filters.map((filter) => (
          <div key={filter.column} className="border border-surface-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setExpanded(expanded === filter.column ? null : filter.column)}
              className="w-full flex items-center justify-between p-3 hover:bg-surface-50 transition-colors"
            >
              <span className="text-sm font-medium text-surface-700">{filter.column}</span>
              <div className="flex items-center gap-2">
                {activeFilters[filter.column] && (
                  <span className="w-2 h-2 bg-primary-500 rounded-full" />
                )}
                <ChevronDownIcon
                  className={`w-4 h-4 text-surface-400 transition-transform ${
                    expanded === filter.column ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </button>

            <AnimatePresence>
              {expanded === filter.column && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-surface-200"
                >
                  <div className="p-3">
                    {filter.type === 'string' && filter.values && (
                      <div className="space-y-1 max-h-48 overflow-y-auto">
                        {filter.values.map((value) => (
                          <label
                            key={value}
                            className="flex items-center gap-2 p-1.5 rounded hover:bg-surface-50 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={activeFilters[filter.column]?.includes(value) || false}
                              onChange={(e) => {
                                const current = activeFilters[filter.column] || [];
                                const newValue = e.target.checked
                                  ? [...current, value]
                                  : current.filter((v: string) => v !== value);
                                onFilterChange(filter.column, newValue.length > 0 ? newValue : undefined);
                              }}
                              className="rounded border-surface-300 text-primary-600 focus:ring-primary-500"
                            />
                            <span className="text-sm text-surface-700">{value}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {filter.type === 'number' && filter.range && (
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <input
                            type="number"
                            placeholder="Min"
                            value={activeFilters[filter.column]?.min || ''}
                            onChange={(e) => {
                              const current = activeFilters[filter.column] || {};
                              onFilterChange(filter.column, {
                                ...current,
                                min: e.target.value ? Number(e.target.value) : undefined,
                              });
                            }}
                            className="w-full px-3 py-1.5 text-sm border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                          <input
                            type="number"
                            placeholder="Max"
                            value={activeFilters[filter.column]?.max || ''}
                            onChange={(e) => {
                              const current = activeFilters[filter.column] || {};
                              onFilterChange(filter.column, {
                                ...current,
                                max: e.target.value ? Number(e.target.value) : undefined,
                              });
                            }}
                            className="w-full px-3 py-1.5 text-sm border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                        <input
                          type="range"
                          min={filter.range.min}
                          max={filter.range.max}
                          value={activeFilters[filter.column]?.max || filter.range.max}
                          onChange={(e) => {
                            onFilterChange(filter.column, {
                              min: filter.range!.min,
                              max: Number(e.target.value),
                            });
                          }}
                          className="w-full"
                        />
                      </div>
                    )}

                    {filter.type === 'date' && (
                      <div className="flex gap-2">
                        <input
                          type="date"
                          value={activeFilters[filter.column]?.start || ''}
                          onChange={(e) => {
                            const current = activeFilters[filter.column] || {};
                            onFilterChange(filter.column, { ...current, start: e.target.value });
                          }}
                          className="w-full px-3 py-1.5 text-sm border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                        <input
                          type="date"
                          value={activeFilters[filter.column]?.end || ''}
                          onChange={(e) => {
                            const current = activeFilters[filter.column] || {};
                            onFilterChange(filter.column, { ...current, end: e.target.value });
                          }}
                          className="w-full px-3 py-1.5 text-sm border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
