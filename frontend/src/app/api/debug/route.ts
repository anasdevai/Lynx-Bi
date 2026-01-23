import { NextResponse } from 'next/server';
import { datasets, dashboards } from '@/lib/storage';

export const dynamic = 'force-dynamic';

export async function GET() {
  const datasetsCount = await datasets.size();
  const dashboardsCount = await dashboards.size();
  const allDatasets = await datasets.getAll();
  const allDashboards = await dashboards.getAll();
  
  return NextResponse.json({
    datasetsCount,
    dashboardsCount,
    datasets: allDatasets.map((ds: any) => ({
      id: ds?.id,
      name: ds?.name,
      rowCount: ds?.rowCount,
      columnCount: ds?.columnCount,
    })),
    dashboards: allDashboards.map((dash: any) => ({
      id: dash?.id,
      name: dash?.name,
    })),
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
    redisConfigured: !!(process.env.REDIS_URL || process.env.KV_URL),
  });
}
