import { NextResponse } from 'next/server';
import { datasets } from '@/lib/storage';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const size = await datasets.size();
    console.log('GET /api/datasets called, datasets count:', size);
    
    const allDatasets = await datasets.getAll();
    const datasetList = allDatasets.map((ds: any) => ({
      id: ds.id,
      name: ds.name,
      rowCount: ds.rowCount,
      columnCount: ds.columnCount,
      createdAt: ds.createdAt
    }));
    
    console.log('Returning datasets:', datasetList.length);
    return NextResponse.json(datasetList);
  } catch (error: any) {
    console.error('Error in GET /api/datasets:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
