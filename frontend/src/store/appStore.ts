import { create } from 'zustand';

interface Dataset {
  id: string;
  name: string;
  schema: {
    columns: Array<{ name: string; type: string; nullable: boolean }>;
    rowCount: number;
  };
  rowCount: number;
  columnCount: number;
}

interface AppState {
  // Datasets
  datasets: Dataset[];
  activeDatasetId: string | null;
  setDatasets: (datasets: Dataset[]) => void;
  addDataset: (dataset: Dataset) => void;
  setActiveDataset: (id: string | null) => void;
  
  // Dashboard state
  activeDashboardId: string | null;
  setActiveDashboard: (id: string | null) => void;
  
  // Global filters
  globalFilters: Record<string, any>;
  setGlobalFilter: (column: string, value: any) => void;
  clearGlobalFilters: () => void;
  
  // UI state
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Datasets
  datasets: [],
  activeDatasetId: null,
  setDatasets: (datasets) => set({ datasets }),
  addDataset: (dataset) => set((state) => ({ 
    datasets: [...state.datasets, dataset],
    activeDatasetId: dataset.id 
  })),
  setActiveDataset: (id) => set({ activeDatasetId: id }),
  
  // Dashboard
  activeDashboardId: null,
  setActiveDashboard: (id) => set({ activeDashboardId: id }),
  
  // Filters
  globalFilters: {},
  setGlobalFilter: (column, value) => set((state) => ({
    globalFilters: { ...state.globalFilters, [column]: value }
  })),
  clearGlobalFilters: () => set({ globalFilters: {} }),
  
  // UI
  sidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
}));
