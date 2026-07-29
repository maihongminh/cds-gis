import { NextResponse } from 'next/server';

import { resetDemoGisFeatures } from '@/lib/demo-gis-store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST() {
  try {
    return NextResponse.json(await resetDemoGisFeatures());
  } catch (error) {
    console.error('Không thể khôi phục dữ liệu GIS demo', error);
    return NextResponse.json(
      { error: 'Không thể khôi phục dữ liệu GIS demo.' },
      { status: 500 },
    );
  }
}
