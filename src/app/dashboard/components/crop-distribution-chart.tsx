'use client';

import * as React from 'react';
import { SectionCard } from '@/components/common';

interface CropDistributionItem {
  cropTypeCode: string;
  cropTypeName: string;
  areaHa: number;
  percentage: number;
}

interface CropDistributionChartProps {
  data: CropDistributionItem[];
}

const CROP_COLOR_MAP: Record<string, { stroke: string; bg: string; text: string }> = {
  'ca-phe-arabica': { stroke: 'stroke-emerald-500', bg: 'bg-emerald-500', text: 'text-emerald-500' },
  'chuoi-laobao': { stroke: 'stroke-teal-600', bg: 'bg-teal-600', text: 'text-teal-600' },
  'lua-ray': { stroke: 'stroke-amber-500', bg: 'bg-amber-500', text: 'text-amber-500' },
  'ngo-lai': { stroke: 'stroke-orange-400', bg: 'bg-orange-400', text: 'text-orange-400' },
  'rau-rung': { stroke: 'stroke-sky-500', bg: 'bg-sky-500', text: 'text-sky-500' },
};

const DEFAULT_COLOR = { stroke: 'stroke-slate-400', bg: 'bg-slate-400', text: 'text-slate-400' };

export function CropDistributionChart({ data }: CropDistributionChartProps) {
  // SVG Donut Calculations
  const radius = 50;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  
  // Calculate cumulative percentages for offset offsets
  const donutSegments = data.map((item, idx) => {
    const color = CROP_COLOR_MAP[item.cropTypeCode] || DEFAULT_COLOR;
    const percentage = item.percentage;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    const accumulatedPercentage = data.slice(0, idx).reduce((sum, current) => sum + current.percentage, 0);
    const rotation = (accumulatedPercentage / 100) * 360;
    
    return {
      ...item,
      color,
      strokeDashoffset,
      rotation,
    };
  });

  return (
    <SectionCard
      title="Cơ cấu diện tích cây trồng"
      description="Tỷ lệ diện tích canh tác cây trồng chính (mùa vụ 2026-XH)"
      className="h-full"
    >
      <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-6 py-4">
        {/* Left pane: SVG Donut */}
        <div className="relative w-36 h-36 flex-shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
            {/* Background circle track */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              className="fill-none stroke-muted"
              strokeWidth={strokeWidth}
            />
            {/* Segment slices */}
            {donutSegments.map((seg, idx) => (
              <circle
                key={idx}
                cx="60"
                cy="60"
                r={radius}
                className={cn("fill-none transition-all duration-1000 ease-out", seg.color.stroke)}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={seg.strokeDashoffset}
                strokeLinecap="round"
                transform={`rotate(${seg.rotation} 60 60)`}
              />
            ))}
          </svg>
          {/* Inner circle text summary */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Tổng cộng</span>
            <span className="text-base font-bold text-foreground">
              {data.reduce((sum, item) => sum + item.areaHa, 0).toFixed(1)} <span className="text-[9px] font-medium">ha</span>
            </span>
          </div>
        </div>

        {/* Right pane: Bars with metrics */}
        <div className="flex-1 w-full space-y-3.5">
          {data.slice(0, 5).map((item) => {
            const color = CROP_COLOR_MAP[item.cropTypeCode] || DEFAULT_COLOR;
            return (
              <div key={item.cropTypeCode} className="space-y-1 group">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-2 text-foreground/90">
                    <span className={cn("w-2 h-2 rounded-full", color.bg)} />
                    <span className="truncate max-w-[120px] sm:max-w-[160px]">{item.cropTypeName}</span>
                  </div>
                  <div className="text-muted-foreground flex items-center gap-1.5 font-sans">
                    <span className="text-foreground">{item.areaHa.toFixed(1)} ha</span>
                    <span className="text-[10px] text-muted-foreground/60">({item.percentage}%)</span>
                  </div>
                </div>
                {/* Horizontal Progress Bar */}
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden border border-border/10">
                  <div
                    className={cn("h-full rounded-full transition-all duration-1000", color.bg)}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </SectionCard>
  );
}

// Utility wrapper helper to avoid importing classnames in multiple places
function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}
