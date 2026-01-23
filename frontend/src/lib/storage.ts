// In-memory storage for serverless functions
// Note: This is shared across all function invocations in the same instance
// For production, consider using Vercel KV, Postgres, or another persistent storage

// Use global to persist across hot reloads in development
const globalForStorage = global as typeof globalThis & {
  datasets?: Map<string, any>;
  dashboards?: Map<string, any>;
};

export const datasets = globalForStorage.datasets ?? new Map();
export const dashboards = globalForStorage.dashboards ?? new Map();

if (process.env.NODE_ENV !== 'production') {
  globalForStorage.datasets = datasets;
  globalForStorage.dashboards = dashboards;
}

// Helper to get all data (for debugging)
export const getAllData = () => ({
  datasets: Array.from(datasets.entries()),
  dashboards: Array.from(dashboards.entries()),
});
