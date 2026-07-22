'use client';

import { useState, useEffect } from 'react';
import { Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { FormDialog } from '@/components/common';
import { User, UserRole } from '@/types/user';
import { getRoleLabel } from '@/lib/rbac';
import { MOCK_HAMLETS } from '@/data/mock-administrative-units';
import { toast } from 'sonner';

const USER_ROLES: UserRole[] = ['admin', 'data_officer', 'unit_leader', 'data_governance', 'commune_leader'];

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingUser?: User | null;
  onSave?: (userData: Partial<User>) => void;
}

export function UserFormDialog({ open, onOpenChange, editingUser, onSave }: UserFormDialogProps) {
  const isEdit = !!editingUser;
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('data_officer');
  const [hamletCode, setHamletCode] = useState('');

  useEffect(() => {
    if (editingUser) {
      setFullName(editingUser.fullName);
      setEmail(editingUser.email);
      setPhone(editingUser.phone);
      setRole(editingUser.role);
      setHamletCode(editingUser.scope?.allowedVillageCodes?.[0] ?? '');
    } else {
      setFullName('');
      setEmail('');
      setPhone('');
      setRole('data_officer');
      setHamletCode('');
    }
  }, [editingUser, open]);

  // Reset hamletCode if role is not data_officer
  useEffect(() => {
    if (role !== 'data_officer') {
      setHamletCode('');
    } else if (!hamletCode && MOCK_HAMLETS.length > 0) {
      setHamletCode(MOCK_HAMLETS[0].code);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc.');
      return;
    }

    if (role === 'data_officer' && !hamletCode) {
      toast.error('Vui lòng chọn thôn phụ trách.');
      return;
    }

    const userData: Partial<User> = {
      fullName,
      email,
      phone,
      role,
      scope: {
        organizationUnitIds: role === 'data_officer' || role === 'unit_leader' ? ['unit-eco'] : ['unit-ubnd'],
        allowedDataGroups: role === 'data_officer' ? ['economy', 'agriculture_environment'] : [],
        allowedVillageCodes: role === 'data_officer' && hamletCode ? [hamletCode] : ['all'],
        maxSecurityLevel: role === 'admin' || role === 'data_governance' || role === 'commune_leader' ? 'confidential' : 'shared',
      }
    };

    if (onSave) {
      onSave(userData);
    } else {
      toast.success(isEdit ? `Đã cập nhật tài khoản "${fullName}"` : `Đã tạo tài khoản "${fullName}"`);
    }

    onOpenChange(false);
  }

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? 'Chỉnh sửa tài khoản' : 'Tạo tài khoản mới'}
      description="Điền thông tin tài khoản người dùng hệ thống. Mật khẩu mặc định sẽ được gửi qua email."
      submitText={isEdit ? 'Lưu thay đổi' : 'Tạo tài khoản'}
      onSubmit={handleSubmit}
      maxWidthClass="max-w-[450px]"
    >
      <div className="grid gap-1.5">
        <Label htmlFor="user-fullname">Họ và tên *</Label>
        <Input
          id="user-fullname"
          placeholder="Nhập họ và tên..."
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="user-email">Email *</Label>
        <Input
          id="user-email"
          type="email"
          placeholder="email@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="user-phone">Số điện thoại</Label>
        <Input
          id="user-phone"
          placeholder="09xxxxxxxx"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="user-role">Vai trò *</Label>
        <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
          <SelectTrigger id="user-role">
            <SelectValue placeholder="Chọn vai trò" />
          </SelectTrigger>
          <SelectContent>
            {USER_ROLES.map((r) => (
              <SelectItem key={r} value={r}>
                {getRoleLabel(r)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {role === 'data_officer' && (
        <div className="grid gap-1.5 animate-fadeIn">
          <Label htmlFor="user-hamlet">Thôn phụ trách *</Label>
          <Select value={hamletCode} onValueChange={setHamletCode}>
            <SelectTrigger id="user-hamlet">
              <SelectValue placeholder="Chọn thôn phụ trách" />
            </SelectTrigger>
            <SelectContent>
              {MOCK_HAMLETS.map((h) => (
                <SelectItem key={h.code} value={h.code}>
                  {h.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </FormDialog>
  );
}
