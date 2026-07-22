'use client';

import * as React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreVertical, Eye, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export interface CustomAction {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  className?: string;
}

interface ActionMenuProps {
  entityName?: string;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  deleteConfirmMessage?: string;
  customActions?: CustomAction[];
  align?: 'start' | 'end';
  /** If userRole === 'leader', only the view/detail action is shown as a text button */
  userRole?: string;
  /** Text to show for detail button when userRole is 'leader' */
  leaderDetailLabel?: string;
  onLeaderDetail?: () => void;
}

export function ActionMenu({
  entityName = 'bản ghi',
  onView,
  onEdit,
  onDelete,
  deleteConfirmMessage,
  customActions = [],
  align = 'end',
  userRole,
  leaderDetailLabel = 'Chi tiết',
  onLeaderDetail,
}: ActionMenuProps) {
  const isLeader = userRole === 'leader';

  // Leader mode: just show a plain "Chi tiết" text button
  if (isLeader) {
    const detailAction = onLeaderDetail || onView;
    return (
      <div className="flex justify-center">
        <Button
          variant="ghost"
          size="xs"
          className="h-7 text-[10px] text-primary hover:bg-primary/5 cursor-pointer shadow-none"
          onClick={detailAction}
        >
          {leaderDetailLabel}
        </Button>
      </div>
    );
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    const confirmMessage = deleteConfirmMessage || `Bạn có chắc chắn muốn xóa ${entityName} này?`;

    // Use window.confirm for simple modal confirmation in mock prototype
    if (window.confirm(confirmMessage)) {
      if (onDelete) {
        onDelete();
      }
      toast.success(`Đã xóa ${entityName} thành công!`, {
        description: 'Dữ liệu đã được gỡ khỏi hệ thống tạm thời.',
      });
    }
  };

  const hasStandardActions = onView || onEdit || onDelete;
  const hasBoth = hasStandardActions && customActions.length > 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-muted cursor-pointer shadow-none rounded-md"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreVertical className="w-4 h-4 text-muted-foreground" />
          <span className="sr-only">Thao tác</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align={align} className="w-44 border-border bg-card">
        {customActions.map((action, idx) => (
          <DropdownMenuItem
            key={idx}
            onClick={(e) => {
              e.stopPropagation();
              action.onClick();
            }}
            className={cn('flex items-center gap-2 p-2 text-xs cursor-pointer', action.className)}
          >
            {action.icon && <span className="size-4 flex items-center justify-center">{action.icon}</span>}
            <span>{action.label}</span>
          </DropdownMenuItem>
        ))}

        {hasBoth && <DropdownMenuSeparator className="bg-border" />}

        {onView && (
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              onView();
            }}
            className="flex items-center gap-2 p-2 text-xs focus:bg-accent cursor-pointer"
          >
            <Eye className="size-4 text-muted-foreground" />
            <span>Xem chi tiết</span>
          </DropdownMenuItem>
        )}

        {onEdit && (
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="flex items-center gap-2 p-2 text-xs focus:bg-accent cursor-pointer"
          >
            <Edit2 className="size-4 text-muted-foreground" />
            <span>Chỉnh sửa</span>
          </DropdownMenuItem>
        )}

        {onDelete && (
          <>
            {hasStandardActions && (onView || onEdit) && <DropdownMenuSeparator className="bg-border" />}
            <DropdownMenuItem
              onClick={handleDeleteClick}
              className="flex items-center gap-2 p-2 text-xs text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
            >
              <Trash2 className="size-4 text-destructive" />
              <span>Xóa</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
