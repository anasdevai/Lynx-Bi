import { createClient } from 'redis';

// Create Redis client
const client = createClient({
  url: process.env.REDIS_URL || process.env.KV_URL
});

client.on('error', (err) => console.error('Redis Client Error', err));

// Connect to Redis
let isConnected = false;
const connectRedis = async () => {
  if (!isConnected) {
    await client.connect();
    isConnected = true;
  }
};

// Redis storage for persistent data across serverless functions
export const datasets = {
  async set(id: string, data: any) {
    await connectRedis();
    await client.set(`dataset:${id}`, JSON.stringify(data));
    await client.sAdd('dataset:ids', id);
  },
  
  async get(id: string) {
    await connectRedis();
    const data = await client.get(`dataset:${id}`);
    return data ? JSON.parse(data as string) : null;
  },
  
  async getAll() {
    await connectRedis();
    const idsSet = await client.sMembers('dataset:ids');
    const ids = Array.from(idsSet);
    if (!ids || ids.length === 0) return [];
    
    const datasets = await Promise.all(
      ids.map(async (id: string) => {
        const data = await client.get(`dataset:${id}`);
        return data ? JSON.parse(data as string) : null;
      })
    );
    return datasets.filter(Boolean);
  },
  
  async delete(id: string) {
    await connectRedis();
    await client.del(`dataset:${id}`);
    await client.sRem('dataset:ids', id);
  },
  
  async size() {
    await connectRedis();
    const idsSet = await client.sMembers('dataset:ids');
    const ids = Array.from(idsSet);
    return ids ? ids.length : 0;
  }
};

export const dashboards = {
  async set(id: string, data: any) {
    await connectRedis();
    await client.set(`dashboard:${id}`, JSON.stringify(data));
    await client.sAdd('dashboard:ids', id);
  },
  
  async get(id: string) {
    await connectRedis();
    const data = await client.get(`dashboard:${id}`);
    return data ? JSON.parse(data as string) : null;
  },
  
  async getAll() {
    await connectRedis();
    const idsSet = await client.sMembers('dashboard:ids');
    const ids = Array.from(idsSet);
    if (!ids || ids.length === 0) return [];
    
    const dashboards = await Promise.all(
      ids.map(async (id: string) => {
        const data = await client.get(`dashboard:${id}`);
        return data ? JSON.parse(data as string) : null;
      })
    );
    return dashboards.filter(Boolean);
  },
  
  async delete(id: string) {
    await connectRedis();
    await client.del(`dashboard:${id}`);
    await client.sRem('dashboard:ids', id);
  },
  
  async size() {
    await connectRedis();
    const idsSet = await client.sMembers('dashboard:ids');
    const ids = Array.from(idsSet);
    return ids ? ids.length : 0;
  }
};
