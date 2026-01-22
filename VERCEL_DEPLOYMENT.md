# Vercel Deployment Guide for Lynx BI

## ✅ Full Project Deployment on Vercel

Your Lynx BI project is now configured to deploy completely on Vercel! The backend has been integrated into Next.js API routes.

## 🚀 Quick Deploy Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel**: https://vercel.com
2. **Sign in** with your GitHub account
3. **Click "Add New Project"**
4. **Import your repository**: Select `anasdevai/Lynx-Bi`
5. **Configure Project**:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
6. **Click "Deploy"**

That's it! Vercel will build and deploy your entire application.

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to your project
cd AsmBI

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - Project name? lynx-bi
# - Directory? frontend
# - Override settings? No

# For production deployment
vercel --prod
```

## 📋 What's Been Changed

### Backend Integration
- ✅ All Express.js routes converted to Next.js API routes
- ✅ File upload handling adapted for serverless
- ✅ Data storage using in-memory Map (serverless-compatible)
- ✅ Query engine integrated into API routes
- ✅ Dashboard management via API routes

### API Routes Created
- `/api/health` - Health check endpoint
- `/api/upload` - File upload and parsing
- `/api/datasets` - List all datasets
- `/api/datasets/[id]` - Get/delete specific dataset
- `/api/query` - Query data with filters and aggregations
- `/api/dashboards` - Create/list dashboards
- `/api/dashboards/[id]` - Get/update/delete dashboard

### Configuration Files
- ✅ `vercel.json` - Vercel deployment configuration
- ✅ `frontend/next.config.js` - Updated for serverless
- ✅ `frontend/package.json` - Added required dependencies

## ⚠️ Important Notes

### Data Persistence
The current implementation uses **in-memory storage** which means:
- Data is lost when the serverless function restarts
- Not suitable for production with real users
- Perfect for demos and testing

### For Production Use
Consider adding external storage:
- **Database**: Vercel Postgres, MongoDB Atlas, Supabase
- **File Storage**: AWS S3, Cloudflare R2, Vercel Blob
- **Cache**: Vercel KV, Redis

## 🔧 Environment Variables (Optional)

If you need to add environment variables:

1. In Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add any required variables:
   ```
   NODE_ENV=production
   ```

## 📱 After Deployment

Once deployed, you'll get a URL like: `https://lynx-bi.vercel.app`

### Test Your Deployment
1. Visit your deployment URL
2. Go to `/upload` to test file upload
3. Upload a CSV file
4. Navigate to `/analytics` to see your data
5. Create dashboards at `/dashboards`

## 🎯 Custom Domain (Optional)

To add a custom domain:
1. Go to Project Settings → Domains
2. Add your domain
3. Follow DNS configuration instructions

## 🔄 Automatic Deployments

Every push to your `main` branch will automatically trigger a new deployment!

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main

# Vercel automatically deploys!
```

## 📊 Monitoring

View your deployment logs and analytics:
- Dashboard: https://vercel.com/dashboard
- Real-time logs
- Performance metrics
- Error tracking

## 🆘 Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `frontend/package.json`
- Verify TypeScript has no errors

### API Routes Not Working
- Check function logs in Vercel dashboard
- Verify API routes are in `frontend/src/app/api/`
- Check for CORS issues

### File Upload Issues
- Vercel has a 4.5MB request body limit on Hobby plan
- For larger files, upgrade plan or use external storage

## 🎉 You're All Set!

Your Lynx BI application is ready to deploy on Vercel. Just follow the steps above and you'll have a live application in minutes!

## 📚 Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Vercel Limits](https://vercel.com/docs/concepts/limits/overview)

