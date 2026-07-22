'use client';

import { Input } from '@/components/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { SearchInput } from '@/components/common';
import { UserRole } from '@/types/user';
import { getRoleLabel } from '@/lib/rbac';

const USER_ROLES: UserRole[] = ['admin', 'data_officer', 'unit_leader', 'data_governance', 'commune_leader'];

interface UsersFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  roleFilter: string;
  onRoleFilterChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
}

export function UsersFilters({
  search,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
  statusFilter,
  onStatusFilterChange,
}: UsersFiltersProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <SearchInput
        id="users-search"
        placeholder="Tìm theo tên, email, tài khoản..."
        className="flex-1 min-w-[200px]"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      <Select value={roleFilter} onValueChange={onRoleFilterChange}>
        <SelectTrigger id="users-role-filter" className="w-[180px]">
          <SelectValue placeholder="Vai trò" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả vai trò</SelectItem>
          {USER_ROLES.map((role) => (
            <SelectItem key={role} value={role}>
              {getRoleLabel(role)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={statusFilter} onValueChange={onStatusFilterChange}>
        <SelectTrigger id="users-status-filter" className="w-[160px]">
          <SelectValue placeholder="Trạng thái" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả</SelectItem>
          <SelectItem value="active">Đang hoạt động</SelectItem>
          <SelectItem value="inactive">Bị vô hiệu hóa</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
