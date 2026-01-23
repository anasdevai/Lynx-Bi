import { NextResponse } from 'next/server';
import { datasets } from '@/lib/storage';

export async function GET() {
  try {
    console.log('GET /api/datasets called, datasets.size:', datasets.size);
    const datasetList = Array.from(datasets.values()).map(ds => ({
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
