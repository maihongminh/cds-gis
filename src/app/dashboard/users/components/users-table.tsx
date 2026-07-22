"use client";

import { ActionMenu, DataTableColumn, DataTableShell, StatusBadge } from "@/components/common";
import { can } from "@/lib/rbac";
import { User } from "@/types/user";
import { KeyRound, ShieldAlert, ShieldCheck } from "lucide-react";
import { UserRoleBadge } from "./user-role-badge";

const SCOPE_LABELS: Record<string, string> = {
  admin: "Toàn hệ thống",
  data_officer: "Đơn vị/Thôn được giao",
  unit_leader: "Chỉ xem/Duyệt đơn vị",
  data_governance: "Quản trị dữ liệu toàn xã",
  commune_leader: "Chỉ xem toàn xã",
};

function formatDate(iso: string | undefined) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface UsersTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDisable: (user: User) => void;
  onResetPassword: (user: User) => void;
}

export function UsersTable({ users, onEdit, onDisable, onResetPassword }: UsersTableProps) {
  const columns: DataTableColumn<User>[] = [
    {
      header: "Họ tên",
      accessorKey: "fullName",
      sortable: true,
      render: (row) => <span className="font-semibold text-foreground text-sm">{row.fullName}</span>,
    },
    {
      header: "Email",
      accessorKey: "email",
      sortable: true,
      render: (row) => <span className="text-muted-foreground text-xs">{row.email}</span>,
    },
    {
      header: "Vai trò",
      accessorKey: "role",
      render: (row) => <UserRoleBadge role={row.role} />,
    },
    {
      header: "Phạm vi dữ liệu",
      render: (row) => <span className="text-xs">{SCOPE_LABELS[row.role] ?? "—"}</span>,
    },
    {
      header: "Thôn phụ trách",
      render: (row) => {
        const codes = row.scope?.allowedVillageCodes || [];
        if (codes.includes("all")) return <span className="text-muted-foreground text-xs">Toàn xã</span>;
        return <span className="text-muted-foreground text-xs">{codes.join(", ") || "—"}</span>;
      },
    },
    {
      header: "Trạng thái",
      accessorKey: "isActive",
      render: (row) => <StatusBadge status={row.isActive ? "active" : "inactive"} />,
    },
    {
      header: "Đăng nhập cuối",
      accessorKey: "lastLogin",
      render: (row) => <span className="text-muted-foreground text-xs">{formatDate(row.lastLogin)}</span>,
    },
    {
      header: "Thao tác",
      align: "right",
      render: (row) => {
        const customActions = [];

        if (can("user:disable")) {
          customActions.push({
            label: row.isActive ? "Vô hiệu hóa" : "Kích hoạt",
            icon: row.isActive ? <ShieldAlert className="size-3.5 text-amber-500" /> : <ShieldCheck className="size-3.5 text-emerald-500" />,
            onClick: () => onDisable(row),
          });
        }

        if (can("user:resetPassword")) {
          customActions.push({
            label: "Đặt lại mật khẩu",
            icon: <KeyRound className="size-3.5 text-muted-foreground" />,
            onClick: () => onResetPassword(row),
          });
        }

        return <ActionMenu entityName="tài khoản" onEdit={can("user:edit") ? () => onEdit(row) : undefined} customActions={customActions} />;
      },
    },
  ];

  return <DataTableShell data={users} columns={columns} searchKeys={["fullName", "email", "username"]} initialPageSize={10} />;
}
