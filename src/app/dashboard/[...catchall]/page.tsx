'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { Construction, ArrowLeft, Sparkles, Server } from 'lucide-react';
import { Button } from '@/components/ui';
import Link from 'next/link';

export default function CatchAllPlaceholderPage() {
  const pathname = usePathname();

  // Map path to a friendly name for displaying
  const getFriendlyModuleName = (path: string) => {
    const segment = path.split('/').pop() || '';
    switch (segment) {
      // Group 1
      case 'indicators':
        return 'Bộ chỉ số điều hành';
      
      // Group 2
      case 'administrative-population':
        return 'Phân hệ Hành chính & Dân cư';
      case 'economy':
        return 'Phân hệ Dữ liệu Kinh tế';
      case 'tourism-services':
        return 'Phân hệ Du lịch & Dịch vụ';
      case 'land-planning':
        return 'Phân hệ Đất đai & Quy hoạch';
      case 'agriculture-environment':
        return 'Phân hệ Nông nghiệp & Môi trường';
      case 'education-health':
        return 'Phân hệ Giáo dục & Y tế';
      case 'social-welfare':
        return 'Phân hệ An sinh xã hội';
      case 'disaster-emergency':
        return 'Phân hệ Thiên tai & Khẩn cấp';

      // Group 3
      case 'data-templates':
        return 'Quản lý Biểu mẫu dữ liệu';
      case 'data-imports':
        return 'Nhập dữ liệu (Import)';
      case 'data-approvals':
        return 'Quy trình Phê duyệt dữ liệu';
      case 'data-publication':
        return 'Công bộ dữ liệu chuẩn hóa';
      case 'data-versions':
        return 'Nhật ký phiên bản & Rollback';
      case 'data-search':
        return 'Tra cứu dữ liệu đa ngành';

      // Group 4
      case 'map':
        return 'Bản đồ số GIS';
      case 'layers':
        return 'Quản lý lớp bản đồ';
      case 'features':
        return 'Đối tượng không gian';

      // Group 5
      case 'roles':
        return 'Quản trị Vai trò & Quyền hạn';
      case 'organizations':
        return 'Quản trị Đơn vị hành chính';
      case 'staff':
        return 'Danh bạ Cán bộ & Công chức';
      case 'backups':
        return 'Cấu hình Sao lưu & Khôi phục';
      case 'integrations':
        return 'Cổng tích hợp dữ liệu tỉnh';
      
      default:
        return 'Tính năng hệ thống';
    }
  };

  const moduleName = getFriendlyModuleName(pathname);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-12 text-center animate-none">
      <div className="relative mb-6">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-primary/15 blur-2xl rounded-full scale-150" />
        
        {/* Icon container */}
        <div className="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-card border border-border/80 shadow-md text-primary">
          <Construction className="w-10 h-10 animate-bounce" />
          <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-yellow-500" />
        </div>
      </div>

      <div className="max-w-md space-y-3 relative">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold tracking-wide uppercase bg-primary/10 text-primary border border-primary/20">
          <Server className="w-3.5 h-3.5" />
          Tính năng đang hoàn thiện
        </div>
        
        <h1 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">
          {moduleName}
        </h1>
        
        <p className="text-xs md:text-sm text-muted-foreground leading-relaxed font-medium">
          Phân hệ dữ liệu này nằm trong đề án Hệ sinh thái Dữ liệu số Lao Bảo. Chúng tôi đang chuẩn hóa các chỉ mục dữ liệu và thiết lập cổng đồng bộ thông tin.
        </p>

        <div className="pt-6 flex flex-col sm:flex-row justify-center items-center gap-3">
          <Button asChild size="sm" variant="outline" className="cursor-pointer gap-2 text-xs">
            <Link href="/dashboard">
              <ArrowLeft className="w-4 h-4" />
              Quay lại Tổng quan
            </Link>
          </Button>
          
          <Button asChild size="sm" variant="default" className="cursor-pointer gap-2 text-xs">
            <Link href="/dashboard/settings">
              Xem Cấu hình hệ thống
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
