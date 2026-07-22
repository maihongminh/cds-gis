import * as React from 'react';
import { SectionCard } from '@/components/common';
import { StatusBadge } from '@/components/common';
import { MOCK_LANDS } from '@/data/mock-lands';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui';

interface HouseholdLandTabProps {
  householdId: string;
}

export function HouseholdLandTab({ householdId }: HouseholdLandTabProps) {
  // Filter land plots for this household
  const lands = React.useMemo(() => {
    return MOCK_LANDS.filter((l) => l.householdId === householdId && l.status === 'active');
  }, [householdId]);

  const getOwnershipText = (val: string) => {
    switch (val) {
      case 'household': return 'Sở hữu riêng';
      case 'communal': return 'Đất tập thể';
      case 'rented': return 'Giao khoán/Thuê';
      default: return val;
    }
  };

  return (
    <SectionCard title="Quản lý quỹ đất & Thửa đất sở hữu">
      {lands.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground text-xs">
          Hộ dân hiện chưa có thông tin thửa đất khai báo trên hệ thống.
        </div>
      ) : (
        <Table size="sm">
          <TableHeader className="bg-muted/40 border-b border-border/60">
            <TableRow className="hover:bg-transparent border-b border-border/60 text-muted-foreground font-semibold uppercase tracking-wider">
              <TableHead className="pb-2 text-xs">Mã thửa đất</TableHead>
              <TableHead className="pb-2 text-xs">Loại đất</TableHead>
              <TableHead className="pb-2 text-right text-xs">Diện tích</TableHead>
              <TableHead className="pb-2 text-center text-xs">Tờ bản đồ</TableHead>
              <TableHead className="pb-2 text-xs">Hình thức sở hữu</TableHead>
              <TableHead className="pb-2 text-center text-xs">Giấy chứng nhận (Sổ đỏ)</TableHead>
              <TableHead className="pb-2 pl-4 text-xs">Mục đích sử dụng</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-border/40 font-medium">
            {lands.map((land) => (
              <TableRow key={land.id} className="hover:bg-muted/30 transition-colors h-10">
                <TableCell className="font-mono text-[11px] font-bold text-foreground text-xs">{land.parcelCode}</TableCell>
                <TableCell className="text-foreground text-xs">{land.landTypeName}</TableCell>
                <TableCell className="text-right text-foreground font-bold text-xs">{land.areaHa} ha</TableCell>
                <TableCell className="text-center text-muted-foreground text-xs">{land.mapSheetNumber || '-'}</TableCell>
                <TableCell className="text-muted-foreground text-xs">{getOwnershipText(land.ownershipType)}</TableCell>
                <TableCell className="text-center text-xs">
                  <div className="flex flex-col items-center gap-0.5">
                    <StatusBadge status={land.certificateStatus} />
                    {land.certificateNumber && (
                      <span className="text-[10px] text-muted-foreground font-mono font-semibold">
                        No. {land.certificateNumber}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="pl-4 text-muted-foreground text-xs truncate max-w-[150px]" title={land.purpose}>
                  {land.purpose}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </SectionCard>
  );
}
