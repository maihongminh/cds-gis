import { NextResponse } from 'next/server';

import { migrateDemoGisSeed } from '@/lib/demo-gis-store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST() {
  try {
    const result = await migrateDemoGisSeed();
    return NextResponse.json({
      message:
        'Đã cập nhật dữ liệu seed và giữ nguyên dữ liệu do người dùng tạo.',
      demoSeedVersion: result.collection.demoSeedVersion,
      totalFeatureCount: result.collection.features.length,
      replacedSeedCount: result.replacedSeedCount,
      preservedFeatureCount: result.preservedFeatureCount,
      skippedIdCollisionCount: result.skippedIdCollisionCount,
    });
  } catch (error) {
    console.error('Không thể migrate dữ liệu GIS demo', error);
    return NextResponse.json(
      { error: 'Không thể migrate dữ liệu GIS demo.' },
      { status: 500 },
    );
  }
}
