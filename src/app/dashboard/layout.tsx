'use client';

import { AppSidebar } from '@/components/layout/app-sidebar';
import { DashboardHeader } from '@/components/layout/dashboard-header';
import { SidebarProvider, useSidebar } from '@/components/layout/sidebar-context';
import { TenantProvider, useTenant } from '@/components/layout/tenant-context';
import { Button } from '@/components/ui';
import { X } from 'lucide-react';
import * as React from 'react';

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const { isMobileOpen, setMobileOpen } = useSidebar();
  const { currentRole } = useTenant();

  React.useEffect(() => {
    document.body.classList.add('overflow-hidden', 'h-svh');
    document.documentElement.classList.add('overflow-hidden', 'h-svh');
    return () => {
      document.body.classList.remove('overflow-hidden', 'h-svh');
      document.documentElement.classList.remove('overflow-hidden', 'h-svh');
    };
  }, []);

  if (currentRole === null) {
    return (
      <div className="flex h-svh w-screen items-center justify-center bg-background text-foreground font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-xs font-medium text-muted-foreground animate-pulse">Đang kết nối hệ thống...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-svh overflow-hidden bg-background text-foreground font-sans">
      {/* 1. Backdrop overlay for mobile when sidebar slides out */}
      {isMobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 md:hidden bg-black/40 dark:bg-black/60 backdrop-blur-xs transition-opacity duration-300 pointer-events-auto"
            onClick={() => setMobileOpen(false)}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setMobileOpen(false)}
            className="fixed top-3.5 right-2.5 z-50 md:hidden bg-background text-foreground border-border cursor-pointer w-9 h-9 flex items-center justify-center rounded-lg shadow-md animate-none"
            aria-label="Đóng menu"
          >
            <X className="w-4.5 h-4.5" />
          </Button>
        </>
      )}

      {/* 2. Sidebar Component */}
      <AppSidebar />

      {/* 3. Main content area */}
      <div className="flex-1 flex flex-col min-w-0 h-svh overflow-hidden shrink-0">
        {/* Top header */}
        <DashboardHeader />

        {/* Page content area below */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 xl:p-8 bg-muted/80 dark:bg-muted/5 grow @container/main">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <TenantProvider>
      <SidebarProvider>
        <DashboardLayoutContent>{children}</DashboardLayoutContent>
      </SidebarProvider>
    </TenantProvider>
  );
}
