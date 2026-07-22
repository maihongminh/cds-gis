// src/app/dashboard/map/features/page.tsx
'use client';

import * as React from 'react';
import { useTenant } from '@/components/layout/tenant-context';
import {
  Button,
  Card,
  CardContent,
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
  Compass,
  Plus,
  Edit2,
  Trash2,
  MapPin,
  Link2,
  ArrowLeft,
  Info,
  Layers,
} from 'lucide-react';
import { toast } from 'sonner';
import { ActionMenu, PageHeader } from '@/components/common';
import Link from 'next/link';
import { INITIAL_SPATIAL_FEATURES, SpatialFeature, INITIAL_MAP_LAYERS } from '@/data/mock-map-layers';

export default function FeaturesManagementPage() {
  const { currentRole } = useTenant();
  const [features, setFeatures] = React.useState<SpatialFeature[]>(INITIAL_SPATIAL_FEATURES);
  const [searchQuery, setSearchQuery] = React.useState('');

  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [formRecord, setFormRecord] = React.useState<any>({});

  const isEditable = ['admin', 'data_officer', 'data_governance'].includes(currentRole || '');

  const getLayerName = (layerId: string) => {
    return INITIAL_MAP_LAYERS.find((l) => l.id === layerId)?.name || layerId;
  };

  const filteredFeatures = features.filter((f) => {
    // Hide confidential features if the user doesn't have viewConfidential access
    const layer = INITIAL_MAP_LAYERS.find((l) => l.id === f.layerId);
    if (layer?.securityLevel === 'confidential' && !['admin', 'data_governance', 'commune_leader'].includes(currentRole || '')) {
      return false;
    }
    return f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.description.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRecord.name || !formRecord.coordinatesStr) {
      toast.error('Vui lòng điền đầy đủ thông tin tên và tọa độ.');
      return;
    }

    // Parse coordinates string e.g. "106.582, 16.636"
    const parts = formRecord.coordinatesStr.split(',').map((p: string) => Number(p.trim()));
    if (parts.length !== 2 || isNaN(parts[0]) || isNaN(parts[1])) {
      toast.error('Tọa độ không hợp lệ. Vui lòng nhập định dạng: Longitude, Latitude (VD: 106.582, 16.636)');
      return;
    }

    const geometry = {
      type: 'Point' as const,
      coordinates: [parts[0], parts[1]] as [number, number],
    };

    if (formRecord.id) {
      setFeatures((prev) => prev.map((f) => f.id === formRecord.id ? {
        ...f,
        name: formRecord.name,
        description: formRecord.description,
        layerId: formRecord.layerId,
        geometry,
        linkedEntityType: formRecord.linkedEntityType,
        linkedEntityId: formRecord.linkedEntityId,
      } : f));
      toast.success('Cập nhật đối tượng không gian thành công!');
    } else {
      const newFeature: SpatialFeature = {
        id: `feat-${Date.now()}`,
        layerId: formRecord.layerId || 'layer-education',
        name: formRecord.name,
        description: formRecord.description || '',
        geometry,
        linkedEntityType: formRecord.linkedEntityType || '',
        linkedEntityId: formRecord.linkedEntityId || '',
        properties: {},
      };
      setFeatures((prev) => [...prev, newFeature]);
      toast.success('Khởi tạo đối tượng không gian mới thành công!');
    }
    setIsFormOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Xóa đối tượng không gian: ${name}?`)) return;
    setFeatures((prev) => prev.filter((f) => f.id !== id));
    toast.info(`Đã gỡ bỏ: ${name}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Back link */}
      <div className="flex items-center gap-2">
        <Link href="/dashboard/map" className="text-primary hover:underline flex items-center gap-1 font-semibold">
          <ArrowLeft className="size-3.5" /> Quay lại Bản đồ số
        </Link>
      </div>

      {/* Header */}
      <PageHeader
        title={
          <>
            <MapPin className="w-6 h-6 text-primary" />
            Biên tập Đối tượng Không gian (POIs/Features)
          </>
        }
        description="Quản lý tọa độ hình học GIS và liên kết dữ liệu nghiệp vụ của 9 cụm chuyên ngành."
        actions={
          isEditable && (
            <Button
              onClick={() => {
                setFormRecord({ name: '', description: '', layerId: 'layer-education', coordinatesStr: '106.598, 16.633', linkedEntityType: 'school', linkedEntityId: '' });
                setIsFormOpen(true);
              }}
              size="sm"
              className="h-9 text-xs cursor-pointer gap-1.5 shadow-none font-semibold"
            >
              <Plus className="size-4" />
              Thêm đối tượng
            </Button>
          )
        }
      />

      {/* Link logic help card */}
      <Card className="border-border bg-card p-4 flex gap-3">
        <div className="flex gap-2">
          <Info className="size-5 text-primary shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-foreground">Nguyên tắc chuẩn hóa dữ liệu GIS địa lý:</p>
            <p className="text-muted-foreground leading-normal">
              Không nhân bản (duplicate) các trường dữ liệu kinh tế - xã hội. Bản đồ chỉ lưu giữ tọa độ hình học (geometry) và liên kết khóa ngoài sang cơ sở dữ liệu chuyên ngành thông qua <code className="bg-muted px-1.5 py-0.5 rounded font-mono">linkedEntityType</code> và <code className="bg-muted px-1.5 py-0.5 rounded font-mono">linkedEntityId</code>.
            </p>
          </div>
        </div>
      </Card>

      {/* Search box */}
      <Card className="border-border bg-card shadow-2xs">
        <CardContent className="p-4">
          <Input
            placeholder="Tìm kiếm đối tượng du lịch, trường học, trạm y tế..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-background border-border text-xs h-9 shadow-none"
          />
        </CardContent>
      </Card>

      {/* Features Table */}
      <Card className="border-border bg-card shadow-2xs overflow-hidden pb-0!">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-muted/40 border-b border-border/60 text-muted-foreground font-semibold">
              <tr>
                <th className="py-3.5 px-4">Tên đối tượng không gian</th>
                <th className="py-3.5 px-4">Lớp bản đồ liên kết</th>
                <th className="py-3.5 px-4">Tọa độ địa lý (Long, Lat)</th>
                <th className="py-3.5 px-4">Thực thể nghiệp vụ</th>
                <th className="py-3.5 px-4">Khóa ngoài liên kết</th>
                <th className="py-3.5 px-4">Mô tả ngắn</th>
                {isEditable && <th className="py-3.5 px-4 text-center">Thao tác</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 font-medium">
              {filteredFeatures.map((f) => {
                const coords = f.geometry.coordinates as [number, number];
                return (
                  <tr key={f.id} className="hover:bg-muted/5 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-foreground flex items-center gap-1.5">
                      <MapPin className="size-3.5 text-primary shrink-0" />
                      {f.name}
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground font-semibold">{getLayerName(f.layerId)}</td>
                    <td className="py-3.5 px-4 font-mono text-muted-foreground">{coords[0].toFixed(5)}, {coords[1].toFixed(5)}</td>
                    <td className="py-3.5 px-4 text-muted-foreground font-bold uppercase text-[9px]">{f.linkedEntityType}</td>
                    <td className="py-3.5 px-4 text-muted-foreground font-mono flex items-center gap-1 mt-1.5">
                      <Link2 className="size-3 text-muted-foreground shrink-0" />
                      {f.linkedEntityId || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground max-w-[200px] truncate">{f.description}</td>
                    {isEditable && (
                      <td className="py-3.5 px-4 text-center">
                        <ActionMenu
                          entityName="đối tượng bản đồ"
                          onEdit={() => { setFormRecord({ ...f, coordinatesStr: `${coords[0]}, ${coords[1]}` }); setIsFormOpen(true); }}
                          onDelete={() => setFeatures((prev) => prev.filter((item) => item.id !== f.id))}
                        />
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ─── Add/Edit Feature Dialog ─── */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-foreground">
              {formRecord.id ? 'Biên tập đối tượng không gian' : 'Khởi tạo đối tượng mới'}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Nhập tọa độ chuẩn WGS-84 (GPS) và liên kết dữ liệu chuyên ngành.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveForm} className="space-y-4 py-2 text-xs">
            <div className="grid gap-1.5">
              <label className="font-bold text-foreground">Tên đối tượng (POI)</label>
              <Input value={formRecord.name || ''} onChange={(e) => setFormRecord((p: any) => ({ ...p, name: e.target.value }))} placeholder="VD: Trường Tiểu học Lao Bảo..." className="bg-background border-border text-xs h-9 shadow-none" />
            </div>

            <div className="grid gap-1.5">
              <label className="font-bold text-foreground">Lớp bản đồ phân nhóm</label>
              <Select
                value={formRecord.layerId || 'layer-education'}
                onValueChange={(val) => setFormRecord((p: any) => ({ ...p, layerId: val }))}
              >
                <SelectTrigger className="w-full h-9 text-xs bg-background border-border shadow-none cursor-pointer">
                  <SelectValue placeholder="Chọn lớp bản đồ" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border text-xs">
                  {INITIAL_MAP_LAYERS.map((l) => (
                    <SelectItem key={l.id} value={l.id} className="cursor-pointer">
                      {l.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-1.5">
              <label className="font-bold text-foreground">Tọa độ WGS-84 (Định dạng: Kinh độ, Vĩ độ)</label>
              <Input value={formRecord.coordinatesStr || ''} onChange={(e) => setFormRecord((p: any) => ({ ...p, coordinatesStr: e.target.value }))} placeholder="VD: 106.582, 16.636" className="bg-background border-border text-xs h-9 shadow-none font-mono" />
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div className="grid gap-1.5">
                <label className="font-bold text-foreground">Loại thực thể liên kết</label>
                <Select
                  value={formRecord.linkedEntityType || 'school'}
                  onValueChange={(val) => setFormRecord((p: any) => ({ ...p, linkedEntityType: val }))}
                >
                  <SelectTrigger className="w-full h-9 text-xs bg-background border-border shadow-none cursor-pointer">
                    <SelectValue placeholder="Chọn thực thể liên kết" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border text-xs">
                    <SelectItem value="school" className="cursor-pointer">Trường học / Cấp học</SelectItem>
                    <SelectItem value="healthFacility" className="cursor-pointer">Cơ sở Y tế</SelectItem>
                    <SelectItem value="riskPoint" className="cursor-pointer">Điểm nguy cơ thiên tai</SelectItem>
                    <SelectItem value="monument" className="cursor-pointer">Di tích du lịch</SelectItem>
                    <SelectItem value="defenseSite" className="cursor-pointer">Khu vực Quốc phòng</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1.5">
                <label className="font-bold text-foreground">Mã thực thể liên kết (ID khóa ngoài)</label>
                <Input value={formRecord.linkedEntityId || ''} onChange={(e) => setFormRecord((p: any) => ({ ...p, linkedEntityId: e.target.value }))} placeholder="VD: sch-1" className="bg-background border-border text-xs h-9 shadow-none font-mono" />
              </div>
            </div>

            <div className="grid gap-1.5">
              <label className="font-bold text-foreground">Mô tả ngắn gọn</label>
              <Input value={formRecord.description || ''} onChange={(e) => setFormRecord((p: any) => ({ ...p, description: e.target.value }))} className="bg-background border-border text-xs h-9 shadow-none" />
            </div>

            <DialogFooter className="pt-2 border-t border-border/40 gap-2">
              <DialogClose asChild>
                <Button variant="outline" size="sm" className="h-9 text-xs cursor-pointer shadow-none border-border">Hủy</Button>
              </DialogClose>
              <Button type="submit" size="sm" className="h-9 text-xs cursor-pointer shadow-none">Lưu lại</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}
