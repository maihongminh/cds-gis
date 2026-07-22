'use client';

import * as React from 'react';
import { Bell, Info, CheckCircle, AlertTriangle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui';
import { Button } from '@/components/ui';
import { ScrollArea } from '@/components/ui';
import Link from 'next/link';

interface NotificationItem {
  id: string;
  type: 'info' | 'success' | 'warning';
  message: string;
  time: string;
  unread: boolean;
}

export function NotificationsMenu() {
  const [open, setOpen] = React.useState(false);
  const [notifications, setNotifications] = React.useState<NotificationItem[]>([
    {
      id: 'notif-1',
      type: 'success',
      message: 'Thôn hoàn thành chi trả DVMTR Quý 1/2026',
      time: '10 phút trước',
      unread: true,
    },
    {
      id: 'notif-2',
      type: 'warning',
      message: 'Cảnh báo: Phát hiện dịch sâu bệnh hại cây dược liệu tại thôn Khe Đá',
      time: '2 giờ trước',
      unread: true,
    },
    {
      id: 'notif-3',
      type: 'info',
      message: 'Hộ ông Hồ Văn Lang đăng ký thêm 0.8ha Cây dược liệu',
      time: '1 ngày trước',
      unread: false,
    },
    {
      id: 'notif-4',
      type: 'info',
      message: 'Lịch tiêm phòng vắc-xin Lở mồm long móng sắp diễn ra',
      time: '2 ngày trước',
      unread: false,
    },
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-blue-500 shrink-0" />;
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="relative w-9 h-9 text-foreground cursor-pointer bg-card border-border hover:bg-accent shadow-none"
          aria-label="Thông báo"
        >
          <Bell className="w-4.5 h-4.5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-80 p-0 border-border bg-card shadow-md">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/20">
          <span className="text-xs font-semibold text-foreground">Thông báo</span>
          {unreadCount > 0 && (
            <Button
              variant="link"
              onClick={markAllRead}
              className="text-[10px] text-primary hover:underline font-medium p-0 h-auto cursor-pointer"
            >
              Đánh dấu tất cả đã đọc
            </Button>
          )}
        </div>

        <ScrollArea className="h-72">
          <div className="divide-y divide-border">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-xs text-muted-foreground">
                Không có thông báo mới.
              </div>
            ) : (
              notifications.map((item) => (
                <Link
                  key={item.id}
                  href={`/dashboard/notifications/${item.id}`}
                  onClick={() => setOpen(false)}
                  className={`flex gap-2.5 p-3 hover:bg-muted/40 transition-colors cursor-pointer ${
                    item.unread ? 'bg-primary/5' : ''
                  }`}
                >
                  {getIcon(item.type)}
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs text-foreground leading-normal ${item.unread ? 'font-medium' : ''}`}>
                      {item.message}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1">{item.time}</p>
                  </div>
                  {item.unread && (
                    <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                  )}
                </Link>
              ))
            )}
          </div>
        </ScrollArea>

        <div className="border-t border-border p-2 text-center bg-muted/10">
          <Link
            href="/dashboard/notifications"
            onClick={() => setOpen(false)}
            className="inline-flex w-full items-center justify-center text-[11px] font-semibold text-primary hover:underline py-1 cursor-pointer"
          >
            Xem tất cả thông báo
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
