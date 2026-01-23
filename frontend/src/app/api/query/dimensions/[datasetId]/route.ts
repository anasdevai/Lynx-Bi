import { NextRequest, NextResponse } from 'next/server';
import { datasets } from '@/lib/storage';

export async function GET(
  request: NextRequest,
  { params }: { params: { datasetId: string } }
) {
  try {
    const dataset: any = await datasets.get(params.datasetId);
    if (!dataset) {
      return NextResponse.json({ error: 'Dataset not found' }, { status: 404 });
    }
    
    const dimensions = dataset.schema.columns
      .filter((c: any) => c.type === 'string' || c.type === 'date')
      .map((c: any) => ({ name: c.name, type: c.type }));
    
    return NextResponse.json({ dimensions });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
