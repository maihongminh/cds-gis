'use client';

import * as React from 'react';
import { StatusBadge } from '@/components/common';
import { LandCertificateStatus } from '@/types/land';

interface LandStatusBadgeProps {
  status: LandCertificateStatus;
  className?: string;
}

export function LandStatusBadge({ status, className }: LandStatusBadgeProps) {
  return (
    <StatusBadge status={status} className={className} />
  );
}
