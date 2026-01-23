import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { datasets } from '@/lib/storage';

export async function POST(request: NextRequest) {
  try {
    console.log('Upload API called');
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    console.log('File received:', file?.name, file?.size);
    
    if (!file) {
      console.error('No file in request');
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file type
    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith('.csv') && !fileName.endsWith('.xlsx') && !fileName.endsWith('.xls') && !fileName.endsWith('.txt')) {
      console.error('Invalid file type:', fileName);
      return NextResponse.json({ error: 'Invalid file type. Allowed: CSV, Excel, TXT' }, { status: 400 });
    }

    // Read file content
    const buffer = await file.arrayBuffer();
    const content = Buffer.from(buffer).toString('utf-8');
    
    console.log('File content length:', content.length);
    
    // Parse CSV (improved implementation)
    const lines = content.split(/\r?\n/).filter(line => line.trim());
    
    if (lines.length === 0) {
      console.error('File is empty');
      return NextResponse.json({ error: 'File is empty' }, { status: 400 });
    }
    
    console.log('Lines parsed:', lines.length);
    
    // Parse CSV with proper handling of quoted values
    const parseCSVLine = (line: string): string[] => {
      const result = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current.trim());
      return result;
    };
    
    const headers = parseCSVLine(lines[0]);
    const rows = lines.slice(1).map(line => {
      const values = parseCSVLine(line);
      const row: any = {};
      headers.forEach((header, i) => {
        row[header] = values[i] || '';
      });
      return row;
    });

    console.log('Headers:', headers);
    console.log('Rows parsed:', rows.length);

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
    
    await datasets.set(datasetId, dataset);
    
    const size = await datasets.size();
    console.log('Dataset stored:', datasetId, 'Total datasets:', size);
    
    const response = {
      id: datasetId,
      name: dataset.name,
      schema,
      rowCount: dataset.rowCount,
      columnCount: dataset.columnCount,
      preview: rows.slice(0, 100)
    };
    
    console.log('Returning response:', response.id, response.name);
    
    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ 
      error: error.message || 'Upload failed',
      details: error.toString()
    }, { status: 500 });
  }
}

function inferType(value: any): string {
  if (!value || value === '') return 'string';
  const trimmed = String(value).trim();
  if (!isNaN(Number(trimmed)) && trimmed !== '') return 'number';
  if (trimmed.match(/^\d{4}-\d{2}-\d{2}/)) return 'date';
  return 'string';
}
