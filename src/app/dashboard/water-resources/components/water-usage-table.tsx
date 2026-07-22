'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Button,
} from '@/components/ui';
import { SectionCard } from '@/components/common';
import { CleanWaterUsageRecord, HygienicWaterUsageRecord } from '@/types/water-resource';
import { Award, ShieldAlert, Edit } from 'lucide-react';

interface WaterUsageTableProps {
  cleanData: CleanWaterUsageRecord[];
  hygienicData: HygienicWaterUsageRecord[];
  userRole: string;
  onEditClean?: (item: CleanWaterUsageRecord) => void;
  onEditHygienic?: (item: HygienicWaterUsageRecord) => void;
}

export function WaterUsageTable({
  cleanData,
  hygienicData,
  userRole,
  onEditClean,
  onEditHygienic,
}: WaterUsageTableProps) {
  const isLeader = userRole === 'leader';

  // Combine datasets by villageCode & year for clean presentation
  const combined = React.useMemo(() => {
    return cleanData.map((c) => {
      const h = hygienicData.find(
        (x) => x.villageCode === c.villageCode && x.year === c.year
      );
      return {
        id: c.id,
        villageCode: c.villageCode,
        villageName: c.villageName,
        totalHouseholds: c.totalHouseholds,
        cleanWaterHouseholds: c.cleanWaterHouseholds,
        cleanPercentage: c.percentage,
        hygienicWaterHouseholds: h ? h.hygienicWaterHouseholds : 0,
        hygienicPercentage: h ? h.percentage : 0,
        year: c.year,
        rawClean: c,
        rawHygienic: h,
      };
    });
  }, [cleanData, hygienicData]);

  return (
    <SectionCard title="Tỷ lệ sử dụng nước sạch & nước sinh hoạt hợp vệ sinh">
      <div className="overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader className="bg-muted/40 border-b border-border/60">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs">Thôn địa bàn</TableHead>
              <TableHead className="text-right text-xs">Tổng số hộ</TableHead>
              <TableHead className="text-right text-xs">Hộ dùng nước sạch</TableHead>
              <TableHead className="text-center text-xs">Tỷ lệ nước sạch (%)</TableHead>
              <TableHead className="text-right text-xs">Hộ dùng nước hợp vệ sinh</TableHead>
              <TableHead className="text-center text-xs">Tỷ lệ hợp vệ sinh (%)</TableHead>
              <TableHead className="text-center text-xs">Năm theo dõi</TableHead>
              {!isLeader && (onEditClean || onEditHygienic) && (
                <TableHead className="w-24 text-center text-xs">Cập nhật số liệu</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {combined.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-xs text-muted-foreground">
                  Không có dữ liệu sử dụng nước sạch và hợp vệ sinh.
                </TableCell>
              </TableRow>
            ) : (
              combined.map((item, idx) => {
                // Highlight high achievements and warning alerts
                const isHighClean = item.cleanPercentage >= 60;
                const isLowHygienic = item.hygienicPercentage < 80;

                return (
                  <TableRow key={idx} className="hover:bg-muted/30 border-b border-border/40 text-xs">
                    <TableCell className="font-bold text-foreground">{item.villageName}</TableCell>
                    <TableCell className="text-right">{Math.round(item.totalHouseholds)} hộ</TableCell>
                    <TableCell className="text-right text-sky-600 dark:text-sky-400 font-semibold">
                      {Math.round(item.cleanWaterHouseholds)} hộ
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className="font-bold text-foreground">{item.cleanPercentage}%</span>
                        {isHighClean && <span title="Đạt tỷ lệ cao"><Award className="size-3.5 text-amber-500" /></span>}
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-indigo-600 dark:text-indigo-400 font-semibold">
                      {Math.round(item.hygienicWaterHouseholds)} hộ
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className="font-bold text-foreground">{item.hygienicPercentage}%</span>
                        {isLowHygienic && <span title="Tỷ lệ cần cải thiện"><ShieldAlert className="size-3.5 text-rose-500" /></span>}
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-medium text-muted-foreground">{item.year}</TableCell>
                    {!isLeader && (onEditClean || onEditHygienic) && (
                      <TableCell className="p-1 text-center">
                        <div className="flex justify-center gap-1">
                          {onEditClean && (
                            <Button
                              variant="outline"
                              size="xs"
                              onClick={() => onEditClean(item.rawClean)}
                              className="h-6 text-[10px] cursor-pointer shadow-none px-1.5 text-sky-600 border-sky-200 hover:bg-sky-500/5 hover:text-sky-700"
                              title="Cập nhật tỷ lệ nước sạch"
                            >
                              Nước sạch
                            </Button>
                          )}
                          {onEditHygienic && item.rawHygienic && (
                            <Button
                              variant="outline"
                              size="xs"
                              onClick={() => onEditHygienic(item.rawHygienic!)}
                              className="h-6 text-[10px] cursor-pointer shadow-none px-1.5 text-indigo-600 border-indigo-200 hover:bg-indigo-500/5 hover:text-indigo-700"
                              title="Cập nhật tỷ lệ hợp vệ sinh"
                            >
                              Hợp vệ sinh
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </SectionCard>
  );
}
