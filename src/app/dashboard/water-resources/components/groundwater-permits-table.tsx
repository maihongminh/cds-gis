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
import { StatusBadge, SectionCard, ActionMenu } from '@/components/common';
import { RefreshCw } from 'lucide-react';
import { GroundwaterPermitRecord } from '@/types/water-resource';

interface GroundwaterPermitsTableProps {
  data: GroundwaterPermitRecord[];
  userRole: string;
  onEdit: (item: GroundwaterPermitRecord) => void;
  onDelete: (item: GroundwaterPermitRecord) => void;
  onRenew: (item: GroundwaterPermitRecord) => void;
}

export function GroundwaterPermitsTable({
  data,
  userRole,
  onEdit,
  onDelete,
  onRenew,
}: GroundwaterPermitsTableProps) {
  return (
    <SectionCard title="Giấy phép khai thác nước dưới đất">
      <div className="overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader className="bg-muted/40 border-b border-border/60">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs">Số giấy phép</TableHead>
              <TableHead className="text-xs">Chủ hộ / Tổ chức</TableHead>
              <TableHead className="text-xs">Mục đích sử dụng</TableHead>
              <TableHead className="text-xs">Vị trí (Thôn)</TableHead>
              <TableHead className="text-right text-xs">Độ sâu (m)</TableHead>
              <TableHead className="text-right text-xs">Công suất (m³/ngày)</TableHead>
              <TableHead className="text-xs">Ngày cấp</TableHead>
              <TableHead className="text-xs">Hạn giấy phép</TableHead>
              <TableHead className="text-center text-xs">Trạng thái</TableHead>
              <TableHead className="w-12 text-center text-xs">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="h-24 text-center text-xs text-muted-foreground">
                  Không có dữ liệu giấy phép nước dưới đất.
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/30 border-b border-border/40 text-xs">
                  <TableCell className="font-mono font-bold text-primary">{item.permitNumber}</TableCell>
                  <TableCell className="font-bold text-foreground">{item.ownerName}</TableCell>
                  <TableCell className="text-muted-foreground">{item.purpose}</TableCell>
                  <TableCell className="font-medium">{item.villageName}</TableCell>
                  <TableCell className="text-right">{item.depthMeters} m</TableCell>
                  <TableCell className="text-right font-semibold">{item.capacityM3Day} m³</TableCell>
                  <TableCell>{item.issueDate}</TableCell>
                  <TableCell>{item.expiryDate}</TableCell>
                  <TableCell className="text-center">
                    <StatusBadge
                      status={item.status === 'active' ? 'active' : item.status === 'expired' ? 'inactive' : 'warning'}
                      customLabel={item.status === 'active' ? 'Còn hiệu lực' : item.status === 'expired' ? 'Hết hiệu lực' : 'Đã thu hồi'}
                    />
                  </TableCell>
                  <TableCell className="p-0 text-center">
                    <ActionMenu
                      entityName="giấy phép khai thác nước"
                      userRole={userRole}
                      onEdit={() => onEdit(item)}
                      onDelete={() => onDelete(item)}
                      customActions={
                        item.status !== 'active'
                          ? [
                              {
                                label: 'Gia hạn',
                                icon: <RefreshCw className="size-3.5 text-emerald-600" />,
                                onClick: () => onRenew(item),
                                className: 'text-emerald-700 focus:text-emerald-700 focus:bg-emerald-500/10',
                              },
                            ]
                          : []
                      }
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
