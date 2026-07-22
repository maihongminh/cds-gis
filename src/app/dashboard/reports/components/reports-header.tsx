'use client';

import * as React from 'react';
import { PageHeader } from '@/components/common';
import { Button } from '@/components/ui';
import { FileDown, FileSpreadsheet } from 'lucide-react';
import { ExportReportDialog } from './export-report-dialog';

export function ReportsHeader() {
  const [exportFormat, setExportFormat] = React.useState<'excel' | 'pdf'>('excel');
  const [isExportOpen, setIsExportOpen] = React.useState(false);

  const handleExport = (format: 'excel' | 'pdf') => {
    setExportFormat(format);
    setIsExportOpen(true);
  };

  const actions = (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleExport('excel')}
        className="h-9 px-3 text-xs bg-card border-border hover:bg-muted cursor-pointer shadow-none font-semibold text-emerald-600 dark:text-emerald-400 border-emerald-500/10"
      >
        <FileSpreadsheet className="size-4" />
        Xuất file Excel
      </Button>
      <Button
        variant="default"
        size="sm"
        onClick={() => handleExport('pdf')}
        className="h-9 px-3 text-xs cursor-pointer shadow-none font-semibold bg-rose-600 hover:bg-rose-700 text-white"
      >
        <FileDown className="size-4" />
        Xuất file PDF
      </Button>

      <ExportReportDialog
        isOpen={isExportOpen}
        onOpenChange={setIsExportOpen}
        format={exportFormat}
        reportTitle="Bao_cao_nong_nghiep_kinh_te_Tra_Tap"
      />
    </div>
  );

  return (
    <PageHeader
      title="Báo cáo & Thống kê định kỳ"
      description="Tổng hợp số liệu kinh tế nông - lâm nghiệp, thống kê hộ nghèo, cận nghèo và theo dõi chỉ số thu nhập bình quân phục vụ báo cáo cấp xã, cấp huyện"
      actions={actions}
    />
  );
}
