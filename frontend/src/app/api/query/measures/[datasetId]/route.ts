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
    
    const numericCols = dataset.schema.columns
      .filter((c: any) => c.type === 'number' || c.type === 'integer' || c.type === 'float')
      .map((c: any) => c.name);
    
    const measures = [];
    const aggregations = ['SUM', 'COUNT', 'AVG', 'MIN', 'MAX'];
    
    for (const col of numericCols) {
      for (const agg of aggregations) {
        measures.push(`${agg}(${col})`);
      }
    }
    
    return NextResponse.json({ measures, numericColumns: numericCols });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
