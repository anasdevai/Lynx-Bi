import { NextRequest, NextResponse } from 'next/server';
import { datasets } from '@/lib/storage';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { datasetId, query } = body;
    
    if (!datasetId) {
      return NextResponse.json({ error: 'Dataset ID required' }, { status: 400 });
    }
    
    const dataset: any = await datasets.get(datasetId);
    if (!dataset) {
      return NextResponse.json({ error: 'Dataset not found' }, { status: 404 });
    }
    
    // Simple query execution (filters, groupBy, aggregations)
    let data = [...dataset.data];
    
    // Apply filters
    if (query.filters && Object.keys(query.filters).length > 0) {
      data = data.filter(row => {
        return Object.entries(query.filters).every(([key, value]) => {
          return row[key] == value;
        });
      });
    }
    
    // Apply groupBy and measures
    if (query.groupBy && query.measures) {
      const grouped = new Map();
      
      data.forEach(row => {
        const keys = query.groupBy.map((col: string) => row[col]).join('|');
        if (!grouped.has(keys)) {
          grouped.set(keys, []);
        }
        grouped.get(keys).push(row);
      });
      
      data = Array.from(grouped.entries()).map(([keys, rows]: [string, any[]]) => {
        const result: any = {};
        const keyValues = keys.split('|');
        query.groupBy.forEach((col: string, i: number) => {
          result[col] = keyValues[i];
        });
        
        query.measures.forEach((measure: string) => {
          const match = measure.match(/(\w+)\((\w+)\)/);
          if (match) {
            const [, agg, col] = match;
            const values = rows.map(r => Number(r[col]) || 0);
            
            switch (agg.toUpperCase()) {
              case 'SUM':
                result[measure] = values.reduce((a, b) => a + b, 0);
                break;
              case 'AVG':
                result[measure] = values.reduce((a, b) => a + b, 0) / values.length;
                break;
              case 'COUNT':
                result[measure] = values.length;
                break;
              case 'MIN':
                result[measure] = Math.min(...values);
                break;
              case 'MAX':
                result[measure] = Math.max(...values);
                break;
            }
          }
        });
        
        return result;
      });
    }
    
    return NextResponse.json({
      success: true,
      datasetId,
      query,
      result: data,
      executedAt: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Query execution error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
