'use client';

import * as React from 'react';
import {
  Building,
  GraduationCap,
  HeartPulse,
  Landmark,
  MapPin,
} from 'lucide-react';

import type { MapLayer } from '@/data/gis-layer-catalog';
import { cn } from '@/lib/utils';

const LAYER_ICONS: Record<string, React.ElementType> = {
  Building,
  GraduationCap,
  HeartPulse,
  Landmark,
  MapPin,
};

interface MapLayerSymbolProps {
  geometryType: MapLayer['geometryType'];
  styleConfig: MapLayer['styleConfig'];
  className?: string;
}

export function MapLayerSymbol({
  geometryType,
  styleConfig,
  className,
}: MapLayerSymbolProps) {
  const Icon = styleConfig.icon
    ? LAYER_ICONS[styleConfig.icon]
    : undefined;

  if (Icon) {
    return (
      <span
        className={cn(
          'flex size-3 shrink-0 items-center justify-center',
          className,
        )}
        style={{ color: styleConfig.color }}
      >
        <Icon className="size-full" />
      </span>
    );
  }

  if (geometryType === 'point') {
    return (
      <span
        className={cn(
          'size-3 shrink-0 rounded-full border-[1.5px] border-white',
          className,
        )}
        style={{ backgroundColor: styleConfig.color }}
      />
    );
  }

  if (geometryType === 'line') {
    return (
      <span
        className={cn('h-0 w-3 shrink-0 border-t-2', className)}
        style={{ borderColor: styleConfig.color }}
      />
    );
  }

  return (
    <span
      className={cn('size-3 shrink-0 rounded-sm border', className)}
      style={{
        backgroundColor: `${styleConfig.fillColor ?? styleConfig.color}30`,
        borderColor: styleConfig.color,
      }}
    />
  );
}
