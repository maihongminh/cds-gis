// src/app/dashboard/map/layers/page.tsx
'use client';

import * as React from 'react';
import { useTenant } from '@/components/layout/tenant-context';
import {
  Button,
  Card,
  CardContent,
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
  Layers,
  Plus,
  Edit2,
  Trash2,
  Lock,
  Globe,
  Settings,
  Info,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';
import { ActionMenu, PageHeader } from '@/components/common';
import Link from 'next/link';
import { INITIAL_MAP_LAYERS, MapLayer, MapDataGroup } from '@/data/mock-map-layers';

export default function LayersManagementPage() {
  const { currentRole } = useTenant();
  const [layers, setLayers] = React.useState<MapLayer[]>(INITIAL_MAP_LAYERS);
  const [searchQuery, setSearchQuery] = React.useState('');

  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [formRecord, setFormRecord] = React.useState<any>({});

  const isEditable = ['admin', 'data_governance'].includes(currentRole || '');

  const filteredLayers = layers.filter((l) =>
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.source.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRecord.name) {
      toast.error('Vui lòng nhập tên lớp bản đồ.');
      return;
    }

    if (formRecord.id) {
      setLayers((prev) => prev.map((l) => l.id === formRecord.id ? { ...l, ...formRecord } : l));
      toast.success('Đã cập nhật cấu hình lớp bản đồ GIS!');
    } else {
      const newLayer: MapLayer = {
        id: `layer-${Date.now()}`,
        name: formRecord.name,
        dataGroup: formRecord.dataGroup || 'land',
        geometryType: formRecord.geometryType || 'point',
        order: layers.length + 1,
        visibleByDefault: formRecord.visibleByDefault ?? true,
        styleConfig: { color: formRecord.color || '#3b82f6', weight: 2 },
        securityLevel: formRecord.securityLevel || 'public',
        allowedRoles: formRecord.securityLevel === 'confidential' ? ['admin', 'data_governance', 'commune_leader'] : ['admin', 'data_officer', 'unit_leader', 'data_governance', 'commune_leader'],
        source: formRecord.source || 'UBND xã Lao Bảo',
        updateFrequency: formRecord.updateFrequency || 'Hằng năm',
        status: formRecord.status || 'active',
      };
      setLayers((prev) => [...prev, newLayer]);
      toast.success('Đã khởi tạo lớp bản đồ mới thành công!');
    }
    setIsFormOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Xóa cấu hình lớp bản đồ: ${name}?`)) return;
    setLayers((prev) => prev.filter((l) => l.id !== id));
    toast.info(`Đã gỡ bỏ cấu hình lớp bản đồ: ${name}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Back to map header link */}
      <div className="flex items-center gap-2">
        <Link href="/dashboard/map" className="text-primary hover:underline flex items-center gap-1 font-semibold">
          <ArrowLeft className="size-3.5" /> Quay lại Bản đồ số
        </Link>
      </div>

      {/* Header */}
      <PageHeader
        title={
          <>
            <Layers className="w-6 h-6 text-primary" />
            Cấu hình Lớp bản đồ GIS
          </>
        }
        description="Quản lý danh mục lớp không gian bản đồ số xã Lao Bảo, gán nhóm quyền và mức độ bảo mật dữ liệu."
        actions={
          isEditable && (
            <Button
              onClick={() => {
                setFormRecord({ name: '', dataGroup: 'land', geometryType: 'point', securityLevel: 'public', visibleByDefault: true, color: '#3b82f6', source: '', updateFrequency: 'Hằng năm', status: 'active' });
                setIsFormOpen(true);
              }}
              size="sm"
              className="h-9 text-xs cursor-pointer gap-1.5 shadow-none font-semibold"
            >
              <Plus className="size-4" />
              Thêm lớp mới
            </Button>
          )
        }
      />

      {/* Info warning */}
      <Card className="border-border bg-card p-4 flex gap-3">
        <div className="flex gap-2">
          <Info className="size-5 text-primary shrink-0" />
          <p className="text-xs text-muted-foreground leading-normal">
            <strong>Lưu ý về phân quyền GIS:</strong><br /> Các lớp bản đồ thiết lập mức bảo mật <code className="bg-rose-500/10 px-1 py-0.5 rounded text-rose-600 font-bold">confidential</code> chỉ hiển thị cho các tài khoản chuyên trách quốc phòng/lãnh đạo xã. Mọi thao tác biên tập đều ghi lại nhật ký giám sát.
          </p>
        </div>
      </Card>

      {/* Search and Filters */}
      <Card className="border-border bg-card shadow-2xs">
        <CardContent className="p-4">
          <Input
            placeholder="Tìm kiếm lớp bản đồ nền, nguồn dữ liệu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-background border-border text-xs h-9 shadow-none"
          />
        </CardContent>
      </Card>

      {/* Table Layers */}
      <Card className="border-border bg-card shadow-2xs overflow-hidden pb-0!">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-muted/40 border-b border-border/60 text-muted-foreground font-semibold">
              <tr>
                <th className="py-3.5 px-4">Tên lớp dữ liệu GIS</th>
                <th className="py-3.5 px-4">Nhóm chuyên đề</th>
                <th className="py-3.5 px-4">Dạng hình học</th>
                <th className="py-3.5 px-4">Nguồn dữ liệu</th>
                <th className="py-3.5 px-4">Tần suất cập nhật</th>
                <th className="py-3.5 px-4">Cấp bảo mật</th>
                <th className="py-3.5 px-4">Trạng thái</th>
                {isEditable && <th className="py-3.5 px-4 text-center">Thao tác</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 font-medium">
              {filteredLayers.map((l) => (
                <tr key={l.id} className="hover:bg-muted/5 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-foreground flex items-center gap-1.5">
                    <span className="size-2.5 rounded-full shrink-0" style={{ backgroundColor: l.styleConfig.color }} />
                    {l.name}
                  </td>
                  <td className="py-3.5 px-4 text-muted-foreground uppercase font-bold text-[9px]">{l.dataGroup}</td>
                  <td className="py-3.5 px-4 text-muted-foreground font-semibold">{l.geometryType === 'point' ? 'Điểm (Point)' : l.geometryType === 'line' ? 'Đường (Line)' : 'Vùng (Polygon)'}</td>
                  <td className="py-3.5 px-4 text-muted-foreground">{l.source}</td>
                  <td className="py-3.5 px-4 text-muted-foreground">{l.updateFrequency}</td>
                  <td className="py-3.5 px-4">
                    <Badge variant="outline" className={`text-[9px] px-1.5 py-0 font-bold uppercase ${l.securityLevel === 'confidential' ? 'bg-rose-500/10 text-rose-600 border-rose-500/20' : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'}`}>
                      {l.securityLevel === 'confidential' ? 'CONFIDENTIAL (Mật)' : 'PUBLIC'}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant="outline" className={`text-[9px] px-1.5 py-0 font-bold uppercase ${l.status === 'active' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-muted/40 text-muted-foreground border-border'}`}>
                      {l.status === 'active' ? 'Hoạt động' : 'Ngừng'}
                    </Badge>
                  </td>
                  {isEditable && (
                    <td className="py-3.5 px-4 text-center">
                      <ActionMenu
                        entityName="lớp bản đồ"
                        onEdit={() => { setFormRecord({ ...l, color: l.styleConfig.color }); setIsFormOpen(true); }}
                        onDelete={() => setLayers((prev) => prev.filter((item) => item.id !== l.id))}
                      />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ─── Layer Edit Form Dialog ─── */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-foreground">
              {formRecord.id ? 'Biên tập lớp bản đồ' : 'Khởi tạo lớp bản đồ số mới'}
            </DialogTitle>
            <DialogDescription className="text-xs">Đồng bộ chuẩn cơ sở dữ liệu không gian xã Lao Bảo.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveForm} className="space-y-4 py-2 text-xs">
            <div className="grid gap-1.5">
              <label className="font-bold text-foreground">Tên lớp dữ liệu GIS</label>
              <Input value={formRecord.name || ''} onChange={(e) => setFormRecord((p: any) => ({ ...p, name: e.target.value }))} placeholder="VD: Lớp hạ tầng thủy lợi..." className="bg-background border-border text-xs h-9 shadow-none" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <label className="font-bold text-foreground">Nhóm dữ liệu chuyên ngành</label>
                <Select
                  value={formRecord.dataGroup || 'land'}
                  onValueChange={(val) => setFormRecord((p: any) => ({ ...p, dataGroup: val }))}
                >
                  <SelectTrigger className="w-full h-9 text-xs bg-background border-border shadow-none cursor-pointer">
                    <SelectValue placeholder="Chọn nhóm" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border text-xs">
                    <SelectItem value="administrative" className="cursor-pointer">Hành chính &amp; Dân cư</SelectItem>
                    <SelectItem value="economy" className="cursor-pointer">Kinh tế</SelectItem>
                    <SelectItem value="tourism" className="cursor-pointer">Du lịch &amp; Dịch vụ</SelectItem>
                    <SelectItem value="land" className="cursor-pointer">Đất đai &amp; Quy hoạch</SelectItem>
                    <SelectItem value="agriculture" className="cursor-pointer">Nông nghiệp</SelectItem>
                    <SelectItem value="education" className="cursor-pointer">Giáo dục</SelectItem>
                    <SelectItem value="health" className="cursor-pointer">Y tế</SelectItem>
                    <SelectItem value="disaster" className="cursor-pointer">Thiên tai &amp; Khẩn cấp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1.5">
                <label className="font-bold text-foreground">Dạng hình học</label>
                <Select
                  value={formRecord.geometryType || 'point'}
                  onValueChange={(val) => setFormRecord((p: any) => ({ ...p, geometryType: val }))}
                >
                  <SelectTrigger className="w-full h-9 text-xs bg-background border-border shadow-none cursor-pointer">
                    <SelectValue placeholder="Chọn dạng" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border text-xs">
                    <SelectItem value="point" className="cursor-pointer">Điểm (Point)</SelectItem>
                    <SelectItem value="line" className="cursor-pointer">Đường (Line)</SelectItem>
                    <SelectItem value="polygon" className="cursor-pointer">Vùng (Polygon)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <label className="font-bold text-foreground">Cấp độ bảo mật</label>
                <Select
                  value={formRecord.securityLevel || 'public'}
                  onValueChange={(val) => setFormRecord((p: any) => ({ ...p, securityLevel: val }))}
                >
                  <SelectTrigger className="w-full h-9 text-xs bg-background border-border shadow-none cursor-pointer">
                    <SelectValue placeholder="Chọn độ bảo mật" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border text-xs">
                    <SelectItem value="public" className="cursor-pointer">Công khai</SelectItem>
                    <SelectItem value="confidential" className="cursor-pointer">Bảo mật / Mật</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1.5">
                <label className="font-bold text-foreground">Mã màu ký hiệu style (Hex)</label>
                <Input value={formRecord.color || '#3b82f6'} onChange={(e) => setFormRecord((p: any) => ({ ...p, color: e.target.value }))} className="bg-background border-border text-xs h-9 shadow-none" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <label className="font-bold text-foreground">Cơ quan phụ trách</label>
                <Input value={formRecord.source || ''} onChange={(e) => setFormRecord((p: any) => ({ ...p, source: e.target.value }))} placeholder="VD: Phòng Tài nguyên - Môi trường" className="bg-background border-border text-xs h-9 shadow-none" />
              </div>
              <div className="grid gap-1.5">
                <label className="font-bold text-foreground">Tần suất cập nhật</label>
                <Input value={formRecord.updateFrequency || ''} onChange={(e) => setFormRecord((p: any) => ({ ...p, updateFrequency: e.target.value }))} placeholder="VD: Hằng quý" className="bg-background border-border text-xs h-9 shadow-none" />
              </div>
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
