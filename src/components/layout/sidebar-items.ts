import type { LucideIcon } from 'lucide-react';
import type { AppModule } from '@/types/auth';
import {
  LayoutDashboard,
  Activity,
  BarChart3,
  Bell,
  Database,
  Users,
  TrendingUp,
  Compass,
  Map,
  Sprout,
  BookOpen,
  Heart,
  Shield,
  AlertTriangle,
  FileSpreadsheet,
  ClipboardCheck,
  UserCheck,
  AppWindow,
  RotateCcw,
  Search,
  Layers,
  MapPin,
  Settings,
  Network,
  Building2,
  History,
  Server,
  Link2,
  Key,
  Sparkles,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

export type SidebarChildItem = {
  title: string;
  href: string;
  icon?: LucideIcon;
  module: AppModule;
  /** If true, only match exact pathname (no prefix matching) */
  exact?: boolean;
};

export type SidebarGroupItem = {
  type: 'group';
  title: string;
  icon: LucideIcon;
  children: SidebarChildItem[];
};

export type SidebarSingleItem = {
  type: 'single';
  title: string;
  href: string;
  icon: LucideIcon;
  module: AppModule;
};

export type SidebarItem = SidebarSingleItem | SidebarGroupItem;

// ─── Config ──────────────────────────────────────────────────────────────────

export const sidebarItems: SidebarItem[] = [
  // 1. Tổng quan & điều hành
  {
    type: 'group',
    title: 'Tổng quan & điều hành',
    icon: LayoutDashboard,
    children: [
      { title: 'Tổng quan', href: '/dashboard', icon: LayoutDashboard, module: 'dashboard' },
      { title: 'Trung tâm điều hành', href: '/dashboard/operations-center', icon: AppWindow, module: 'dashboard' },
      { title: 'Bộ chỉ số', href: '/dashboard/indicators', icon: Activity, module: 'indicators' },
      { title: 'Báo cáo', href: '/dashboard/reports', icon: BarChart3, module: 'reports' },
      { title: 'Thông báo', href: '/dashboard/notifications', icon: Bell, module: 'notifications' },
      { title: 'Trợ lý AI', href: '/dashboard/ai-assistant', icon: Sparkles, module: 'dashboard' },
    ],
  },

  // 2. Kho dữ liệu số
  {
    type: 'group',
    title: 'Kho dữ liệu số',
    icon: Database,
    children: [
      { title: 'Hành chính & Dân cư', href: '/dashboard/administrative-population', icon: Users, module: 'administrativePopulation' },
      { title: 'Kinh tế', href: '/dashboard/economy', icon: TrendingUp, module: 'economy' },
      { title: 'Du lịch & Dịch vụ', href: '/dashboard/tourism-services', icon: Compass, module: 'tourismServices' },
      { title: 'Đất đai & Quy hoạch', href: '/dashboard/land-planning', icon: Map, module: 'landPlanning' },
      { title: 'Nông nghiệp & Môi trường', href: '/dashboard/agriculture-environment', icon: Sprout, module: 'agricultureEnvironment' },
      { title: 'Giáo dục & Y tế', href: '/dashboard/education-health', icon: BookOpen, module: 'educationHealth' },
      { title: 'An sinh xã hội', href: '/dashboard/social-welfare', icon: Heart, module: 'socialWelfare' },
      { title: 'Quốc phòng - An ninh', href: '/dashboard/security-defense', icon: Shield, module: 'securityDefense' },
      { title: 'Thiên tai & Khẩn cấp', href: '/dashboard/disaster-emergency', icon: AlertTriangle, module: 'disasterEmergency' },
    ],
  },

  // 3. Quy trình dữ liệu
  {
    type: 'group',
    title: 'Quy trình dữ liệu',
    icon: ClipboardCheck,
    children: [
      { title: 'Biểu mẫu', href: '/dashboard/data-templates', icon: FileSpreadsheet, module: 'dataTemplates' },
      { title: 'Nhập/Import', href: '/dashboard/data-imports', icon: ClipboardCheck, module: 'dataImports' },
      { title: 'Phê duyệt', href: '/dashboard/data-approvals', icon: UserCheck, module: 'dataApprovals' },
      { title: 'Công bố', href: '/dashboard/data-publication', icon: AppWindow, module: 'dataPublication' },
      { title: 'Phiên bản', href: '/dashboard/data-versions', icon: RotateCcw, module: 'dataVersions' },
      { title: 'Tra cứu', href: '/dashboard/data-search', icon: Search, module: 'dataSearch' },
    ],
  },

  // 4. Bản đồ số
  {
    type: 'group',
    title: 'Bản đồ số',
    icon: Map,
    children: [
      { title: 'Bản đồ số GIS', href: '/dashboard/map', icon: Map, module: 'map', exact: true },
      { title: 'Thống kê bản đồ', href: '/dashboard/map/statistics', icon: BarChart3, module: 'map', exact: true },
      { title: 'Lớp bản đồ', href: '/dashboard/map/layers', icon: Layers, module: 'mapLayers' },
      { title: 'Đối tượng', href: '/dashboard/map/features', icon: MapPin, module: 'mapFeatures' },
    ],
  },

  // 5. Quản trị hệ thống
  {
    type: 'group',
    title: 'Quản trị hệ thống',
    icon: Settings,
    children: [
      { title: 'Người dùng', href: '/dashboard/users', icon: Users, module: 'users' },
      { title: 'Vai trò', href: '/dashboard/roles', icon: Key, module: 'roles' },
      { title: 'Đơn vị', href: '/dashboard/organizations', icon: Network, module: 'organizations' },
      { title: 'Cán bộ', href: '/dashboard/staff', icon: Building2, module: 'staff' },
      { title: 'Nhật ký hệ thống', href: '/dashboard/audit-logs', icon: History, module: 'auditLogs' },
      { title: 'Sao lưu', href: '/dashboard/backups', icon: Server, module: 'backups' },
      { title: 'Tích hợp', href: '/dashboard/integrations', icon: Link2, module: 'integrations' },
      { title: 'Cấu hình', href: '/dashboard/settings', icon: Settings, module: 'settings' },
    ],
  },
];
