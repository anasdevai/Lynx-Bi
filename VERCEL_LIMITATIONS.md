# Vercel Deployment Limitations

## Current Issue: Data Persistence

The application is currently deployed on Vercel using **in-memory storage** (JavaScript `Map`). This has a critical limitation:

### The Problem
- Vercel serverless functions are **stateless**
- Each API request may run on a different server instance
- Data stored in memory is **not shared** between instances
- Uploaded datasets disappear after the serverless function "goes to sleep"

### Why This Happens
When you upload a file:
1. Request goes to Serverless Function Instance A
2. Data is stored in Instance A's memory
3. When you try to fetch datasets, request goes to Instance B
4. Instance B has no data (empty memory)

## Solutions

### Option 1: Use Vercel KV (Redis) - Recommended
Vercel KV provides persistent key-value storage.

**Setup:**
```bash
# Install Vercel KV
npm install @vercel/kv

# In Vercel Dashboard:
# 1. Go to Storage tab
# 2. Create KV Database
# 3. Connect to your project
```

**Update storage.ts:**
```typescript
import { kv } from '@vercel/kv';

export const datasets = {
  set: async (id: string, data: any) => await kv.set(`dataset:${id}`, data),
  get: async (id: string) => await kv.get(`dataset:${id}`),
  getAll: async () => {
    const keys = await kv.keys('dataset:*');
    return Promise.all(keys.map(k => kv.get(k)));
  },
  delete: async (id: string) => await kv.del(`dataset:${id}`)
};
```

### Option 2: Use Vercel Postgres
For larger datasets and complex queries.

```bash
npm install @vercel/postgres
```

### Option 3: Use External Database
- **MongoDB Atlas** (Free tier available)
- **Supabase** (PostgreSQL, free tier)
- **PlanetScale** (MySQL, free tier)
- **Neon** (PostgreSQL, free tier)

### Option 4: Deploy Backend Separately
Deploy the Express.js backend to a platform with persistent storage:

**Railway.app:**
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
cd backend
railway init
railway up
```

**Render.com:**
1. Go to https://render.com
2. New → Web Service
3. Connect GitHub repo
4. Root Directory: `backend`
5. Build Command: `npm install`
6. Start Command: `npm start`

Then update frontend to point to the backend URL.

### Option 5: Local Development Only
For testing and development, run locally:

```bash
# Terminal 1 - Backend
cd backend
npm install
npm start

# Terminal 2 - Frontend  
cd frontend
npm install
npm run dev
```

## Temporary Workaround

For demo purposes, you can use browser localStorage to cache data client-side, but this only works for single-user scenarios and data is lost on browser clear.

## Recommended Production Setup

1. **Frontend**: Vercel (current deployment)
2. **Backend**: Railway or Render with persistent storage
3. **Database**: MongoDB Atlas or Supabase
4. **File Storage**: AWS S3 or Cloudflare R2

This gives you:
- ✅ Fast frontend delivery (Vercel CDN)
- ✅ Persistent data storage
- ✅ Scalable architecture
- ✅ Real multi-user support

## Next Steps

Choose one of the solutions above based on your needs:
- **Quick demo**: Use Vercel KV (easiest)
- **Production app**: Deploy backend separately + database
- **Learning/testing**: Run locally

Would you like help implementing any of these solutions?
