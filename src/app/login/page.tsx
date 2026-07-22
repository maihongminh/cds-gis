'use client';

import {
    Button, Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle, Input, Label, Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui';
import { APP_CONFIG } from '@/lib/app-config';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = React.useState('admin');
  const [username, setUsername] = React.useState('admin');
  const [password, setPassword] = React.useState('••••••••');
  const [loading, setLoading] = React.useState(false);

  // Update the default username when the role changes for better UI feedback
  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
    setUsername(role);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Set mock cookies for app_sid and app_role
    document.cookie = `app_sid=demo-session; path=/; max-age=86400`;
    document.cookie = `app_role=${encodeURIComponent(selectedRole)}; path=/; max-age=86400`;
    document.cookie = `app_hamlet_code=; path=/; max-age=0`;

    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 600);
  };

  return (
    <div className="flex min-h-svh items-center justify-center p-4 bg-background text-foreground font-sans relative">
      <div className="absolute top-6 left-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-semibold transition-colors cursor-pointer"
        >
          <ArrowLeft className="size-4" />
          Quay lại trang chủ
        </Link>
      </div>

      <Card className="w-full max-w-lg border-border bg-card shadow-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Logo" width={64} height={64} className="w-16 h-16 object-contain" />
          </div>
          <CardTitle className="text-xl md:text-2xl font-bold tracking-tight text-foreground animate-none">
            {APP_CONFIG.nameLine1}
          </CardTitle>
          <CardDescription className="text-xs md:text-sm text-muted-foreground mt-1 flex flex-col gap-1">
            <span>{APP_CONFIG.nameLine2}</span>
            <span className="text-[11px] opacity-80">Đăng nhập hệ thống quản lý dữ liệu kinh tế – xã hội cấp xã.</span>
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {/* Username Input */}
            <div className="space-y-2">
              <Label htmlFor="username">Tài khoản</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="bg-card border-border shadow-none h-9 text-xs"
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-card border-border shadow-none h-9 text-xs"
              />
            </div>

            {/* Role Select Dropdown */}
            <div className="space-y-2">
              <Label htmlFor="role">Vai trò đăng nhập (Demo)</Label>
              <Select value={selectedRole} onValueChange={handleRoleChange}>
                <SelectTrigger id="role" className="bg-card border-border shadow-none cursor-pointer h-9 text-xs min-w-50">
                  <SelectValue placeholder="Chọn vai trò" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border space-y-2">
                  <SelectItem value="admin" className="cursor-pointer text-xs">Quản trị viên (Admin)</SelectItem>
                  <SelectItem value="data_officer" className="cursor-pointer text-xs">Cán bộ nhập liệu</SelectItem>
                  <SelectItem value="unit_leader" className="cursor-pointer text-xs">Lãnh đạo đơn vị</SelectItem>
                  <SelectItem value="data_governance" className="cursor-pointer text-xs">Cán bộ Văn phòng UBND</SelectItem>
                  <SelectItem value="commune_leader" className="cursor-pointer text-xs">Lãnh đạo xã (UBND/HĐND)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>

          <CardFooter className="pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-10 font-semibold text-xs cursor-pointer shadow-none"
            >
              {loading ? 'Đang kết nối hệ thống...' : 'Đăng nhập hệ thống'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
