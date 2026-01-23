# Vercel KV Setup Guide

## Step 1: Create Vercel KV Database

1. Go to your Vercel Dashboard: https://vercel.com/dashboard
2. Select your project: **frontend**
3. Click on the **Storage** tab (top navigation)
4. Click **Create Database**
5. Select **KV** (Redis)
6. Give it a name: `lynx-bi-storage`
7. Select region: Choose closest to your users
8. Click **Create**

## Step 2: Connect to Your Project

1. After creating the database, click **Connect Project**
2. Select your **frontend** project
3. Click **Connect**

This will automatically add the required environment variables to your project:
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`
- `KV_REST_API_READ_ONLY_TOKEN`
- `KV_URL`

## Step 3: Redeploy

The environment variables are now set. Deploy your project:

```bash
cd frontend
vercel --prod
```

Or simply push to GitHub - Vercel will auto-deploy with the new environment variables!

## Step 4: Test

1. Visit your deployed app
2. Go to `/upload`
3. Upload a CSV file
4. Navigate to `/model` or `/analytics`
5. Your data should persist!

## Verify Setup

Visit `/api/debug` to check if KV is configured:
```
https://your-app.vercel.app/api/debug
```

Look for `"kvConfigured": true`

## Pricing

- **Hobby Plan**: Free tier includes:
  - 256 MB storage
  - 3,000 commands per day
  - Perfect for demos and small projects

- **Pro Plan**: $20/month includes:
  - 1 GB storage
  - 100,000 commands per day

For your use case, the free tier should be sufficient!

## Troubleshooting

### Error: Missing KV environment variables

If you see this error after setup:
1. Go to Project Settings → Environment Variables
2. Verify KV variables are present
3. Redeploy the project

### Data not persisting

1. Check `/api/debug` endpoint
2. Verify `kvConfigured: true`
3. Check Vercel logs for errors

## Alternative: Use Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Link project
vercel link

# Create KV store
vercel kv create lynx-bi-storage

# Deploy
vercel --prod
```

## Done!

Once KV is set up, your Lynx BI application will have full persistent storage and all features will work perfectly on Vercel! 🎉
