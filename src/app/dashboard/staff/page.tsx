// src/app/dashboard/staff/page.tsx

'use client';

import * as React from 'react';
import { MOCK_USERS } from '@/data/mock-users';
import { MOCK_ORGANIZATIONS } from '@/data/mock-organizations';
import { getRoleLabel } from '@/lib/rbac';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Separator,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Badge,
} from '@/components/ui';
import { Contact, Search, Plus, Phone, Mail, UserCheck, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader, SearchInput } from '@/components/common';
import { User } from '@/types';

export default function StaffDirectoryPage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedUnit, setSelectedUnit] = React.useState('all');
  const [staffList, setStaffList] = React.useState<User[]>(MOCK_USERS);

  const getUnitName = (unitId: string | undefined) => {
    if (!unitId) return 'Không trực thuộc';
    const found = MOCK_ORGANIZATIONS.find((u) => u.id === unitId);
    return found ? found.name : 'Không xác định';
  };

  const filteredStaff = React.useMemo(() => {
    return staffList.filter((s) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        s.fullName.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.phone.includes(q);
      const matchesUnit = selectedUnit === 'all' || s.organizationUnitId === selectedUnit;
      return matchesSearch && matchesUnit;
    });
  }, [staffList, searchQuery, selectedUnit]);

  const handleCreateStaff = () => {
    toast.info('Tính năng thêm cán bộ mới chỉ khả dụng trên môi trường kết nối cơ sở dữ liệu thật.');
  };

  const handleEditStaff = (staff: User) => {
    toast.info(`Chỉnh sửa hồ sơ cán bộ: ${staff.fullName}`);
  };

  const handleToggleStatus = (staff: User) => {
    setStaffList((prev) =>
      prev.map((s) => (s.id === staff.id ? { ...s, isActive: !s.isActive } : s))
    );
    const actionText = staff.isActive ? 'vô hiệu hóa' : 'kích hoạt';
    toast.success(`Đã ${actionText} hồ sơ cán bộ "${staff.fullName}" thành công.`);
  };

  return (
    <div className="space-y-6 pb-10 animate-fade-in">
      {/* Header */}
      <PageHeader
        title={
          <>
            <Contact className="w-6 h-6 text-primary" />
            Danh bạ Cán bộ &amp; Công chức
          </>
        }
        description="Quản lý hồ sơ nhân sự chuyên trách, điện thoại liên hệ và phòng ban trực thuộc xã Lao Bảo."
        actions={
          <Button onClick={handleCreateStaff} size="sm" className="h-9 text-xs cursor-pointer gap-1.5 shadow-none">
            <Plus className="size-4" />
            Thêm hồ sơ cán bộ
          </Button>
        }
      />

      {/* Filter and Search controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchInput
          id="staff-search"
          placeholder="Tìm theo họ tên, email, điện thoại..."
          className="flex-1 min-w-[200px]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <Select value={selectedUnit} onValueChange={setSelectedUnit}>
          <SelectTrigger id="staff-unit-filter" className="w-[200px] bg-card border-border shadow-none cursor-pointer h-9 text-xs">
            <SelectValue placeholder="Lọc theo đơn vị" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border text-xs">
            <SelectItem value="all" className="cursor-pointer text-xs">Tất cả đơn vị</SelectItem>
            {MOCK_ORGANIZATIONS.map((unit) => (
              <SelectItem key={unit.id} value={unit.id} className="cursor-pointer text-xs">
                {unit.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Staff members display layout (Grid of cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStaff.map((staff) => (
          <Card key={staff.id} className={`border-border bg-card shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between ${!staff.isActive && 'opacity-60'}`}>
            <CardHeader className="pb-3 flex flex-row items-start gap-3">
              <div className="w-10 h-10 rounded-full border border-primary/20 bg-primary/10 flex items-center justify-center font-bold text-xs text-primary shrink-0 uppercase">
                {staff.fullName.split(' ').slice(-1)[0][0]}
              </div>
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="text-xs font-bold text-foreground truncate">{staff.fullName}</h3>
                  <Badge variant={staff.isActive ? 'default' : 'secondary'} className="px-1.5 py-px text-[7.5px] uppercase font-bold shrink-0">
                    {staff.isActive ? 'Đang trực' : 'Nghỉ công tác'}
                  </Badge>
                </div>
                <p className="text-[10px] text-muted-foreground font-semibold truncate">
                  {getUnitName(staff.organizationUnitId)}
                </p>
                <p className="text-[9px] text-primary/80 font-bold uppercase tracking-wider">
                  {getRoleLabel(staff.role)}
                </p>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2 border-t border-border/40 pt-3 text-[11px] text-muted-foreground">
                <p className="flex items-center gap-2">
                  <Phone className="size-3.5 text-muted-foreground/60 shrink-0" />
                  <span>Điện thoại: <strong className="text-foreground">{staff.phone}</strong></span>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="size-3.5 text-muted-foreground/60 shrink-0" />
                  <span className="truncate">Email: <strong className="text-foreground">{staff.email}</strong></span>
                </p>
              </div>

              <div className="flex items-center justify-end gap-1.5 pt-3 border-t border-border/40">
                <Button onClick={() => handleEditStaff(staff)} variant="outline" size="sm" className="h-8 text-[11px] px-2.5 cursor-pointer shadow-none">
                  Chỉnh sửa
                </Button>
                <Button
                  onClick={() => handleToggleStatus(staff)}
                  variant={staff.isActive ? 'destructive' : 'default'}
                  size="sm"
                  className="h-8 text-[11px] px-2.5 cursor-pointer shadow-none gap-1"
                >
                  {staff.isActive ? (
                    <>
                      <ShieldAlert className="size-3" />
                      Khóa hồ sơ
                    </>
                  ) : (
                    <>
                      <UserCheck className="size-3" />
                      Mở khóa
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
