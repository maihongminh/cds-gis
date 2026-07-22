// src/app/dashboard/tourism-services/page.tsx

'use client';

import * as React from 'react';
import { useTenant } from '@/components/layout/tenant-context';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
  Input,
  Badge,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';
import {
  Palmtree,
  Compass,
  Bed,
  ShoppingBag,
  Image as ImageIcon,
  Video,
  Plus,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  FileSpreadsheet,
  MapPin,
  Clock,
  Phone,
  Star,
  Globe2,
  Play,
} from 'lucide-react';
import { toast } from 'sonner';
import { ActionMenu, PageHeader } from '@/components/common';
import { WorkflowStatusBadge } from '@/components/common/WorkflowStatusBadge';
import { SecurityLevelBadge } from '@/components/common/SecurityLevelBadge';
import { VILLAGES } from '@/data/laobao-administrative-units';
import { WorkflowStatus, SecurityLevel } from '@/types';

// Interfaces
interface TourismPoint {
  id: string;
  name: string;
  type: 'Historical' | 'Scenic' | 'Checkin' | 'Cultural';
  description: string;
  villageCode: string;
  coordinates: [number, number];
  openingHours: string;
  contact: string;
  status: 'Open' | 'Closed' | 'Repair';
  workflowStatus: WorkflowStatus;
}

interface Accommodation {
  id: string;
  name: string;
  type: 'Hotel' | 'Homestay' | 'Motel';
  address: string;
  capacity: string;
  rating: number;
  contact: string;
  operatingStatus: 'Active' | 'Paused';
  workflowStatus: WorkflowStatus;
}

interface ShowcasePoint {
  id: string;
  name: string;
  type: 'Showroom' | 'RetailStore' | 'CooperativeBooth';
  address: string;
  description: string;
  contact: string;
  workflowStatus: WorkflowStatus;
}

interface MediaAsset {
  id: string;
  title: string;
  mediaType: 'image' | 'video';
  url: string;
  linkedEntityType: string;
  linkedEntityId: string;
  caption: string;
  visibility: 'Public' | 'Internal';
}

const INITIAL_TOURISM_POINTS: TourismPoint[] = [
  {
    id: 'tp-1',
    name: 'Di tích Lịch sử cấp Quốc gia Nhà đày Lao Bảo',
    type: 'Historical',
    description: 'Nơi giam giữ các chiến sĩ cách mạng kiên trung thời kỳ kháng chiến chống Pháp, minh chứng lịch sử hào hùng.',
    villageCode: 'vinh-dong',
    coordinates: [106.592, 16.635],
    openingHours: '07:30 - 17:00 (Hằng ngày)',
    contact: '0233.3876.111',
    status: 'Open',
    workflowStatus: 'published',
  },
  {
    id: 'tp-2',
    name: 'Cửa khẩu Quốc tế Lao Bảo & Khu thương mại biên giới',
    type: 'Checkin',
    description: 'Điểm check-in giao thương nhộn nhịp biên giới Việt - Lào, hành lang kinh tế Đông Tây EWEC.',
    villageCode: 'ka-tang',
    coordinates: [106.578, 16.620],
    openingHours: '07:00 - 22:00',
    contact: 'Ban quản lý Cửa khẩu',
    status: 'Open',
    workflowStatus: 'published',
  },
  {
    id: 'tp-3',
    name: 'Thắng cảnh Sông Sê Pôn border view',
    type: 'Scenic',
    description: 'Dòng sông biên giới tự nhiên chảy dọc theo xã Lao Bảo, cảnh quan thanh bình yên ả lý tưởng cho check-in.',
    villageCode: 'ka-tang',
    coordinates: [106.582, 16.612],
    openingHours: 'Tự do truy cập',
    contact: 'Không có',
    status: 'Open',
    workflowStatus: 'published',
  }
];

