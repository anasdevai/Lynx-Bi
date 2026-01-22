'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { uploadFile, getDatasets, deleteDataset } from '@/lib/api';
import { useAppStore } from '@/store/appStore';
import { Loader3D } from '@/components/ui/Loader3D';
import { useLoading } from '@/components';
import {
  CloudArrowUpIcon,
  DocumentIcon,
  TrashIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  TableCellsIcon,
  ArrowUpTrayIcon,
} from '@heroicons/react/24/outline';

export default function UploadPage() {
  const queryClient = useQueryClient();
  const { addDataset } = useAppStore();
  const { showLoading, hideLoading } = useLoading();
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadedFile, setUploadedFile] = useState<any>(null);

  const { data: datasets = [], isLoading } = useQuery({
    queryKey: ['datasets'],
    queryFn: getDatasets,
  });

  const uploadMutation = useMutation({
    mutationFn: uploadFile,
    onSuccess: (data) => {
      hideLoading();
      setUploadStatus('success');
      setUploadedFile(data);
      addDataset(data);
      queryClient.invalidateQueries({ queryKey: ['datasets'] });
    },
    onError: () => {
      hideLoading();
      setUploadStatus('error');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDataset,
    onSuccess: () => {
      hideLoading();
      queryClient.invalidateQueries({ queryKey: ['datasets'] });
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setUploadStatus('uploading');
      showLoading('Uploading and analyzing file...', 'data');
      uploadMutation.mutate(acceptedFiles[0]);
    }
  }, [uploadMutation, showLoading]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
  });

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Upload Data</h1>
        <p className="text-surface-400">Import CSV, Excel, or TXT files for analysis</p>
      </motion.div>

      {/* Upload Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div
          {...getRootProps()}
          className={`
            glass-card rounded-3xl cursor-pointer transition-all duration-300 overflow-hidden
            ${isDragActive ? 'border-accent-indigo shadow-neon-purple scale-[1.02]' : 'border-white/10 hover:border-accent-indigo/50'}
          `}
        >
          <input {...getInputProps()} />
          
          {/* Animated Background */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-indigo/10 rounded-full blur-3xl"
              animate={{
                scale: isDragActive ? [1, 1.3, 1] : 1,
                opacity: isDragActive ? [0.3, 0.5, 0.3] : 0.2,
              }}
              transition={{ duration: 2, repeat: isDragActive ? Infinity : 0 }}
            />
          </div>

          <div className="relative py-16 text-center">
            <motion.div
              animate={{
                y: isDragActive ? [-10, 0, -10] : 0,
                scale: isDragActive ? 1.1 : 1,
              }}
              transition={{ duration: 1, repeat: isDragActive ? Infinity : 0 }}
              className="mb-6"
            >
              <div className={`
                w-20 h-20 mx-auto rounded-3xl flex items-center justify-center
                ${isDragActive 
                  ? 'bg-gradient-to-br from-accent-indigo to-accent-purple shadow-neon-purple' 
                  : 'bg-white/5 border border-white/10'
                }
              `}>
                {isDragActive ? (
                  <ArrowUpTrayIcon className="w-10 h-10 text-white" />
                ) : (
                  <CloudArrowUpIcon className="w-10 h-10 text-surface-400" />
                )}
              </div>
            </motion.div>

            <p className="text-xl font-semibold text-white mb-2">
              {isDragActive ? 'Drop your file here' : 'Drag & drop a file here'}
            </p>
            <p className="text-surface-400 mb-4">or click to browse</p>
            <div className="flex items-center justify-center gap-3 text-xs text-surface-500">
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">CSV</span>
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">Excel</span>
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">TXT</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Upload Status */}
      <AnimatePresence>
        {uploadStatus !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="mt-6"
          >
            {uploadStatus === 'uploading' && (
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center gap-4">
                  <Loader3D type="orbit" size="sm" />
                  <span className="text-accent-indigo font-medium">Uploading and analyzing file...</span>
                </div>
              </div>
            )}
            {uploadStatus === 'success' && uploadedFile && (
              <div className="glass-card rounded-2xl p-6 border border-neon-green/30 bg-neon-green/5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-neon-green/20 flex items-center justify-center">
                    <CheckCircleIcon className="w-6 h-6 text-neon-green" />
                  </div>
                  <div>
                    <span className="text-neon-green font-semibold">Upload successful!</span>
                    <p className="text-sm text-surface-400">
                      {uploadedFile.name} • {uploadedFile.rowCount.toLocaleString()} rows • {uploadedFile.columnCount} columns
                    </p>
                  </div>
                </div>
              </div>
            )}
            {uploadStatus === 'error' && (
              <div className="glass-card rounded-2xl p-6 border border-red-500/30 bg-red-500/5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                    <ExclamationCircleIcon className="w-6 h-6 text-red-400" />
                  </div>
                  <span className="text-red-400 font-medium">Upload failed. Please try again.</span>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Schema Preview */}
      {uploadedFile?.schema && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <TableCellsIcon className="w-5 h-5 text-accent-indigo" />
            Detected Schema
          </h2>
          <div className="glass-card rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-6 py-4 text-left text-sm font-medium text-surface-400">Column</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-surface-400">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-surface-400">Nullable</th>
                </tr>
              </thead>
              <tbody>
                {uploadedFile.schema.columns.map((col: any, idx: number) => (
                  <motion.tr
                    key={col.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-white">{col.name}</td>
                    <td className="px-6 py-4">
                      <span className={`
                        inline-flex px-3 py-1 text-xs font-medium rounded-full
                        ${col.type === 'integer' || col.type === 'float' 
                          ? 'bg-neon-blue/10 text-neon-blue border border-neon-blue/20'
                          : col.type === 'date'
                          ? 'bg-neon-purple/10 text-neon-purple border border-neon-purple/20'
                          : 'bg-white/5 text-surface-400 border border-white/10'
                        }
                      `}>
                        {col.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-surface-400">{col.nullable ? 'Yes' : 'No'}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Existing Datasets */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-12"
      >
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <DocumentIcon className="w-5 h-5 text-accent-purple" />
          Your Datasets
        </h2>
        
        {isLoading ? (
          <div className="glass-card rounded-2xl p-12 flex justify-center">
            <Loader3D type="dna" text="Loading datasets..." />
          </div>
        ) : datasets.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center">
              <DocumentIcon className="w-8 h-8 text-surface-500" />
            </div>
            <p className="text-surface-400">No datasets uploaded yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {datasets.map((dataset: any, idx: number) => (
              <motion.div
                key={dataset.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="glass-card card-3d rounded-2xl p-5 group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-indigo to-accent-purple flex items-center justify-center shadow-neon-purple">
                      <DocumentIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white group-hover:text-accent-indigo transition-colors">
                        {dataset.name}
                      </h3>
                      <p className="text-sm text-surface-400">
                        {dataset.rowCount.toLocaleString()} rows • {dataset.columnCount} cols
                      </p>
                    </div>
                  </div>
                  <motion.button
                    onClick={() => deleteMutation.mutate(dataset.id)}
                    className="p-2 rounded-lg text-surface-500 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <TrashIcon className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
