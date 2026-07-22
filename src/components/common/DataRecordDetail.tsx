// src/components/common/DataRecordDetail.tsx

import * as React from 'react';
import { DataRecordBase } from '@/types';
import { RecordMetadataPanel } from './RecordMetadataPanel';
import { VersionTimeline } from './VersionTimeline';
import { LabelValueGrid } from './label-value-grid';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui';

interface DetailField {
  label: string;
  value: React.ReactNode;
  fullWidth?: boolean;
}

interface DataRecordDetailProps {
  record: DataRecordBase;
  title: string;
  fields: DetailField[];
  onBack?: () => void;
  className?: string;
}

export function DataRecordDetail({
  record,
  title,
  fields,
  onBack,
  className
}: DataRecordDetailProps) {
  return (
    <div className={`space-y-6 animate-fade-in ${className || ''}`}>
      {onBack && (
        <Button onClick={onBack} variant="outline" size="sm" className="h-8 text-xs cursor-pointer gap-1.5 shadow-none">
          <ArrowLeft className="size-4" />
          Quay lại danh sách
        </Button>
      )}

      {/* Details Grid Layout (2 columns: main details + side audit log panel) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main fields section */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-border bg-card shadow-2xs">
            <CardHeader>
              <CardTitle className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <FileText className="size-4.5 text-primary" />
                {title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <LabelValueGrid
                items={fields.map((f) => ({
                  label: f.label,
                  value: f.value,
                  fullWidth: f.fullWidth,
                }))}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar panels (Audit log + status information) */}
        <div className="space-y-6">
          <RecordMetadataPanel record={record} />

          <VersionTimeline
            currentVersion={record.version}
            createdBy={record.createdBy}
            createdAt={record.createdAt}
            updatedBy={record.updatedBy}
            updatedAt={record.updatedAt}
            publishedAt={record.publishedAt}
          />
        </div>
      </div>
    </div>
  );
}
export type { DetailField };
