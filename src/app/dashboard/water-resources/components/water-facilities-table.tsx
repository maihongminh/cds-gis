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
import { Waves, RefreshCw, CheckCircle } from 'lucide-react';
import { CentralizedWaterFacility, SmallWaterFacility } from '@/types/water-resource';

interface WaterFacilitiesTableProps {
  centralizedData: CentralizedWaterFacility[];
  smallData: SmallWaterFacility[];
  userRole: string;
  onEditCentralized: (item: CentralizedWaterFacility) => void;
  onDeleteCentralized: (item: CentralizedWaterFacility) => void;
  onEditSmall: (item: SmallWaterFacility) => void;
  onDeleteSmall: (item: SmallWaterFacility) => void;
  onToggleStatusCentralized: (item: CentralizedWaterFacility) => void;
  onToggleStatusSmall: (item: SmallWaterFacility) => void;
}

export function WaterFacilitiesTable({
  centralizedData,
  smallData,
  userRole,
  onEditCentralized,
  onDeleteCentralized,
  onEditSmall,
  onDeleteSmall,
  onToggleStatusCentralized,
  onToggleStatusSmall,
}: WaterFacilitiesTableProps) {
  const getFacilityTypeLabel = (type: string) => {
    switch (type) {
      case 'gravity': return 'Tự chảy tập trung';
      case 'pump': return 'Trạm bơm điện';
      case 'drilledWell': return 'Giếng khoan công nghiệp';
      case 'diggedWell': return 'Giếng đào hộ GĐ';
      case 'gravityTank': return 'Bể nước tự chảy hộ';
      case 'rainwaterHarvest': return 'Bể thu chứa nước mưa';
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      <SectionCard title="Công trình cấp nước tập trung">
        <div className="overflow-x-auto rounded-lg border border-border">
          <Table>
            <TableHeader className="bg-muted/40 border-b border-border/60">
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs">Tên công trình</TableHead>
                <TableHead className="text-xs">Loại công trình</TableHead>
                <TableHead className="text-xs">Thôn địa bàn</TableHead>
                <TableHead className="text-right text-xs">Công suất (m³/ngày)</TableHead>
                <TableHead className="text-right text-xs">Số hộ phục vụ</TableHead>
                <TableHead className="text-xs">Đơn vị quản lý</TableHead>
                <TableHead className="text-xs">Kiểm tra gần nhất</TableHead>
                <TableHead className="text-center text-xs">Tình trạng</TableHead>
                <TableHead className="w-12 text-center text-xs">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {centralizedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center text-xs text-muted-foreground">
                    Không có công trình cấp nước tập trung.
                  </TableCell>
                </TableRow>
              ) : (
                centralizedData.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/30 border-b border-border/40 text-xs">
                    <TableCell className="font-bold text-foreground flex items-center gap-1.5">
                      <Waves className="size-3.5 text-cyan-500" />
                      {item.facilityName}
                    </TableCell>
                    <TableCell className="font-medium text-muted-foreground">{getFacilityTypeLabel(item.facilityType)}</TableCell>
                    <TableCell className="font-semibold">{item.villageName}</TableCell>
                    <TableCell className="text-right font-semibold text-foreground">{item.capacityM3Day} m³</TableCell>
                    <TableCell className="text-right font-medium text-cyan-600 dark:text-cyan-400">{item.servedHouseholds} hộ</TableCell>
                    <TableCell className="font-medium text-muted-foreground">{item.managementUnit}</TableCell>
                    <TableCell className="text-muted-foreground">{item.lastCheckedDate}</TableCell>
                    <TableCell className="text-center">
                      <StatusBadge
                        status={item.status === 'active' ? 'active' : item.status === 'maintenance' ? 'warning' : 'inactive'}
                        customLabel={item.status === 'active' ? 'Hoạt động tốt' : item.status === 'maintenance' ? 'Bảo trì' : 'Tạm ngừng'}
                      />
                    </TableCell>
                    <TableCell className="p-0 text-center">
                      <ActionMenu
                        entityName="công trình cấp nước"
                        userRole={userRole}
                        onEdit={() => onEditCentralized(item)}
                        onDelete={() => onDeleteCentralized(item)}
                        customActions={[
                          {
                            label: 'Đổi trạng thái',
                            icon: <RefreshCw className="size-3.5 text-blue-600" />,
                            onClick: () => onToggleStatusCentralized(item),
                            className: 'text-blue-700 focus:text-blue-700 focus:bg-blue-500/10',
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

      <SectionCard title="Công trình cấp nước nhỏ lẻ (Hộ gia đình)">
        <div className="overflow-x-auto rounded-lg border border-border">
          <Table>
            <TableHeader className="bg-muted/40 border-b border-border/60">
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs">Tên công trình / Chủ hộ</TableHead>
                <TableHead className="text-xs">Loại hình</TableHead>
                <TableHead className="text-xs">Thôn địa bàn</TableHead>
                <TableHead className="text-center text-xs">Chuẩn vệ sinh</TableHead>
                <TableHead className="text-center text-xs">Trạng thái</TableHead>
                <TableHead className="w-12 text-center text-xs">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {smallData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-xs text-muted-foreground">
                    Không có công trình nhỏ lẻ hộ gia đình.
                  </TableCell>
                </TableRow>
              ) : (
                smallData.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/30 border-b border-border/40 text-xs">
                    <TableCell className="font-bold text-foreground">Giếng/Bể hộ {item.householdHeadName}</TableCell>
                    <TableCell className="font-medium text-muted-foreground">{getFacilityTypeLabel(item.facilityType)}</TableCell>
                    <TableCell className="font-semibold">{item.villageName}</TableCell>
                    <TableCell className="text-center">
                      <StatusBadge
                        status={item.isHygienic ? 'active' : 'inactive'}
                        customLabel={item.isHygienic ? 'Đạt chuẩn' : 'Chưa đạt'}
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <StatusBadge
                        status={item.status === 'active' ? 'active' : 'inactive'}
                        customLabel={item.status === 'active' ? 'Đang dùng' : 'Ngưng dùng'}
                      />
                    </TableCell>
                    <TableCell className="p-0 text-center">
                      <ActionMenu
                        entityName="công trình nước nhỏ lẻ"
                        userRole={userRole}
                        onEdit={() => onEditSmall(item)}
                        onDelete={() => onDeleteSmall(item)}
                        customActions={[
                          {
                            label: 'Cập nhật chuẩn vệ sinh',
                            icon: <CheckCircle className="size-3.5 text-emerald-600" />,
                            onClick: () => onToggleStatusSmall(item),
                            className: 'text-emerald-700 focus:text-emerald-700 focus:bg-emerald-500/10',
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
    </div>
  );
}