const INITIAL_ACCOMMODATIONS: Accommodation[] = [
  {
    id: 'acc-1',
    name: 'Khách sạn Sepon Lao Bảo (3 Sao)',
    type: 'Hotel',
    address: 'Thôn Vĩnh Đông, Xã Lao Bảo, Tỉnh Quảng Trị',
    capacity: '80 phòng nghỉ tiêu chuẩn',
    rating: 4.5,
    contact: '0233.3877.999',
    operatingStatus: 'Active',
    workflowStatus: 'published',
  },
  {
    id: 'acc-2',
    name: 'Homestay Bản Văn hóa Ka Tăng',
    type: 'Homestay',
    address: 'Thôn Ka Tăng, Xã Lao Bảo',
    capacity: '3 căn Bungalow gỗ cộng đồng (sức chứa 15 người)',
    rating: 4.8,
    contact: '0912.345.678',
    operatingStatus: 'Active',
    workflowStatus: 'published',
  },
  {
    id: 'acc-3',
    name: 'Nhà nghỉ Biên Thùy Lao Bảo',
    type: 'Motel',
    address: 'Thôn Tân Kim, Xã Lao Bảo',
    capacity: '15 phòng nghỉ bình dân',
    rating: 4.0,
    contact: '0233.3876.543',
    operatingStatus: 'Active',
    workflowStatus: 'published',
  }
];

const INITIAL_SHOWCASES: ShowcasePoint[] = [
  {
    id: 'sc-1',
    name: 'Trung tâm Trưng bày & Giới thiệu Sản phẩm OCOP Lao Bảo',
    type: 'Showroom',
    address: 'Thôn Vĩnh Đông, Lao Bảo',
    description: 'Gian hàng tập trung giới thiệu các nông sản OCOP của Lao Bảo và Tỉnh Quảng Trị như chè vằng, cà phê Arabica, dầu tràm.',
    contact: '0945.111.222',
    workflowStatus: 'published',
  },
  {
    id: 'sc-2',
    name: 'Điểm dệt thổ cẩm truyền thống Vân Kiều Ka Tăng',
    type: 'CooperativeBooth',
    address: 'Thôn Ka Tăng, Lao Bảo',
    description: 'Nơi giới thiệu, bán đồ lưu niệm dệt thủ cẩm, nhạc cụ truyền thống của đồng bào Vân Kiều.',
    contact: '0988.777.666',
    workflowStatus: 'published',
  }
];

const INITIAL_MEDIA: MediaAsset[] = [
  {
    id: 'med-1',
    title: 'Toàn cảnh Khu di tích Nhà tù Lao Bảo',
    mediaType: 'image',
    url: 'https://luhanhvietnam.com.vn/du-lich/vnt_upload/news/08_2019/nha-tu-lao-bao_1.jpg',
    linkedEntityType: 'Historical',
    linkedEntityId: 'tp-1',
    caption: 'Khuôn viên lưu giữ hiện vật, nhà biệt giam trong khu di tích quốc gia.',
    visibility: 'Public',
  },
  {
    id: 'med-2',
    title: 'Cửa khẩu Quốc tế Lao Bảo góc flycam',
    mediaType: 'video',
    url: '#',
    linkedEntityType: 'Checkin',
    linkedEntityId: 'tp-2',
    caption: 'Đại lộ biên giới nối liền Việt Nam và Lào qua EWEC.',
    visibility: 'Public',
  },
  {
    id: 'med-3',
    title: 'Không gian văn hóa Bungalow Ka Tăng Homestay',
    mediaType: 'image',
    url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&auto=format&fit=crop&q=60',
    linkedEntityType: 'Homestay',
    linkedEntityId: 'acc-2',
    caption: 'Thiết kế nhà sàn truyền thống kết hợp tiện ích hiện đại.',
    visibility: 'Public',
  }
];

