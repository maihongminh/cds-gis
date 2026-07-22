'use client';

import { useTenant } from '@/components/layout/tenant-context';
import { Avatar, AvatarFallback, Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label, Separator } from '@/components/ui';
import { ROLE_LABELS, canPerform, canAccessModule } from '@/lib/rbac';
import { MOCK_USERS } from '@/data/mock-users';
import { UserRole } from '@/types/auth';
import {
  CheckCircle2,
  Globe,
  KeyRound,
  Laptop,
  Lock,
  Save,
  Shield,
  ShieldCheck,
  User,
  XCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/common';

export default function ProfilePage() {
  const router = useRouter();
  const { currentRole, selectedHamletCode, hamlets } = useTenant();
  const role = (currentRole as UserRole) || 'commune_leader';

  // Active tab state in the left sidebar
  const [activeTab, setActiveTab] = React.useState<'profile' | 'rbac' | 'security'>('profile');

  // Form states
  const [fullName, setFullName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('0912 345 678');
  const [org, setOrg] = React.useState('Ủy ban nhân dân xã Lao Bảo');

  // Password reset simulation states
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  const getRoleName = (r: UserRole) => {
    return ROLE_LABELS[r] || r;
  };

  const getRoleAbbr = (r: UserRole) => {
    if (r === 'admin') return 'AD';
    if (r === 'data_officer') return 'CB';
    if (r === 'unit_leader') return 'LT';
    if (r === 'data_governance') return 'VP';
    if (r === 'commune_leader') return 'LĐ';
    return 'CX';
  };

  const getUserName = (r: UserRole) => {
    const user = MOCK_USERS.find(u => u.role === r);
    return user?.fullName ?? 'Người dùng demo';
  };

  const getUserEmail = (r: UserRole) => {
    const user = MOCK_USERS.find(u => u.role === r);
    return user?.email ?? `${r.replace('_', '.')}@laobao.gov.vn`;
  };

  const getRoleBadgeVariant = (r: UserRole) => {
    if (r === 'admin') return 'destructive';
    if (r === 'data_officer') return 'default';
    if (r === 'unit_leader') return 'secondary';
    if (r === 'data_governance') return 'outline';
    if (r === 'commune_leader') return 'secondary';
    return 'outline';
  };

  // Sync profile details if role changes
  React.useEffect(() => {
    setFullName(getUserName(role));
    setEmail(getUserEmail(role));
    setOrg('Ủy ban nhân dân xã Lao Bảo');
  }, [role]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Cập nhật thông tin tài khoản thành công!');
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Mật khẩu mới không trùng khớp!');
      return;
    }
    toast.success('Đã thay đổi mật khẩu hệ thống thành công!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  // Check action permission (rbac.ts logic visualization)
  const isActionAllowed = (actionKey: string) => {
    return canPerform(role, 'administrativePopulation', actionKey as any);
  };

  // Check module permission
  const isModuleAllowed = (modKey: string) => {
    // Map settings keys to AppModules
    const map: Record<string, any> = {
      catalogs: 'settings',
      households: 'administrativePopulation',
      crops: 'agricultureEnvironment',
      livestock: 'agricultureEnvironment',
      lands: 'landPlanning',
      householdEconomy: 'economy',
      forestDvmtr: 'agricultureEnvironment',
      auditLogs: 'auditLogs',
    };
    const target = map[modKey] || modKey;
    return canAccessModule(role, target);
  };

  return (
    <div className="space-y-6 pb-10 animate-fade-in">
      {/* Main Shadcn Settings Header */}
      <PageHeader
        title="Thiết lập tài khoản"
        description="Quản lý thông tin định danh, cấu hình bảo mật và giám sát phân quyền nghiệp vụ xã Lao Bảo."
      />

      {/* Shadcn Settings Layout (2 columns: Sidebar Navigation + Active Content) */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left column: Navigation Menu & Mini User Profile */}
        <aside className="w-full lg:w-60 shrink-0 space-y-6">
          {/* User mini profile card */}
          <div className="rounded-xl border border-border bg-card p-4.5 text-center shadow-2xs space-y-4">
            <div className="flex justify-center">
              <Avatar className="w-16 h-16 border-2 border-border shadow-2xs">
                <AvatarFallback className="text-lg font-bold bg-primary/10 text-primary uppercase animate-none">
                  {getRoleAbbr(role)}
                </AvatarFallback>
              </Avatar>
            </div>
            <div>
              <h3 className="text-xs font-bold text-foreground truncate">{fullName}</h3>
              <p className="text-[10px] text-muted-foreground truncate mt-0.5">{email}</p>
            </div>
            <div className="flex justify-center">
              <Badge variant={getRoleBadgeVariant(role)} className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                {getRoleName(role)}
              </Badge>
            </div>
          </div>

          {/* Navigation Sidebar Buttons */}
          <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 border-b lg:border-b-0 border-border">
            <button
              onClick={() => setActiveTab('profile')}
              className={`
                flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg transition-all text-left whitespace-nowrap cursor-pointer w-full
                ${activeTab === 'profile'
                  ? 'bg-primary/5 text-primary'
                  : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
                }
              `}
            >
              <User className="w-4 h-4 shrink-0" />
              <span>Thông tin cá nhân</span>
            </button>
            <button
              onClick={() => setActiveTab('rbac')}
              className={`
                flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg transition-all text-left whitespace-nowrap cursor-pointer w-full
                ${activeTab === 'rbac'
                  ? 'bg-primary/5 text-primary'
                  : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
                }
              `}
            >
              <Shield className="w-4 h-4 shrink-0" />
              <span>Phân quyền hệ thống</span>
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`
                flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg transition-all text-left whitespace-nowrap cursor-pointer w-full
                ${activeTab === 'security'
                  ? 'bg-primary/5 text-primary'
                  : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
                }
              `}
            >
              <Lock className="w-4 h-4 shrink-0" />
              <span>Bảo mật & Hoạt động</span>
            </button>
          </nav>
        </aside>

        {/* Right column: Form Content / Panel details */}
        <div className="flex-1 max-w-3xl">
          {activeTab === 'profile' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-bold text-foreground">Hồ sơ cá nhân</CardTitle>
                <CardDescription className="text-xs">Thông tin liên lạc và chức vụ của cán bộ vận hành hệ thống</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveProfile} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-1.5">
                      <Label htmlFor="profile-fullname" className="text-xs font-bold text-foreground">Họ và tên cán bộ</Label>
                      <Input
                        id="profile-fullname"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        placeholder="Nhập họ và tên..."
                        className="bg-background border-border text-xs h-9 shadow-none focus-visible:ring-primary focus-visible:border-primary"
                      />
                      <p className="text-[10px] text-muted-foreground">Tên của bạn sẽ được hiển thị trên báo cáo kê khai.</p>
                    </div>

                    <div className="grid gap-1.5">
                      <Label htmlFor="profile-email" className="text-xs font-bold text-foreground">Địa chỉ Email công vụ</Label>
                      <Input
                        id="profile-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="email@tra-tap.gov.vn"
                        className="bg-background border-border text-xs h-9 shadow-none focus-visible:ring-primary focus-visible:border-primary"
                      />
                      <p className="text-[10px] text-muted-foreground">Địa chỉ email để nhận thông báo khẩn cấp hệ thống.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-1.5">
                      <Label htmlFor="profile-phone" className="text-xs font-bold text-foreground">Số điện thoại liên lạc</Label>
                      <Input
                        id="profile-phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        placeholder="09xx xxx xxx"
                        className="bg-background border-border text-xs h-9 shadow-none focus-visible:ring-primary focus-visible:border-primary"
                      />
                      <p className="text-[10px] text-muted-foreground">Số điện thoại liên lạc khẩn cấp khi gieo trồng có dịch hại.</p>
                    </div>

                    <div className="grid gap-1.5">
                      <Label htmlFor="profile-org" className="text-xs font-bold text-foreground">Đơn vị / Chi bộ trực thuộc</Label>
                      <Input
                        id="profile-org"
                        value={org}
                        onChange={(e) => setOrg(e.target.value)}
                        required
                        placeholder="UBND xã Lao Bảo..."
                        className="bg-background border-border text-xs h-9 shadow-none focus-visible:ring-primary focus-visible:border-primary"
                      />
                      <p className="text-[10px] text-muted-foreground">Cơ quan trực tiếp phụ trách thu thập số liệu.</p>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-border/60">
                    <Button id="btn-save-profile" type="submit" size="sm" className="h-9 text-xs px-4 cursor-pointer font-medium">
                      <Save className="size-4" />
                      Lưu thông tin cá nhân
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {activeTab === 'rbac' && (
            <div className="space-y-6">
              {/* Security Header Banner */}
              <Card className="border-border bg-card shadow-2xs">
                <CardHeader>
                  <CardTitle className="text-sm font-bold text-foreground">Phân quyền nghiệp vụ (RBAC)</CardTitle>
                  <CardDescription className="text-xs">
                    Vai trò hiện tại của bạn là <strong className="text-foreground font-semibold">{getRoleName(role)}</strong>. Hãy tham khảo bảng quyền hạn bên dưới.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Operation Access Actions Grid */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-primary" />
                      Quyền thao tác dữ liệu nông nghiệp
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {[
                        { key: 'view', name: 'Xem dữ liệu' },
                        { key: 'create', name: 'Thêm mới' },
                        { key: 'update', name: 'Cập nhật/Sửa' },
                        { key: 'delete', name: 'Xóa vĩnh viễn' },
                        { key: 'import', name: 'Nhập tệp (Import)' },
                        { key: 'export', name: 'Xuất tệp (Export)' },
                      ].map((act) => {
                        const allowed = isActionAllowed(act.key);
                        return (
                          <div
                            key={act.key}
                            className={`flex items-center gap-2 p-2.5 border rounded-lg transition-colors ${allowed
                              ? 'bg-emerald-500/5 border-emerald-500/25 text-emerald-700 dark:text-emerald-400'
                              : 'bg-muted/10 border-border/30 text-muted-foreground/50 opacity-60'
                              }`}
                          >
                            {allowed ? (
                              <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                            ) : (
                              <XCircle className="size-4 text-muted-foreground/30 shrink-0" />
                            )}
                            <span className="text-[11px] font-medium leading-none">{act.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <Separator className="bg-border/60" />

                  {/* Modules Permissions breakdown */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <Globe className="w-4 h-4 text-primary" />
                      Phạm vi chức năng nghiệp vụ xã
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        { key: 'dashboard', name: 'Bảng điều khiển', desc: 'Xem biểu đồ tổng quan, KPI thống kê xã Lao Bảo' },
                        { key: 'catalogs', name: 'Quản lý Danh mục', desc: 'Quản lý danh mục cây trồng, vật nuôi, đơn vị hành chính' },
                        { key: 'households', name: 'Quản lý Hộ dân', desc: 'Kê khai thông tin hộ gia đình, nhân khẩu, hoàn cảnh' },
                        { key: 'crops', name: 'Dữ liệu Cây trồng', desc: 'Diện tích, năng suất, loại hình gieo trồng cây nông/lâm nghiệp' },
                        { key: 'livestock', name: 'Dữ liệu Chăn nuôi', desc: 'Thống kê đàn gia súc, gia cầm, tình hình dịch bệnh' },
                        { key: 'lands', name: 'Quản lý Đất đai', desc: 'Bản đồ, loại đất sử dụng, chủ sở hữu, hiện trạng sử dụng' },
                        { key: 'householdEconomy', name: 'Kinh tế Hộ gia đình', desc: 'Thu nhập, chi tiêu, các khoản vay và mức sống hộ nghèo' },
                        { key: 'forestDvmtr', name: 'Rừng & Chi trả DVMTR', desc: 'Quản lý diện tích rừng bảo vệ và chi trả dịch vụ môi trường rừng' },
                        { key: 'reports', name: 'Báo cáo Thống kê', desc: 'Xuất các biểu mẫu tổng hợp dữ liệu nông nghiệp cấp xã/thôn' },
                        { key: 'users', name: 'Quản lý Tài khoản', desc: 'Cấp tài khoản, phân quyền cán bộ xã/thôn' },
                        { key: 'auditLogs', name: 'Nhật ký Hệ thống', desc: 'Theo dõi lịch sử truy cập, thay đổi dữ liệu của cán bộ' },
                        { key: 'settings', name: 'Cấu hình Hệ thống', desc: 'Thiết lập định mức hỗ trợ, chu kỳ gieo trồng, sao lưu' },
                      ].map((mod) => {
                        const allowed = isModuleAllowed(mod.key);
                        return (
                          <div
                            key={mod.key}
                            className={`flex items-start gap-2.5 p-3 border rounded-xl transition-all duration-200 ${allowed
                              ? 'bg-card border-border hover:border-primary/20 hover:shadow-2xs'
                              : 'bg-muted/10 border-border/30 opacity-50'
                              }`}
                          >
                            <div className="mt-0.5 shrink-0">
                              {allowed ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                              ) : (
                                <XCircle className="w-4 h-4 text-muted-foreground/30" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs font-semibold ${allowed ? 'text-foreground' : 'text-muted-foreground line-through'}`}>
                                {mod.name}
                              </p>
                              <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">{mod.desc}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              {/* Security Form Card */}
              <Card className="border-border bg-card shadow-2xs">
                <CardHeader>
                  <CardTitle className="text-sm font-bold text-foreground">Đổi mật khẩu tài khoản</CardTitle>
                  <CardDescription className="text-xs">Để đảm bảo an toàn thông tin, khuyến cáo thay đổi mật khẩu định kỳ 3 tháng</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdatePassword} className="space-y-4">
                    <div className="grid gap-1.5">
                      <Label htmlFor="current-pass" className="text-xs font-bold text-foreground">Mật khẩu hiện tại</Label>
                      <Input
                        id="current-pass"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                        className="bg-background border-border text-xs h-9 shadow-none focus-visible:ring-primary focus-visible:border-primary"
                      />
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="new-pass" className="text-xs font-bold text-foreground">Mật khẩu mới</Label>
                      <Input
                        id="new-pass"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="bg-background border-border text-xs h-9 shadow-none focus-visible:ring-primary focus-visible:border-primary"
                      />
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="confirm-pass" className="text-xs font-bold text-foreground">Xác nhận mật khẩu mới</Label>
                      <Input
                        id="confirm-pass"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="bg-background border-border text-xs h-9 shadow-none focus-visible:ring-primary focus-visible:border-primary"
                      />
                    </div>
                    <div className="flex justify-end pt-4 border-t border-border/60">
                      <Button id="btn-change-password" type="submit" size="sm" className="h-9 text-xs px-4 cursor-pointer font-medium">
                        <KeyRound className="size-4" />
                        Đổi mật khẩu
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Login Session Activity logs */}
              <Card className="border-border bg-card shadow-2xs">
                <CardHeader>
                  <CardTitle className="text-sm font-bold flex items-center gap-2 text-foreground">
                    <Laptop className="size-4 text-primary" />
                    Lịch sử đăng nhập & thiết bị
                  </CardTitle>
                  <CardDescription className="text-xs">Theo dõi lịch sử truy cập gần đây của tài khoản của bạn</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-border/60">
                    {[
                      { event: 'Phiên hoạt động hiện tại (Đăng nhập hệ thống)', time: '10 phút trước', ip: '192.168.1.15', device: 'Chrome / Windows 11', current: true },
                      { event: 'Xem dữ liệu Hộ dân & Cây trồng', time: '1 giờ trước', ip: '192.168.1.15', device: 'Chrome / Windows 11', current: false },
                      { event: 'Xuất tệp Báo cáo DVMTR Quý 1/2026', time: '1 ngày trước', ip: '113.161.45.2', device: 'Firefox / macOS', current: false },
                      { event: 'Đăng nhập hệ thống', time: '5 ngày trước', ip: '113.161.45.2', device: 'Chrome / Android', current: false },
                    ].map((log, index) => (
                      <div key={index} className="p-4.5 flex flex-col gap-2 hover:bg-muted/5 transition-colors">
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-foreground leading-snug">{log.event}</span>
                            {log.current && (
                              <Badge variant="default" className="text-[8px] bg-emerald-500 text-white hover:bg-emerald-600 px-1.5 py-0 rounded-full h-4 font-bold shrink-0">
                                Đang trực tuyến
                              </Badge>
                            )}
                          </div>
                          <span className="text-[9px] text-muted-foreground shrink-0 mt-0.5">{log.time}</span>
                        </div>
                        <div className="flex flex-wrap items-center justify-between text-[10px] text-muted-foreground gap-2">
                          <span className="flex items-center gap-1">
                            <Globe className="size-4 text-muted-foreground/60" />
                            Địa chỉ IP: {log.ip}
                          </span>
                          <span className="truncate max-w-[200px]" title={log.device}>{log.device}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
