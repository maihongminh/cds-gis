'use client';

import * as React from 'react';
import { SectionCard } from '@/components/common';
import { CropRecord } from '@/types/crop';
import { MOCK_CROPS } from '@/data/mock-crops';
import { MOCK_HOUSEHOLDS } from '@/data/mock-households';
import { formatVND } from './dashboard-kpi-grid';

interface MonthlyProductionChartProps {
  selectedHamletCode: string;
}

interface SeasonData {
  seasonCode: string;
  seasonLabel: string;
  revenue: number;
  cost: number;
}

export function MonthlyProductionChart({ selectedHamletCode }: MonthlyProductionChartProps) {
  // 1. Group mock crops by season and calculate totals dynamically based on hamlet scope
  const seasonData = React.useMemo(() => {
    // Filter households in hamlet
    const hamletHhs = selectedHamletCode === 'all'
      ? MOCK_HOUSEHOLDS
      : MOCK_HOUSEHOLDS.filter(hh => hh.hamletCode === selectedHamletCode);

    const hhIds = new Set(hamletHhs.map(h => h.id));
    const hamletCrops = MOCK_CROPS.filter(c => hhIds.has(c.householdId) && c.status === 'active');

    const seasons = [
      { code: '2025-DH', label: 'Đông Xuân 25' },
      { code: '2025-XH', label: 'Xuân Hè 25' },
      { code: '2026-DH', label: 'Đông Xuân 26' },
      { code: '2026-XH', label: 'Xuân Hè 26' },
    ];

    return seasons.map((s): SeasonData => {
      const cropsInSeason = hamletCrops.filter(c => c.seasonYear === s.code);
      const revenue = cropsInSeason.reduce((sum, c) => sum + (c.harvestOutputKg * c.salePrice), 0);
      // Mock cost as 30% of revenue + some random variance for visuals
      const cost = revenue > 0 ? Math.round(revenue * 0.3) : 0;

      return {
        seasonCode: s.code,
        seasonLabel: s.label,
        revenue,
        cost,
      };
    });
  }, [selectedHamletCode]);

  // 2. SVG Bar Rendering Math
  const viewBoxWidth = 500;
  const viewBoxHeight = 220;
  const paddingLeft = 60;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartWidth = viewBoxWidth - paddingLeft - paddingRight;
  const chartHeight = viewBoxHeight - paddingTop - paddingBottom;

  const maxVal = React.useMemo(() => {
    const highest = Math.max(...seasonData.map(d => Math.max(d.revenue, d.cost)), 1000000); // fallback min
    return highest * 1.15; // 15% top buffer
  }, [seasonData]);

  // Y-axis grid values
  const gridTicks = [0, 0.25, 0.5, 0.75, 1].map(pct => maxVal * pct);

  return (
    <SectionCard
      title="Doanh thu & Chi phí Nông nghiệp"
      description="Biến động tổng doanh thu trồng trọt đối chiếu chi phí sản xuất theo mùa vụ"
      actions={
        <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider max-md:flex-col">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-primary shrink-0" />
            <span className="text-muted-foreground">Doanh thu</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-rose-500/80 shrink-0" />
            <span className="text-muted-foreground">Chi phí</span>
          </div>
        </div>
      }
    >
      <div className="w-full">
        {/* SVG Wrapper */}
        <svg
          className="w-full h-auto overflow-visible"
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Horizontal Grid lines and Y-axis Labels */}
          {gridTicks.map((val, idx) => {
            const y = chartHeight - (val / maxVal) * chartHeight + paddingTop;
            return (
              <g key={idx} className="opacity-70">
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={viewBoxWidth - paddingRight}
                  y2={y}
                  className="stroke-border/50"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 3}
                  className="fill-muted-foreground text-[8px] font-bold text-right font-sans"
                  textAnchor="end"
                >
                  {formatVND(val, true)}
                </text>
              </g>
            );
          })}

          {/* Grouped Bars */}
          {seasonData.map((data, idx) => {
            const segmentWidth = chartWidth / seasonData.length;
            const groupCenterX = paddingLeft + idx * segmentWidth + segmentWidth / 2;

            // Bar widths and gap settings
            const barWidth = 16;
            const barGap = 4;

            const revenueHeight = (data.revenue / maxVal) * chartHeight;
            const costHeight = (data.cost / maxVal) * chartHeight;

            // X-coordinates
            const revenueX = groupCenterX - barWidth - barGap / 2;
            const costX = groupCenterX + barGap / 2;

            // Y-coordinates
            const revenueY = chartHeight - revenueHeight + paddingTop;
            const costY = chartHeight - costHeight + paddingTop;

            return (
              <g key={data.seasonCode} className="group/bar">
                {/* 1. Revenue Bar */}
                <rect
                  x={revenueX}
                  y={revenueY}
                  width={barWidth}
                  height={Math.max(revenueHeight, 2)}
                  rx="3"
                  className="fill-primary hover:brightness-110 transition-all duration-300 cursor-pointer"
                />
                {/* Hover value label for Revenue */}
                <text
                  x={revenueX + barWidth / 2}
                  y={revenueY - 4}
                  className="fill-foreground text-[8px] font-bold text-center opacity-0 group-hover/bar:opacity-100 transition-opacity pointer-events-none font-sans"
                  textAnchor="middle"
                >
                  {formatVND(data.revenue, true)}
                </text>

                {/* 2. Cost Bar */}
                <rect
                  x={costX}
                  y={costY}
                  width={barWidth}
                  height={Math.max(costHeight, 2)}
                  rx="3"
                  className="fill-rose-500/80 hover:brightness-110 transition-all duration-300 cursor-pointer"
                />
                {/* Hover value label for Cost */}
                <text
                  x={costX + barWidth / 2}
                  y={costY - 4}
                  className="fill-foreground text-[8px] font-bold text-center opacity-0 group-hover/bar:opacity-100 transition-opacity pointer-events-none font-sans"
                  textAnchor="middle"
                >
                  {formatVND(data.cost, true)}
                </text>

                {/* X-axis Label */}
                <text
                  x={groupCenterX}
                  y={chartHeight + paddingTop + 16}
                  className="fill-muted-foreground text-[9px] font-semibold text-center font-sans"
                  textAnchor="middle"
                >
                  {data.seasonLabel}
                </text>
              </g>
            );
          })}

          {/* Baseline X-axis */}
          <line
            x1={paddingLeft}
            y1={chartHeight + paddingTop}
            x2={viewBoxWidth - paddingRight}
            y2={chartHeight + paddingTop}
            className="stroke-border"
            strokeWidth="1"
          />
        </svg>
      </div>
    </SectionCard>
  );
}
