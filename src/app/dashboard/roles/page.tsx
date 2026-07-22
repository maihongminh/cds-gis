// src/app/dashboard/roles/page.tsx

'use client';

import * as React from 'react';
import { MOCK_ROLES, SystemRoleDefinition } from '@/data/mock-roles';
import { MOCK_USERS } from '@/data/mock-users';
import { getRoleVariant } from '@/lib/rbac';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  Separator,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  CardFooter,
} from '@/components/ui';
import { Shield, ShieldAlert, ShieldCheck, UserCheck, Plus, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/common';
import { UserRole } from '@/types/auth';

const PERMISSION_ACTIONS_INFO = [
  { key: 'view', name: 'Xem thông tin (View)', desc: 'Đọc danh sách và chi tiết các bản ghi dữ liệu.' },
  { key: 'create', name: 'Thêm mới (Create)', desc: 'Tạo mới một biểu mẫu bản ghi dạng nháp.' },
  { key: 'update', name: 'Cập nhật (Update)', desc: 'Sửa đổi dữ liệu nháp hoặc bị trả lại.' },
  { key: 'delete', name: 'Xóa mềm (Delete)', desc: 'Đánh dấu lưu trữ hoặc xóa tạm thời bản ghi.' },
  { key: 'submit', name: 'Gửi phê duyệt (Submit)', desc: 'Chuyển trạng thái từ nháp sang chờ duyệt.' },
  { key: 'approveUnit', name: 'Duyệt cấp phòng (Approve Unit)', desc: 'Trưởng bộ phận phê duyệt sơ bộ hồ sơ.' },
  { key: 'approveGovernance', name: 'Thẩm định chung (Approve Gov)', desc: 'Văn phòng UBND thẩm định chất lượng.' },
  { key: 'publish', name: 'Công bố dữ liệu (Publish)', desc: 'Phát hành chính thức lên CSDL dùng chung.' },
  { key: 'viewConfidential', name: 'Xem dữ liệu Mật (Confidential)', desc: 'Quyền tiếp cận nhóm dữ liệu Quốc phòng - An ninh.' },
];

export default function RolesManagementPage() {
  const [roles] = React.useState<SystemRoleDefinition[]>(MOCK_ROLES);

  const getAssignedCount = (roleCode: UserRole) => {
    return MOCK_USERS.filter((u) => u.role === roleCode).length;
  };

  const handleCreateRole = () => {
    toast.info('Tính năng tạo nhóm vai trò mới chỉ khả dụng trên môi trường kết nối cơ sở dữ liệu thật.');
  };

  const handleEditRole = (role: SystemRoleDefinition) => {
    toast.info(`Chỉnh sửa cấu hình nhóm vai trò: ${role.name}`);
  };

  const handleDeleteRole = (role: SystemRoleDefinition) => {
    const assignedCount = getAssignedCount(role.code);
    if (assignedCount > 0) {
      toast.error(`Không thể xóa vai trò "${role.name}" vì hiện đang có ${assignedCount} người dùng thuộc nhóm này!`, {
        icon: <ShieldAlert className="size-5 text-destructive" />
      });
    } else {
      toast.success(`Đã xóa vai trò "${role.name}" thành công.`);
    }
  };

  // Mock function simulating check of permissions at UI level
  const mockCanPerform = (roleCode: UserRole, action: string): boolean => {
    // Basic simulation logic matching checkPermission / rbac matrix
    if (roleCode === 'admin') return true;
    if (roleCode === 'data_governance') return true;
    if (roleCode === 'commune_leader') {
      return ['view', 'export', 'viewConfidential'].includes(action);
    }
    if (roleCode === 'unit_leader') {
      return ['view', 'export', 'approveUnit'].includes(action);
    }
    if (roleCode === 'data_officer') {
      return ['view', 'create', 'update', 'import', 'export', 'submit'].includes(action);
    }
    return false;
  };

  return (
    <div className="space-y-6 pb-10 animate-fade-in">
      {/* Header */}
      <PageHeader
        title={
          <>
            <Shield className="w-6 h-6 text-primary" />
            Quản trị Vai trò &amp; Quyền hạn
          </>
        }
        description="Quản lý ma trận phân quyền, phân cấp bảo mật và các nhóm người dùng vận hành hệ thống Lao Bảo."
        actions={
          <Button onClick={handleCreateRole} size="sm" className="h-9 text-xs cursor-pointer gap-1.5 shadow-none">
            <Plus className="size-4" />
            Tạo nhóm vai trò mới
          </Button>
        }
      />

      {/* Grid listing the 5 roles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles.map((role) => {
          const count = getAssignedCount(role.code);
          return (
            <Card key={role.code} className="border-border bg-card shadow-2xs hover:shadow-xs transition-shadow">
              <CardHeader className="pb-3 flex flex-row items-start justify-between gap-2">
                <div className="space-y-1.5">
                  <Badge variant={getRoleVariant(role.code)} className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                    {role.code}
                  </Badge>
                  <CardTitle className="text-sm font-bold text-foreground leading-tight mt-1">{role.name}</CardTitle>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground bg-muted/40 px-2 py-1 rounded-md shrink-0">
                  <UserCheck className="size-3.5 text-primary" />
                  <span>{count} Nhân sự</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-[11px] text-muted-foreground leading-relaxed h-12 overflow-hidden">
                  {role.description}
                </p>
              </CardContent>
              <CardFooter className="justify-end">
                <Button onClick={() => handleEditRole(role)} variant="ghost" size="icon" className="size-8 rounded-lg cursor-pointer hover:bg-accent">
                  <Edit className="size-4 text-muted-foreground" />
                </Button>
                <Button onClick={() => handleDeleteRole(role)} variant="ghost" size="icon" className="size-8 rounded-lg cursor-pointer hover:bg-destructive/10 text-destructive">
                  <Trash2 className="size-4" />
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Permission Matrix Table */}
      <Card className="border-border bg-card shadow-2xs">
        <CardHeader>
          <CardTitle className="text-sm font-bold text-foreground">Ma trận Phân quyền Thao tác Hệ thống</CardTitle>
          <CardDescription className="text-xs">
            Bảng tra cứu trực quan phân quyền chi tiết cho từng vai trò trên các tác vụ dữ liệu.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[300px] text-xs font-bold">Hành động / Tác vụ</TableHead>
                {roles.map((r) => (
                  <TableHead key={r.code} className="text-center text-xs font-bold min-w-[120px]">
                    {r.name.split(' (')[0]}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {PERMISSION_ACTIONS_INFO.map((act) => (
                <TableRow key={act.key} className="hover:bg-muted/5 transition-colors">
                  <TableCell className="py-3.5">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-foreground leading-snug">{act.name}</span>
                      <span className="text-[10px] text-muted-foreground mt-0.5 leading-normal">{act.desc}</span>
                    </div>
                  </TableCell>
                  {roles.map((r) => {
                    const allowed = mockCanPerform(r.code, act.key);
                    return (
                      <TableCell key={r.code} className="text-center py-3.5">
                        <div className="flex justify-center">
                          {allowed ? (
                            <ShieldCheck className="size-5 text-emerald-500" />
                          ) : (
                            <ShieldAlert className="size-5 text-muted-foreground/30" />
                          )}
                        </div>
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
