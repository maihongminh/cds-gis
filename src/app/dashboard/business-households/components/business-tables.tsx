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
import { Store, Coins, FileSpreadsheet } from 'lucide-react';
import { BusinessHouseholdRecord, BusinessRevenueRecord, NonAgriculturalLaborRecord } from '@/types/business-household';

// 1. Business Households Table
interface BusinessHouseholdsTableProps {
  data: BusinessHouseholdRecord[];
  userRole: string;
  onEdit: (item: BusinessHouseholdRecord) => void;
  onDelete: (item: BusinessHouseholdRecord) => void;
}

export function BusinessHouseholdsTable({ data, userRole, onEdit, onDelete }: BusinessHouseholdsTableProps) {
  const getScaleBadge = (scale: string) => {
    switch (scale) {
      case 'large':
        return <span className="text-[10px] px-1.5 py-0.5 rounded-sm font-bold bg-indigo-500/10 text-indigo-600 uppercase border border-indigo-500/20">Lớn</span>;
      case 'medium':
        return <span className="text-[10px] px-1.5 py-0.5 rounded-sm font-bold bg-blue-500/10 text-blue-600 uppercase border border-blue-500/20">Vừa</span>;
      default:
        return <span className="text-[10px] px-1.5 py-0.5 rounded-sm font-bold bg-muted text-muted-foreground uppercase border border-border">Nhỏ</span>;
    }
  };

  return (
    <SectionCard title="Danh sách hộ sản xuất kinh doanh phi nông nghiệp">
      <div className="overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader className="bg-muted/40 border-b border-border/60">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs">Mã hộ KD</TableHead>
              <TableHead className="text-xs">Tên cơ sở / Hộ KD</TableHead>
              <TableHead className="text-xs">Chủ hộ</TableHead>
              <TableHead className="text-xs">Thôn địa bàn</TableHead>
              <TableHead className="text-xs">Ngành nghề</TableHead>
              <TableHead className="text-center text-xs">Quy mô</TableHead>
              <TableHead className="text-center text-xs">Đăng ký KD</TableHead>
              <TableHead className="text-center text-xs">Trạng thái</TableHead>
              <TableHead className="w-12 text-center text-xs">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center text-xs text-muted-foreground">Không có hộ kinh doanh nào.</TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/30 border-b border-border/40 text-xs">
                  <TableCell className="font-mono font-bold text-muted-foreground">{item.id.toUpperCase()}</TableCell>
                  <TableCell className="font-bold text-foreground">
                    <div className="flex items-center gap-1.5">
                      <Store className="size-3.5 text-blue-500" />
                      {item.businessName}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span>{item.householdHeadName}</span>
                    <span className="text-[10px] text-muted-foreground font-mono block">{item.householdCode}</span>
                  </TableCell>
                  <TableCell className="font-semibold">{item.villageName}</TableCell>
                  <TableCell className="font-medium text-muted-foreground">{item.industry}</TableCell>
                  <TableCell className="text-center">{getScaleBadge(item.scale)}</TableCell>
                  <TableCell className="text-center">
                    <StatusBadge
                      status={item.hasRegistration ? 'active' : 'inactive'}
                      customLabel={item.hasRegistration ? (item.registrationNumber || 'Có ĐKKD') : 'Chưa đăng ký'}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <StatusBadge
                      status={item.isActive ? 'active' : 'inactive'}
                      customLabel={item.isActive ? 'Đang hoạt động' : 'Tạm ngưng'}
                    />
                  </TableCell>
                  <TableCell className="p-0 text-center">
                    <ActionMenu
                      entityName="hộ kinh doanh"
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

// 2. Business Revenues Table
interface BusinessRevenuesTableProps {
  data: BusinessRevenueRecord[];
  userRole: string;
  onEdit: (item: BusinessRevenueRecord) => void;
  onDelete: (item: BusinessRevenueRecord) => void;
}

export function BusinessRevenuesTable({ data, userRole, onEdit, onDelete }: BusinessRevenuesTableProps) {
  const getSourceLabel = (src: string) => {
    switch (src) {
      case 'taxDeclaration': return 'Tự khai thuế';
      case 'survey': return 'Khảo sát thực địa';
      default: return 'Ước tính thống kê';
    }
  };

  return (
    <SectionCard title="Doanh thu ước tính theo kỳ khai nhận">
      <div className="overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader className="bg-muted/40 border-b border-border/60">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs">Tên cơ sở / Hộ kinh doanh</TableHead>
              <TableHead className="text-xs">Chủ hộ</TableHead>
              <TableHead className="text-xs">Kỳ ghi nhận</TableHead>
              <TableHead className="text-right text-xs">Doanh thu ước tính (VND)</TableHead>
              <TableHead className="text-xs">Nguồn số liệu</TableHead>
              <TableHead className="w-12 text-center text-xs">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-xs text-muted-foreground">Không có số liệu doanh thu.</TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/30 border-b border-border/40 text-xs">
                  <TableCell className="font-bold text-foreground">
                    <div className="flex items-center gap-1.5">
                      <Coins className="size-3.5 text-amber-500" />
                      {item.businessName}
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold text-muted-foreground">{item.householdHeadName}</TableCell>
                  <TableCell className="font-bold text-foreground">{item.period}</TableCell>
                  <TableCell className="text-right font-bold text-emerald-600 dark:text-emerald-400">
                    {item.estimatedRevenueVnd.toLocaleString()} đ
                  </TableCell>
                  <TableCell className="font-medium">
                    <span className="flex items-center gap-1">
                      <FileSpreadsheet className="size-3.5 text-muted-foreground" />
                      {getSourceLabel(item.dataSource)}
                    </span>
                  </TableCell>
                  <TableCell className="p-0 text-center">
                    <ActionMenu
                      entityName="doanh thu kinh doanh"
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

// 3. Non-Agricultural Labor Table
interface NonAgriLaborTableProps {
  data: NonAgriculturalLaborRecord[];
  userRole: string;
  onEdit: (item: NonAgriculturalLaborRecord) => void;
  onDelete: (item: NonAgriculturalLaborRecord) => void;
}

export function NonAgriLaborTable({ data, userRole, onEdit, onDelete }: NonAgriLaborTableProps) {
  return (
    <SectionCard title="Thống kê lao động phi nông nghiệp và làm việc xa">
      <div className="overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader className="bg-muted/40 border-b border-border/60">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs">Chủ hộ</TableHead>
              <TableHead className="text-xs">Thôn</TableHead>
              <TableHead className="text-right text-xs">Tổng số lao động trong hộ</TableHead>
              <TableHead className="text-right text-xs">Lao động phi nông nghiệp</TableHead>
              <TableHead className="text-right text-xs">Lao động đi làm ăn xa</TableHead>
              <TableHead className="text-center text-xs">Năm khảo sát</TableHead>
              <TableHead className="w-12 text-center text-xs">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-xs text-muted-foreground">Không có dữ liệu lao động.</TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/30 border-b border-border/40 text-xs">
                  <TableCell className="font-bold text-foreground">
                    <span>{item.householdHeadName}</span>
                    <span className="text-[10px] text-muted-foreground font-mono block">{item.householdCode}</span>
                  </TableCell>
                  <TableCell className="font-semibold">{item.villageName}</TableCell>
                  <TableCell className="text-right font-medium text-muted-foreground">{item.totalLaborCount} lao động</TableCell>
                  <TableCell className="text-right font-bold text-blue-600 dark:text-blue-400">{item.nonAgriculturalLaborCount} người</TableCell>
                  <TableCell className="text-right font-bold text-indigo-600 dark:text-indigo-400">{item.awayLaborCount} người</TableCell>
                  <TableCell className="text-center font-semibold text-muted-foreground">{item.year}</TableCell>
                  <TableCell className="p-0 text-center">
                    <ActionMenu
                      entityName="số liệu lao động"
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
