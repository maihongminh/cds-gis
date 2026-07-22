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
import { Waves, ClipboardList, ShieldAlert, Users, CheckCircle } from 'lucide-react';
import {
  IrrigationFacility,
  IrrigationOperationRecord,
  IrrigationManagementUnit,
} from '@/types/irrigation';

// 1. Irrigation Facilities Table
interface IrrigationFacilitiesTableProps {
  data: IrrigationFacility[];
  userRole: string;
  onEdit: (item: IrrigationFacility) => void;
  onDelete: (item: IrrigationFacility) => void;
}

export function IrrigationFacilitiesTable({ data, userRole, onEdit, onDelete }: IrrigationFacilitiesTableProps) {
  const getFacilityStatusLabel = (status: string) => {
    switch (status) {
      case 'good': return 'Hoạt động tốt';
      case 'needsRepair': return 'Cần sửa chữa';
      default: return 'Bị hư hỏng';
    }
  };

  const getFacilityStatusBadgeType = (status: string): 'active' | 'pending' | 'inactive' => {
    switch (status) {
      case 'good': return 'active';
      case 'needsRepair': return 'pending';
      default: return 'inactive';
    }
  };

  return (
    <SectionCard title="Danh sách công trình thủy lợi toàn xã">
      <div className="overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader className="bg-muted/40 border-b border-border/60">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs">Mã công trình</TableHead>
              <TableHead className="text-xs">Tên công trình</TableHead>
              <TableHead className="text-xs">Phân loại</TableHead>
              <TableHead className="text-xs">Thôn địa bàn</TableHead>
              <TableHead className="text-right text-xs">Quy mô/Thiết kế</TableHead>
              <TableHead className="text-right text-xs">Diện tích tưới (ha)</TableHead>
              <TableHead className="text-center text-xs">Năm đầu tư</TableHead>
              <TableHead className="text-xs">Đơn vị quản lý</TableHead>
              <TableHead className="text-center text-xs">Hiện trạng</TableHead>
              <TableHead className="w-12 text-center text-xs">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="h-24 text-center text-xs text-muted-foreground">Không có công trình nào.</TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/30 border-b border-border/40 text-xs">
                  <TableCell className="font-mono font-bold text-muted-foreground">{item.facilityCode}</TableCell>
                  <TableCell className="font-bold text-foreground">
                    <div className="flex items-center gap-1.5">
                      <Waves className="size-3.5 text-blue-500" />
                      {item.name}
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold text-muted-foreground">{item.typeName}</TableCell>
                  <TableCell className="font-semibold">{item.villageName}</TableCell>
                  <TableCell className="text-right font-medium text-muted-foreground">{item.capacity}</TableCell>
                  <TableCell className="text-right font-bold text-blue-600">{item.irrigatedAreaHa} ha</TableCell>
                  <TableCell className="text-center text-muted-foreground">{item.investedYear}</TableCell>
                  <TableCell className="max-w-[150px] truncate text-muted-foreground" title={item.managementUnitName}>
                    {item.managementUnitName}
                  </TableCell>
                  <TableCell className="text-center">
                    <StatusBadge
                      status={getFacilityStatusBadgeType(item.status)}
                      customLabel={getFacilityStatusLabel(item.status)}
                    />
                  </TableCell>
                  <TableCell className="p-0 text-center">
                    <ActionMenu
                      entityName="công trình thủy lợi"
                      userRole={userRole}
                      onEdit={() => onEdit(item)}
                      onDelete={() => onDelete(item)}
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

// 2. Irrigation Operation Table
interface IrrigationOperationsTableProps {
  data: IrrigationOperationRecord[];
  userRole: string;
  onEdit: (item: IrrigationOperationRecord) => void;
  onDelete: (item: IrrigationOperationRecord) => void;
  onResolve: (item: IrrigationOperationRecord) => void;
}

export function IrrigationOperationsTable({ data, userRole, onEdit, onDelete, onResolve }: IrrigationOperationsTableProps) {
  const getOpStatusLabel = (status: string) => {
    switch (status) {
      case 'resolved': return 'Ổn định / Đã xử lý';
      case 'pending': return 'Yêu cầu khắc phục';
      default: return 'Theo dõi vận hành';
    }
  };

  const getOpStatusBadgeType = (status: string): 'active' | 'pending' | 'inactive' => {
    switch (status) {
      case 'resolved': return 'active';
      case 'monitoring': return 'pending';
      default: return 'inactive';
    }
  };

  return (
    <SectionCard title="Nhật ký kiểm tra và vận hành thủy lợi">
      <div className="overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader className="bg-muted/40 border-b border-border/60">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs">Tên công trình</TableHead>
              <TableHead className="text-xs">Ngày kiểm tra</TableHead>
              <TableHead className="text-xs">Người kiểm tra</TableHead>
              <TableHead className="text-center text-xs">Tình trạng chung</TableHead>
              <TableHead className="text-xs">Chi tiết sự cố ghi nhận</TableHead>
              <TableHead className="text-xs">Đề xuất xử lý</TableHead>
              <TableHead className="text-center text-xs">Trạng thái xử lý</TableHead>
              <TableHead className="w-12 text-center text-xs">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-xs text-muted-foreground">Không có nhật ký vận hành.</TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/30 border-b border-border/40 text-xs">
                  <TableCell className="font-bold text-foreground">
                    <div className="flex items-center gap-1.5">
                      <ClipboardList className="size-3.5 text-muted-foreground" />
                      {item.facilityName}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-muted-foreground">{item.checkDate}</TableCell>
                  <TableCell className="text-muted-foreground">{item.inspectorName}</TableCell>
                  <TableCell className="text-center font-bold">
                    {item.operationStatus === 'stable' ? (
                      <span className="text-emerald-600 text-[10px]">ỔN ĐỊNH</span>
                    ) : (
                      <span className="text-rose-600 text-[10px] flex items-center justify-center gap-0.5">
                        <ShieldAlert className="size-3" />
                        GHI NHẬN LỖI
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate text-muted-foreground" title={item.issuesRecorded}>
                    {item.issuesRecorded || 'Không có'}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate text-muted-foreground" title={item.actionProposed}>
                    {item.actionProposed || 'Không có'}
                  </TableCell>
                  <TableCell className="text-center">
                    <StatusBadge
                      status={getOpStatusBadgeType(item.status)}
                      customLabel={getOpStatusLabel(item.status)}
                    />
                  </TableCell>
                  <TableCell className="p-0 text-center">
                    <ActionMenu
                      entityName="nhật ký vận hành"
                      userRole={userRole}
                      onEdit={() => onEdit(item)}
                      onDelete={() => onDelete(item)}
                      customActions={
                        item.status !== 'resolved'
                          ? [
                              {
                                label: 'Đã khắc phục',
                                icon: <CheckCircle className="size-3.5 text-emerald-600" />,
                                onClick: () => onResolve(item),
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

// 3. Irrigation Management Units Table
interface IrrigationManagementUnitsTableProps {
  data: IrrigationManagementUnit[];
  userRole: string;
  onEdit: (item: IrrigationManagementUnit) => void;
  onDelete: (item: IrrigationManagementUnit) => void;
}

export function IrrigationManagementUnitsTable({ data, userRole, onEdit, onDelete }: IrrigationManagementUnitsTableProps) {
  return (
    <SectionCard title="Đơn vị khai thác quản lý thủy lợi">
      <div className="overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader className="bg-muted/40 border-b border-border/60">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs">Đơn vị quản lý</TableHead>
              <TableHead className="text-xs">Loại hình</TableHead>
              <TableHead className="text-xs">Đại diện liên hệ</TableHead>
              <TableHead className="text-xs">Số điện thoại</TableHead>
              <TableHead className="text-right text-xs">Số công trình phụ trách</TableHead>
              <TableHead className="w-12 text-center text-xs">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-xs text-muted-foreground">Không có đơn vị nào.</TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/30 border-b border-border/40 text-xs">
                  <TableCell className="font-bold text-foreground">
                    <div className="flex items-center gap-1.5">
                      <Users className="size-3.5 text-muted-foreground" />
                      {item.name}
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold text-muted-foreground">{item.typeName}</TableCell>
                  <TableCell className="font-medium">{item.contactPerson}</TableCell>
                  <TableCell className="font-mono text-muted-foreground">{item.phoneNumber}</TableCell>
                  <TableCell className="text-right font-bold text-blue-600">{item.facilityCount} công trình</TableCell>
                  <TableCell className="p-0 text-center">
                    <ActionMenu
                      entityName="đơn vị quản lý"
                      userRole={userRole}
                      onEdit={() => onEdit(item)}
                      onDelete={() => onDelete(item)}
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
