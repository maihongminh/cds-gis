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
import { CatalogTabType } from './catalog-form-dialog';

// Union type covering all catalog tab data shapes
export type CatalogTableItem = {
  code: string;
  name?: string;
  description?: string;
  // hamlet
  ethnicity?: string;
  // crop
  unit?: string;
  isSpecialty?: boolean;
  // livestock
  vaccinationIntervalMonths?: number;
  // land
  group?: 'nong-nghiep' | 'lam-nghiep' | 'phi-nong-nghiep';
  // season
  year?: number;
  season?: string;
  isLocked?: boolean;
  // poverty
  threshold?: string;
  isActive?: boolean;
  // ethnicity
  localGroup?: string;
  parentEthnicityCode?: string;
  status?: 'active' | 'inactive';
};


interface CatalogTableProps {
  tabType: CatalogTabType;
  data: CatalogTableItem[];
  onEdit: (item: CatalogTableItem) => void;
  onDelete: (item: CatalogTableItem) => void;
}

export function CatalogTable({
  tabType,
  data,
  onEdit,
  onDelete,
}: CatalogTableProps) {
  const renderHeaders = () => {
    switch (tabType) {
      case 'hamlet':
        return (
          <>
            <TableHead>Mã</TableHead>
            <TableHead>Tên Thôn</TableHead>
            <TableHead>Dân tộc đa số</TableHead>
            <TableHead>Đặc điểm nổi bật</TableHead>
            <TableHead>Trạng thái</TableHead>
          </>
        );
      case 'crop':
        return (
          <>
            <TableHead>Mã loại cây</TableHead>
            <TableHead>Tên cây trồng</TableHead>
            <TableHead>Đơn vị tính</TableHead>
            <TableHead>Đặc sản vùng</TableHead>
            <TableHead>Mô tả chung</TableHead>
          </>
        );
      case 'livestock':
        return (
          <>
            <TableHead>Mã vật nuôi</TableHead>
            <TableHead>Tên vật nuôi</TableHead>
            <TableHead>Đơn vị đếm</TableHead>
            <TableHead>Chu kỳ thú y (Tháng)</TableHead>
            <TableHead>Mô tả chung</TableHead>
          </>
        );
      case 'land':
        return (
          <>
            <TableHead>Mã loại đất</TableHead>
            <TableHead>Tên phân loại đất</TableHead>
            <TableHead>Nhóm quy hoạch</TableHead>
            <TableHead>Mô tả mục đích</TableHead>
          </>
        );
      case 'season':
        return (
          <>
            <TableHead>Mã mùa vụ</TableHead>
            <TableHead>Năm</TableHead>
            <TableHead>Vụ canh tác</TableHead>
            <TableHead>Tình trạng dữ liệu</TableHead>
          </>
        );
      case 'poverty':
        return (
          <>
            <TableHead>Mã phân loại</TableHead>
            <TableHead>Tên phân loại</TableHead>
            <TableHead>Ngưỡng thu nhập bình quân</TableHead>
            <TableHead>Tiêu chuẩn pháp lý</TableHead>
          </>
        );
      case 'ethnicity':
        return (
          <>
            <TableHead>Mã dân tộc</TableHead>
            <TableHead>Tên dân tộc / Thành phần</TableHead>
            <TableHead>Nhóm địa phương</TableHead>
            <TableHead>Dân tộc gốc (cha)</TableHead>
            <TableHead>Mô tả chi tiết</TableHead>
            <TableHead>Trạng thái</TableHead>
          </>
        );
      default:
        return null;
    }
  };

  const renderRows = (item: CatalogTableItem, index: number) => {
    const actions = (
      <ActionMenu
        entityName="danh mục"
        onEdit={() => onEdit(item)}
        onDelete={() => onDelete(item)}
      />
    );

    switch (tabType) {
      case 'hamlet':
        return (
          <TableRow key={index} className="hover:bg-muted/30 border-b border-border/40">
            <TableCell className="font-mono text-[10px] font-bold text-muted-foreground">{item.code}</TableCell>
            <TableCell className="font-bold text-foreground">{item.name}</TableCell>
            <TableCell>{item.ethnicity || 'Vân Kiều'}</TableCell>
            <TableCell className="max-w-[200px] truncate text-muted-foreground">{item.description || '-'}</TableCell>
            <TableCell><StatusBadge status="active" /></TableCell>
            <TableCell className="w-16 p-0 text-center">{actions}</TableCell>
          </TableRow>
        );
      case 'crop':
        return (
          <TableRow key={index} className="hover:bg-muted/30 border-b border-border/40">
            <TableCell className="font-mono text-[10px] font-bold text-muted-foreground">{item.code}</TableCell>
            <TableCell className="font-bold text-foreground">{item.name}</TableCell>
            <TableCell className="font-medium">{item.unit}</TableCell>
            <TableCell>
              <StatusBadge status={item.isSpecialty ? 'active' : 'inactive'} customLabel={item.isSpecialty ? 'Đặc sản' : 'Thường'} />
            </TableCell>
            <TableCell className="max-w-[250px] truncate text-muted-foreground">{item.description}</TableCell>
            <TableCell className="w-16 p-0 text-center">{actions}</TableCell>
          </TableRow>
        );
      case 'livestock':
        return (
          <TableRow key={index} className="hover:bg-muted/30 border-b border-border/40">
            <TableCell className="font-mono text-[10px] font-bold text-muted-foreground">{item.code}</TableCell>
            <TableCell className="font-bold text-foreground">{item.name}</TableCell>
            <TableCell className="font-medium">{item.unit}</TableCell>
            <TableCell className="font-semibold">{item.vaccinationIntervalMonths} tháng</TableCell>
            <TableCell className="max-w-[250px] truncate text-muted-foreground">{item.description}</TableCell>
            <TableCell className="w-16 p-0 text-center">{actions}</TableCell>
          </TableRow>
        );
      case 'land':
        return (
          <TableRow key={index} className="hover:bg-muted/30 border-b border-border/40">
            <TableCell className="font-mono text-[10px] font-bold text-muted-foreground">{item.code}</TableCell>
            <TableCell className="font-bold text-foreground">{item.name}</TableCell>
            <TableCell>
              <StatusBadge
                status={item.group === 'nong-nghiep' ? 'active' : item.group === 'lam-nghiep' ? 'processing' : 'inactive'}
                customLabel={item.group === 'nong-nghiep' ? 'Nông nghiệp' : item.group === 'lam-nghiep' ? 'Lâm nghiệp' : 'Phi nông nghiệp'}
              />
            </TableCell>
            <TableCell className="max-w-[250px] truncate text-muted-foreground">{item.description}</TableCell>
            <TableCell className="w-16 p-0 text-center">{actions}</TableCell>
          </TableRow>
        );
      case 'season':
        return (
          <TableRow key={index} className="hover:bg-muted/30 border-b border-border/40">
            <TableCell className="font-mono text-[10px] font-bold text-muted-foreground">{item.code}</TableCell>
            <TableCell className="font-semibold">{item.year}</TableCell>
            <TableCell className="font-bold text-foreground">{item.season}</TableCell>
            <TableCell>
              <StatusBadge status={!item.isLocked ? 'active' : 'inactive'} customLabel={!item.isLocked ? 'Đang mở khóa' : 'Đã khóa sổ'} />
            </TableCell>
            <TableCell className="w-16 p-0 text-center">{actions}</TableCell>
          </TableRow>
        );
      case 'poverty':
        return (
          <TableRow key={index} className="hover:bg-muted/30 border-b border-border/40">
            <TableCell className="font-mono text-[10px] font-bold text-muted-foreground">{item.code}</TableCell>
            <TableCell className="font-bold text-foreground">{item.name}</TableCell>
            <TableCell className="font-semibold text-emerald-600 dark:text-emerald-400">{item.threshold}</TableCell>
            <TableCell className="max-w-[250px] truncate text-muted-foreground">{item.description}</TableCell>
            <TableCell className="w-16 p-0 text-center">{actions}</TableCell>
          </TableRow>
        );
      case 'ethnicity':
        return (
          <TableRow key={index} className="hover:bg-muted/30 border-b border-border/40">
            <TableCell className="font-mono text-[10px] font-bold text-muted-foreground">{item.code}</TableCell>
            <TableCell className="font-bold text-foreground">{item.name}</TableCell>
            <TableCell className="font-semibold">{item.localGroup || '-'}</TableCell>
            <TableCell className="font-medium text-muted-foreground">{item.parentEthnicityCode ? (item.parentEthnicityCode === 'van-kieu' ? 'Vân Kiều' : item.parentEthnicityCode) : '-'}</TableCell>
            <TableCell className="max-w-[250px] truncate text-muted-foreground">{item.description || '-'}</TableCell>
            <TableCell>
              <StatusBadge status={item.status === 'inactive' ? 'inactive' : 'active'} />
            </TableCell>
            <TableCell className="w-16 p-0 text-center">{actions}</TableCell>
          </TableRow>
        );
      default:
        return null;
    }
  };

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="overflow-x-auto w-full">
        <Table>
          <TableHeader className="bg-muted/40 border-b border-border/60">
            <TableRow className="hover:bg-transparent">
              {renderHeaders()}
              <TableHead className="w-16 text-center">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-xs text-muted-foreground">
                  Không tìm thấy danh mục nào.
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, index) => renderRows(item, index))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
