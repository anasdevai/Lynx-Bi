import { kv } from '@vercel/kv';

// Vercel KV (Redis) storage for persistent data across serverless functions

export const datasets = {
  async set(id: string, data: any) {
    await kv.set(`dataset:${id}`, data);
    // Also maintain a list of all dataset IDs
    await kv.sadd('dataset:ids', id);
  },
  
  async get(id: string) {
    return await kv.get(`dataset:${id}`);
  },
  
  async getAll() {
    const ids = await kv.smembers('dataset:ids');
    if (!ids || ids.length === 0) return [];
    
    const datasets = await Promise.all(
      ids.map(async (id: any) => await kv.get(`dataset:${id}`))
    );
    return datasets.filter(Boolean);
  },
  
  async delete(id: string) {
    await kv.del(`dataset:${id}`);
    await kv.srem('dataset:ids', id);
  },
  
  async size() {
    const ids = await kv.smembers('dataset:ids');
    return ids ? ids.length : 0;
  }
};

export const dashboards = {
  async set(id: string, data: any) {
    await kv.set(`dashboard:${id}`, data);
    await kv.sadd('dashboard:ids', id);
  },
  
  async get(id: string) {
    return await kv.get(`dashboard:${id}`);
  },
  
  async getAll() {
    const ids = await kv.smembers('dashboard:ids');
    if (!ids || ids.length === 0) return [];
    
    const dashboards = await Promise.all(
      ids.map(async (id: any) => await kv.get(`dashboard:${id}`))
    );
    return dashboards.filter(Boolean);
  },
  
  async delete(id: string) {
    await kv.del(`dashboard:${id}`);
    await kv.srem('dashboard:ids', id);
  },
  
  async size() {
    const ids = await kv.smembers('dashboard:ids');
    return ids ? ids.length : 0;
  }
};
