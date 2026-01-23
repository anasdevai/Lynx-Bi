import { NextRequest, NextResponse } from 'next/server';
import { dashboards } from '@/lib/storage';

export async function GET() {
  try {
    const allDashboards = await dashboards.getAll();
    return NextResponse.json(allDashboards);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, widgets } = body;
    
    const id = `dash_${Date.now()}`;
    const dashboard = {
      id,
      name,
      description,
      widgets: widgets || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await dashboards.set(id, dashboard);
    
    return NextResponse.json(dashboard);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
