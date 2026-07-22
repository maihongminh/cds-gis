'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTenant } from '@/components/layout/tenant-context';
import { MOCK_HOUSEHOLDS } from '@/data/mock-households';
import { PageHeader } from '@/components/common';
import { Breadcrumbs } from '@/components/common';
import { CommonTabs } from '@/components/common';
import { HouseholdOverviewTab } from './components/household-overview-tab';
import { HouseholdProductionTab } from './components/household-production-tab';
import { HouseholdEconomyTab } from './components/household-economy-tab';
import { HouseholdLandTab } from './components/household-land-tab';
import { HouseholdHistoryTab } from './components/household-history-tab';
import { Button } from '@/components/ui';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui';
import { Input } from '@/components/ui';
import { Label } from '@/components/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { ChevronLeft, Edit, Printer, Trash, ShieldAlert, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

interface HouseholdDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function HouseholdDetailPage({ params }: HouseholdDetailPageProps) {
  const router = useRouter();
  const { id } = React.use(params);
  const { hamlets } = useTenant();

  // Find target household
  const household = React.useMemo(() => {
    return MOCK_HOUSEHOLDS.find((h) => h.id === id);
  }, [id]);

  // Edit Form State
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [name, setName] = React.useState(household?.headName || '');
  const [phone, setPhone] = React.useState(household?.phone || '');
  const [members, setMembers] = React.useState(String(household?.memberCount || 4));
  const [labors, setLabors] = React.useState(String(household?.agriculturalLaborCount || 2));
  const [status, setStatus] = React.useState(household?.status || 'active');

  if (!household) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Breadcrumbs />
        <div className="flex flex-col items-center justify-center text-center p-12 border border-dashed border-border/80 rounded-xl bg-card">
          <ShieldAlert className="w-10 h-10 text-destructive mb-3" />
          <h3 className="text-base font-bold text-foreground">Không tìm thấy dữ liệu hộ dân</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-xs">
            Mã định danh hồ sơ không tồn tại hoặc đã bị xóa khỏi hệ thống tạm thời.
          </p>
          <Button asChild size="sm" className="mt-5 cursor-pointer shadow-none">
            <Link href="/dashboard/households">
              <ArrowLeft className="size-4.5" />
              Quay lại danh sách
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      toast.error('Họ tên chủ hộ không được để trống');
      return;
    }

    toast.success('Đã cập nhật hồ sơ hộ dân!', {
      description: `Thay đổi thông tin hộ ${household.code} thành công.`,
    });
    setIsEditOpen(false);
  };

  const handleDelete = () => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa vĩnh viễn hồ sơ hộ dân ${household.headName} (${household.code})?`)) {
      toast.success(`Đã xóa hộ dân ${household.code} thành công!`);
      router.push('/dashboard/households');
    }
  };

  const handlePrint = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1200)),
      {
        loading: 'Đang chuẩn bị bản in hồ sơ...',
        success: 'Trình biên xuất hoàn thành! Đã mở cửa sổ in.',
        error: 'Lỗi in.',
      }
    );
  };

  const actions = (
    <div className="flex items-center gap-2">
      {/* 1. Edit Dialog Trigger */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="h-9 px-3 text-xs bg-card border-border hover:bg-muted cursor-pointer shadow-none">
            <Edit className="size-4 text-muted-foreground" />
            Chỉnh sửa
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold">Chỉnh sửa hồ sơ: {household.code}</DialogTitle>
            <DialogDescription className="text-xs">
              Cập nhật thông tin chi tiết nhân khẩu học và trạng thái vận hành của hộ.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="name" className="text-xs">Họ tên chủ hộ <span className="text-destructive">*</span></Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="h-9 text-xs" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="phone" className="text-xs">Số điện thoại liên hệ</Label>
                <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="h-9 text-xs" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="members" className="text-xs">Số nhân khẩu</Label>
                <Input id="members" type="number" min="1" value={members} onChange={(e) => setMembers(e.target.value)} className="h-9 text-xs" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="labors" className="text-xs">Lao động nông nghiệp</Label>
                <Input id="labors" type="number" min="0" value={labors} onChange={(e) => setLabors(e.target.value)} className="h-9 text-xs" />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <Label htmlFor="status" className="text-xs">Trạng thái hồ sơ</Label>
                <Select value={status} onValueChange={(val) => setStatus(val as 'active' | 'changed' | 'archived')}>
                  <SelectTrigger id="status" className="h-9 text-xs bg-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border text-xs">
                    <SelectItem value="active" className="cursor-pointer">Đang hoạt động (Active)</SelectItem>
                    <SelectItem value="changed" className="cursor-pointer">Có biến động kinh tế (Changed)</SelectItem>
                    <SelectItem value="archived" className="cursor-pointer">Lưu trữ (Archived)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" size="sm" className="cursor-pointer shadow-none text-xs">Hủy</Button>
              </DialogClose>
              <Button type="submit" size="sm" className="cursor-pointer shadow-none text-xs">Lưu thay đổi</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 2. Print Payout Trigger */}
      <Button variant="outline" size="sm" onClick={handlePrint} className="h-9 px-3 text-xs bg-card border-border hover:bg-muted cursor-pointer shadow-none">
        <Printer className="size-4 text-muted-foreground" />
        In hồ sơ
      </Button>

      {/* 3. Delete Trigger */}
      <Button variant="outline" size="sm" onClick={handleDelete} className="h-9 px-3 text-xs text-destructive border-border hover:bg-destructive/10 cursor-pointer shadow-none">
        <Trash className="size-4 text-destructive" />
        Xóa
      </Button>
    </div>
  );

  // Define tab items for detail pages
  const detailTabs = [
    { value: 'overview', label: 'Tổng quan', content: <HouseholdOverviewTab household={household} /> },
    { value: 'production', label: 'Sản xuất', content: <HouseholdProductionTab householdId={household.id} /> },
    { value: 'economy', label: 'Kinh tế hộ', content: <HouseholdEconomyTab householdId={household.id} /> },
    { value: 'land', label: 'Đất đai', content: <HouseholdLandTab householdId={household.id} /> },
    { value: 'history', label: 'Lịch sử biến động', content: <HouseholdHistoryTab household={household} /> },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Dynamic breadcrumb trail */}
      <Breadcrumbs />

      {/* Back button link */}
      <div className="flex items-center">
        <Button asChild variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground cursor-pointer shadow-none pl-0">
          <Link href="/dashboard/households">
            <ChevronLeft className="size-4" />
            Quay lại danh sách hộ dân
          </Link>
        </Button>
      </div>

      {/* Detail header */}
      <PageHeader
        title={household.headName}
        description={`Mã hộ khẩu: ${household.code} — Địa bàn cư trú: ${household.hamletName}`}
        actions={actions}
      />

      {/* Tab Panels content */}
      <CommonTabs tabs={detailTabs} defaultValue="overview" />
    </div>
  );
}
