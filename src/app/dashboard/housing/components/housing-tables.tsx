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
import { Landmark, User, HeartHandshake, CheckCircle } from 'lucide-react';
import { HousingRecord, HousingSupportRecord, HousingSupportNeed } from '@/types/housing';

// 1. Housing Records Table
interface HousingRecordsTableProps {
  data: HousingRecord[];
  userRole: string;
  onEdit: (item: HousingRecord) => void;
  onDelete: (item: HousingRecord) => void;
}

export function HousingRecordsTable({ data, userRole, onEdit, onDelete }: HousingRecordsTableProps) {
  const getRatingBadge = (rating: string) => {
    switch (rating) {
      case 'good':
        return <span className="text-[10px] px-1.5 py-0.5 rounded-sm font-bold bg-emerald-500/10 text-emerald-600 uppercase border border-emerald-500/20">Tốt</span>;
      case 'poor':
        return <span className="text-[10px] px-1.5 py-0.5 rounded-sm font-bold bg-amber-500/10 text-amber-600 uppercase border border-amber-500/20">Xuống cấp</span>;
      case 'dangerous':
        return <span className="text-[10px] px-1.5 py-0.5 rounded-sm font-bold bg-rose-500/10 text-rose-600 uppercase border border-rose-500/20">Nguy hiểm</span>;
      default:
        return <span className="text-[10px] px-1.5 py-0.5 rounded-sm font-bold bg-muted text-muted-foreground uppercase border border-border">Trung bình</span>;
    }
  };

  const getHousingTypeLabel = (type: string) => {
    switch (type) {
      case 'kiên cố': return 'Kiên cố';
      case 'bán kiên cố': return 'Bán kiên cố';
      case 'nhà tạm': return 'Nhà tạm';
      case 'dột nát': return 'Dột nát';
      default: return type;
    }
  };

  return (
    <SectionCard title="Danh sách hiện trạng nhà ở hộ dân">
      <div className="overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader className="bg-muted/40 border-b border-border/60">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs">Hộ gia đình</TableHead>
              <TableHead className="text-xs">Thôn địa bàn</TableHead>
              <TableHead className="text-xs">Loại nhà ở</TableHead>
              <TableHead className="text-right text-xs">Diện tích (m²)</TableHead>
              <TableHead className="text-right text-xs">Năm xây dựng</TableHead>
              <TableHead className="text-center text-xs">Đánh giá chung</TableHead>
              <TableHead className="text-right text-xs">Xuống cấp (%)</TableHead>
              <TableHead className="w-12 text-center text-xs">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-xs text-muted-foreground">Không có dữ liệu hiện trạng nhà ở.</TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/30 border-b border-border/40 text-xs">
                  <TableCell className="font-bold text-foreground">
                    <div className="flex items-center gap-1.5">
                      <User className="size-3.5 text-muted-foreground" />
                      <div>
                        <span>{item.householdHeadName}</span>
                        <span className="text-[10px] text-muted-foreground font-mono block">{item.householdCode}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">{item.villageName}</TableCell>
                  <TableCell className="font-medium text-foreground">{getHousingTypeLabel(item.housingType)}</TableCell>
                  <TableCell className="text-right">{item.areaSqm} m²</TableCell>
                  <TableCell className="text-right font-medium text-muted-foreground">{item.builtYear}</TableCell>
                  <TableCell className="text-center">{getRatingBadge(item.conditionRating)}</TableCell>
                  <TableCell className="text-right font-semibold text-rose-500">{item.degradationPercentage}%</TableCell>
                  <TableCell className="p-0 text-center">
                    <ActionMenu
                      entityName="hiện trạng nhà ở"
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

// 2. Housing Support Table
interface HousingSupportsTableProps {
  data: HousingSupportRecord[];
  userRole: string;
  onEdit: (item: HousingSupportRecord) => void;
  onDelete: (item: HousingSupportRecord) => void;
}

export function HousingSupportsTable({ data, userRole, onEdit, onDelete }: HousingSupportsTableProps) {
  return (
    <SectionCard title="Chương trình hỗ trợ nhà ở đã triển khai">
      <div className="overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader className="bg-muted/40 border-b border-border/60">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs">Hộ gia đình</TableHead>
              <TableHead className="text-xs">Chương trình hỗ trợ</TableHead>
              <TableHead className="text-xs">Loại hỗ trợ</TableHead>
              <TableHead className="text-right text-xs">Mức hỗ trợ (VND)</TableHead>
              <TableHead className="text-center text-xs">Năm thực hiện</TableHead>
              <TableHead className="text-center text-xs">Tình trạng</TableHead>
              <TableHead className="w-12 text-center text-xs">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-xs text-muted-foreground">Không có ghi nhận hỗ trợ.</TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/30 border-b border-border/40 text-xs">
                  <TableCell className="font-bold text-foreground">
                    <span>{item.householdHeadName}</span>
                    <span className="text-[10px] text-muted-foreground font-mono block">{item.householdCode}</span>
                  </TableCell>
                  <TableCell className="font-medium text-foreground max-w-[200px] truncate" title={item.programName}>
                    <div className="flex items-center gap-1.5">
                      <Landmark className="size-3.5 text-indigo-500" />
                      {item.programName}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-muted-foreground">
                    {item.supportType === 'buildNew' ? 'Xây mới nhà ở' : 'Sửa chữa/Cải tạo'}
                  </TableCell>
                  <TableCell className="text-right font-bold text-emerald-600 dark:text-emerald-400">
                    {item.amountVnd.toLocaleString()} đ
                  </TableCell>
                  <TableCell className="text-center font-medium text-muted-foreground">{item.year}</TableCell>
                  <TableCell className="text-center">
                    <StatusBadge
                      status={item.status === 'completed' ? 'active' : item.status === 'ongoing' ? 'processing' : item.status === 'pending' ? 'warning' : 'inactive'}
                      customLabel={item.status === 'completed' ? 'Đã hoàn tất' : item.status === 'ongoing' ? 'Đang xây dựng' : item.status === 'pending' ? 'Chờ vốn' : 'Hủy bỏ'}
                    />
                  </TableCell>
                  <TableCell className="p-0 text-center">
                    <ActionMenu
                      entityName="chương trình hỗ trợ nhà ở"
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

// 3. Housing Support Needs Table
interface HousingSupportNeedsTableProps {
  data: HousingSupportNeed[];
  userRole: string;
  onEdit: (item: HousingSupportNeed) => void;
  onDelete: (item: HousingSupportNeed) => void;
  onApprove: (item: HousingSupportNeed) => void;
}

export function HousingSupportNeedsTable({ data, userRole, onEdit, onDelete, onApprove }: HousingSupportNeedsTableProps) {
  const getPriorityBadge = (pri: string) => {
    switch (pri) {
      case 'high':
        return <span className="text-[10px] px-1.5 py-0.5 rounded-sm font-bold bg-rose-500/10 text-rose-500 uppercase border border-rose-500/20">Khẩn cấp (Cao)</span>;
      case 'medium':
        return <span className="text-[10px] px-1.5 py-0.5 rounded-sm font-bold bg-amber-500/10 text-amber-500 uppercase border border-amber-500/20">Trung bình</span>;
      default:
        return <span className="text-[10px] px-1.5 py-0.5 rounded-sm font-bold bg-muted text-muted-foreground uppercase border border-border">Thấp</span>;
    }
  };

  return (
    <SectionCard title="Kiến nghị nhu cầu hỗ trợ nhà ở tạm, dột nát">
      <div className="overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader className="bg-muted/40 border-b border-border/60">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs">Hộ gia đình</TableHead>
              <TableHead className="text-xs">Thôn địa bàn</TableHead>
              <TableHead className="text-xs">Loại nhu cầu</TableHead>
              <TableHead className="text-center text-xs">Mức độ ưu tiên</TableHead>
              <TableHead className="text-right text-xs">Kinh phí ước tính</TableHead>
              <TableHead className="text-xs">Ngày kiến nghị</TableHead>
              <TableHead className="text-center text-xs">Trạng thái duyệt</TableHead>
              <TableHead className="w-12 text-center text-xs">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-xs text-muted-foreground">Không có kiến nghị nào đang chờ.</TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/30 border-b border-border/40 text-xs">
                  <TableCell className="font-bold text-foreground">
                    <span>{item.householdHeadName}</span>
                    <span className="text-[10px] text-muted-foreground font-mono block">{item.householdCode}</span>
                  </TableCell>
                  <TableCell className="font-semibold">{item.villageName}</TableCell>
                  <TableCell className="font-medium text-foreground">
                    <div className="flex items-center gap-1.5">
                      <HeartHandshake className="size-3.5 text-teal-500" />
                      {item.needType === 'buildNew' ? 'Xây mới nhà ở' : 'Sửa chữa nhà'}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{getPriorityBadge(item.priorityLevel)}</TableCell>
                  <TableCell className="text-right font-bold text-foreground">
                    {item.estimatedCostVnd.toLocaleString()} đ
                  </TableCell>
                  <TableCell className="text-muted-foreground">{item.requestDate}</TableCell>
                  <TableCell className="text-center">
                    <StatusBadge
                      status={item.status === 'approved' ? 'active' : item.status === 'pending' ? 'processing' : 'inactive'}
                      customLabel={item.status === 'approved' ? 'Đã phê duyệt' : item.status === 'pending' ? 'Chờ xét duyệt' : 'Từ chối'}
                    />
                  </TableCell>
                  <TableCell className="p-0 text-center">
                    <ActionMenu
                      entityName="kiến nghị nhà ở"
                      userRole={userRole}
                      onEdit={() => onEdit(item)}
                      onDelete={() => onDelete(item)}
                      customActions={
                        item.status === 'pending'
                          ? [
                              {
                                label: 'Phê duyệt',
                                icon: <CheckCircle className="size-3.5 text-emerald-600" />,
                                onClick: () => onApprove(item),
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
