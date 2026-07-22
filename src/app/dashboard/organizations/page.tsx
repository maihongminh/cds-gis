// src/app/dashboard/organizations/page.tsx

'use client';

import * as React from 'react';
import { MOCK_ORGANIZATIONS } from '@/data/mock-organizations';
import { MOCK_USERS } from '@/data/mock-users';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
  Badge,
  CardFooter,
} from '@/components/ui';
import { Network, Plus, Trash2, Edit, Users, FolderKanban } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/common';
import { OrganizationUnit } from '@/types';

export default function OrganizationsPage() {
  const [units] = React.useState<OrganizationUnit[]>(MOCK_ORGANIZATIONS);

  const getStaffCount = (unitId: string) => {
    return MOCK_USERS.filter((u) => u.organizationUnitId === unitId).length;
  };

  const handleCreateUnit = () => {
    toast.info('Tính năng tạo đơn vị mới chỉ khả dụng trên môi trường kết nối cơ sở dữ liệu thật.');
  };

  const handleEditUnit = (unit: OrganizationUnit) => {
    toast.info(`Chỉnh sửa thông tin đơn vị: ${unit.name}`);
  };

  const handleDeleteUnit = (unit: OrganizationUnit) => {
    const staffCount = getStaffCount(unit.id);
    if (staffCount > 0) {
      toast.error(`Không thể xóa đơn vị "${unit.name}" vì hiện đang có ${staffCount} nhân sự thuộc phòng ban này!`);
    } else {
      toast.success(`Đã xóa phòng ban "${unit.name}" thành công.`);
    }
  };

  // Mock mapped groups for display
  const getMappedDataGroups = (unitId: string): string[] => {
    if (unitId === 'unit-ubnd') return ['Hành chính', 'Dân cư', 'Toàn bộ'];
    if (unitId === 'unit-eco') return ['Kinh tế', 'Nông nghiệp', 'OCOP'];
    if (unitId === 'unit-culture') return ['Du lịch', 'Dịch vụ', 'An sinh'];
    if (unitId === 'unit-police') return ['Trật tự xã hội', 'Tạm trú/Tạm vắng'];
    if (unitId === 'unit-military') return ['Nghĩa vụ quân sự', 'Dân quân tự vệ'];
    if (unitId === 'unit-medical') return ['Y tế', 'Tiêm chủng'];
    if (unitId === 'unit-services') return ['Môi trường', 'Thu gom rác'];
    return ['Chung'];
  };

  return (
    <div className="space-y-6 pb-10 animate-fade-in">
      {/* Header */}
      <PageHeader
        title={
          <>
            <Network className="w-6 h-6 text-primary" />
            Quản trị Cơ quan, Đơn vị
          </>
        }
        description="Thiết lập sơ đồ tổ chức, cơ cấu phòng ban và phân định trách nhiệm báo cáo các lĩnh vực dữ liệu."
        actions={
          <Button onClick={handleCreateUnit} size="sm" className="h-9 text-xs cursor-pointer gap-1.5 shadow-none">
            <Plus className="size-4" />
            Thêm đơn vị mới
          </Button>
        }
      />

      {/* Organizational Units Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {units.map((unit) => {
          const staffCount = getStaffCount(unit.id);
          const groups = getMappedDataGroups(unit.id);

          return (
            <Card key={unit.id} className="border-border bg-card shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-2">
                  <Badge variant="outline" className="px-1.5 py-0.5 text-[8px] font-bold bg-muted/60 border-border/80">
                    {unit.code}
                  </Badge>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground bg-muted/40 px-2 py-0.5 rounded-md">
                    <Users className="size-3 text-primary" />
                    <span>{staffCount} cán bộ</span>
                  </div>
                </div>
                <CardTitle className="text-sm font-bold text-foreground mt-2 leading-tight">
                  {unit.name}
                </CardTitle>
                <CardDescription className="text-[11px] leading-relaxed mt-1 overflow-hidden">
                  {unit.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                    <FolderKanban className="size-3" />
                    Lĩnh vực dữ liệu phụ trách
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {groups.map((g) => (
                      <span key={g} className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] font-medium bg-primary/10 text-primary">
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className='justify-end'>
                <Button onClick={() => handleEditUnit(unit)} variant="ghost" size="icon" className="size-8 rounded-lg cursor-pointer hover:bg-accent">
                  <Edit className="size-4 text-muted-foreground" />
                </Button>
                <Button onClick={() => handleDeleteUnit(unit)} variant="ghost" size="icon" className="size-8 rounded-lg cursor-pointer hover:bg-destructive/10 text-destructive">
                  <Trash2 className="size-4" />
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
