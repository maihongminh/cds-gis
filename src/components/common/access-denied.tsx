'use client';

import * as React from 'react';
import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function AccessDenied() {
  return (
    <div className="flex w-full items-center justify-center p-4 min-h-[400px]">
      <Card className="w-full max-w-md border-border bg-card shadow-md">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <CardTitle className="text-xl font-bold tracking-tight text-foreground animate-none">
            Không có quyền truy cập
          </CardTitle>
          <CardDescription className="text-xs md:text-sm text-muted-foreground mt-1">
            Tài khoản hiện tại không được cấp quyền truy cập chức năng này.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center text-xs text-muted-foreground pt-2">
          Nếu đây là một sai sót, vui lòng liên hệ với quản trị viên hệ thống để kiểm tra lại vai trò và phạm vi tài khoản của bạn.
        </CardContent>
        <CardFooter className="flex justify-center pt-4 border-t border-border/40">
          <Button asChild size="sm" className="cursor-pointer shadow-none text-xs">
            <Link href="/dashboard">
              Quay lại Trang tổng quan
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
