import { NextRequest, NextResponse } from 'next/server';
import { dashboards } from '../route';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const dashboard = dashboards.get(params.id);
    
    if (!dashboard) {
      return NextResponse.json({ error: 'Dashboard not found' }, { status: 404 });
    }
    
    return NextResponse.json(dashboard);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const dashboard = dashboards.get(params.id);
    
    if (!dashboard) {
      return NextResponse.json({ error: 'Dashboard not found' }, { status: 404 });
    }
    
    const updated = {
      ...dashboard,
      ...body,
      updatedAt: new Date().toISOString()
    };
    
    dashboards.set(params.id, updated);
    
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deleted = dashboards.delete(params.id);
    
    if (!deleted) {
      return NextResponse.json({ error: 'Dashboard not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
