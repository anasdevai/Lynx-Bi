import axios from 'axios';

// Use relative URLs in production, localhost in development
const baseURL = typeof window !== 'undefined' && window.location.hostname !== 'localhost'
  ? '/api'  // Production: use relative path
  : 'http://localhost:3000/api';  // Development: use localhost

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

// Dataset APIs
export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const getDatasets = async () => {
  const { data } = await api.get('/datasets');
  return data;
};

export const getDataset = async (id: string) => {
  const { data } = await api.get(`/datasets/${id}`);
  return data;
};

export const deleteDataset = async (id: string) => {
  const { data } = await api.delete(`/datasets/${id}`);
  return data;
};

// Query APIs
export interface BIQuery {
  filters?: Record<string, any>;
  groupBy?: string[];
  measures?: string[];
  timeIntelligence?: {
    type: 'mom' | 'yoy' | 'rolling' | 'trend';
    dateColumn: string;
    window?: number;
  };
  kpis?: Array<{
    name: string;
    measure: string;
    target: number;
    thresholds: { yellow: number; red: number };
  }>;
  histogram?: { column: string; bins: number };
}

export const executeQuery = async (datasetId: string, query: BIQuery) => {
  const { data } = await api.post('/query/execute', { datasetId, query });
  return data;
};

export const getMeasures = async (datasetId: string) => {
  const { data } = await api.get(`/query/measures/${datasetId}`);
  return data;
};

export const getDimensions = async (datasetId: string) => {
  const { data } = await api.get(`/query/dimensions/${datasetId}`);
  return data;
};

// Dashboard APIs
export interface Widget {
  id: string;
  type: 'chart' | 'kpi' | 'table';
  title: string;
  chartType?: 'bar' | 'line' | 'pie' | 'area' | 'heatmap';
  query: BIQuery;
  position: { x: number; y: number; w: number; h: number };
  config?: Record<string, any>;
}

export interface Dashboard {
  id: string;
  name: string;
  description?: string;
  datasetId: string;
  widgets: Widget[];
  filters: any[];
  createdAt: string;
  updatedAt: string;
}

export const getDashboards = async (): Promise<Dashboard[]> => {
  const { data } = await api.get('/dashboards');
  return data;
};

export const getDashboard = async (id: string): Promise<Dashboard> => {
  const { data } = await api.get(`/dashboards/${id}`);
  return data;
};

export const createDashboard = async (dashboard: Partial<Dashboard>) => {
  const { data } = await api.post('/dashboards', dashboard);
  return data;
};

export const updateDashboard = async (id: string, updates: Partial<Dashboard>) => {
  const { data } = await api.put(`/dashboards/${id}`, updates);
  return data;
};

export const deleteDashboard = async (id: string) => {
  const { data } = await api.delete(`/dashboards/${id}`);
  return data;
};

export const addWidget = async (dashboardId: string, widget: Partial<Widget>) => {
  const { data } = await api.post(`/dashboards/${dashboardId}/widgets`, widget);
  return data;
};

export const updateWidget = async (dashboardId: string, widgetId: string, updates: Partial<Widget>) => {
  const { data } = await api.put(`/dashboards/${dashboardId}/widgets/${widgetId}`, updates);
  return data;
};

export const deleteWidget = async (dashboardId: string, widgetId: string) => {
  const { data } = await api.delete(`/dashboards/${dashboardId}/widgets/${widgetId}`);
  return data;
};

export default api;
