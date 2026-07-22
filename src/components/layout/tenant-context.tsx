'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_HAMLETS, COMMUNE } from '@/data/mock-administrative-units';
import { AdministrativeUnit } from '@/types/administrative-unit';

interface TenantContextType {
  selectedCommune: typeof COMMUNE;
  selectedHamletCode: string; // 'all' represents the entire commune, or a specific hamlet code
  setSelectedHamletCode: (code: string) => void;
  hamlets: AdministrativeUnit[];
  currentRole: string | null;
  setCurrentRole: (role: string | null) => void;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [selectedHamletCode, setSelectedHamletCode] = useState<string>('all');
  const [currentRole, setCurrentRole] = useState<string | null>(null);

  // Read role from cookies on initialization
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const roleMatch = document.cookie.match(/app_role=([^;]+)/);
      const roleVal = roleMatch ? decodeURIComponent(roleMatch[1]) : null;
      setCurrentRole(roleVal);
      setSelectedHamletCode('all');
    }
  }, []);

  const handleSetSelectedHamletCode = (code: string) => {
    setSelectedHamletCode(code);
  };

  return (
    <TenantContext.Provider
      value={{
        selectedCommune: COMMUNE,
        selectedHamletCode,
        setSelectedHamletCode: handleSetSelectedHamletCode,
        hamlets: MOCK_HAMLETS,
        currentRole,
        setCurrentRole,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used inside TenantProvider');
  }
  return context;
}
