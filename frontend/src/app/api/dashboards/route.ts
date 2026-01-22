import { NextRequest, NextResponse } from 'next/server';
import { dashboards } from '@/lib/storage';

export async function GET() {
  try {
    const dashboardList = Array.from(dashboards.values());
    return NextResponse.json(dashboardList);
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
    
    dashboards.set(id, dashboard);
    
    return NextResponse.json(dashboard);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