export default function TourismServicesPage() {
  const { currentRole } = useTenant();
  const [activeTab, setActiveTab] = React.useState('points');

  // Datasets
  const [points, setPoints] = React.useState<TourismPoint[]>(INITIAL_TOURISM_POINTS);
  const [accommodations, setAccommodations] = React.useState<Accommodation[]>(INITIAL_ACCOMMODATIONS);
  const [showcases, setShowcases] = React.useState<ShowcasePoint[]>(INITIAL_SHOWCASES);
  const [mediaAssets, setMediaAssets] = React.useState<MediaAsset[]>(INITIAL_MEDIA);

  const [searchQuery, setSearchQuery] = React.useState('');

  // Modals
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);
  const [activeRecord, setActiveRecord] = React.useState<any | null>(null);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [formType, setFormType] = React.useState<'point' | 'accommodation' | 'showcase'>('point');
  const [formRecord, setFormRecord] = React.useState<any>({});

  // Summary Metrics
  const stats = React.useMemo(() => {
    const totalPoints = points.length;
    const totalRooms = 98; // Sepon Hotel 80 + Homestay capacity mock + Motel 15
    const ocopShowcases = showcases.length;
    const mediaCount = mediaAssets.length;

    return { totalPoints, totalRooms, ocopShowcases, mediaCount };
  }, [points, showcases, mediaAssets]);

  // Filters
  const filteredPoints = React.useMemo(() => {
    return points.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [points, searchQuery]);

  const filteredAccommodations = React.useMemo(() => {
    return accommodations.filter((a) => a.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [accommodations, searchQuery]);

  const filteredShowcases = React.useMemo(() => {
    return showcases.filter((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [showcases, searchQuery]);

  // Export
  const handleExport = () => {
    toast.success('Đang kết xuất báo cáo thống kê Du lịch & Dịch vụ xã Lao Bảo...');
  };

  // Workflow Action
  const handleWorkflowAction = (rec: any, type: string, action: WorkflowStatus) => {
    if (type === 'point') {
      setPoints((prev) => prev.map((p) => (p.id === rec.id ? { ...p, workflowStatus: action } : p)));
    } else if (type === 'accommodation') {
      setAccommodations((prev) => prev.map((a) => (a.id === rec.id ? { ...a, workflowStatus: action } : a)));
    } else if (type === 'showcase') {
      setShowcases((prev) => prev.map((s) => (s.id === rec.id ? { ...s, workflowStatus: action } : s)));
    }
    toast.success('Đã cập nhật trạng thái quy trình phê duyệt thành công!');
    setIsDetailOpen(false);
  };

  // CRUD
  const handleDelete = (id: string, type: string, name: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa: ${name}?`)) {
      if (type === 'point') {
        setPoints((prev) => prev.filter((p) => p.id !== id));
      } else if (type === 'accommodation') {
        setAccommodations((prev) => prev.filter((a) => a.id !== id));
      } else if (type === 'showcase') {
        setShowcases((prev) => prev.filter((s) => s.id !== id));
      }
      toast.info(`Đã xóa bản ghi ${name}.`);
    }
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (formType === 'point') {
      if (formRecord.id) {
        setPoints((prev) => prev.map((p) => (p.id === formRecord.id ? { ...p, ...formRecord, workflowStatus: 'draft' } : p)));
        toast.success('Đã cập nhật điểm du lịch!');
      } else {
        const newPt: TourismPoint = {
          id: `tp-${Date.now()}`,
          name: formRecord.name || 'Điểm du lịch mới',
          type: formRecord.type || 'Checkin',
          description: formRecord.description || '',
          villageCode: formRecord.villageCode || 'ka-tang',
          coordinates: [106.59, 16.63],
          openingHours: formRecord.openingHours || '08:00 - 17:00',
          contact: formRecord.contact || '',
          status: 'Open',
          workflowStatus: 'draft',
        };
        setPoints((prev) => [newPt, ...prev]);
        toast.success('Thêm mới điểm du lịch thành công!');
      }
    } else if (formType === 'accommodation') {
      if (formRecord.id) {
        setAccommodations((prev) => prev.map((a) => (a.id === formRecord.id ? { ...a, ...formRecord, workflowStatus: 'draft' } : a)));
        toast.success('Đã cập nhật cơ sở lưu trú!');
      } else {
        const newAcc: Accommodation = {
          id: `acc-${Date.now()}`,
          name: formRecord.name || 'Cơ sở lưu trú mới',
          type: formRecord.type || 'Hotel',
          address: formRecord.address || '',
          capacity: formRecord.capacity || '',
          rating: Number(formRecord.rating || 4),
          contact: formRecord.contact || '',
          operatingStatus: 'Active',
          workflowStatus: 'draft',
        };
        setAccommodations((prev) => [newAcc, ...prev]);
        toast.success('Thêm mới cơ sở lưu trú thành công!');
      }
    }
    setIsFormOpen(false);
  };

  const handleOpenEdit = (rec: any, type: 'point' | 'accommodation' | 'showcase') => {
    setFormType(type);
    setFormRecord({ ...rec });
    setIsFormOpen(true);
  };

  const handleOpenAdd = (type: 'point' | 'accommodation' | 'showcase') => {
    setFormType(type);
    setFormRecord(
      type === 'point'
        ? { name: '', type: 'Checkin', description: '', villageCode: 'ka-tang', openingHours: '08:00 - 17:00', contact: '' }
        : type === 'accommodation'
          ? { name: '', type: 'Hotel', address: '', capacity: '', rating: 4, contact: '' }
          : {}
    );
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <PageHeader
        title={
          <>
            <Palmtree className="w-6 h-6 text-primary" />
            CSDL Du lịch, Dịch vụ &amp; Thương mại
          </>
        }
        description="Văn phòng VH-XH xã Lao Bảo. Quản lý danh thắng lịch sử, cơ sở lưu trú, điểm OCOP giới thiệu và thư viện truyền thông."
        actions={
          <>
            <Button
              onClick={handleExport}
              variant="outline"
              size="sm"
              className="h-9 text-xs cursor-pointer gap-1.5 shadow-none border-border"
            >
              <FileSpreadsheet className="size-4" />
              Báo cáo du lịch
            </Button>
            {(currentRole === 'admin' || currentRole === 'data_officer') && (
              <Button
                onClick={() => handleOpenAdd(activeTab === 'accommodations' ? 'accommodation' : 'point')}
                size="sm"
                className="h-9 text-xs cursor-pointer gap-1.5 shadow-none"
              >
                <Plus className="size-4" />
                Thêm mới
              </Button>
            )}
          </>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border-border bg-card p-4 flex items-center gap-3">
          <div className="p-3 bg-primary/10 text-primary rounded-xl shrink-0">
            <Compass className="size-5" />
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Điểm tham quan, di tích</span>
            <h3 className="text-base font-bold text-foreground mt-0.5">{stats.totalPoints} địa điểm</h3>
          </div>
        </Card>

        <Card className="border-border bg-card p-4 flex items-center gap-3">
          <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl shrink-0">
            <Bed className="size-5" />
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Quy mô lưu trú</span>
            <h3 className="text-base font-bold text-foreground mt-0.5">{stats.totalRooms} phòng/khách</h3>
          </div>
        </Card>

        <Card className="border-border bg-card p-4 flex items-center gap-3">
          <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl shrink-0">
            <ShoppingBag className="size-5" />
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Điểm giới thiệu OCOP</span>
            <h3 className="text-base font-bold text-foreground mt-0.5">{stats.ocopShowcases} điểm bán</h3>
          </div>
        </Card>

        <Card className="border-border bg-card p-4 flex items-center gap-3">
          <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl shrink-0">
            <ImageIcon className="size-5" />
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Thư viện truyền thông</span>
            <h3 className="text-base font-bold text-foreground mt-0.5">{stats.mediaCount} tư liệu</h3>
          </div>
        </Card>
      </div>

      {/* Tabs navigation */}
      <div className="flex border-b border-border gap-2 overflow-x-auto pb-px shrink-0">
        {[
          { id: 'points', label: 'Điểm du lịch & Di tích' },
          { id: 'accommodations', label: 'Nhà hàng, Khách sạn, Homestay' },
          { id: 'showcases', label: 'Điểm trưng bày & Giới thiệu' },
          { id: 'media', label: 'Thư viện Ảnh & Video' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setSearchQuery('');
            }}
            className={`px-4 py-2 border-b-2 font-semibold text-xs transition-colors whitespace-nowrap cursor-pointer ${activeTab === tab.id
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search Filter Bar */}
      {activeTab !== 'media' && (
        <Card className="border-border bg-card shadow-2xs">
          <CardContent className="flex gap-3">
            <div className="flex-1">
              <Input
                placeholder="Tìm kiếm điểm du lịch, khách sạn, nhà hàng..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-background border-border text-xs h-9 shadow-none"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Tab View */}
      <div className="space-y-4">
        {activeTab === 'points' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPoints.map((p) => (
              <Card key={p.id} className="border-border bg-card hover:shadow-2xs transition-shadow">
                <CardHeader className="pb-3 flex flex-row items-start justify-between gap-4 flex-wrap">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Badge variant="outline" className="px-1.5 py-0 text-[8.5px] uppercase font-bold text-primary border-primary/20 bg-primary/5">
                        {p.type === 'Historical'
                          ? 'Di tích lịch sử'
                          : p.type === 'Scenic'
                            ? 'Danh thắng tự nhiên'
                            : p.type === 'Checkin'
                              ? 'Điểm check-in'
                              : 'Văn hóa bản địa'}
                      </Badge>
                      <WorkflowStatusBadge status={p.workflowStatus} />
                    </div>
                    <CardTitle className="text-sm font-bold text-foreground leading-tight mt-1">
                      {p.name}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {p.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      onClick={() => {
                        setActiveRecord({ ...p, type: 'point' });
                        setIsDetailOpen(true);
                      }}
                      variant="outline"
                      size="xs"
                      className="h-7 w-7 p-0 cursor-pointer border-border"
                    >
                      <Eye className="size-3.5" />
                    </Button>
                    {(currentRole === 'admin' || currentRole === 'data_officer') && (
                      <>
                        <Button
                          onClick={() => handleOpenEdit(p, 'point')}
                          variant="outline"
                          size="xs"
                          className="h-7 w-7 p-0 cursor-pointer border-border"
                        >
                          <Edit2 className="size-3.5 text-amber-600" />
                        </Button>
                        <Button
                          onClick={() => handleDelete(p.id, 'point', p.name)}
                          variant="outline"
                          size="xs"
                          className="h-7 w-7 p-0 cursor-pointer border-border"
                        >
                          <Trash2 className="size-3.5 text-rose-600" />
                        </Button>
                      </>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex justify-between items-center text-xs text-muted-foreground flex-wrap gap-2">
                  <span className="flex items-center gap-1"><Clock className="size-3.5 text-muted-foreground" /> {p.openingHours}</span>
                  <span className="flex items-center gap-1"><Phone className="size-3.5 text-muted-foreground" /> {p.contact}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'accommodations' && (
          <Card className="border-border bg-card shadow-2xs overflow-hidden pb-0!">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-muted/40 border-b border-border/60 text-muted-foreground font-semibold">
                  <tr>
                    <th className="py-3.5 px-4">Tên cơ sở lưu trú/dịch vụ</th>
                    <th className="py-3.5 px-4">Phân loại</th>
                    <th className="py-3.5 px-4">Đánh giá khách hàng</th>
                    <th className="py-3.5 px-4">Quy mô sức chứa</th>
                    <th className="py-3.5 px-4">Số điện thoại liên hệ</th>
                    <th className="py-3.5 px-4">Quy trình</th>
                    <th className="py-3.5 px-4 text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 font-medium">
                  {filteredAccommodations.map((a) => (
                    <tr key={a.id} className="hover:bg-muted/5 transition-colors">
                      <td className="py-3.5 px-4 text-foreground font-semibold flex items-center gap-1.5">
                        <Bed className="size-3.5 text-indigo-500" />
                        {a.name}
                      </td>
                      <td className="py-3.5 px-4 text-muted-foreground">
                        {a.type === 'Hotel' ? 'Khách sạn' : a.type === 'Homestay' ? 'Homestay' : 'Nhà nghỉ'}
                      </td>
                      <td className="py-3.5 px-4 text-amber-500 font-bold flex items-center gap-1">
                        <Star className="size-3.5 fill-amber-500 text-amber-500" />
                        {a.rating}
                      </td>
                      <td className="py-3.5 px-4 text-foreground font-semibold">{a.capacity}</td>
                      <td className="py-3.5 px-4 text-muted-foreground">{a.contact}</td>
                      <td className="py-3.5 px-4">
                        <WorkflowStatusBadge status={a.workflowStatus} />
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <ActionMenu
                          entityName="cơ sở lưu trú"
                          onView={() => {
                            setActiveRecord({ ...a, type: 'accommodation' });
                            setIsDetailOpen(true);
                          }}
                          onEdit={(currentRole === 'admin' || currentRole === 'data_officer') ? () => handleOpenEdit(a, 'accommodation') : undefined}
                          onDelete={(currentRole === 'admin' || currentRole === 'data_officer') ? () => setAccommodations((prev) => prev.filter((item) => item.id !== a.id)) : undefined}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {activeTab === 'showcases' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredShowcases.map((s) => (
              <Card key={s.id} className="border-border bg-card hover:shadow-2xs transition-shadow">
                <CardHeader className="pb-3 flex flex-row items-start justify-between gap-4 flex-wrap">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Badge variant="outline" className="px-1.5 py-0 text-[8.5px] uppercase font-bold text-primary border-primary/20 bg-primary/5">
                        {s.type === 'Showroom' ? 'Nhà trưng bày OCOP' : 'Gian hàng thổ cẩm'}
                      </Badge>
                      <WorkflowStatusBadge status={s.workflowStatus} />
                    </div>
                    <CardTitle className="text-sm font-bold text-foreground leading-tight mt-1">
                      {s.name}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="size-3.5 text-muted-foreground" />
                      {s.address}
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="pt-2 pb-4">
                  <p className="text-xs text-muted-foreground leading-relaxed bg-muted/20 p-3 rounded-lg border border-border/40">
                    {s.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'media' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {mediaAssets.map((m) => (
              <Card key={m.id} className="border-border bg-card overflow-hidden hover:shadow-2xs transition-shadow flex flex-col pt-0!">
                <div className="aspect-video w-full bg-muted/60 relative flex items-center justify-center overflow-hidden">
                  {m.mediaType === 'image' ? (
                    <img
                      src={m.url}
                      alt={m.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-indigo-950 text-indigo-200 p-4 text-center relative">
                      <Play className="size-8 text-primary fill-primary animate-pulse mb-1" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Video Tư liệu Cửa khẩu</span>
                    </div>
                  )}
                  <Badge className="absolute top-2 left-2 text-[8px] font-bold bg-card/90 border border-border text-foreground hover:bg-card">
                    {m.mediaType.toUpperCase()}
                  </Badge>
                </div>
                <CardHeader className="flex-1 border-b-0">
                  <CardTitle className="text-xs font-bold text-foreground leading-snug">{m.title}</CardTitle>
                  <CardDescription className="text-[10px] leading-relaxed mt-1">{m.caption}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-foreground">
              Chi tiết CSDL Du lịch & Cơ sở
            </DialogTitle>
            <DialogDescription className="text-xs">
              Trích xuất dữ liệu CSDL xã Lao Bảo
            </DialogDescription>
          </DialogHeader>

          {activeRecord && (
            <div className="space-y-4 py-2 text-xs">
              {activeRecord.type === 'point' && (
                <>
                  <div className="p-3 bg-muted/20 border border-border rounded-xl space-y-1">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">Tên địa danh</span>
                    <p className="font-bold text-foreground text-xs leading-normal">{activeRecord.name}</p>
                  </div>
                  <div className="p-3 bg-muted/20 border border-border rounded-xl space-y-1">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">Mô tả chi tiết</span>
                    <p className="font-medium text-foreground leading-normal">{activeRecord.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-muted/20 border border-border rounded-xl">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Giờ mở cửa</span>
                      <p className="font-bold text-foreground mt-0.5">{activeRecord.openingHours}</p>
                    </div>
                    <div className="p-3 bg-muted/20 border border-border rounded-xl">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Liên hệ</span>
                      <p className="font-bold text-foreground mt-0.5">{activeRecord.contact}</p>
                    </div>
                  </div>
                </>
              )}

              {activeRecord.type === 'accommodation' && (
                <>
                  <div className="p-3 bg-muted/20 border border-border rounded-xl space-y-1">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">Tên cơ sở lưu trú</span>
                    <p className="font-bold text-foreground text-xs leading-normal">{activeRecord.name}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-muted/20 border border-border rounded-xl">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Mức xếp hạng</span>
                      <p className="font-bold text-amber-500 mt-0.5">{'★'.repeat(Math.round(activeRecord.rating))} ({activeRecord.rating})</p>
                    </div>
                    <div className="p-3 bg-muted/20 border border-border rounded-xl">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Sức chứa</span>
                      <p className="font-bold text-foreground mt-0.5">{activeRecord.capacity}</p>
                    </div>
                  </div>
                  <div className="p-3 bg-muted/20 border border-border rounded-xl space-y-1">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">Địa chỉ thực tế</span>
                    <p className="font-medium text-foreground leading-normal">{activeRecord.address}</p>
                  </div>
                </>
              )}

              <Separator className="bg-border/60" />

              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-foreground">Trạng thái phê duyệt:</span>
                <WorkflowStatusBadge status={activeRecord.workflowStatus} />
              </div>

              <div className="flex flex-wrap gap-2 pt-2 justify-end border-t border-border/60">
                {activeRecord.workflowStatus === 'draft' && (
                  <Button
                    onClick={() => handleWorkflowAction(activeRecord, activeRecord.type, 'submitted')}
                    size="xs"
                    className="h-8 text-xs cursor-pointer shadow-none"
                  >
                    Trình phê duyệt số liệu
                  </Button>
                )}
                {activeRecord.workflowStatus === 'submitted' && currentRole === 'unit_leader' && (
                  <>
                    <Button
                      onClick={() => handleWorkflowAction(activeRecord, activeRecord.type, 'returned')}
                      variant="destructive"
                      size="xs"
                      className="h-8 text-xs cursor-pointer shadow-none"
                    >
                      Trả lại
                    </Button>
                    <Button
                      onClick={() => handleWorkflowAction(activeRecord, activeRecord.type, 'unit_approved')}
                      variant="default"
                      size="xs"
                      className="h-8 text-xs cursor-pointer shadow-none bg-emerald-600 hover:bg-emerald-700"
                    >
                      Ký duyệt cấp phòng
                    </Button>
                  </>
                )}
                {['submitted', 'unit_approved'].includes(activeRecord.workflowStatus) &&
                  (currentRole === 'data_governance' || currentRole === 'admin') && (
                    <>
                      <Button
                        onClick={() => handleWorkflowAction(activeRecord, activeRecord.type, 'returned')}
                        variant="destructive"
                        size="xs"
                        className="h-8 text-xs cursor-pointer shadow-none"
                      >
                        Trả lại rà soát
                      </Button>
                      <Button
                        onClick={() => handleWorkflowAction(activeRecord, activeRecord.type, 'published')}
                        variant="default"
                        size="xs"
                        className="h-8 text-xs cursor-pointer shadow-none bg-primary"
                      >
                        Công bố chính thức
                      </Button>
                    </>
                  )}
              </div>
            </div>
          )}

          <DialogFooter className="pt-2 border-t border-border/40">
            <DialogClose asChild>
              <Button variant="outline" size="sm" className="h-8 text-xs cursor-pointer shadow-none border-border">
                Đóng
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit/Add Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-foreground">
              {formRecord.id
                ? `Cập nhật ${formType === 'accommodation' ? 'Cơ sở lưu trú' : 'Điểm du lịch'}`
                : `Thêm mới ${formType === 'accommodation' ? 'Cơ sở lưu trú' : 'Điểm du lịch'}`}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Nhập các tham số định danh du lịch xã Lao Bảo.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveForm} className="space-y-4 py-2 text-xs">
            {formType === 'point' && (
              <>
                <div className="grid gap-1.5">
                  <label className="font-bold text-foreground">Tên điểm du lịch / Di tích</label>
                  <Input
                    value={formRecord.name || ''}
                    onChange={(e) => setFormRecord((prev: any) => ({ ...prev, name: e.target.value }))}
                    placeholder="Nhập tên địa danh..."
                    className="bg-background border-border text-xs h-9 shadow-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-1.5">
                    <label className="font-bold text-foreground">Loại điểm tham quan</label>
                    <Select
                      value={formRecord.type || 'Checkin'}
                      onValueChange={(val) => setFormRecord((prev: any) => ({ ...prev, type: val }))}
                    >
                      <SelectTrigger className="w-full h-9 text-xs bg-background border-border shadow-none cursor-pointer">
                        <SelectValue placeholder="Chọn loại điểm" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border text-xs">
                        <SelectItem value="Historical" className="cursor-pointer">Di tích lịch sử</SelectItem>
                        <SelectItem value="Scenic" className="cursor-pointer">Danh thắng tự nhiên</SelectItem>
                        <SelectItem value="Checkin" className="cursor-pointer">Điểm Check-in</SelectItem>
                        <SelectItem value="Cultural" className="cursor-pointer">Văn hóa bản địa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-1.5">
                    <label className="font-bold text-foreground">Thôn trực thuộc</label>
                    <Select
                      value={formRecord.villageCode || 'ka-tang'}
                      onValueChange={(val) => setFormRecord((prev: any) => ({ ...prev, villageCode: val }))}
                    >
                      <SelectTrigger className="w-full h-9 text-xs bg-background border-border shadow-none cursor-pointer">
                        <SelectValue placeholder="Chọn thôn" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border text-xs">
                        {VILLAGES.map((v) => (
                          <SelectItem key={v.code} value={v.code} className="cursor-pointer">
                            Thôn {v.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-1.5">
                  <label className="font-bold text-foreground">Giờ hoạt động</label>
                  <Input
                    value={formRecord.openingHours || ''}
                    onChange={(e) => setFormRecord((prev: any) => ({ ...prev, openingHours: e.target.value }))}
                    placeholder="Ví dụ: 08:00 - 17:00..."
                    className="bg-background border-border text-xs h-9 shadow-none"
                  />
                </div>
                <div className="grid gap-1.5">
                  <label className="font-bold text-foreground">Số điện thoại / Quản lý</label>
                  <Input
                    value={formRecord.contact || ''}
                    onChange={(e) => setFormRecord((prev: any) => ({ ...prev, contact: e.target.value }))}
                    className="bg-background border-border text-xs h-9 shadow-none"
                  />
                </div>
                <div className="grid gap-1.5">
                  <label className="font-bold text-foreground">Mô tả tóm tắt</label>
                  <textarea
                    value={formRecord.description || ''}
                    onChange={(e) => setFormRecord((prev: any) => ({ ...prev, description: e.target.value }))}
                    placeholder="Mô tả..."
                    className="w-full min-h-[60px] rounded-md border border-border bg-background px-3 py-2 text-xs focus-visible:outline-hidden"
                  />
                </div>
              </>
            )}

            {formType === 'accommodation' && (
              <>
                <div className="grid gap-1.5">
                  <label className="font-bold text-foreground">Tên cơ sở lưu trú</label>
                  <Input
                    value={formRecord.name || ''}
                    onChange={(e) => setFormRecord((prev: any) => ({ ...prev, name: e.target.value }))}
                    placeholder="Nhập tên khách sạn, homestay..."
                    className="bg-background border-border text-xs h-9 shadow-none"
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="grid gap-1.5">
                    <label className="font-bold text-foreground">Loại hình</label>
                    <Select
                      value={formRecord.type || 'Hotel'}
                      onValueChange={(val) => setFormRecord((prev: any) => ({ ...prev, type: val }))}
                    >
                      <SelectTrigger className="w-full h-9 text-xs bg-background border-border shadow-none cursor-pointer">
                        <SelectValue placeholder="Chọn loại hình" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border text-xs">
                        <SelectItem value="Hotel" className="cursor-pointer">Khách sạn</SelectItem>
                        <SelectItem value="Homestay" className="cursor-pointer">Homestay</SelectItem>
                        <SelectItem value="Motel" className="cursor-pointer">Nhà nghỉ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-1.5">
                    <label className="font-bold text-foreground">Sao đánh giá</label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formRecord.rating || ''}
                      onChange={(e) => setFormRecord((prev: any) => ({ ...prev, rating: Number(e.target.value) }))}
                      className="bg-background border-border text-xs h-9 shadow-none"
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <label className="font-bold text-foreground">Liên hệ</label>
                    <Input
                      value={formRecord.contact || ''}
                      onChange={(e) => setFormRecord((prev: any) => ({ ...prev, contact: e.target.value }))}
                      className="bg-background border-border text-xs h-9 shadow-none"
                    />
                  </div>
                </div>
                <div className="grid gap-1.5">
                  <label className="font-bold text-foreground">Quy mô phòng nghỉ</label>
                  <Input
                    value={formRecord.capacity || ''}
                    onChange={(e) => setFormRecord((prev: any) => ({ ...prev, capacity: e.target.value }))}
                    placeholder="Ví dụ: 25 phòng nghỉ..."
                    className="bg-background border-border text-xs h-9 shadow-none"
                  />
                </div>
                <div className="grid gap-1.5">
                  <label className="font-bold text-foreground">Địa chỉ chi tiết</label>
                  <Input
                    value={formRecord.address || ''}
                    onChange={(e) => setFormRecord((prev: any) => ({ ...prev, address: e.target.value }))}
                    className="bg-background border-border text-xs h-9 shadow-none"
                  />
                </div>
              </>
            )}

            <DialogFooter className="pt-2 border-t border-border/40 gap-2">
              <DialogClose asChild>
                <Button variant="outline" size="sm" className="h-9 text-xs cursor-pointer shadow-none border-border">
                  Hủy
                </Button>
              </DialogClose>
              <Button type="submit" size="sm" className="h-9 text-xs cursor-pointer shadow-none">
                Lưu lại
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
