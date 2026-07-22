// src/app/forgot-password/page.tsx

'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, AlertCircle, CheckCircle } from 'lucide-react';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from '@/components/ui';
import { toast } from 'sonner';
import { APP_CONFIG } from '@/lib/app-config';

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Vui lòng nhập địa chỉ email.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success('Đã gửi liên kết khôi phục mật khẩu!', {
        description: `Một email hướng dẫn đã được gửi tới ${email}.`
      });
    }, 1000);
  };

  return (
    <div className="flex min-h-svh items-center justify-center p-4 bg-background text-foreground font-sans relative">
      <div className="absolute top-6 left-6">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-semibold transition-colors cursor-pointer"
        >
          <ArrowLeft className="size-4" />
          Quay lại Đăng nhập
        </Link>
      </div>

      <Card className="w-full max-w-md border-border bg-card shadow-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Logo" width={56} height={56} className="w-14 h-14 object-contain" />
          </div>
          <CardTitle className="text-xl font-bold tracking-tight text-foreground">
            Quên mật khẩu?
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground mt-1">
            {APP_CONFIG.nameLine1} - {APP_CONFIG.nameLine2}
          </CardDescription>
        </CardHeader>

        {!submitted ? (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-primary/5 border border-primary/20 p-3 flex gap-2 items-start text-xs text-primary/80">
                <AlertCircle className="size-4 shrink-0 mt-0.5" />
                <span>Nhập địa chỉ email công vụ của bạn. Hệ thống sẽ gửi một liên kết bảo mật để đặt lại mật khẩu của tài khoản cán bộ.</span>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email công vụ</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@laobao.gov.vn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-9 bg-card border-border shadow-none h-9 text-xs"
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-9 font-semibold text-xs cursor-pointer shadow-none"
              >
                {loading ? 'Đang xử lý...' : 'Gửi liên kết đặt lại mật khẩu'}
              </Button>
            </CardFooter>
          </form>
        ) : (
          <CardContent className="space-y-4 text-center py-6">
            <div className="flex justify-center">
              <CheckCircle className="size-12 text-emerald-500" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-foreground">Kiểm tra hộp thư điện tử</h3>
              <p className="text-xs text-muted-foreground">
                Chúng tôi đã gửi một email hướng dẫn đến địa chỉ <strong className="text-foreground">{email}</strong>. Vui lòng kiểm tra hộp thư đến (hoặc thư rác).
              </p>
            </div>
            <Button
              asChild
              variant="outline"
              className="w-full mt-4 h-9 text-xs cursor-pointer shadow-none"
            >
              <Link href="/login">
                Quay lại trang Đăng nhập
              </Link>
            </Button>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
