'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Badge } from '@/components/ui';
import { ShieldCheck, ShieldAlert, Users, Info } from 'lucide-react';

export function RoleSettingsCard() {
  const activeRoles = [
    {
      code: 'admin',
      name: 'Quản trị viên (Admin)',
      desc: 'Toàn quyền điều hành hệ thống. Quản lý tài khoản, cấu hình tham số, theo dõi nhật ký hoạt động và bảo mật.',
      color: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20',
    },
    {
      code: 'commune_officer',
      name: 'Cán bộ xã',
      desc: 'Quyền nhập liệu, cập nhật và xuất báo cáo đối với toàn bộ các phân hệ nghiệp vụ kinh tế - xã hội, nông nghiệp, tài nguyên và môi trường trên địa bàn.',
      color: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
    },
    {
      code: 'leader',
      name: 'Lãnh đạo xã',
      desc: 'Quyền giám sát, xem biểu đồ phân tích dashboard tổng quan và xuất báo cáo thống kê. Không có quyền nhập liệu trực tiếp.',
      color: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
    },
  ];

  const roadmapRoles = [
    {
      name: 'Công an xã',
      desc: 'Dành riêng cho công tác quản lý chỉ tiêu An ninh - Quốc phòng cấp xã, theo dõi biến động hộ tịch và tệ nạn xã hội.',
    },
    {
      name: 'Chỉ xem (Viewer)',
      desc: 'Dành cho các cơ quan thanh tra, kiểm tra cấp huyện hoặc sở ngành vào giám sát số liệu mà không thay đổi cấu hình.',
    },
  ];

  return (
    <Card className="border border-border bg-card shadow-sm col-span-1 lg:col-span-2">
      <CardHeader className="flex flex-row items-center gap-3">
        <Users className="size-5 text-primary shrink-0" />
        <div>
          <CardTitle className="text-base">Phân quyền & Vai trò người dùng</CardTitle>
          <CardDescription className="text-xs">
            Danh sách vai trò và quyền hạn được phân bổ trong hệ thống
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          {activeRoles.map((role) => (
            <div
              key={role.code}
              className="rounded-lg border border-border bg-muted/10 p-4 space-y-2.5 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-emerald-500 shrink-0" />
                  <Badge variant="outline" className={role.color}>
                    {role.name}
                  </Badge>
                </div>
                <p className="text-[11px] leading-relaxed text-muted-foreground">
                  {role.desc}
                </p>
              </div>
              <div className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 py-1 px-2 rounded border border-emerald-500/10 w-fit">
                Đang hoạt động (v1.1)
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-border/40 pt-4 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
            <Info className="size-4 text-muted-foreground" />
            <span>Vai trò đang lập lộ trình tích hợp (Roadmap)</span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {roadmapRoles.map((role, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-dashed border-border bg-muted/5 p-3.5 space-y-2 relative overflow-hidden"
              >
                <div className="flex items-center gap-2">
                  <ShieldAlert className="size-4 text-muted-foreground shrink-0 animate-pulse" />
                  <span className="text-xs font-semibold text-foreground">{role.name}</span>
                  <Badge variant="secondary" className="text-[9px] px-1 py-0 shadow-none border-border">
                    Roadmap
                  </Badge>
                </div>
                <p className="text-[11px] leading-relaxed text-muted-foreground">
                  {role.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
