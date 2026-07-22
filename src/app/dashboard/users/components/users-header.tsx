'use client';

import { PageHeader } from '@/components/common';
import { Button } from '@/components/ui';
import { UserPlus } from 'lucide-react';
import { can } from '@/lib/rbac';

interface UsersHeaderProps {
  totalUsers: number;
  onCreateUser: () => void;
}

export function UsersHeader({ totalUsers, onCreateUser }: UsersHeaderProps) {
  return (
    <PageHeader
      title="Người dùng & Phân quyền"
      description={`Quản lý tài khoản và quyền truy cập hệ thống – ${totalUsers} tài khoản`}
      actions={
        can('user:create') ? (
          <Button id="btn-create-user" onClick={onCreateUser}>
            <UserPlus className="size-4" />
            Tạo tài khoản
          </Button>
        ) : undefined
      }
    />
  );
}
