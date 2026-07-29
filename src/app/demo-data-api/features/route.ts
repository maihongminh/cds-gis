import { NextResponse } from 'next/server';

import {
  deleteUserDemoGisFeatures,
  getDemoGisFeatures,
} from '@/lib/demo-gis-store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    return NextResponse.json(await getDemoGisFeatures(), {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    console.error('Không thể đọc dữ liệu GIS demo', error);
    return NextResponse.json(
      { error: 'Không thể đọc dữ liệu GIS demo.' },
      { status: 500 },
    );
  }
}

export async function DELETE() {
  try {
    const deletedCount = await deleteUserDemoGisFeatures();
    return NextResponse.json({ deletedCount });
  } catch (error) {
    console.error('Không thể xóa dữ liệu GIS do người dùng tạo', error);
    return NextResponse.json(
      { error: 'Không thể xóa dữ liệu GIS do người dùng tạo.' },
      { status: 500 },
    );
  }
}
