# Vercel Deployment Guide for Lynx BI

## Important Note

Vercel is optimized for **frontend deployments** (Next.js). Your project has both:
- **Frontend**: Next.js (✅ Perfect for Vercel)
- **Backend**: Express.js (⚠️ Limited support on Vercel)

## Deployment Options

### Option 1: Deploy Frontend Only (Recommended for Quick Start)

This deploys just the Next.js frontend to Vercel. You'll need to host the backend separately.

**Steps:**

1. **Go to Vercel**: https://vercel.com
2. **Sign in** with your GitHub account
3. **Import your repository**: `anasdevai/Lynx-Bi`
4. **Configure the project**:
   - Framework Preset: `Next.js`
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `.next`
5. **Add Environment Variables**:
   - `NEXT_PUBLIC_API_URL`: Your backend URL (e.g., Railway, Render, or other hosting)
6. **Deploy**

**Backend Hosting Options:**
- Railway (https://railway.app) - Easy Node.js hosting
- Render (https://render.com) - Free tier available
- Heroku
- DigitalOcean App Platform

### Option 2: Deploy Both on Vercel (Serverless Functions)

Vercel can run your backend as serverless functions, but with limitations:
- 10-second execution timeout on Hobby plan
- 50MB deployment size limit
- No persistent file storage (uploads won't persist)
- No WebSocket support

**Steps:**

1. **Go to Vercel**: https://vercel.com
2. **Import repository**: `anasdevai/Lynx-Bi`
3. **Configure**:
   - Framework Preset: `Next.js`
   - Root Directory: `frontend`
4. **The vercel.json file** (already created) will handle routing
5. **Deploy**

**Limitations to Consider:**
- File uploads won't persist (need external storage like AWS S3)
- MIPS engine execution might timeout
- Database connections need to be serverless-compatible

### Option 3: Monorepo with Separate Deployments (Best for Production)

Deploy frontend and backend separately:

**Frontend on Vercel:**
1. Import repo, set root to `frontend`
2. Add env: `NEXT_PUBLIC_API_URL=https://your-backend-url.com`

**Backend on Railway/Render:**
1. Create new service
2. Set root to `backend`
3. Set start command: `npm start`
4. Add environment variables from `backend/.env`

## Quick Deploy to Vercel (Frontend Only)

Click this button to deploy the frontend:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/anasdevai/Lynx-Bi&project-name=lynx-bi&root-directory=frontend)

## Environment Variables Needed

### Frontend (.env.local in Vercel):
```
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

### Backend (if deploying separately):
```
PORT=3000
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-url.vercel.app
```

## Post-Deployment

1. Update CORS settings in backend to allow your Vercel domain
2. Test all API endpoints
3. Configure custom domain (optional)
4. Set up monitoring and analytics

## Recommended Approach

For a production-ready deployment:
1. **Frontend**: Deploy to Vercel (fast, free, excellent Next.js support)
2. **Backend**: Deploy to Railway or Render (better for Express.js, file handling)
3. Connect them via environment variables

This gives you the best of both worlds: Vercel's excellent frontend performance and a proper backend hosting solution.

## Need Help?

- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app
- Render Docs: https://render.com/docs
