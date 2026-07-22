'use client';

import * as React from 'react';
import { SectionCard } from '@/components/common';
import { Card, Button, Badge } from '@/components/ui';
import { FileSpreadsheet, FileDown, CloudRain, ShieldCheck } from 'lucide-react';
import { MOCK_ROADS, MOCK_TRANSPORT_STRUCTURES, MOCK_TRAFFIC_DISRUPTIONS, MOCK_ROAD_MAINTENANCE_PLANS } from '@/data/mock-transportation';
import { MOCK_HAMLETS } from '@/data/mock-administrative-units';

interface TransportationReportSectionProps {
  selectedHamletCode: string;
  onExport: (title: string, format: 'excel' | 'pdf') => void;
}

export function TransportationReportSection({ selectedHamletCode, onExport }: TransportationReportSectionProps) {
  // Compute report numbers based on hamlet
  const hamletsList = React.useMemo(() => {
    if (selectedHamletCode !== 'all') {
      return MOCK_HAMLETS.filter(h => h.code === selectedHamletCode);
    }
    return MOCK_HAMLETS;
  }, [selectedHamletCode]);

  // Village hardening rate computation
  const villageStats = React.useMemo(() => {
    return hamletsList.map(h => {
      const vRoads = MOCK_ROADS.filter(r => r.villageCodes.includes(h.code));
      const totalLen = vRoads.reduce((sum, r) => sum + r.lengthKm, 0);
      const hardLen = vRoads
        .filter(r => r.surfaceType === 'concrete' || r.surfaceType === 'asphalt')
        .reduce((sum, r) => sum + r.lengthKm, 0);

      const rate = totalLen > 0 ? Math.round((hardLen / totalLen) * 100) : 0;

      const vDisruptions = MOCK_TRAFFIC_DISRUPTIONS.filter(d => d.villageCode === h.code && d.occurredAt.startsWith('2026'));
      const totalDisruptDays = vDisruptions.reduce((sum, d) => sum + d.disruptionDays, 0);

      const vDegraded = MOCK_TRANSPORT_STRUCTURES.filter(s => s.villageCode === h.code && (s.condition === 'degraded' || s.condition === 'dangerous')).length;

      return {
        code: h.code,
        name: h.name,
        totalLen: Number(totalLen.toFixed(1)),
        hardLen: Number(hardLen.toFixed(1)),
        rate,
        totalDisruptDays,
        vDegraded
      };
    });
  }, [hamletsList]);

  // Degraded bridges list
  const degradedBridges = React.useMemo(() => {
    return MOCK_TRANSPORT_STRUCTURES.filter(
      s => (s.condition === 'degraded' || s.condition === 'dangerous') && (selectedHamletCode === 'all' || s.villageCode === selectedHamletCode)
    ).slice(0, 6);
  }, [selectedHamletCode]);

  return (
    <div className="space-y-6 pt-4">
      {/* Action Buttons to Export */}
      <div className="flex items-center justify-between bg-card border border-border p-4 rounded-xl shadow-xs">
        <div>
          <h4 className="text-xs font-bold text-foreground">Báo cáo Giao thông Vận tải xã Lao Bảo</h4>
          <p className="text-[10px] text-muted-foreground mt-0.5">Xuất dữ liệu hiện trạng hạ tầng giao thông và tình hình chia cắt ra Excel/PDF</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onExport('Báo_cáo_giao_thông_vận_tải_tổng_hợp', 'excel')}
            className="h-8 text-xs cursor-pointer shadow-none text-emerald-600 bg-card border-border hover:bg-muted font-semibold"
          >
            <FileSpreadsheet className="size-4 mr-1.5" />
            Xuất Excel
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onExport('Báo_cáo_giao_thông_vận_tải_tổng_hợp', 'pdf')}
            className="h-8 text-xs cursor-pointer shadow-none text-rose-600 bg-card border-border hover:bg-muted font-semibold"
          >
            <FileDown className="size-4 mr-1.5" />
            Xuất PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hardening Rates by Village */}
        <SectionCard title="Tỷ lệ bê tông/nhựa hóa đường giao thông theo Thôn">
          <div className="space-y-4">
            {villageStats.map((vs) => (
              <div key={vs.code} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-foreground">{vs.name}</span>
                  <span className="font-mono font-bold text-muted-foreground">{vs.rate}% ({vs.hardLen} km / {vs.totalLen} km)</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${vs.rate >= 70 ? 'bg-emerald-500' : vs.rate >= 40 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                    style={{ width: `${vs.rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Degraded bridges / structures */}
        <SectionCard title="Cầu, cống xuống cấp / yếu cần ưu tiên gia cố">
          <div className="divide-y divide-border/60">
            {degradedBridges.length === 0 ? (
              <div className="text-center py-6 text-xs text-muted-foreground">Không có công trình giao thông yếu nào.</div>
            ) : (
              degradedBridges.map((s) => (
                <div key={s.id} className="py-2.5 flex items-start justify-between gap-4 text-xs">
                  <div className="min-w-0">
                    <p className="font-bold text-foreground truncate">{s.name}</p>
                    <p className="text-[10px] text-muted-foreground truncate my-1">Tuyến: {s.roadName} — Vị trí: {s.kmPosition || 'N/A'}</p>
                    <p className="text-[10px] font-semibold text-muted-foreground mt-0.5">Địa bàn: {s.villageName}</p>
                  </div>
                  <div className="shrink-0 flex flex-col items-end gap-1.5">
                    <Badge variant={s.condition === 'dangerous' ? 'destructive' : 'outline'} className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 leading-none">
                      {s.condition === 'dangerous' ? 'Cực kỳ nguy hiểm' : 'Yếu / Xuống cấp'}
                    </Badge>
                    <span className="text-[9px] font-bold text-muted-foreground">Năm xây: {s.builtYear}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </SectionCard>
      </div>

      {/* Disruption Days and Maintenance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard title="Tổng số ngày chia cắt giao thông trong năm 2026">
          <div className="space-y-4">
            <div className="flex items-center gap-3.5 p-4 border border-border/80 rounded-xl bg-muted/10">
              <CloudRain className="size-8 text-rose-500 shrink-0" />
              <div>
                <h5 className="text-xs font-bold text-foreground">Thống kê ngày ách tắc</h5>
                <p className="text-[10px] text-muted-foreground leading-normal mt-0.5">
                  Lũ quét và sạt lở đất ta-luy dương là nguyên nhân chính gây tắc nghẽn giao thông mùa mưa lũ trên địa bàn xã Lao Bảo.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-muted/40 border-b border-border/60">
                    <th className="p-2 font-bold">Thôn địa bàn</th>
                    <th className="p-2 font-bold text-right">Tổng ngày ách tắc</th>
                    <th className="p-2 font-bold text-center">Tình hình khắc phục</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {villageStats.map((vs) => (
                    <tr key={vs.code} className="hover:bg-muted/30">
                      <td className="p-2 font-semibold text-muted-foreground">{vs.name}</td>
                      <td className="p-2 font-bold text-right text-rose-600">{vs.totalDisruptDays} ngày</td>
                      <td className="p-2 text-center text-muted-foreground font-medium">
                        {vs.totalDisruptDays > 0 ? (
                          vs.totalDisruptDays > 10 ? 'Ngập nặng / Sạt lớn' : 'Đã thông tuyến nhanh'
                        ) : (
                          'Giao thông thông suốt'
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </SectionCard>

        {/* Maintenance Plans */}
        <SectionCard title="Tiến độ thực hiện duy tu sửa chữa trong năm">
          <div className="space-y-4">
            <div className="flex items-center gap-3.5 p-4 border border-border/80 rounded-xl bg-muted/10">
              <ShieldCheck className="size-8 text-emerald-500 shrink-0" />
              <div>
                <h5 className="text-xs font-bold text-foreground">Kế hoạch cải tạo hạ tầng</h5>
                <p className="text-[10px] text-muted-foreground leading-normal mt-0.5">
                  Ưu tiên phân bổ nguồn vốn xây dựng nông thôn mới để nâng cấp các ngầm tràn hay sạt lở và gia cố cầu gỗ/cầu treo Thôn.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card className="p-3 border-border bg-card flex flex-col justify-between shadow-none">
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Tổng kinh phí lập kế hoạch</span>
                <span className="text-sm font-bold text-emerald-600 mt-1 block">
                  {MOCK_ROAD_MAINTENANCE_PLANS.reduce((sum, p) => sum + p.estimatedBudgetVnd, 0).toLocaleString()} ₫
                </span>
              </Card>
              <Card className="p-3 border-border bg-card flex flex-col justify-between shadow-none">
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Kế hoạch đang thi công</span>
                <span className="text-sm font-bold text-blue-600 mt-1 block">
                  {MOCK_ROAD_MAINTENANCE_PLANS.filter(p => p.progress === 'inProgress').length} kế hoạch
                </span>
              </Card>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
