// src/components/map/map-error-boundary.tsx
"use client";

import { Button } from "@/components/ui";
import { AlertTriangle, RotateCcw } from "lucide-react";
import * as React from "react";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class MapErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("MapErrorBoundary caught an error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full min-h-[450px] bg-rose-500/5 rounded-xl border border-rose-500/20 flex flex-col items-center justify-center p-6 text-center gap-4 text-xs">
          <div className="w-12 h-12 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center">
            <AlertTriangle className="size-6" />
          </div>
          <div className="space-y-1.5 max-w-sm">
            <h3 className="font-bold text-rose-700 dark:text-rose-400">LỖI KHỞI TẠO BẢN ĐỒ SỐ (GIS)</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">Thư viện bản đồ Leaflet gặp sự cố khi dựng trên Next.js App Router. Vui lòng làm mới lại bản đồ hoặc kiểm tra cấu hình.</p>
            <p className="text-[9px] font-mono text-rose-500 bg-rose-500/10 p-2 rounded-lg max-h-24 overflow-y-auto">{this.state.error?.message}</p>
          </div>
          <Button onClick={this.handleReset} variant="outline" size="sm" className="h-8 text-xs cursor-pointer gap-1.5 border-rose-500/20 text-rose-700 dark:text-rose-400 hover:bg-rose-500/10">
            <RotateCcw className="size-3.5" /> Thử lại
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
