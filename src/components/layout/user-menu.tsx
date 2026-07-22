'use client';

import * as React from 'react';
import { LogOut, ChevronDown, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTenant } from './tenant-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui';
import { Avatar, AvatarFallback } from '@/components/ui';
import { Button } from '@/components/ui';

import { ROLE_LABELS } from '@/lib/rbac';
import { UserRole } from '@/types/auth';
import { MOCK_USERS } from '@/data/mock-users';

export function UserMenu() {
  const { currentRole, setCurrentRole } = useTenant();
  const router = useRouter();

  const handleLogout = () => {
    // Clear all mock session cookies
    document.cookie = 'app_sid=; path=/; max-age=0';
    document.cookie = 'app_role=; path=/; max-age=0';
    document.cookie = 'app_hamlet_code=; path=/; max-age=0';
    setCurrentRole(null);
    window.location.href = '/login';
  };

  const currentUserObj = React.useMemo(() => {
    return MOCK_USERS.find((u) => u.role === currentRole);
  }, [currentRole]);

  const getRoleName = (role: string | null) => {
    if (!role) return 'Khách';
    return ROLE_LABELS[role as UserRole] || role;
  };

  const getRoleAbbr = (role: string | null) => {
    if (!role) return 'K';
    if (role === 'admin') return 'AD';
    if (role === 'data_officer') return 'CB';
    if (role === 'unit_leader') return 'LT';
    if (role === 'data_governance') return 'VP';
    if (role === 'commune_leader') return 'LĐ';
    return 'CX';
  };

  const getUserName = () => {
    return currentUserObj?.fullName ?? 'Người dùng demo';
  };

  const getUserEmail = () => {
    return currentUserObj?.email ?? 'demo@laobao.gov.vn';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 px-2.5 h-9 bg-card border-border hover:bg-accent hover:text-accent-foreground cursor-pointer shadow-none"
        >
          <Avatar className="w-5.5 h-5.5 border border-border">
            <AvatarFallback className="text-[9px] font-bold bg-primary/10 text-primary uppercase animate-none">
              {getRoleAbbr(currentRole)}
            </AvatarFallback>
          </Avatar>
          <span className="hidden md:inline font-medium text-xs text-foreground">
            {getUserName()}
          </span>
          <ChevronDown className="size-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 border-border bg-card">
        <DropdownMenuLabel className="font-normal p-3">
          <div className="flex flex-col gap-1.5">
            <div>
              <p className="text-xs font-semibold text-foreground truncate">
                {getUserName()}
              </p>
              <p className="text-[10px] text-muted-foreground truncate">
                {getUserEmail()}
              </p>
            </div>
            <div className="flex flex-wrap gap-1">
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-medium bg-primary/10 text-primary border border-primary/20">
                {getRoleName(currentRole)}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-border" />

        <DropdownMenuItem
          onClick={() => router.push('/dashboard/profile')}
          className="flex items-center gap-2 p-2.5 text-xs focus:bg-accent focus:text-accent-foreground cursor-pointer"
        >
          <User className="size-4 text-muted-foreground" />
          <span>Thông tin tài khoản</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-border" />

        <DropdownMenuItem
          onClick={handleLogout}
          className="flex items-center gap-2 p-2.5 text-xs text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
        >
          <LogOut className="size-4" />
          <span>Đăng xuất</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
