'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui';
import { Label } from '@/components/ui';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui';
import { toast } from 'sonner';
import { Download, Upload, DatabaseBackup } from 'lucide-react';
import { SystemSettings } from '@/types/settings';

interface BackupSettingsCardProps {
  settings: SystemSettings;
}

export function BackupSettingsCard({ settings }: BackupSettingsCardProps) {
  const [backupInterval, setBackupInterval] = useState(
    String(settings.systemBackupIntervalDays)
  );

  function handleBackup() {
    toast.success('Đang tạo bản sao lưu... Hệ thống sẽ thông báo khi hoàn tất.');
  }

  function handleRestore() {
    toast.success('Đã khôi phục dữ liệu từ bản sao lưu (giả lập)');
  }

  function handleSaveInterval() {
    toast.success(`Đã cập nhật lịch sao lưu tự động mỗi ${backupInterval} ngày`);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sao lưu & Khôi phục</CardTitle>
        <CardDescription>
          Quản lý bản sao lưu dữ liệu hệ thống (UI mock – không xử lý file thật)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-1">
          <Label htmlFor="setting-backup-interval">Tự động sao lưu mỗi (ngày)</Label>
          <div className="flex gap-2">
            <Select value={backupInterval} onValueChange={setBackupInterval}>
              <SelectTrigger id="setting-backup-interval" className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 ngày</SelectItem>
                <SelectItem value="3">3 ngày</SelectItem>
                <SelectItem value="7">7 ngày</SelectItem>
                <SelectItem value="14">14 ngày</SelectItem>
                <SelectItem value="30">30 ngày</SelectItem>
              </SelectContent>
            </Select>
            <Button
              id="btn-save-backup-interval"
              variant="outline"
              onClick={handleSaveInterval}
            >
              Lưu lịch
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button id="btn-create-backup" onClick={handleBackup} className="gap-2">
            <Download className="size-4" />
            Sao lưu ngay
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                id="btn-restore-backup"
                variant="outline"
                className="gap-2"
              >
                <Upload className="size-4" />
                Khôi phục dữ liệu
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Xác nhận khôi phục dữ liệu</AlertDialogTitle>
                <AlertDialogDescription>
                  Hành động này sẽ ghi đè dữ liệu hiện tại bằng bản sao lưu đã chọn.
                  Đây là thao tác demo, không ảnh hưởng đến dữ liệu thực tế.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Hủy</AlertDialogCancel>
                <AlertDialogAction onClick={handleRestore}>
                  Xác nhận khôi phục
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <div className="rounded-md border border-border bg-muted/30 p-4 space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <DatabaseBackup className="size-4 text-muted-foreground" />
            Bản sao lưu gần nhất
          </div>
          <div className="text-sm text-muted-foreground">
            <span className="font-mono">backup_tratap_20260614.json</span> – 14/06/2026 23:00 – 2.4 MB
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
