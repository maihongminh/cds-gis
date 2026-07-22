// src/app/dashboard/ai-assistant/components/ai-demo-disclaimer.tsx

import { AlertCircle } from "lucide-react";

export function AiDemoDisclaimer() {
  return (
    <div className="flex items-center gap-2 p-3 bg-primary/10 text-primary-foreground/80 text-sm rounded-md border border-primary/20 mt-4">
      <AlertCircle className="w-5 h-5 text-primary shrink-0" />
      <div>
        <p className="font-semibold mb-0.5 text-primary">Bản Demo Mô Phỏng</p>
        <p className="text-primary/80">Các tính năng AI hiện đang trong giai đoạn thử nghiệm. Kết quả hiển thị chỉ mang tính chất tham khảo, được tính toán từ các kịch bản mẫu và chưa kết nối với mô hình AI thực tế.</p>
      </div>
    </div>
  );
}
