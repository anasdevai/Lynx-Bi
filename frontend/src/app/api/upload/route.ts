import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// In-memory storage for Vercel (temporary - consider using external storage for production)
const datasets = new Map();

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(csv|xlsx|xls)$/i)) {
      return NextResponse.json({ error: 'Invalid file type. Allowed: CSV, Excel' }, { status: 400 });
    }

    // Read file content
    const buffer = await file.arrayBuffer();
    const content = Buffer.from(buffer).toString('utf-8');
    
    // Parse CSV (basic implementation)
    const lines = content.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim());
    const rows = lines.slice(1).map(line => {
      const values = line.split(',');
      const row: any = {};
      headers.forEach((header, i) => {
        row[header] = values[i]?.trim() || '';
      });
      return row;
    });

    // Infer schema
    const schema = {
      columns: headers.map(header => ({
        name: header,
        type: inferType(rows[0]?.[header]),
        nullable: true
      }))
    };

    // Store dataset
    const datasetId = uuidv4();
    const dataset = {
      id: datasetId,
      name: file.name.replace(/\.[^/.]+$/, ''),
      originalName: file.name,
      schema,
      rowCount: rows.length,
      columnCount: headers.length,
      createdAt: new Date().toISOString(),
      data: rows
    };
    
    datasets.set(datasetId, dataset);
    
    return NextResponse.json({
      id: datasetId,
      name: dataset.name,
      schema,
      rowCount: dataset.rowCount,
      columnCount: dataset.columnCount,
      preview: rows.slice(0, 100)
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function inferType(value: any): string {
  if (!value) return 'string';
  if (!isNaN(Number(value))) return 'number';
  if (value.match(/^\d{4}-\d{2}-\d{2}/)) return 'date';
  return 'string';
}

export { datasets };
