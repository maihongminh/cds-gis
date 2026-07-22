// src/app/dashboard/map/statistics/page.tsx
// GIS Data Statistics Dashboard for Xa Lao Bao
'use client';

import * as React from 'react';
import {
  Breadcrumbs,
  PageHeader,
} from '@/components/common';
import { MapSummary } from '../components/map-summary';
import { MOCK_TOURISM_POIS } from '@/data/mock-map-tourism-pois';
import { MOCK_PUBLIC_FACILITIES } from '@/data/mock-map-public-facilities';
import { MOCK_DISASTER_RISK_ZONES } from '@/data/mock-map-disaster-risks';
import { VILLAGES } from '@/data/laobao-administrative-units';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
} from '@/components/ui';
import {
  Map,
  Compass,
  Building2,
  AlertTriangle,
  FileSpreadsheet,
  PieChart,
} from 'lucide-react';
import {
  TOURISM_POI_COLORS,
  TOURISM_POI_LABELS,
  FACILITY_COLORS,
  FACILITY_LABELS,
  RISK_LEVEL_STYLES,
  RISK_LEVEL_LABELS,
} from '@/lib/map-style-config';
import type { RiskLevel, TourismPoiType, PublicFacilityType } from '@/types/map';

export default function GisStatisticsPage() {
  // 1. Group POIs by type
  const poiCounts = React.useMemo(() => {
    const counts: Record<TourismPoiType, number> = {
      tourist_attraction: 0,
      historical_site: 0,
      scenic_spot: 0,
      check_in: 0,
      local_product_point: 0,
    };
    MOCK_TOURISM_POIS.forEach((poi) => {
      counts[poi.type] = (counts[poi.type] || 0) + 1;
    });
    return counts;
  }, []);

  // 2. Group facilities by type
  const facilityCounts = React.useMemo(() => {
    const counts: Record<PublicFacilityType, number> = {
      health_station: 0,
      school: 0,
      cultural_house: 0,
      administrative_office: 0,
      market: 0,
      sports_facility: 0,
      water_facility: 0,
      public_infrastructure: 0,
    };
    MOCK_PUBLIC_FACILITIES.forEach((fac) => {
      counts[fac.facilityType] = (counts[fac.facilityType] || 0) + 1;
    });
    return counts;
  }, []);

  // 3. Group disaster risks by severity level
  const disasterCounts = React.useMemo(() => {
    const counts: Record<RiskLevel, number> = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
    };
    MOCK_DISASTER_RISK_ZONES.forEach((z) => {
      counts[z.riskLevel] = (counts[z.riskLevel] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      {/* Breadcrumbs Navigation */}
      <Breadcrumbs />

      {/* Page Header */}
      <PageHeader
        title={
          <>
            <PieChart className="w-6 h-6 text-primary" />
            Thống kê dữ liệu số GIS Xã Lao Bảo
          </>
        }
        description="Báo cáo phân tích số lượng và phân bố địa lý các thực thể, công trình công cộng, điểm du lịch và vùng cảnh báo thiên tai trên địa bàn xã."
      />

      {/* Summary Row */}
      <MapSummary />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* POI statistics card */}
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Compass className="size-4 text-violet-500" />
              Điểm du lịch & Di tích ({MOCK_TOURISM_POIS.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="py-0!">
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead className="text-[10px] uppercase font-bold text-muted-foreground">Loại địa điểm</TableHead>
                    <TableHead className="text-[10px] uppercase font-bold text-muted-foreground text-right w-20">Số lượng</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(Object.keys(poiCounts) as TourismPoiType[]).map((type) => {
                    const color = TOURISM_POI_COLORS[type] ?? '#8b5cf6';
                    return (
                      <TableRow key={type} className="border-border/50 hover:bg-muted/30">
                        <TableCell className="text-xs py-2 flex items-center gap-2">
                          <span className="size-2 rounded-full shrink-0" style={{ background: color }} />
                          <span>{TOURISM_POI_LABELS[type]}</span>
                        </TableCell>
                        <TableCell className="text-xs py-2 text-right font-mono font-bold">
                          {poiCounts[type]}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Public Facility statistics card */}
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Building2 className="size-4 text-emerald-500" />
              Công trình công cộng ({MOCK_PUBLIC_FACILITIES.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="py-0!">
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead className="text-[10px] uppercase font-bold text-muted-foreground">Loại công trình</TableHead>
                    <TableHead className="text-[10px] uppercase font-bold text-muted-foreground text-right w-20">Số lượng</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(Object.keys(facilityCounts) as PublicFacilityType[]).map((type) => {
                    const color = FACILITY_COLORS[type] ?? '#10b981';
                    return (
                      <TableRow key={type} className="border-border/50 hover:bg-muted/30">
                        <TableCell className="text-xs py-2 flex items-center gap-2">
                          <span className="size-2 rounded-full shrink-0" style={{ background: color }} />
                          <span>{FACILITY_LABELS[type]}</span>
                        </TableCell>
                        <TableCell className="text-xs py-2 text-right font-mono font-bold">
                          {facilityCounts[type]}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Disaster risk statistics card */}
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <AlertTriangle className="size-4 text-red-500" />
              Theo dõi cảnh báo thiên tai ({MOCK_DISASTER_RISK_ZONES.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="py-0!">
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead className="text-[10px] uppercase font-bold text-muted-foreground">Mức độ rủi ro</TableHead>
                    <TableHead className="text-[10px] uppercase font-bold text-muted-foreground text-right w-20">Số lượng</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(Object.keys(disasterCounts) as RiskLevel[]).map((level) => {
                    const styles = RISK_LEVEL_STYLES[level];
                    return (
                      <TableRow key={level} className="border-border/50 hover:bg-muted/30">
                        <TableCell className="text-xs py-2 flex items-center gap-2">
                          <span className="size-2 rounded-full shrink-0" style={{ background: styles.color }} />
                          <span>{RISK_LEVEL_LABELS[level]}</span>
                        </TableCell>
                        <TableCell className="text-xs py-2 text-right font-mono font-bold" style={{ color: styles.color }}>
                          {disasterCounts[level]}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Village summary list */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Map className="size-4 text-blue-500" />
            Phân bố dữ liệu GIS theo 12 thôn
          </CardTitle>
        </CardHeader>
        <CardContent className="py-0!">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="text-[10px] uppercase font-bold text-muted-foreground">Tên thôn</TableHead>
                  <TableHead className="text-[10px] uppercase font-bold text-muted-foreground text-right">Diện tích (ha)</TableHead>
                  <TableHead className="text-[10px] uppercase font-bold text-muted-foreground text-right">Dân số</TableHead>
                  <TableHead className="text-[10px] uppercase font-bold text-muted-foreground text-right">Số hộ</TableHead>
                  <TableHead className="text-[10px] uppercase font-bold text-muted-foreground text-right">Điểm du lịch</TableHead>
                  <TableHead className="text-[10px] uppercase font-bold text-muted-foreground text-right">Công trình công cộng</TableHead>
                  <TableHead className="text-[10px] uppercase font-bold text-muted-foreground text-right">Vùng cảnh báo thiên tai</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {VILLAGES.map((v) => {
                  const poiCount = MOCK_TOURISM_POIS.filter((poi) => poi.villageCode === v.code).length;
                  const facCount = MOCK_PUBLIC_FACILITIES.filter((fac) => fac.villageCode === v.code).length;
                  const zoneCount = MOCK_DISASTER_RISK_ZONES.filter((z) => z.villageCodes.includes(v.code)).length;

                  return (
                    <TableRow key={v.code} className="border-border/50 hover:bg-muted/30">
                      <TableCell className="text-xs font-medium">{v.name}</TableCell>
                      <TableCell className="text-xs text-right font-mono">{v.areaHa.toLocaleString('vi-VN')}</TableCell>
                      <TableCell className="text-xs text-right font-mono">{v.population.toLocaleString('vi-VN')}</TableCell>
                      <TableCell className="text-xs text-right font-mono">{v.householdCount.toLocaleString('vi-VN')}</TableCell>
                      <TableCell className="text-xs text-right font-mono font-bold text-violet-600 dark:text-violet-400">
                        {poiCount > 0 ? poiCount : '—'}
                      </TableCell>
                      <TableCell className="text-xs text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {facCount > 0 ? facCount : '—'}
                      </TableCell>
                      <TableCell className="text-xs text-right font-mono font-bold text-red-600 dark:text-red-400">
                        {zoneCount > 0 ? zoneCount : '—'}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
