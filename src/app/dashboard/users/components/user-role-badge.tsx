'use client';

import { Badge } from '@/components/ui';
import { UserRole } from '@/types/user';
import { getRoleLabel, getRoleVariant } from '@/lib/rbac';

interface UserRoleBadgeProps {
  role: UserRole;
}

export function UserRoleBadge({ role }: UserRoleBadgeProps) {
  return (
    <Badge variant={getRoleVariant(role)}>
      {getRoleLabel(role)}
    </Badge>
  );
}
