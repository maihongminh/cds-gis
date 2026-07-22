'use client';

import React, { createContext, useContext, useState } from 'react';

interface SidebarContextType {
  isCollapsed: boolean;          // Collapsed state on desktop
  toggleSidebar: () => void;      // Toggle collapse/expand on desktop
  isMobileOpen: boolean;         // Mobile menu open state
  setMobileOpen: (open: boolean) => void; // Open/close on mobile
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setMobileOpen] = useState(false);

  const toggleSidebar = () => setIsCollapsed((prev) => !prev);

  return (
    <SidebarContext.Provider
      value={{
        isCollapsed,
        toggleSidebar,
        isMobileOpen,
        setMobileOpen,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used inside SidebarProvider');
  }
  return context;
}
