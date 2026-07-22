'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface FormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  submitText?: string;
  cancelText?: string;
  isSubmitting?: boolean;
  maxWidthClass?: string;
}

export function FormDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  onSubmit,
  submitText = 'Lưu lại',
  cancelText = 'Hủy bỏ',
  isSubmitting = false,
  maxWidthClass = 'max-w-[600px]',
}: FormDialogProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(e);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`bg-card border-border ${maxWidthClass} w-full flex flex-col max-h-[85vh] p-0`}>
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-foreground text-lg font-semibold">{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-muted-foreground text-sm mt-1">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {children}
          </div>

          <DialogFooter className="p-6 pt-4 border-t border-border/40 bg-muted/30 flex items-center justify-end gap-2 shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="cursor-pointer border-border hover:bg-muted text-foreground text-sm h-9"
            >
              {cancelText}
            </Button>
            {onSubmit && (
              <Button
                type="submit"
                disabled={isSubmitting}
                className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 text-sm h-9"
              >
                {isSubmitting ? 'Đang lưu...' : submitText}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
