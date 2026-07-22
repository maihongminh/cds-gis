'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui';
import { StatusBadge, ActionMenu } from '@/components/common';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { CropChangeRecord, CropChangeReason } from '@/types/crop-change';
import { MOCK_HOUSEHOLDS } from '@/data/mock-households';

interface CropChangesTableProps {
  data: CropChangeRecord[];
  onEdit: (item: CropChangeRecord) => void;
  onDelete: (item: CropChangeRecord) => void;
}

const REASONS_MAP: Record<CropChangeReason, string> = {
  cropConversion: 'Chuyển đổi',
  naturalDisaster: 'Thiên tai',
  disease: 'Dịch bệnh',
  poorHarvest: 'Mất mùa',
  marketChange: 'Thị trường',
  landChange: 'Đổi đất',
  other: 'Khác',
};

const REASON_COLORS: Record<CropChangeReason, 'active' | 'inactive' | 'processing' | 'warning' | 'default'> = {
  cropConversion: 'active', // Green
  naturalDisaster: 'inactive', // Red
  disease: 'inactive', // Red
  poorHarvest: 'warning', // Orange/Yellow
  marketChange: 'processing', // Blue
  landChange: 'processing',
  other: 'default', // Grey
};

export function CropChangesTable({
  data,
  onEdit,
  onDelete,
}: CropChangesTableProps) {
  // Index households for quick lookup of household codes
  const hhMap = React.useMemo(() => new Map(MOCK_HOUSEHOLDS.map(h => [h.id, h])), []);

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="overflow-x-auto w-full">
        <Table>
          <TableHeader className="bg-muted/40 border-b border-border/60">
            <TableRow className="hover:bg-transparent">
              <TableHead className="whitespace-nowrap">Kỳ vụ</TableHead>
              <TableHead className="whitespace-nowrap">Thôn</TableHead>
              <TableHead className="whitespace-nowrap">Hộ dân</TableHead>
              <TableHead className="whitespace-nowrap">Loại cây</TableHead>
              <TableHead className="text-right whitespace-nowrap">Diện tích cũ</TableHead>
              <TableHead className="text-right whitespace-nowrap">Diện tích mới</TableHead>
              <TableHead className="text-right whitespace-nowrap">Biến động (ha)</TableHead>
              <TableHead className="text-right whitespace-nowrap">Sản lượng cũ</TableHead>
              <TableHead className="text-right whitespace-nowrap">Sản lượng mới</TableHead>
              <TableHead className="text-right whitespace-nowrap">Biến động (kg)</TableHead>
              <TableHead className="text-center whitespace-nowrap">Tỷ lệ %</TableHead>
              <TableHead className="text-center whitespace-nowrap">Lý do</TableHead>
              <TableHead className="w-16 text-center">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={13} className="h-32 text-center text-xs text-muted-foreground">
                  Không tìm thấy ghi nhận biến động nào.
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, index) => {
                const hh = hhMap.get(item.householdId);
                const hhCodeStr = hh ? hh.code : item.householdId;
                
                // Format season label
                const seasonLabel = item.period === '2026-XH' ? 'Xuân Hè 2026' : 
                                    item.period === '2026-DH' ? 'Đông Xuân 2026' :
                                    item.period === '2025-XH' ? 'Xuân Hè 2025' :
                                    item.period === '2025-DH' ? 'Đông Xuân 2025' : item.period;

                // Determine change styles
                const isAreaIncrease = item.areaChangeHa > 0;
                const isAreaNoChange = item.areaChangeHa === 0;

                const areaChangeEl = isAreaNoChange ? (
                  <span className="text-muted-foreground text-xs">-</span>
                ) : (
                  <span className={`inline-flex items-center gap-0.5 text-xs font-bold ${isAreaIncrease ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {isAreaIncrease ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                    {isAreaIncrease ? '+' : ''}{item.areaChangeHa}
                  </span>
                );

                const isOutputIncrease = item.outputChangeKg > 0;
                const isOutputNoChange = item.outputChangeKg === 0;

                const outputChangeEl = isOutputNoChange ? (
                  <span className="text-muted-foreground text-xs">-</span>
                ) : (
                  <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${isOutputIncrease ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {isOutputIncrease ? '+' : ''}{item.outputChangeKg.toLocaleString()}
                  </span>
                );

                return (
                  <TableRow key={index} className="hover:bg-muted/30 border-b border-border/40 text-xs">
                    {/* Period */}
                    <TableCell className="font-semibold whitespace-nowrap">{seasonLabel}</TableCell>
                    
                    {/* Hamlet */}
                    <TableCell className="font-medium whitespace-nowrap">{item.villageName}</TableCell>
                    
                    {/* Household */}
                    <TableCell className="whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-bold text-foreground">{hh?.headName || 'Chủ hộ'}</span>
                        <span className="text-[10px] text-muted-foreground font-mono">{hhCodeStr}</span>
                      </div>
                    </TableCell>
                    
                    {/* Crop Type */}
                    <TableCell className="font-semibold text-foreground whitespace-nowrap">{item.cropTypeName}</TableCell>
                    
                    {/* Old Area */}
                    <TableCell className="text-right font-medium whitespace-nowrap">{item.previousAreaHa} ha</TableCell>
                    
                    {/* New Area */}
                    <TableCell className="text-right font-bold whitespace-nowrap">{item.currentAreaHa} ha</TableCell>
                    
                    {/* Area Change */}
                    <TableCell className="text-right whitespace-nowrap">{areaChangeEl}</TableCell>
                    
                    {/* Old Output */}
                    <TableCell className="text-right font-medium text-muted-foreground whitespace-nowrap">{item.previousOutputKg.toLocaleString()} kg</TableCell>
                    
                    {/* New Output */}
                    <TableCell className="text-right font-semibold text-foreground whitespace-nowrap">{item.currentOutputKg.toLocaleString()} kg</TableCell>
                    
                    {/* Output Change */}
                    <TableCell className="text-right whitespace-nowrap">{outputChangeEl}</TableCell>
                    
                    {/* Change % */}
                    <TableCell className="text-center font-bold whitespace-nowrap">
                      <span className={item.changePercent > 0 ? 'text-emerald-600 dark:text-emerald-400' : item.changePercent < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-muted-foreground'}>
                        {item.changePercent > 0 ? '+' : ''}{item.changePercent}%
                      </span>
                    </TableCell>
                    
                    {/* Reason */}
                    <TableCell className="text-center whitespace-nowrap">
                      <StatusBadge 
                        status={REASON_COLORS[item.reason] || 'default'} 
                        customLabel={REASONS_MAP[item.reason] || item.reason} 
                      />
                    </TableCell>
                    
                    {/* Actions */}
                    <TableCell className="w-12 p-0 text-center">
                      <ActionMenu
                        entityName="biến động cây trồng"
                        onEdit={() => onEdit(item)}
                        onDelete={() => onDelete(item)}
                      />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
