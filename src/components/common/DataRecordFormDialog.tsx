// src/components/common/DataRecordFormDialog.tsx

import * as React from 'react';
import { FormDialog } from './form-dialog';
import { Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { SecurityLevel } from '@/types';
import { ReportingPeriodPicker } from './ReportingPeriodPicker';
import { VillageSelect } from './VillageSelect';
import { toast } from 'sonner';

export interface FormFieldDefinition {
  key: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'select' | 'textarea';
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
  placeholder?: string;
}

interface DataRecordFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingRecord?: any | null;
  title: string;
  fields: FormFieldDefinition[];
  onSave: (data: any) => void;
  defaultSecurityLevel?: SecurityLevel;
}

export function DataRecordFormDialog({
  open,
  onOpenChange,
  editingRecord,
  title,
  fields,
  onSave,
  defaultSecurityLevel = 'shared'
}: DataRecordFormDialogProps) {
  const isEdit = !!editingRecord;
  const [formValues, setFormValues] = React.useState<Record<string, any>>({});
  const [reportingPeriod, setReportingPeriod] = React.useState('2026-M06');
  const [securityLevel, setSecurityLevel] = React.useState<SecurityLevel>(defaultSecurityLevel);
  const [villageCode, setVillageCode] = React.useState('all');

  // Initialize values when dialog opens or editingRecord changes
  React.useEffect(() => {
    if (open) {
      if (editingRecord) {
        const initialValues: Record<string, any> = {};
        fields.forEach((f) => {
          initialValues[f.key] = editingRecord[f.key] !== undefined ? editingRecord[f.key] : '';
        });
        setFormValues(initialValues);
        setReportingPeriod(editingRecord.reportingPeriod || '2026-M06');
        setSecurityLevel(editingRecord.securityLevel || defaultSecurityLevel);
        setVillageCode(editingRecord.villageCode || 'all');
      } else {
        const initialValues: Record<string, any> = {};
        fields.forEach((f) => {
          initialValues[f.key] = f.type === 'boolean' ? false : '';
        });
        setFormValues(initialValues);
        setReportingPeriod('2026-M06');
        setSecurityLevel(defaultSecurityLevel);
        setVillageCode('all');
      }
    }
  }, [open, editingRecord, fields, defaultSecurityLevel]);

  const handleInputChange = (key: string, value: any) => {
    setFormValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    for (const f of fields) {
      if (f.required && (formValues[f.key] === undefined || formValues[f.key] === '')) {
        toast.error(`Vui lòng nhập trường bắt buộc: ${f.label}`);
        return;
      }
    }

    const data: any = {
      ...formValues,
      reportingPeriod,
      securityLevel,
      villageCode,
    };

    onSave(data);
    onOpenChange(false);
  };

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? `Chỉnh sửa ${title}` : `Thêm mới ${title}`}
      description="Nhập thông tin biểu mẫu báo cáo số liệu. Bản ghi sẽ ở trạng thái Bản nháp cho tới khi bạn gửi duyệt."
      submitText={isEdit ? 'Lưu thay đổi' : 'Thêm bản ghi'}
      onSubmit={handleSubmit}
      maxWidthClass="max-w-[500px]"
    >
      {/* Scope fields */}
      <div className="grid grid-cols-2 gap-4 border-b border-border/60 pb-4 mb-2">
        <div className="grid gap-1.5">
          <Label htmlFor="record-period" className="text-xs font-bold text-foreground">Kỳ báo cáo *</Label>
          <ReportingPeriodPicker
            value={reportingPeriod}
            onValueChange={setReportingPeriod}
            className="bg-background border-border text-xs h-9"
          />
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="record-village" className="text-xs font-bold text-foreground">Địa bàn (Thôn)</Label>
          <VillageSelect
            value={villageCode}
            onValueChange={setVillageCode}
            allowAll={true}
            className="bg-background border-border text-xs h-9"
          />
        </div>

        <div className="grid gap-1.5 col-span-2">
          <Label htmlFor="record-security" className="text-xs font-bold text-foreground">Độ bảo mật dữ liệu</Label>
          <Select value={securityLevel} onValueChange={(v) => setSecurityLevel(v as SecurityLevel)}>
            <SelectTrigger id="record-security" className="bg-background border-border text-xs h-9">
              <SelectValue placeholder="Chọn độ bảo mật" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public" className="cursor-pointer text-xs">Công khai (Public)</SelectItem>
              <SelectItem value="shared" className="cursor-pointer text-xs">Nội bộ (Shared)</SelectItem>
              <SelectItem value="confidential" className="cursor-pointer text-xs">Mật (Confidential)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Dynamic fields */}
      <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
        {fields.map((f) => (
          <div key={f.key} className="grid gap-1.5">
            <Label htmlFor={`form-field-${f.key}`} className="text-xs font-semibold text-foreground">
              {f.label} {f.required && <span className="text-destructive">*</span>}
            </Label>
            
            {f.type === 'string' && (
              <Input
                id={`form-field-${f.key}`}
                placeholder={f.placeholder}
                value={formValues[f.key] || ''}
                onChange={(e) => handleInputChange(f.key, e.target.value)}
                className="bg-background border-border text-xs h-9"
              />
            )}

            {f.type === 'number' && (
              <Input
                id={`form-field-${f.key}`}
                type="number"
                placeholder={f.placeholder}
                value={formValues[f.key] || ''}
                onChange={(e) => handleInputChange(f.key, e.target.value)}
                className="bg-background border-border text-xs h-9"
              />
            )}

            {f.type === 'date' && (
              <Input
                id={`form-field-${f.key}`}
                type="date"
                value={formValues[f.key] || ''}
                onChange={(e) => handleInputChange(f.key, e.target.value)}
                className="bg-background border-border text-xs h-9"
              />
            )}

            {f.type === 'textarea' && (
              <textarea
                id={`form-field-${f.key}`}
                placeholder={f.placeholder}
                value={formValues[f.key] || ''}
                onChange={(e) => handleInputChange(f.key, e.target.value)}
                className="w-full min-h-[60px] rounded-md border border-border bg-background px-3 py-2 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
              />
            )}

            {f.type === 'select' && (
              <Select
                value={formValues[f.key] || ''}
                onValueChange={(v) => handleInputChange(f.key, v)}
              >
                <SelectTrigger id={`form-field-${f.key}`} className="bg-background border-border text-xs h-9">
                  <SelectValue placeholder={f.placeholder || 'Chọn giá trị'} />
                </SelectTrigger>
                <SelectContent>
                  {f.options?.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value} className="cursor-pointer text-xs">
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {f.type === 'boolean' && (
              <Select
                value={formValues[f.key] === true ? 'true' : formValues[f.key] === false ? 'false' : ''}
                onValueChange={(v) => handleInputChange(f.key, v === 'true')}
              >
                <SelectTrigger id={`form-field-${f.key}`} className="bg-background border-border text-xs h-9">
                  <SelectValue placeholder="Chọn Có/Không" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true" className="cursor-pointer text-xs">Có (Đồng ý)</SelectItem>
                  <SelectItem value="false" className="cursor-pointer text-xs">Không (Từ chối)</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        ))}
      </div>
    </FormDialog>
  );
}
