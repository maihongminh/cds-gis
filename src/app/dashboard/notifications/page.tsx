'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui';
import { Badge } from '@/components/ui';
import { Separator } from '@/components/ui';
import { ScrollArea } from '@/components/ui';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui';
import { toast } from 'sonner';
import { SearchInput } from '@/components/common';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  Calendar,
  User,
  Clock,
  Check,
  Search,
  Eye,
  EyeOff,
  ArrowRight,
  TrendingUp,
  MapPin,
  ClipboardList,
  MailOpen,
  ArrowLeft,
  CheckCheck
} from 'lucide-react';

interface NotificationItem {
  id: string;
  type: 'success' | 'warning' | 'info';
  title: string;
  message: string;
  time: string;
  sender: string;
  content: string;
  unread: boolean;
  meta: {
    label: string;
    value: string;
  }[];
  timeline: {
    time: string;
    title: string;
    description: string;
    done: boolean;
  }[];
  actions: {
    label: string;
    url: string;
    primary: boolean;
  }[];
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'success',
    title: 'Hoàn thành chi trả dịch vụ môi trường rừng (DVMTR) Quý 1/2026',
    message: 'Thôn hoàn thành chi trả DVMTR Quý 1/2026',
    time: '10 phút trước',
    sender: 'Ban Quản lý Rừng phòng hộ Lao Bảo',
    unread: true,
    content: 'Hệ thống đã hoàn tất đối soát dữ liệu tuần tra, diện tích rừng phòng hộ cung ứng dịch vụ bảo vệ và thực hiện giải ngân toàn bộ số tiền chi trả DVMTR Quý 1/2026 cho 45 hộ gia đình nhận khoán tại thôn Ka Tăng, xã Lao Bảo. Số liệu đã được thẩm định chéo với dữ liệu tuần tra GPS trên Smart Lâm nghiệp.',
    meta: [
      { label: 'Diện tích rừng bảo vệ', value: '342.5 ha' },
      { label: 'Tổng kinh phí giải ngân', value: '239.750.000 VNĐ' },
      { label: 'Đơn giá chi trả', value: '700.000 VNĐ/ha/năm' },
      { label: 'Số hộ dân thụ hưởng', value: '45 hộ tại Ka Tăng' }
    ],
    timeline: [
      { time: '01/05/2026', title: 'Nộp báo cáo tuần tra rừng', description: 'Các nhóm hộ tuần tra Ka Tăng nộp dữ liệu GPS tuần tra thực địa của Quý 1.', done: true },
      { time: '15/05/2026', title: 'Xác minh và đối soát bản đồ', description: 'Kiểm lâm địa bàn đối chiếu chéo quỹ đạo tuần tra với ranh giới bản đồ giao khoán.', done: true },
      { time: '08/06/2026', title: 'Phê duyệt quyết định chi trả', description: 'UBND xã Lao Bảo ký duyệt hồ sơ nghiệm thu kỹ thuật bảo vệ rừng.', done: true },
      { time: '15/06/2026', title: 'Giải ngân hoàn tất', description: 'Kinh phí được chuyển khoản trực tiếp qua ngân hàng hoặc phát tiền mặt tại nhà sinh hoạt cộng đồng thôn.', done: true }
    ],
    actions: [
      { label: 'Xem Hồ sơ Lâm nghiệp', url: '/dashboard/forest-dvmtr', primary: true },
      { label: 'Tải Quyết định phê duyệt', url: '#', primary: false }
    ]
  },
  {
    id: 'notif-2',
    type: 'warning',
    title: 'Cảnh báo khẩn cấp dịch sâu bệnh hại cây dược liệu',
    message: 'Cảnh báo: Phát hiện dịch sâu hại cây dược liệu tại thôn Khe Đá',
    time: '2 giờ trước',
    sender: 'Trạm Bảo vệ Thực vật xã Lao Bảo',
    unread: true,
    content: 'Tổ khuyến nông xã Lao Bảo báo cáo phát hiện dịch sâu đục thân và sâu ăn lá cây dược liệu trên diện rộng tại thôn Khe Đá. Dịch hại bùng phát nhanh do thời tiết nóng ẩm xen kẽ mưa rào, ảnh hưởng trực tiếp đến chất lượng và sinh trưởng của diện tích Cà gai leo và chè vằng 1-3 năm tuổi.',
    meta: [
      { label: 'Diện tích bị ảnh hưởng', value: 'Khoảng 4.2 ha' },
      { label: 'Mức độ gây hại', value: '15% - 20% mật độ cây' },
      { label: 'Hộ dân có nguy cơ cao', value: '12 hộ trồng dược liệu tại Khe Đá' },
      { label: 'Chế phẩm khuyến cáo', value: 'Trừ sâu sinh học Bt (Bacillus thuringiensis)' }
    ],
    timeline: [
      { time: '15/06/2026 08:00', title: 'Phát hiện ổ dịch đầu tiên', description: 'Trưởng thôn Khe Đá báo cáo có hiện tượng rụng lá hàng loạt trên đồi dược liệu phía Tây.', done: true },
      { time: '15/06/2026 13:30', title: 'Kiểm tra thực địa của cán bộ xã', description: 'Cán bộ nông nghiệp xã xuống đo đạc, xác minh mẫu sâu bệnh và khoanh vùng ổ dịch.', done: true },
      { time: '15/06/2026 16:14', title: 'Phát hành thông tin cảnh báo', description: 'Cảnh báo đỏ gửi tới các cán bộ thôn và hộ dân xung quanh thôn Khe Đá để kịp thời xử lý phun thuốc.', done: true },
      { time: '16/06/2026 (Dự kiến)', title: 'Cấp phát thuốc bảo vệ thực vật', description: 'UBND xã hỗ trợ cấp phát 50 lít chế phẩm sinh học miễn phí cho các hộ bị ảnh hưởng.', done: false }
    ],
    actions: [
      { label: 'Mở bản đồ vùng dịch', url: '/dashboard/crops', primary: true },
      { label: 'Xem tài liệu hướng dẫn điều trị', url: '#', primary: false }
    ]
  },
  {
    id: 'notif-3',
    type: 'info',
    title: 'Tiếp nhận yêu cầu mở rộng diện tích trồng Cây dược liệu dưới tán rừng phòng hộ',
    message: 'Hộ ông Hồ Văn Lang đăng ký thêm 0.8ha Cây dược liệu',
    time: '1 ngày trước',
    sender: 'Văn phòng Một cửa UBND xã Lao Bảo',
    unread: false,
    content: 'Hệ thống đã tiếp nhận hồ sơ đăng ký trồng bổ sung 0.8 ha Cây dược liệu của hộ ông Hồ Văn Lang (trú tại thôn Ka Tăng). Đơn đề nghị đã được đính kèm bản cam kết bảo vệ môi trường sinh thái rừng phòng hộ và không làm suy giảm thảm thực vật tự nhiên.',
    meta: [
      { label: 'Chủ hộ đăng ký', value: 'Hồ Văn Lang (Ka Tăng)' },
      { label: 'Diện tích đề xuất thêm', value: '0.8 ha (Tổng diện tích sau duyệt: 2.1 ha)' },
      { label: 'Địa điểm trồng dược liệu', value: 'Tiểu khu 312, Lô 4a rừng phòng hộ Lao Bảo' },
      { label: 'Số giống xuống trồng', value: '4.000 cây (Tuổi giống: 2 năm tuổi)' }
    ],
    timeline: [
      { time: '13/06/2026', title: 'Nộp hồ sơ trực tuyến', description: 'Chủ hộ nộp đơn xin liên kết phát triển cây dược liệu dưới tán rừng.', done: true },
      { time: '14/06/2026', title: 'Kiểm tra ranh giới quy hoạch', description: 'Cán bộ quản lý đất đai và nông nghiệp kiểm tra chồng lấn ranh giới lâm nghiệp.', done: true },
      { time: '15/06/2026', title: 'Xã thông qua hồ sơ', description: 'UBND xã Lao Bảo ký biên bản nhất trí đề xuất chuyển Sở NN&PTNT tỉnh phê duyệt.', done: true }
    ],
    actions: [
      { label: 'Xem hồ sơ Hộ gia đình', url: '/dashboard/households', primary: true },
      { label: 'Xem bản đồ lô rừng', url: '/dashboard/lands', primary: false }
    ]
  },
  {
    id: 'notif-4',
    type: 'info',
    title: 'Lịch tiêm phòng vắc-xin Lở mồm long móng cho đàn gia súc năm 2026',
    message: 'Lịch tiêm phòng vắc-xin Lở mồm long móng sắp diễn ra',
    time: '2 ngày trước',
    sender: 'Trạm Thú y Xã Lao Bảo',
    unread: false,
    content: 'Ủy ban nhân dân xã Lao Bảo ban hành kế hoạch số 24/KH-UBND về việc triển khai chiến dịch tiêm phòng vắc-xin Lở mồm long móng (LMLM) đợt 1 năm 2026 cho đàn trâu, bò, lợn trên toàn địa bàn xã. Chiến dịch nhằm ngăn chặn nguy cơ dịch bệnh phát sinh trước mùa mưa bão.',
    meta: [
      { label: 'Loại vắc-xin cấp phát', value: 'Vắc-xin LMLM nhị giá (Type O & A)' },
      { label: 'Đối tượng bắt buộc', value: 'Trâu, bò từ 2 tháng tuổi trở lên' },
      { label: 'Chi phí tiêm phòng', value: 'Nhà nước hỗ trợ 100% vắc-xin và công tiêm' },
      { label: 'Thời gian tại Ka Tăng', value: 'Từ ngày 23/06 đến ngày 25/06/2026' }
    ],
    timeline: [
      { time: '10/06/2026', title: 'Tiếp nhận nguồn vắc-xin', description: 'Trạm thú y xã nhận 1,200 liều vắc-xin bảo quản lạnh từ Sở NN&PTNT tỉnh Quảng Trị.', done: true },
      { time: '13/06/2026', title: 'Họp triển khai kế hoạch', description: 'UBND xã thống nhất lịch di chuyển và nhân lực hỗ trợ tiêm phòng tại các thôn.', done: true },
      { time: '15/06/2026', title: 'Phát thông báo lịch tiêm', description: 'Gửi thông báo tới các trưởng thôn/thông tin để tuyên truyền cho bà con nhốt gia súc.', done: true },
      { time: '20/06/2026 (Sắp diễn ra)', title: 'Bắt đầu tiêm tại thôn Ka Tăng', description: 'Triển khai tiêm cuốn chiếu tại các thôn bắt đầu từ Ka Tăng.', done: false }
    ],
    actions: [
      { label: 'Xem Danh sách Chăn nuôi', url: '/dashboard/livestock', primary: true },
      { label: 'Tải văn bản kế hoạch', url: '#', primary: false }
    ]
  }
];

function NotificationsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Load selected ID from search param
  const paramId = searchParams?.get('id') || null;

  const [notifications, setNotifications] = React.useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [selectedId, setSelectedId] = React.useState<string | null>(paramId);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeTab, setActiveTab] = React.useState<'all' | 'unread' | 'read'>('all');

  // Sync state if param ID changes
  React.useEffect(() => {
    if (paramId) {
      setSelectedId(paramId);
    }
  }, [paramId]);

  // Find currently selected notification
  const selectedNotif = notifications.find((n) => n.id === selectedId) || null;

  // Automatically mark as read when selected
  React.useEffect(() => {
    if (selectedId) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === selectedId && n.unread ? { ...n, unread: false } : n))
      );
    }
  }, [selectedId]);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    router.replace(`/dashboard/notifications?id=${id}`, { scroll: false });
  };

  const handleClearSelection = () => {
    setSelectedId(null);
    router.replace('/dashboard/notifications', { scroll: false });
  };

  const handleToggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => {
        if (n.id === id) {
          const nextVal = !n.unread;
          toast.success(nextVal ? 'Đã đánh dấu là chưa đọc' : 'Đã đánh dấu là đã đọc');
          return { ...n, unread: nextVal };
        }
        return n;
      })
    );
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    toast.success('Đã đánh dấu tất cả thông báo là đã đọc');
  };

  const filteredNotifications = React.useMemo(() => {
    return notifications.filter((n) => {
      const matchesSearch =
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.sender.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTab =
        activeTab === 'all' ||
        (activeTab === 'unread' && n.unread) ||
        (activeTab === 'read' && !n.unread);

      return matchesSearch && matchesTab;
    });
  }, [notifications, searchQuery, activeTab]);

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-4.5 h-4.5 text-amber-500 shrink-0" />;
      default:
        return <Info className="w-4.5 h-4.5 text-blue-500 shrink-0" />;
    }
  };

  const getDetailIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0" />;
      default:
        return <Info className="w-6 h-6 text-blue-500 shrink-0" />;
    }
  };

  const getBannerColor = (type: NotificationItem['type']) => {
    switch (type) {
      case 'success':
        return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400';
      case 'warning':
        return 'bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400';
      default:
        return 'bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-400';
    }
  };

  const getUnreadCount = () => {
    return notifications.filter((n) => n.unread).length;
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in overflow-hidden h-full">
      {/* Page Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">Trung tâm thông báo</h1>
          <p className="text-xs text-muted-foreground">Theo dõi và quản lý các sự kiện, cảnh báo nông nghiệp xã Lao Bảo</p>
        </div>
        {getUnreadCount() > 0 && (
          <Button
            id="btn-mark-all-read"
            variant="outline"
            size="sm"
            onClick={handleMarkAllRead}
            className="text-xs h-8 cursor-pointer border-border hover:bg-accent text-foreground shadow-none rounded-lg"
          >
            <CheckCheck className="size-4" />
            Đọc tất cả ({getUnreadCount()})
          </Button>
        )}
      </div>

      {/* Main Container: 2-column or Mobile Screen Switcher */}
      <div className="flex-1 flex gap-6 min-h-0 overflow-hidden relative">
        {/* Column 1: Notification List (Hidden on mobile if detail is selected) */}
        <div
          className={`
            w-full lg:w-[380px] xl:w-[420px] flex flex-col gap-4 min-h-0 shrink-0 bg-card border border-border rounded-xl p-4 shadow-xs
            ${selectedId ? 'hidden lg:flex' : 'flex'}
          `}
        >
          <SearchInput
            id="notif-search"
            placeholder="Tìm thông báo, đơn vị..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="shrink-0"
          />

          {/* Filtering Tabs */}
          <div className="shrink-0">
            <Tabs
              value={activeTab}
              onValueChange={(val) => setActiveTab(val as 'all' | 'unread' | 'read')}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3 bg-muted h-8 p-0.5 rounded-lg border border-border/30">
                <TabsTrigger value="all" className="xl:text-xs py-1 rounded-md">
                  Tất cả ({notifications.length})
                </TabsTrigger>
                <TabsTrigger value="unread" className="xl:text-xs py-1 rounded-md">
                  Chưa đọc ({notifications.filter(n => n.unread).length})
                </TabsTrigger>
                <TabsTrigger value="read" className="xl:text-xs py-1 rounded-md">
                  Đã đọc ({notifications.filter(n => !n.unread).length})
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <Separator className="bg-border/60 shrink-0" />

          {/* List Items Scrollable */}
          <ScrollArea className="flex-1 min-h-0 -mx-4 px-4">
            <div className="space-y-2 pb-4">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-10 px-4">
                  <Bell className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-muted-foreground">Không tìm thấy thông báo</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Thử đổi điều kiện tìm kiếm hoặc tab bộ lọc khác</p>
                </div>
              ) : (
                filteredNotifications.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className={`
                      group relative flex gap-3 p-3.5 border rounded-xl transition-all duration-200 cursor-pointer text-left
                      ${item.id === selectedId
                        ? 'bg-primary/5 border-primary/45 shadow-none'
                        : 'bg-card border-border/80 hover:bg-muted/30 hover:border-border'
                      }
                      ${item.unread ? 'bg-primary/2' : ''}
                    `}
                  >
                    {/* Unread indicator dot */}
                    {item.unread && (
                      <span className="absolute top-3.5 right-3.5 h-1.5 w-1.5 rounded-full bg-primary animate-none" />
                    )}

                    {/* Notification Type Icon */}
                    <div className="mt-0.5 shrink-0">
                      {getIcon(item.type)}
                    </div>

                    <div className="flex-1 min-w-0 pr-1.5">
                      <p className={`text-xs leading-snug ${item.unread ? 'font-bold text-foreground' : 'font-medium text-foreground/80'}`}>
                        {item.title}
                      </p>
                      <p className="text-[10px] text-muted-foreground/90 mt-1">
                        {item.sender}
                      </p>
                      <div className="flex items-center gap-1 mt-2 text-[9px] text-muted-foreground">
                        <Clock className="w-3 h-3 text-muted-foreground/60 shrink-0" />
                        <span>{item.time}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Column 2: Selected Notification Detail (Occupies full space on mobile if selected) */}
        <div
          className={`
            flex-1 min-w-0 flex flex-col min-h-0 bg-card border border-border rounded-xl overflow-hidden shadow-xs
            ${selectedId ? 'flex' : 'hidden lg:flex'}
          `}
        >
          {selectedNotif ? (
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
              {/* Detail Header & Action toolbars */}
              <div className="shrink-0 flex items-center justify-between border-b border-border p-4 bg-muted/10">
                <Button
                  id="btn-notif-close-detail"
                  variant="ghost"
                  size="sm"
                  onClick={handleClearSelection}
                  className="text-xs h-8 px-2.5 cursor-pointer text-muted-foreground hover:text-foreground shadow-none"
                >
                  <ArrowLeft className="size-4.5" />
                  Quay lại danh sách
                </Button>

                <Button
                  id="btn-toggle-read-status"
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleRead(selectedNotif.id)}
                  className="text-xs h-8 px-2.5 cursor-pointer border-border hover:bg-accent text-foreground shadow-none rounded-lg"
                >
                  {selectedNotif.unread ? (
                    <>
                      <MailOpen className="size-4 text-muted-foreground" />
                      Đánh dấu đã đọc
                    </>
                  ) : (
                    <>
                      <EyeOff className="size-4 text-muted-foreground" />
                      Đánh dấu chưa đọc
                    </>
                  )}
                </Button>
              </div>

              {/* Detail Content Area Scrollable */}
              <ScrollArea className="flex-1 min-h-0">
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 p-6 min-h-full">
                  {/* Detail details main body (Left) */}
                  <div className="xl:col-span-2 space-y-6">
                    {/* Headline Banner */}
                    <div className={`flex items-start gap-4 p-4.5 border border-border/25 rounded-2xl ${getBannerColor(selectedNotif.type)}`}>
                      <div className="p-2 bg-background rounded-xl shadow-xs shrink-0">
                        {getDetailIcon(selectedNotif.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <span className="text-[9px] font-bold uppercase tracking-wider bg-background/95 dark:bg-background/40 px-2 py-0.5 rounded-full border border-border">
                            {selectedNotif.type === 'success' ? 'Thành công' : selectedNotif.type === 'warning' ? 'Cảnh báo' : 'Thông tin'}
                          </span>
                          {selectedNotif.unread && (
                            <span className="h-2 w-2 rounded-full bg-primary shrink-0 animate-pulse" />
                          )}
                        </div>
                        <h2 className="text-sm md:text-base font-bold text-foreground leading-snug">{selectedNotif.title}</h2>
                      </div>
                    </div>

                    {/* Sender & Date row */}
                    <div className="flex flex-wrap gap-x-6 gap-y-2.5 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <User className="w-4.5 h-4.5 text-muted-foreground/80 shrink-0" />
                        <span>Đơn vị gửi: <strong className="text-foreground font-semibold">{selectedNotif.sender}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4.5 h-4.5 text-muted-foreground/80 shrink-0" />
                        <span>Thời điểm: <strong className="text-foreground font-semibold">{selectedNotif.time}</strong></span>
                      </div>
                    </div>

                    <Separator className="bg-border/60" />

                    {/* Detailed Message Content */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Chi tiết thông điệp</h3>
                      <div className="text-xs text-foreground/90 leading-relaxed font-normal bg-muted/10 p-4 border border-border/40 rounded-xl whitespace-pre-wrap">
                        {selectedNotif.content}
                      </div>
                    </div>

                    {/* Metadata boxes */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                        <ClipboardList className="w-4 h-4 text-primary" />
                        Thông số nghiệp vụ liên quan
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {selectedNotif.meta.map((m, idx) => (
                          <div key={idx} className="p-3.5 border border-border bg-card hover:border-primary/20 hover:shadow-2xs transition-all duration-200 rounded-xl flex flex-col gap-1.5">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">{m.label}</span>
                            <span className="text-xs font-bold text-foreground leading-none">{m.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator className="bg-border/60" />

                    {/* Action buttons */}
                    <div className="flex flex-wrap gap-2.5 pt-2">
                      {selectedNotif.actions.map((act, idx) => (
                        <Button
                          id={`btn-detail-act-${idx}`}
                          key={idx}
                          variant={act.primary ? 'default' : 'outline'}
                          size="sm"
                          className="text-xs h-9 px-4 cursor-pointer shadow-none"
                          onClick={() => {
                            if (act.url !== '#') {
                              router.push(act.url);
                            } else {
                              toast.success(`Đang xử lý tài liệu liên kết từ ${selectedNotif.sender}...`);
                            }
                          }}
                        >
                          {act.label}
                          {act.primary && <ArrowRight className="size-4 ml-1.5" />}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Detail progress timeline (Right) */}
                  <div className="xl:col-span-1 space-y-4">
                    <div className="border border-border/80 bg-muted/5 dark:bg-muted/2 rounded-xl p-4.5 space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-foreground">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        Tiến trình vụ việc
                      </h4>
                      <div className="relative border-l border-border ml-2 pl-4 space-y-5 py-1">
                        {selectedNotif.timeline.map((step, idx) => (
                          <div key={idx} className="relative group">
                            {/* Dot indicator */}
                            <span className={`absolute -left-[23px] top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full border bg-card transition-colors ${step.done
                              ? 'border-emerald-500 text-emerald-500'
                              : 'border-border text-muted-foreground/30'
                              }`}>
                              {step.done ? (
                                <Check className="h-2 w-2 stroke-[3]" />
                              ) : (
                                <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                              )}
                            </span>

                            <div className="space-y-1">
                              <span className={`text-[9px] font-bold uppercase ${step.done ? 'text-primary' : 'text-muted-foreground/50'}`}>
                                {step.time}
                              </span>
                              <h5 className={`text-xs font-bold leading-tight ${step.done ? 'text-foreground' : 'text-muted-foreground/70'}`}>
                                {step.title}
                              </h5>
                              <p className="text-[10px] text-muted-foreground/80 leading-relaxed font-normal">
                                {step.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>
          ) : (
            /* Blank state when no item is selected */
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3 bg-muted/5">
              <div className="w-12 h-12 rounded-full border border-border/80 flex items-center justify-center text-muted-foreground/60 bg-card shadow-2xs">
                <Bell className="w-5.5 h-5.5" />
              </div>
              <div className="space-y-1 max-w-xs">
                <h3 className="text-xs font-bold text-foreground">Chưa chọn thông báo</h3>
                <p className="text-[10px] text-muted-foreground leading-normal">
                  Vui lòng bấm chọn một thông báo ở danh sách bên trái để xem nội dung chi tiết và các tùy chọn xử lý công việc.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function NotificationsPage() {
  return (
    <React.Suspense fallback={<div className="p-6 text-center text-xs text-muted-foreground animate-pulse">Đang tải dữ liệu thông báo...</div>}>
      <NotificationsContent />
    </React.Suspense>
  );
}
