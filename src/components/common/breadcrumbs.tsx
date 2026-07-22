'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

const SEGMENT_TRANSLATIONS: Record<string, string> = {
  dashboard: 'Bảng điều khiển',
  indicators: 'Bộ chỉ số',
  reports: 'Báo cáo & Phân tích',
  notifications: 'Thông báo',
  'administrative-population': 'Hành chính & Dân cư',
  economy: 'Kinh tế',
  'tourism-services': 'Du lịch & Dịch vụ',
  'land-planning': 'Đất đai & Quy hoạch',
  'agriculture-environment': 'Nông nghiệp & Môi trường',
  'education-health': 'Giáo dục & Y tế',
  'social-welfare': 'An sinh xã hội',
  'security-defense': 'An ninh – Quốc phòng',
  'disaster-emergency': 'Thiên tai & Khẩn cấp',
  'data-templates': 'Biểu mẫu dữ liệu',
  'data-imports': 'Nhập dữ liệu',
  'data-approvals': 'Phê duyệt dữ liệu',
  'data-publication': 'Công bố dữ liệu',
  'data-versions': 'Phiên bản dữ liệu',
  'data-search': 'Tra cứu đa ngành',
  map: 'Bản đồ số GIS',
  layers: 'Lớp bản đồ',
  features: 'Đối tượng không gian',
  users: 'Người dùng',
  roles: 'Vai trò & Quyền hạn',
  organizations: 'Đơn vị hành chính',
  staff: 'Cán bộ & Công chức',
  'audit-logs': 'Nhật ký hệ thống',
  backups: 'Sao lưu & Khôi phục',
  integrations: 'Tích hợp dữ liệu',
  settings: 'Cấu hình hệ thống',
  new: 'Thêm mới',
  edit: 'Chỉnh sửa',
  details: 'Chi tiết',
};

function formatSegmentName(segment: string): string {
  // Translate standard segments
  if (SEGMENT_TRANSLATIONS[segment]) {
    return SEGMENT_TRANSLATIONS[segment];
  }

  // Format ID-like segments (e.g. hh-12, crop-34, land-102)
  if (segment.includes('-') && (segment.startsWith('hh-') || segment.startsWith('crop-') || segment.startsWith('live-') || segment.startsWith('land-') || segment.startsWith('forest-') || segment.startsWith('econ-') || segment.startsWith('rep-') || segment.startsWith('log-'))) {
    const parts = segment.split('-');
    const idNum = parts[parts.length - 1];
    return `#${idNum}`;
  }

  // Fallback to capitalizing words
  return segment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function Breadcrumbs() {
  // Breadcrumbs are currently disabled globally. Return null to hide them from all pages.
  // To re-enable, simply remove or comment out the return statement below.
  return null;

  const pathname = usePathname();
  if (!pathname || pathname === '/') return null;

  const segments = pathname.split('/').filter(Boolean);

  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-xs font-medium text-muted-foreground mb-4">
      <ol className="flex items-center gap-1.5 flex-wrap">
        <li className="flex items-center">
          <Link
            href="/dashboard"
            className="flex items-center gap-1 hover:text-foreground transition-colors"
          >
            <Home className="size-4" />
            <span className="sr-only">Trang chủ</span>
          </Link>
        </li>

        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1;
          const href = `/${segments.slice(0, index + 1).join('/')}`;
          const label = formatSegmentName(segment);

          // If the page is "dashboard", skip rendering since it's covered by the Home icon
          if (segment === 'dashboard' && index === 0) return null;

          return (
            <React.Fragment key={href}>
              <li className="flex items-center text-muted-foreground/40">
                <ChevronRight className="size-4" />
              </li>
              <li className="flex items-center">
                {isLast ? (
                  <span className="font-semibold text-foreground truncate max-w-[150px] sm:max-w-xs" aria-current="page">
                    {label}
                  </span>
                ) : (
                  <Link
                    href={href}
                    className="hover:text-foreground transition-colors truncate max-w-[150px] sm:max-w-xs"
                  >
                    {label}
                  </Link>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
