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
import { StatusBadge, SectionCard } from '@/components/common';
import { ActionMenu } from '@/components/common';
import { Wrench } from 'lucide-react';
import { WaterTreatmentSystem } from '@/types/water-resource';

interface WaterTreatmentTableProps {
  data: WaterTreatmentSystem[];
  userRole: string;
  onEdit: (item: WaterTreatmentSystem) => void;
  onDelete: (item: WaterTreatmentSystem) => void;
  onMaintain: (item: WaterTreatmentSystem) => void;
}

export function WaterTreatmentTable({
  data,
  userRole,
  onEdit,
  onDelete,
  onMaintain,
}: WaterTreatmentTableProps) {
  return (
    <SectionCard title="Hệ thống xử lý nước sạch và kiểm định">
      <div className="overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader className="bg-muted/40 border-b border-border/60">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs">Tên hệ thống xử lý</TableHead>
              <TableHead className="text-xs">Công nghệ xử lý</TableHead>
              <TableHead className="text-right text-xs">Công suất (m³/ngày)</TableHead>
              <TableHead className="text-xs">Vị trí lắp đặt</TableHead>
              <TableHead className="text-xs">Ngày kiểm tra gần nhất</TableHead>
              <TableHead className="text-center text-xs">Tình trạng vận hành</TableHead>
              <TableHead className="w-12 text-center text-xs">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-xs text-muted-foreground">
                  Không có hệ thống xử lý nước sạch nào.
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/30 border-b border-border/40 text-xs">
                  <TableCell className="font-bold text-foreground">{item.systemName}</TableCell>
                  <TableCell className="font-medium text-muted-foreground">{item.technology}</TableCell>
                  <TableCell className="text-right font-semibold text-foreground">{item.capacityM3Day} m³</TableCell>
                  <TableCell className="max-w-[200px] truncate" title={item.location}>{item.location}</TableCell>
                  <TableCell className="text-muted-foreground">{item.lastInspectionDate}</TableCell>
                  <TableCell className="text-center">
                    <StatusBadge
                      status={item.status === 'active' ? 'active' : item.status === 'maintenance' ? 'warning' : 'inactive'}
                      customLabel={item.status === 'active' ? 'Đang vận hành' : item.status === 'maintenance' ? 'Bảo trì' : 'Tạm ngừng'}
                    />
                  </TableCell>
                  <TableCell className="p-0 text-center">
                    <ActionMenu
                      entityName="hệ thống xử lý nước"
                      userRole={userRole}
                      onEdit={() => onEdit(item)}
                      onDelete={() => onDelete(item)}
                      customActions={[
                        {
                          label: 'Ghi nhận bảo trì',
                          icon: <Wrench className="size-3.5 text-amber-600" />,
                          onClick: () => onMaintain(item),
                          className: 'text-amber-700 focus:text-amber-700 focus:bg-amber-500/10',
                        },
                      ]}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </SectionCard>
  );
}
