import { NextRequest, NextResponse } from 'next/server';
import { datasets } from '@/lib/storage';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const dataset: any = await datasets.get(params.id);
    
    if (!dataset) {
      return NextResponse.json({ error: 'Dataset not found' }, { status: 404 });
    }
    
    return NextResponse.json(dataset.schema);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
