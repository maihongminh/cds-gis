'use client';

import { useState, useMemo } from 'react';
import { MOCK_USERS } from '@/data/mock-users';
import { User } from '@/types/user';
import { UsersHeader } from './components/users-header';
import { UsersFilters } from './components/users-filters';
import { UsersTable } from './components/users-table';
import { UserFormDialog } from './components/user-form-dialog';
import { ConfirmDialog } from '@/components/common';
import { toast } from 'sonner';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formOpen, setFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Confirm dialog state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState('');
  const [confirmDescription, setConfirmDescription] = useState('');
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
  const [confirmVariant, setConfirmVariant] = useState<'default' | 'destructive'>('default');

  const filtered = useMemo(() => {
    return users.filter((user) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        user.fullName.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q) ||
        user.username.toLowerCase().includes(q);
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && user.isActive) ||
        (statusFilter === 'inactive' && !user.isActive);
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  function handleCreateUser() {
    setEditingUser(null);
    setFormOpen(true);
  }

  function handleEditUser(user: User) {
    setEditingUser(user);
    setFormOpen(true);
  }

  function handleSaveUser(userData: Partial<User>) {
    if (editingUser) {
      // Edit User
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingUser.id
            ? ({
                ...u,
                ...userData,
                updatedAt: new Date().toISOString(),
              } as User)
            : u
        )
      );
      toast.success(`Đã cập nhật tài khoản "${userData.fullName}" thành công.`);
    } else {
      // Create User
      const newUser: User = {
        id: `user-${Date.now()}`,
        username: userData.email?.split('@')[0] || `user_${Date.now()}`,
        fullName: userData.fullName || '',
        role: userData.role || 'data_officer',
        email: userData.email || '',
        phone: userData.phone || '',
        scope: userData.scope,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setUsers((prev) => [newUser, ...prev]);
      toast.success(`Đã tạo tài khoản "${userData.fullName}" thành công. Mật khẩu mặc định đã được gửi tới ${userData.email}`);
    }
  }

  function handleDisableToggle(user: User) {
    const actionText = user.isActive ? 'vô hiệu hóa' : 'kích hoạt';
    setConfirmTitle(`Xác nhận ${actionText} tài khoản`);
    setConfirmDescription(
      `Bạn có chắc chắn muốn ${actionText} tài khoản của ông/bà "${user.fullName}" (@${user.username})?`
    );
    setConfirmVariant(user.isActive ? 'destructive' : 'default');
    setConfirmAction(() => () => {
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, isActive: !u.isActive } : u))
      );
      toast.success(`Đã ${actionText} tài khoản "${user.fullName}" thành công.`);
      setConfirmOpen(false);
    });
    setConfirmOpen(true);
  }

  function handleResetPassword(user: User) {
    setConfirmTitle('Đặt lại mật khẩu');
    setConfirmDescription(
      `Hệ thống sẽ tạo mật khẩu ngẫu nhiên mới và gửi tới thư điện tử "${user.email}" của ông/bà "${user.fullName}". Bạn có chắc chắn muốn tiếp tục?`
    );
    setConfirmVariant('default');
    setConfirmAction(() => () => {
      const generatedPassword = Math.random().toString(36).slice(-8).toUpperCase();
      toast.success(`Đã đặt lại mật khẩu cho "${user.fullName}" thành công.`, {
        description: `Mật khẩu mới (giả lập): ${generatedPassword}`,
        duration: 8000,
      });
      setConfirmOpen(false);
    });
    setConfirmOpen(true);
  }

  return (
    <div className="flex flex-col gap-6">
      <UsersHeader totalUsers={users.length} onCreateUser={handleCreateUser} />
      <UsersFilters
        search={search}
        onSearchChange={setSearch}
        roleFilter={roleFilter}
        onRoleFilterChange={setRoleFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />
      <UsersTable
        users={filtered}
        onEdit={handleEditUser}
        onDisable={handleDisableToggle}
        onResetPassword={handleResetPassword}
      />
      <UserFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        editingUser={editingUser}
        onSave={handleSaveUser}
      />
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={confirmTitle}
        description={confirmDescription}
        confirmText="Đồng ý"
        cancelText="Hủy bỏ"
        onConfirm={confirmAction}
        variant={confirmVariant}
      />
    </div>
  );
}
