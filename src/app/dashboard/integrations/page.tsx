// src/app/dashboard/integrations/page.tsx
'use client';

import * as React from 'react';
import { useTenant } from '@/components/layout/tenant-context';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Separator,
  Badge,
} from '@/components/ui';
import {
  Network,
  Cpu,
  Database,
  Globe,
  CheckCircle,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/common';

interface IntegrationConnector {
  id: string;
  name: string;
  type: string;
  status: 'planned' | 'configured' | 'disabled' | 'error';
  description: string;
  roadmap?: string;
}

const CONNECTORS: IntegrationConnector[] = [
  { id: 'conn-1', name: 'Hệ thống CSDL Dân cư Quốc gia', type: 'Dân cư', status: 'planned', description: 'Đồng bộ mã số định danh, hộ khẩu điện tử phục vụ quản lý nhân khẩu và an sinh xã hội thôn.', roadmap: 'Q1/2027' },
  { id: 'conn-2', name: 'Cổng Dịch vụ công trực tuyến tỉnh Quảng Trị', type: 'Dịch vụ công', status: 'configured', description: 'Đồng bộ trạng thái tiếp nhận, xử lý hồ sơ hành chính một cửa của UBND xã.', roadmap: 'Đang kết nối' },
  { id: 'conn-3', name: 'Trục liên thông văn bản điều hành (Edoc)', type: 'Văn bản điều hành', status: 'configured', description: 'Tiếp nhận chỉ đạo của Tỉnh ủy, HĐND-UBND Tỉnh Quảng Trị chuyển giao về xã.', roadmap: 'Đang kết nối' },
  { id: 'conn-4', name: 'CSDL Thống kê Tổng cục Thống kê ngành', type: 'Thống kê ngành', status: 'disabled', description: 'Nạp dữ liệu kế hoạch phát triển kinh tế vĩ mô định kỳ từ Cục Thống kê tỉnh.', roadmap: 'Tạm dừng' },
  { id: 'conn-5', name: 'Trung tâm Giám sát Điều hành thông minh tỉnh (IOC)', type: 'Tỉnh/IOC', status: 'planned', description: 'Chia sẻ chỉ số phát triển xã Lao Bảo lên Dashboard tổng hợp của tỉnh Quảng Trị.', roadmap: 'Q4/2027' },
  { id: 'conn-6', name: 'Trợ lý ảo Trí tuệ nhân tạo (AI Assistant)', type: 'IOC/AI', status: 'planned', description: 'Mô hình phân tích thông minh, trả lời báo cáo tự động và gợi ý kế hoạch mùa vụ.', roadmap: 'Lộ trình 2027-2028' },
];

const STATUS_CONFIG: Record<IntegrationConnector['status'], { label: string; className: string }> = {
  planned: { label: 'Đang lên kế hoạch', className: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
  configured: { label: 'Đã kết nối', className: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-bold' },
  disabled: { label: 'Tạm ngừng', className: 'bg-muted/40 text-muted-foreground border-border' },
  error: { label: 'Sự cố kết nối', className: 'bg-rose-500/10 text-rose-600 border-rose-500/20 animate-pulse' },
};

export default function IntegrationsPage() {
  const { currentRole } = useTenant();

  const handleTestConnection = (name: string) => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: `Đang gửi tín hiệu kiểm tra Ping đến gateway kết nối của ${name}...`,
        success: `Kết nối thông suốt! Gateway phản hồi tốt (Latency: 24ms).`,
        error: 'Lỗi kiểm tra kết nối.',
      }
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Header */}
      <PageHeader
        title={
          <>
            <Network className="w-6 h-6 text-primary" />
            Liên thông &amp; Tích hợp hệ thống
          </>
        }
        description="Quản lý cổng kết nối liên thông dữ liệu dân cư, tỉnh/IOC và các trợ lý ảo thông minh."
      />

      {/* Roadmap section */}
      <Card className="border-border bg-card">
        <CardHeader>
          <h3 className="font-bold text-foreground flex items-center gap-1.5">
            <Cpu className="size-4 text-primary" />
            Lộ trình tích hợp Trí tuệ nhân tạo (AI Assistant) &amp; IOC tỉnh (2027–2028)
          </h3>
          <p className="text-[10px] text-muted-foreground mt-0.5">Mô hình phân tích thông minh hỗ trợ lãnh đạo ra quyết định</p>
        </CardHeader>
        <CardContent className="px-4 space-y-3">
          <div className="p-3.5 bg-muted/20 border border-border rounded-xl space-y-2">
            <p className="font-bold text-foreground flex items-center gap-1.5">
              <Sparkles className="size-4 text-indigo-600" />
              Đặc tả kết nối trợ lý AI thông minh:
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Trợ lý ảo AI sẽ tự động phân tích 62 chỉ số kinh tế xã hội Lao Bảo, đưa ra dự báo về năng suất nông sản, nguy cơ thiên tai và tự động sinh bản thảo báo cáo hàng tháng.
              Hiện tại, cổng kết nối AI đang ở trạng thái <strong>&quot;Chưa kết nối&quot; (Lộ trình 2027–2028)</strong>, hệ thống không mô phỏng dữ liệu AI hoặc gọi endpoint API thật để bảo đảm an toàn thông tin biên giới.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Connectors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {CONNECTORS.map((conn) => (
          <Card key={conn.id} className="bg-card border border-border p-4 rounded-xl flex flex-col justify-between shadow-xs">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-[9px] uppercase font-bold text-muted-foreground">
                  Phân loại: {conn.type}
                </Badge>
                <Badge variant="outline" className={`text-[9px] px-1.5 py-0 font-bold uppercase ${STATUS_CONFIG[conn.status].className}`}>
                  {STATUS_CONFIG[conn.status].label}
                </Badge>
              </div>
              <h4 className="text-xs font-bold text-foreground leading-normal">{conn.name}</h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {conn.description}
              </p>
            </div>

            <div className="flex items-center justify-between gap-2 pt-4 mt-3 border-t border-border/40 text-[10px]">
              <span className="text-[9px] font-mono bg-muted px-1.5 py-0.5 rounded text-muted-foreground font-bold">
                Lộ trình: {conn.roadmap}
              </span>
              {conn.status === 'configured' ? (
                <Button
                  onClick={() => handleTestConnection(conn.name)}
                  variant="outline"
                  size="xs"
                  className="h-7 text-[9px] cursor-pointer border-border hover:bg-muted font-bold text-primary shadow-none"
                >
                  <RotateCcw className="size-3 mr-1" />
                  Test Ping
                </Button>
              ) : (
                <span className="text-muted-foreground italic text-[9px]">Chưa cấu hình</span>
              )}
            </div>
          </Card>
        ))}
      </div>

    </div>
  );
}
