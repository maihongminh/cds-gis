// src/components/map/map-shell.tsx
// Dynamically loads MapClient (ssr:false) and forwards shared MapState props.
'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import { MapLoading } from './map-loading';
import { MapErrorBoundary } from './map-error-boundary';
import type { MapState } from './map-client';

// Dynamic import keeps the GIS engine out of the initial dashboard bundle.
const MapClient = dynamic<{ mapState: MapState }>(
  () => import('./map-client').then((m) => ({ default: m.default })),
  {
    ssr: false,
    loading: () => <MapLoading />,
  }
);

interface MapShellProps {
  mapState: MapState;
  /** Optional: minimum height override */
  minHeight?: number;
}

export function MapShell({ mapState, minHeight = 500 }: MapShellProps) {
  return (
    <MapErrorBoundary>
      <div className="w-full h-full" style={{ minHeight }}>
        <MapClient mapState={mapState} />
      </div>
    </MapErrorBoundary>
  );
}
