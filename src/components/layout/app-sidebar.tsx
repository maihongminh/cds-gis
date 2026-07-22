'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  ScrollArea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui';
import { APP_CONFIG } from '@/lib/app-config';
import { getVisibleSidebarTreeItems } from '@/lib/rbac';
import { MOCK_USERS } from '@/data/mock-users';
import { cn } from '@/lib/utils';
import { UserRole } from '@/types/auth';
import {
  ChevronLeft,
  LogOut,
  Minus,
  Plus,
  Search,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import * as React from 'react';
import { ThemeToggle } from '../theme/theme-toggle';
import { useSidebar } from './sidebar-context';
import type { SidebarGroupItem, SidebarItem, SidebarSingleItem } from './sidebar-items';
import { sidebarItems } from './sidebar-items';
import { useTenant } from './tenant-context';
import { SearchInput } from '../common/search-input';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isActivePath(pathname: string, href: string, exact?: boolean): boolean {
  if (exact || href === '/dashboard') return pathname === href;
  return pathname === href || pathname.startsWith(href + '/');
}

/** Returns set of group titles whose children contain the current pathname */
function getActiveGroupIds(items: SidebarItem[], pathname: string): Set<string> {
  const ids = new Set<string>();
  for (const item of items) {
    if (item.type === 'group') {
      const hasActiveChild = item.children.some((child) =>
        isActivePath(pathname, child.href, child.exact)
      );
      if (hasActiveChild) ids.add(item.title);
    }
  }
  return ids;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Animated collapsible content for expanded sidebar accordion */
function CollapsiblePanel({
  open,
  children,
}: {
  open: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        'grid transition-[grid-template-rows] duration-200',
        open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
      )}
    >
      <div className="overflow-hidden min-h-0">
        {children}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isCollapsed, isMobileOpen, setMobileOpen } = useSidebar();
  const { currentRole, setCurrentRole, selectedHamletCode, setSelectedHamletCode, hamlets } =
    useTenant();

  // Filter items by role
  const visibleItems: SidebarItem[] = getVisibleSidebarTreeItems(
    (currentRole as UserRole) || 'leader',
    sidebarItems
  );

  // Auto-derive which groups are active from the current pathname (stable string key for deps)
  const activeGroupIds = React.useMemo(
    () => getActiveGroupIds(visibleItems, pathname),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pathname] // visibleItems shape is stable; pathname is the only changing dep
  );

  // Groups manually opened by the user
  const [manualOpenGroups, setManualOpenGroups] = React.useState<Set<string>>(new Set);
  // Groups explicitly closed by the user (overrides active-route auto-open)
  const [manualClosedGroups, setManualClosedGroups] = React.useState<Set<string>>(new Set);

  /** Pure derivation — no useEffect needed */
  const isGroupOpen = (title: string): boolean => {
    if (manualClosedGroups.has(title)) return false; // user explicitly closed
    if (activeGroupIds.has(title)) return true;      // auto-open by active route
    return manualOpenGroups.has(title);              // user manually opened
  };

  const toggleGroup = (title: string) => {
    const currentlyOpen = isGroupOpen(title);
    if (currentlyOpen) {
      setManualOpenGroups((prev) => { const n = new Set(prev); n.delete(title); return n; });
      setManualClosedGroups((prev) => new Set([...prev, title]));
    } else {
      setManualClosedGroups((prev) => { const n = new Set(prev); n.delete(title); return n; });
      setManualOpenGroups((prev) => new Set([...prev, title]));
    }
  };

  const handleLogout = () => {
    document.cookie = 'app_sid=; path=/; max-age=0';
    document.cookie = 'app_role=; path=/; max-age=0';
    document.cookie = 'app_hamlet_code=; path=/; max-age=0';
    setCurrentRole(null);
    setMobileOpen(false);
    window.location.href = '/login';
  };

  const currentUserObj = React.useMemo(() => {
    return MOCK_USERS.find((u) => u.role === currentRole);
  }, [currentRole]);

  const getUserName = () => {
    return currentUserObj?.fullName ?? 'Người dùng demo';
  };

  const getUserEmail = () => {
    return currentUserObj?.email ?? 'demo@laobao.gov.vn';
  };

  return (
    <TooltipProvider delayDuration={300}>
      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-50 flex flex-col h-svh bg-sidebar transition-all duration-300',
          'md:sticky md:z-10 shadow-[inset_-1px_0_0_0] shadow-border/80',
          isCollapsed ? 'md:w-16' : 'md:w-70',
          isMobileOpen ? 'translate-x-0 w-70' : '-translate-x-full md:translate-x-0'
        )}
      >
        {/* ── LOGO & APP NAME ── */}
        <div className="flex items-center h-16 px-2.5 border-b border-sidebar-border justify-between shrink-0">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 overflow-hidden hover:opacity-85 transition-opacity cursor-pointer"
          >
            <div className="shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="Logo"
                width={44}
                height={44}
                className="w-11 h-11 object-contain"
              />
            </div>
            <div
              className={cn(
                'flex flex-col transition-all duration-300 whitespace-nowrap text-sidebar-foreground leading-tight',
                isCollapsed ? 'md:opacity-0 md:w-0 md:pointer-events-none' : 'opacity-100 w-auto'
              )}
            >
              <span className="font-bold text-sm tracking-tight">Hệ Thống Dữ Liệu Số</span>
              <span className="text-xs text-muted-foreground font-medium mt-0.5">
                {APP_CONFIG.nameLine2}
              </span>
            </div>
          </Link>
        </div>

        {/* ── NAVIGATION ── */}
        <ScrollArea className="flex-1 px-2.5 py-3 overflow-y-auto">
          <nav className="space-y-0.5">
            {/* ─── COLLAPSED MODE: icon-rail ─── */}
            {isCollapsed && (
              <div className="hidden md:flex flex-col gap-0.5">
                {visibleItems.map((item) => {
                  if (item.type === 'single') {
                    const single = item as SidebarSingleItem;
                    const Icon = single.icon;
                    const isActive = isActivePath(pathname, single.href);
                    return (
                      <Tooltip key={single.href}>
                        <TooltipTrigger asChild>
                          <Link
                            href={single.href}
                            onClick={() => setMobileOpen(false)}
                            aria-label={single.title}
                            className={cn(
                              'flex size-10 mx-auto items-center justify-center rounded-lg transition-colors duration-200',
                              isActive
                                ? 'bg-sidebar-accent border border-sidebar-border text-primary'
                                : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                            )}
                          >
                            <Icon className="size-4.5 shrink-0" />
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right" sideOffset={8}>
                          {single.title}
                        </TooltipContent>
                      </Tooltip>
                    );
                  }

                  // Group item in collapsed mode
                  const group = item as SidebarGroupItem;
                  const GroupIcon = group.icon;
                  const isOpen = isGroupOpen(group.title);
                  const isParentActive = group.children.some((child) =>
                    isActivePath(pathname, child.href, child.exact)
                  );

                  return (
                    <div key={group.title}>
                      {/* Level-1 group button */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            aria-label={group.title}
                            onClick={() => toggleGroup(group.title)}
                            className={cn(
                              'relative flex size-10 mx-auto items-center justify-center rounded-lg transition-colors duration-200 cursor-pointer w-full',
                              isParentActive
                                ? 'bg-sidebar-accent border border-sidebar-border text-primary'
                                : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                            )}
                          >
                            <GroupIcon className="size-4.5 shrink-0" />
                            {/* Plus/Minus indicator — absolute bottom */}
                            <span className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center justify-center rounded-full bg-primary/70 border border-border/60 p-px">
                              {isOpen ? (
                                <Minus className="size-3 text-white" />
                              ) : (
                                <Plus className="size-3 text-white" />
                              )}
                            </span>
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="right" sideOffset={8}>
                          {group.title}
                        </TooltipContent>
                      </Tooltip>

                      {/* Collapsed submenu — icon-only */}
                      {isOpen && (
                        <div className="mx-1 my-1 rounded-md border border-border/60 bg-muted/40 flex flex-col gap-0.5">
                          {group.children.map((child) => {
                            const ChildIcon = child.icon;
                            const isChildActive = isActivePath(pathname, child.href, child.exact);
                            return (
                              <Tooltip key={child.href}>
                                <TooltipTrigger asChild>
                                  <Link
                                    href={child.href}
                                    onClick={() => setMobileOpen(false)}
                                    aria-label={child.title}
                                    className={cn(
                                      'mx-auto flex size-8 items-center justify-center rounded-lg transition-colors duration-200',
                                      isChildActive
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-sidebar-foreground/70 hover:bg-primary/10 hover:text-sidebar-accent-foreground'
                                    )}
                                  >
                                    {ChildIcon && <ChildIcon className="size-4 shrink-0" />}
                                  </Link>
                                </TooltipTrigger>
                                <TooltipContent side="right" sideOffset={8}>
                                  {child.title}
                                </TooltipContent>
                              </Tooltip>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* ─── EXPANDED MODE (desktop) + MOBILE DRAWER (always) ─── */}
            <div className={cn('flex flex-col gap-0.5', isCollapsed ? 'md:hidden' : '')}>
              {visibleItems.map((item) => {
                if (item.type === 'single') {
                  const single = item as SidebarSingleItem;
                  const Icon = single.icon;
                  const isActive = isActivePath(pathname, single.href);
                  return (
                    <Link
                      key={single.href}
                      href={single.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        'flex items-center h-10 px-2.5 rounded-lg border transition-colors duration-200 cursor-pointer gap-2.5',
                        isActive
                          ? 'bg-sidebar-accent border-sidebar-border font-medium text-primary'
                          : 'text-sidebar-foreground/80 border-transparent hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                      )}
                    >
                      <Icon className="size-4 shrink-0" />
                      <span className="text-sm truncate">{single.title}</span>
                    </Link>
                  );
                }

                // Group item in expanded mode
                const group = item as SidebarGroupItem;
                const GroupIcon = group.icon;
                const isOpen = isGroupOpen(group.title);
                const isGroupActive = group.children.some((child) =>
                  isActivePath(pathname, child.href, child.exact)
                );

                return (
                  <div key={group.title} className="flex flex-col">
                    {/* Expanded group trigger — custom button (no AccordionTrigger) */}
                    <button
                      type="button"
                      onClick={() => toggleGroup(group.title)}
                      className={cn(
                        'flex items-center h-10 px-2.5 rounded-lg border transition-colors duration-200 cursor-pointer text-sm font-normal w-full text-left',
                        'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                        isOpen && 'bg-sidebar-accent/60',
                        isGroupActive
                          ? 'text-primary border-sidebar-border/60 bg-sidebar-accent/40'
                          : 'text-sidebar-foreground/80 border-transparent'
                      )}
                    >
                      <GroupIcon className="size-4 shrink-0" />
                      <span className="flex-1 truncate ml-2">{group.title}</span>
                      {isOpen ? (
                        <Minus className="size-4 shrink-0 text-muted-foreground" />
                      ) : (
                        <Plus className="size-4 shrink-0 text-muted-foreground" />
                      )}
                    </button>

                    {/* Expanded accordion content */}
                    <CollapsiblePanel open={isOpen}>
                      <div className="ml-2.5 pl-2 border-l border-sidebar-border/80 space-y-0.5 mt-0.5 pb-0.5">
                        {group.children.map((child) => {
                          const ChildIcon = child.icon;
                          const isChildActive = isActivePath(pathname, child.href, child.exact);
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={() => setMobileOpen(false)}
                              className={cn(
                                'flex items-center h-9 px-2.5 rounded-md border transition-colors duration-200 cursor-pointer text-sm gap-2.5',
                                isChildActive
                                  ? 'bg-sidebar-accent border-sidebar-border font-medium text-primary'
                                  : 'text-sidebar-foreground/70 border-transparent hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                              )}
                            >
                              {ChildIcon && <ChildIcon className="size-4 shrink-0" />}
                              <span className="truncate">{child.title}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </CollapsiblePanel>
                  </div>
                );
              })}
            </div>
          </nav>
        </ScrollArea>

        {/* ── MOBILE-ONLY: Search & Tenant Switcher ── */}
        <div className="md:hidden px-3 py-2.5 border-t border-sidebar-border space-y-2 shrink-0 bg-sidebar">
          <SearchInput
            placeholder="Tìm kiếm nhanh..."
            inputClassName="bg-sidebar-accent border-sidebar-border focus:border-primary text-sidebar-foreground placeholder:text-muted-foreground/60 shadow-none border"
            iconClassName="text-sidebar-foreground/40"
          />
          <div className="space-y-1">
            <label className="hidden text-[8px] uppercase font-bold tracking-wider text-sidebar-foreground/50">
              Phạm vi dữ liệu
            </label>
            <Select value={selectedHamletCode} onValueChange={setSelectedHamletCode}>
              <SelectTrigger className="h-9 text-xs bg-sidebar-accent border-sidebar-border text-sidebar-foreground cursor-pointer shadow-none">
                <SelectValue placeholder="Chọn thôn" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="all" className="text-xs cursor-pointer">
                  Toàn xã Lao Bảo
                </SelectItem>
                {hamlets.map((hamlet) => (
                  <SelectItem
                    key={hamlet.code}
                    value={hamlet.code}
                    className="text-xs cursor-pointer"
                  >
                    {hamlet.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* ── MOBILE DRAWER FOOTER ── */}
        <div className="md:hidden px-3 py-2.5 border-t border-sidebar-border space-y-2 bg-sidebar shrink-0">
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 w-full text-left p-2 rounded-lg hover:bg-sidebar-accent transition-colors duration-200 cursor-pointer border border-sidebar-border bg-sidebar-accent/30 outline-none">
                <div className="w-9 h-9 rounded-full border border-sidebar-border flex items-center justify-center bg-muted shrink-0">
                  <User className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-sidebar-foreground truncate">
                    {getUserName()}
                  </p>
                  <p className="text-[9px] text-sidebar-foreground/60 truncate">
                    {getUserEmail()}
                  </p>
                </div>
                <ChevronLeft className="w-4 h-4 text-sidebar-foreground/40 shrink-0 rotate-270" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-card border-border">
              <DropdownMenuLabel className="text-xs font-bold">Tài khoản</DropdownMenuLabel>
              <DropdownMenuSeparator className="border-border/40" />
              <DropdownMenuItem
                className="text-xs cursor-pointer"
                onClick={() => {
                  setMobileOpen(false);
                  router.push('/dashboard/profile');
                }}
              >
                <User className="size-4" />
                Thông tin tài khoản
              </DropdownMenuItem>
              <DropdownMenuSeparator className="border-border/40" />
              <DropdownMenuItem
                className="text-xs cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                onClick={handleLogout}
              >
                <LogOut className="size-4" />
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* ── FOOTER: Logo + Version ── */}
        <div className="p-3 border-t border-sidebar-border flex flex-col shrink-0 relative">
          {!isCollapsed || isMobileOpen ? (
            <div className="text-center text-xs text-sidebar-foreground/60 font-medium">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <p className="text-[10px]">Phiên bản 1.0.0</p>
              <ThemeToggle
                variant="icon"
                className="absolute right-3 top-1/2 -translate-y-1/2 border-sidebar-border bg-sidebar-accent text-sidebar-foreground hover:bg-sidebar-accent/80 hover:text-sidebar-accent-foreground w-8 h-8 rounded-lg shadow-none md:hidden"
              />
            </div>
          ) : (
            <div className="text-center text-xs text-sidebar-foreground/60 font-medium">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <p>v1.0</p>
            </div>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
}
