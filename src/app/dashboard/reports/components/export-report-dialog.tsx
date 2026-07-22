'use client';

import * as React from 'react';
import { Button } from '@/components/ui';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui';
import { Loader2, CheckCircle2 } from 'lucide-react';

interface ExportReportDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  format: 'excel' | 'pdf';
  reportTitle: string;
}

export function ExportReportDialog({
  isOpen,
  onOpenChange,
  format,
  reportTitle,
}: ExportReportDialogProps) {
  const [step, setStep] = React.useState(1);
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    if (isOpen) {
      setStep(1);
      setProgress(0);
      
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setStep(2);
            return 100;
          }
          return prev + 10;
        });
      }, 200);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const getStepText = () => {
    if (progress < 30) return 'Đang tổng hợp dữ liệu nhân khẩu & kinh tế...';
    if (progress < 60) return 'Đang tính toán sản lượng và bình quân thu nhập...';
    if (progress < 90) return `Đang dàn trang và kết xuất file ${format.toUpperCase()}...`;
    return 'Đang đóng gói file báo cáo...';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-sm font-bold">Xuất báo cáo & thống kê</DialogTitle>
          <DialogDescription className="text-xs">
            Trích xuất báo cáo dữ liệu định kỳ của xã Lao Bảo.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
          {step === 1 ? (
            <>
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <div className="space-y-1.5 w-full max-w-[280px]">
                <div className="text-xs font-semibold text-foreground">{getStepText()}</div>
                <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden border border-border/30">
                  <div
                    className="bg-primary h-1.5 rounded-full transition-all duration-200"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="text-[10px] text-muted-foreground font-mono">{progress}%</div>
              </div>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-12 h-12 text-emerald-500 animate-bounce" />
              <div className="space-y-1">
                <div className="text-xs font-bold text-foreground">Tạo báo cáo thành công!</div>
                <div className="text-[10px] text-muted-foreground max-w-[320px]">
                  Tệp <span className="font-semibold text-foreground">{reportTitle}.{format === 'excel' ? 'xlsx' : 'pdf'}</span> đã được biên dịch thành công và tải xuống máy tính của bạn.
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={step === 1}
            className="w-full sm:w-auto cursor-pointer shadow-none text-xs"
          >
            Đóng cửa sổ
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
