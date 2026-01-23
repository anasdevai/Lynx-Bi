import { NextResponse } from 'next/server';
import { datasets, dashboards } from '@/lib/storage';

export async function GET() {
  return NextResponse.json({
    datasetsCount: datasets.size,
    dashboardsCount: dashboards.size,
    datasets: Array.from(datasets.entries()).map(([id, ds]) => ({
      id,
      name: ds.name,
      rowCount: ds.rowCount,
      columnCount: ds.columnCount,
    })),
    dashboards: Array.from(dashboards.entries()).map(([id, dash]) => ({
      id,
      name: dash.name,
    })),
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
  });
}
