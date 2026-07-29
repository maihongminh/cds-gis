import { NextRequest, NextResponse } from 'next/server';

import {
  deleteDemoGisFeature,
  saveDemoGisFeature,
  validateDemoGisFeature,
} from '@/lib/demo-gis-store';
import type { DemoGisFeature } from '@/types/demo-gis';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const feature = (await request.json()) as DemoGisFeature;
    feature.id = decodeURIComponent(id);
    validateDemoGisFeature(feature);
    return NextResponse.json(await saveDemoGisFeature(feature));
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Dữ liệu không hợp lệ.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const deleted = await deleteDemoGisFeature(decodeURIComponent(id));
    if (!deleted) {
      return NextResponse.json(
        { error: 'Không tìm thấy đối tượng.' },
        { status: 404 },
      );
    }
    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error('Không thể xóa đối tượng GIS demo', error);
    return NextResponse.json(
      { error: 'Không thể xóa đối tượng GIS demo.' },
      { status: 500 },
    );
  }
}
