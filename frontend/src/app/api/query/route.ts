import { NextRequest, NextResponse } from 'next/server';
import { datasets } from '@/lib/storage';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { datasetId, filters, aggregations, groupBy } = body;
    
    const dataset: any = await datasets.get(datasetId);
    if (!dataset) {
      return NextResponse.json({ error: 'Dataset not found' }, { status: 404 });
    }
    
    let data = [...dataset.data];
    
    // Apply filters
    if (filters && filters.length > 0) {
      data = data.filter(row => {
        return filters.every((filter: any) => {
          const value = row[filter.column];
          switch (filter.operator) {
            case 'equals':
              return value == filter.value;
            case 'contains':
              return String(value).toLowerCase().includes(String(filter.value).toLowerCase());
            case 'greater':
              return Number(value) > Number(filter.value);
            case 'less':
              return Number(value) < Number(filter.value);
            default:
              return true;
          }
        });
      });
    }
    
    // Apply groupBy and aggregations
    if (groupBy && aggregations) {
      const grouped = new Map();
      
      data.forEach(row => {
        const key = row[groupBy];
        if (!grouped.has(key)) {
          grouped.set(key, []);
        }
        grouped.get(key).push(row);
      });
      
      data = Array.from(grouped.entries()).map(([key, rows]: [any, any[]]) => {
        const result: any = { [groupBy]: key };
        
        aggregations.forEach((agg: any) => {
          const values = rows.map(r => Number(r[agg.column]) || 0);
          switch (agg.function) {
            case 'sum':
              result[`${agg.function}_${agg.column}`] = values.reduce((a, b) => a + b, 0);
              break;
            case 'avg':
              result[`${agg.function}_${agg.column}`] = values.reduce((a, b) => a + b, 0) / values.length;
              break;
            case 'count':
              result[`${agg.function}_${agg.column}`] = values.length;
              break;
            case 'min':
              result[`${agg.function}_${agg.column}`] = Math.min(...values);
              break;
            case 'max':
              result[`${agg.function}_${agg.column}`] = Math.max(...values);
              break;
          }
        });
        
        return result;
      });
    }
    
    return NextResponse.json({
      data,
      rowCount: data.length,
      executionTime: Math.random() * 100 // Mock execution time
    });
  } catch (error: any) {
    console.error('Query error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
