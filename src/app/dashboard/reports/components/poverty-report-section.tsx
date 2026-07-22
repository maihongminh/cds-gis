'use client';

import * as React from 'react';
import { SectionCard } from '@/components/common';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui';
import { StatusBadge } from '@/components/common';
import { HouseholdEconomyRecord } from '@/types/household-economy';
import { formatVND } from '../../components/dashboard-kpi-grid';
import Link from 'next/link';

interface PovertyReportSectionProps {
  povertyData: HouseholdEconomyRecord[];
}

export function PovertyReportSection({ povertyData }: PovertyReportSectionProps) {
  // Filter only poor & nearPoor
  const poorList = React.useMemo(() => {
    return povertyData.filter(
      (p) => p.economicClassificationAfter === 'poor' || p.economicClassificationAfter === 'nearPoor'
    );
  }, [povertyData]);

  return (
    <SectionCard
      title="Báo cáo rà soát hộ nghèo & cận nghèo"
      description="Danh sách thống kê chi tiết các hộ thuộc diện hộ nghèo, cận nghèo đa chiều cùng mức thu nhập bình quân đầu người và chính sách hỗ trợ phát triển kinh tế"
    >
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto w-full">
          <Table>
            <TableHeader className="bg-muted/40 border-b border-border/60">
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs font-semibold text-muted-foreground">Chủ hộ / Hộ dân</TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground text-center">Năm</TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground">Phân loại kinh tế</TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground text-right">Bình quân đầu người</TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground">Chính sách đặc thù đã nhận</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {poorList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-xs text-muted-foreground">
                    Không có hộ nghèo hay cận nghèo nào thuộc bộ lọc hiện tại.
                  </TableCell>
                </TableRow>
              ) : (
                poorList.map((row, idx) => (
                  <TableRow key={idx} className="hover:bg-muted/30 border-b border-border/40">
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <Link
                          href={`/dashboard/households/${row.householdId}`}
                          className="font-bold text-foreground hover:text-primary transition-colors"
                        >
                          {row.householdHeadName}
                        </Link>
                        <span className="text-[10px] text-muted-foreground/60 font-mono font-semibold">
                          {row.householdCode}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-medium text-muted-foreground">{row.year}</TableCell>
                    <TableCell>
                      <StatusBadge
                        status={row.economicClassificationAfter === 'poor' ? 'none' : 'pending'}
                        customLabel={row.economicClassificationAfter === 'poor' ? 'Hộ nghèo' : 'Hộ cận nghèo'}
                      />
                    </TableCell>
                    <TableCell className="text-right font-bold text-foreground font-sans">
                      {formatVND(row.incomePerCapita, false)}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {row.supportPoliciesReceived && row.supportPoliciesReceived.length > 0 ? (
                          row.supportPoliciesReceived.map((policy, pIdx) => (
                            <span
                              key={pIdx}
                              className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-sm font-medium border border-primary/20"
                            >
                              {policy}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] text-muted-foreground italic">Trợ cấp tiền điện, gạo cứu đói</span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </SectionCard>
  );
}
