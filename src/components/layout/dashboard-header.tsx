'use client';

import * as React from 'react';
import { Menu, PanelLeftOpen, PanelLeftClose } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useSidebar } from './sidebar-context';
import { TenantSwitcher } from './tenant-switcher';
import { NotificationsMenu } from './notifications-menu';
import { ThemeToggle } from '../theme/theme-toggle';
import { UserMenu } from './user-menu';
import { Button } from '@/components/ui';
import { APP_CONFIG } from '@/lib/app-config';
import { SearchInput } from '../common/search-input';

export function DashboardHeader() {
  const { isCollapsed, toggleSidebar, setMobileOpen } = useSidebar();
  const pathname = usePathname();
  const isMapWorkspace = pathname === '/dashboard/map';

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-border bg-background/80 backdrop-blur-md px-2.5 md:px-6 xl:px-8 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Mobile Logo & App Name (aligns with sidebar when open) */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2 md:hidden overflow-hidden hover:opacity-85 transition-opacity cursor-pointer"
        >
          <div className="shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Logo" width={44} height={44} className="w-11 h-11 object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-xs tracking-tight whitespace-nowrap text-foreground leading-tight">
              {APP_CONFIG.nameLine1}
            </span>
            <span className="text-[10px] text-muted-foreground font-medium">
              {APP_CONFIG.nameLine2}
            </span>
          </div>
        </Link>

        {/* Desktop Sidebar Toggle */}
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={toggleSidebar}
          className="hidden md:flex text-foreground cursor-pointer w-9 h-9"
          aria-label="Thu gọn/Mở rộng sidebar"
        >
          {isCollapsed ? (
            <PanelLeftOpen className="w-4.5 h-4.5" />
          ) : (
            <PanelLeftClose className="w-4.5 h-4.5" />
          )}
        </Button>

        {/* Administrative scope filter */}
        {!isMapWorkspace && (
          <div className="hidden md:flex">
            <TenantSwitcher />
          </div>
        )}
      </div>

      {!isMapWorkspace && (
        <SearchInput
          placeholder="Tìm kiếm nhanh..."
          className="hidden xl:flex max-w-xs"
          inputClassName="h-8"
        />
      )}

      {/* Right group: Notifications, Theme, User Menu */}
      <div className="flex items-center gap-2.5">
        {/* Notification center */}
        <NotificationsMenu />

        {/* Theme toggle button (desktop only) */}
        <ThemeToggle variant="icon" className="hidden md:inline-flex" />

        {/* User account dropdown menu (desktop only) */}
        <div className="hidden md:block">
          <UserMenu />
        </div>
        {/* Hamburger Mobile Toggle */}
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => setMobileOpen(true)}
          className="md:hidden text-foreground cursor-pointer w-9 h-9"
          aria-label="Mở menu"
        >
          <Menu className="w-4.5 h-4.5" />
        </Button>
      </div>
    </header>
  );
}
