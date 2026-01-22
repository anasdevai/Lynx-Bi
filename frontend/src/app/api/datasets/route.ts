import { NextResponse } from 'next/server';
import { datasets } from '../upload/route';

export async function GET() {
  try {
    const datasetList = Array.from(datasets.values()).map(ds => ({
      id: ds.id,
      name: ds.name,
      rowCount: ds.rowCount,
      columnCount: ds.columnCount,
      createdAt: ds.createdAt
    }));
    
    return NextResponse.json(datasetList);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
