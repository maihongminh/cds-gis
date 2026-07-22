// src/components/map/map-loading.tsx
import * as React from 'react';
import { Loader2 } from 'lucide-react';

export function MapLoading() {
  return (
    <div className="w-full h-full min-h-[450px] bg-muted/40 rounded-xl flex flex-col items-center justify-center border border-border/60 gap-3 text-xs animate-pulse">
      <Loader2 className="size-8 text-primary animate-spin" />
      <div className="space-y-1 text-center">
        <p className="font-bold text-foreground">Đang tải bản đồ số...</p>
        <p className="text-[10px] text-muted-foreground">Khởi tạo thư viện GIS Leaflet &amp; hệ tọa độ EPSG:4326</p>
      </div>
    </div>
  );
}
