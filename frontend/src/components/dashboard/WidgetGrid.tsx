'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  TrashIcon, 
  Cog6ToothIcon, 
  ArrowsPointingOutIcon,
  EllipsisVerticalIcon 
} from '@heroicons/react/24/outline';

interface Widget {
  id: string;
  type: string;
  title: string;
  position: { x: number; y: number; w: number; h: number };
}

interface WidgetGridProps {
  widgets: Widget[];
  columns?: number;
  rowHeight?: number;
  onWidgetMove?: (id: string, position: { x: number; y: number }) => void;
  onWidgetResize?: (id: string, size: { w: number; h: number }) => void;
  onWidgetDelete?: (id: string) => void;
  onWidgetEdit?: (id: string) => void;
  renderWidget: (widget: Widget) => React.ReactNode;
}

export function WidgetGrid({
  widgets,
  columns = 12,
  rowHeight = 100,
  onWidgetMove,
  onWidgetResize,
  onWidgetDelete,
  onWidgetEdit,
  renderWidget,
}: WidgetGridProps) {
  const [activeWidget, setActiveWidget] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState<string | null>(null);

  const getGridStyle = (position: Widget['position']) => ({
    gridColumn: `span ${position.w}`,
    gridRow: `span ${position.h}`,
    minHeight: position.h * rowHeight,
  });

  return (
    <div
      className="grid gap-6"
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gridAutoRows: `${rowHeight}px`,
      }}
    >
      {widgets.map((widget, idx) => (
        <motion.div
          key={widget.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.05 }}
          style={getGridStyle(widget.position)}
          className="relative group"
          onMouseEnter={() => setActiveWidget(widget.id)}
          onMouseLeave={() => {
            setActiveWidget(null);
            setShowMenu(null);
          }}
        >
          <div className="h-full bg-white rounded-xl border border-surface-200 shadow-sm overflow-hidden">
            {/* Widget Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-surface-100">
              <h3 className="font-medium text-surface-900 truncate">{widget.title}</h3>
              
              {/* Actions */}
              <div className={`flex items-center gap-1 transition-opacity ${
                activeWidget === widget.id ? 'opacity-100' : 'opacity-0'
              }`}>
                <button
                  onClick={() => onWidgetEdit?.(widget.id)}
                  className="p-1.5 text-surface-400 hover:text-surface-600 hover:bg-surface-100 rounded"
                >
                  <Cog6ToothIcon className="w-4 h-4" />
                </button>
                <button
                  className="p-1.5 text-surface-400 hover:text-surface-600 hover:bg-surface-100 rounded cursor-move"
                >
                  <ArrowsPointingOutIcon className="w-4 h-4" />
                </button>
                <div className="relative">
                  <button
                    onClick={() => setShowMenu(showMenu === widget.id ? null : widget.id)}
                    className="p-1.5 text-surface-400 hover:text-surface-600 hover:bg-surface-100 rounded"
                  >
                    <EllipsisVerticalIcon className="w-4 h-4" />
                  </button>
                  
                  {showMenu === widget.id && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute right-0 top-full mt-1 w-36 bg-white rounded-lg shadow-lg border border-surface-200 py-1 z-50"
                    >
                      <button
                        onClick={() => {
                          onWidgetEdit?.(widget.id);
                          setShowMenu(null);
                        }}
                        className="w-full px-3 py-2 text-left text-sm text-surface-700 hover:bg-surface-50"
                      >
                        Edit Widget
                      </button>
                      <button
                        className="w-full px-3 py-2 text-left text-sm text-surface-700 hover:bg-surface-50"
                      >
                        Duplicate
                      </button>
                      <hr className="my-1 border-surface-200" />
                      <button
                        onClick={() => {
                          onWidgetDelete?.(widget.id);
                          setShowMenu(null);
                        }}
                        className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Widget Content */}
            <div className="p-4 h-[calc(100%-52px)] overflow-auto">
              {renderWidget(widget)}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
