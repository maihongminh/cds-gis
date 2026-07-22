// src/app/dashboard/data-templates/page.tsx

'use client';

import * as React from 'react';
import { useTenant } from '@/components/layout/tenant-context';
import { canPerform } from '@/lib/rbac';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
  Badge,
} from '@/components/ui';
import { LayoutGrid, Download, Plus, FileText, CheckCircle2, ShieldAlert, Settings, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/common';
import { MOCK_ORGANIZATIONS } from '@/data/mock-organizations';

interface TemplateField {
  code: string;
  name: string;
  type: string;
  required: boolean;
  validation?: string;
}

interface DataTemplate {
  id: string;
  name: string;
  code: string;
  dataGroup: string;
  version: string;
  ownerUnitId: string;
  frequency: string;
  fieldsCount: number;
  status: 'active' | 'draft';
  fields: TemplateField[];
}

const MOCK_TEMPLATES: DataTemplate[] = [
  {
    id: 'tpl-households',
    name: 'Kê khai Nhân khẩu & Hộ gia đình',
    code: 'TPL-HH-01',
    dataGroup: 'Dân cư',
    version: '1.2',
    ownerUnitId: 'unit-ubnd',
    frequency: 'Hàng năm',
    fieldsCount: 8,
    status: 'active',
    fields: [
      { code: 'householdCode', name: 'Mã hộ khẩu', type: 'Chuỗi (String)', required: true },
      { code: 'headFullName', name: 'Họ tên chủ hộ', type: 'Chuỗi (String)', required: true },
      { code: 'memberCount', name: 'Số thành viên', type: 'Số nguyên (Integer)', required: true, validation: '>= 1' },
      { code: 'isPoor', name: 'Hộ nghèo', type: 'Boolean (Yes/No)', required: true },
      { code: 'villageCode', name: 'Mã thôn/thôn', type: 'Danh mục', required: true },
    ],
  },
  {
    id: 'tpl-crops',
    name: 'Báo cáo Sản lượng Cây trồng',
    code: 'TPL-AGRI-01',
    dataGroup: 'Nông nghiệp',
    version: '2.0',
    ownerUnitId: 'unit-eco',
    frequency: 'Hàng vụ',
    fieldsCount: 6,
    status: 'active',
    fields: [
      { code: 'cropType', name: 'Loại cây trồng', type: 'Danh mục', required: true },
      { code: 'area', name: 'Diện tích (ha)', type: 'Số thực (Float)', required: true, validation: '> 0' },
      { code: 'yield', name: 'Năng suất (tạ/ha)', type: 'Số thực (Float)', required: true },
      { code: 'production', name: 'Sản lượng (tấn)', type: 'Số thực (Float)', required: true },
      { code: 'villageCode', name: 'Mã thôn/thôn', type: 'Danh mục', required: true },
    ],
  },
  {
    id: 'tpl-livestock',
    name: 'Kê khai Đàn Gia súc, Gia cầm',
    code: 'TPL-AGRI-02',
    dataGroup: 'Nông nghiệp',
    version: '1.0',
    ownerUnitId: 'unit-eco',
    frequency: 'Hàng tháng',
    fieldsCount: 5,
    status: 'active',
    fields: [
      { code: 'animalType', name: 'Loại vật nuôi', type: 'Danh mục', required: true },
      { code: 'headCount', name: 'Số lượng con', type: 'Số nguyên (Integer)', required: true, validation: '>= 0' },
      { code: 'diseaseStatus', name: 'Tình trạng dịch bệnh', type: 'Danh mục', required: true },
      { code: 'reportingPeriod', name: 'Kỳ báo cáo', type: 'Chuỗi (String)', required: true },
    ],
  },
  {
    id: 'tpl-tourism',
    name: 'Báo cáo Thống kê Du lịch xã',
    code: 'TPL-TOUR-01',
    dataGroup: 'Du lịch',
    version: '1.1',
    ownerUnitId: 'unit-culture',
    frequency: 'Hàng quý',
    fieldsCount: 7,
    status: 'active',
    fields: [
      { code: 'visitorCount', name: 'Lượt khách du lịch', type: 'Số nguyên (Integer)', required: true },
      { code: 'revenue', name: 'Doanh thu (triệu VNĐ)', type: 'Số thực (Float)', required: true },
      { code: 'homestayCount', name: 'Số homestay hoạt động', type: 'Số nguyên (Integer)', required: true },
    ],
  },
];

export default function DataTemplatesPage() {
  const { currentRole } = useTenant();
  const [selectedTpl, setSelectedTpl] = React.useState<DataTemplate>(MOCK_TEMPLATES[0]);

  // Check if current role has governance authority
  const hasGovernancePermission = React.useMemo(() => {
    return currentRole === 'admin' || currentRole === 'data_governance';
  }, [currentRole]);

  const getOrgName = (unitId: string) => {
    const org = MOCK_ORGANIZATIONS.find((o) => o.id === unitId);
    return org ? org.name : 'Không xác định';
  };

  const handleDownloadExcel = (tpl: DataTemplate) => {
    toast.success(`Đã xuất và tải về biểu mẫu Excel chuẩn: ${tpl.code}`, {
      description: 'Tệp tải xuống chứa cấu trúc trường dữ liệu mẫu đã được khóa bảo vệ.',
      icon: <Download className="size-4 text-emerald-500" />
    });
  };

  const handleEditTemplate = (tpl: DataTemplate) => {
    if (!hasGovernancePermission) {
      toast.error('Quyền hạn bị từ chối! Chỉ cán bộ Quản trị dữ liệu hoặc Admin mới được phép chỉnh sửa cấu hình biểu mẫu.');
      return;
    }
    toast.info(`Chỉnh sửa cấu trúc biểu mẫu chuẩn: ${tpl.name}`);
  };

  const handleCreateTemplate = () => {
    if (!hasGovernancePermission) {
      toast.error('Quyền hạn bị từ chối! Chỉ cán bộ Quản trị dữ liệu hoặc Admin mới được phép tạo biểu mẫu mới.');
      return;
    }
    toast.info('Tạo cấu trúc dữ liệu biểu mẫu mới.');
  };

  return (
    <div className="space-y-6 pb-10 animate-fade-in">
      {/* Header */}
      <PageHeader
        title={
          <>
            <LayoutGrid className="w-6 h-6 text-primary" />
            Quản lý Biểu mẫu Dữ liệu
          </>
        }
        description="Quản lý danh mục biểu mẫu chỉ tiêu số liệu và chuẩn hóa cấu trúc dữ liệu dùng chung xã Lao Bảo."
        actions={
          <Button
            onClick={handleCreateTemplate}
            disabled={!hasGovernancePermission}
            size="sm"
            className="h-9 text-xs cursor-pointer gap-1.5 shadow-none"
          >
            <Plus className="size-4" />
            Tạo biểu mẫu mới
          </Button>
        }
      />

      {/* Grid: Left templates list, Right fields definition details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left List Card */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="border-border bg-card shadow-2xs">
            <CardHeader>
              <CardTitle className="text-sm font-bold text-foreground">Danh mục biểu mẫu chuẩn</CardTitle>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-border/60">
              {MOCK_TEMPLATES.map((tpl) => {
                const isSelected = selectedTpl.id === tpl.id;
                return (
                  <div
                    key={tpl.id}
                    onClick={() => setSelectedTpl(tpl)}
                    className={`p-4 flex flex-col gap-2.5 transition-all cursor-pointer hover:bg-muted/5 ${isSelected ? 'bg-primary/15 border-primary' : ''
                      }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                        {tpl.code}
                      </span>
                      <Badge variant="outline" className="px-1.5 py-px text-[8px] font-semibold bg-emerald-500/5 text-emerald-700 dark:text-emerald-400 border-emerald-500/20">
                        Đang áp dụng
                      </Badge>
                    </div>

                    <div>
                      <h3 className="text-xs font-bold text-foreground leading-snug">{tpl.name}</h3>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{getOrgName(tpl.ownerUnitId)}</p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between text-[10px] text-muted-foreground gap-2 pt-1">
                      <span className="bg-muted/60 px-2 py-0.5 rounded-sm">
                        Lĩnh vực: {tpl.dataGroup}
                      </span>
                      <span>{tpl.fieldsCount} chỉ tiêu</span>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Right Details Panel */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-border bg-card shadow-2xs @container/card">
            <CardHeader className="flex flex-col @xl:flex-row @xl:items-center @xl:justify-between gap-4">
              <div className="space-y-1 grow">
                <CardTitle className="text-sm font-bold text-foreground flex items-center gap-1.5">
                  <FileText className="size-4.5 text-primary" />
                  Cấu trúc chỉ tiêu: {selectedTpl.name}
                </CardTitle>
                <CardDescription className="text-xs">
                  Thiết lập chuẩn hóa schema dữ liệu cho vai trò nhập liệu báo cáo.
                </CardDescription>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  onClick={() => handleDownloadExcel(selectedTpl)}
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs cursor-pointer gap-1.5 shadow-none"
                >
                  <Download className="size-3.5" />
                  Tải file mẫu
                </Button>
                <Button
                  onClick={() => handleEditTemplate(selectedTpl)}
                  variant="default"
                  size="sm"
                  disabled={!hasGovernancePermission}
                  className="h-8 text-xs cursor-pointer gap-1.5 shadow-none"
                >
                  <Settings className="size-3.5" />
                  Cấu hình schema
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Header details info */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 border border-border/60 rounded-xl bg-muted/20 text-xs">
                <div>
                  <span className="text-[10px] text-muted-foreground font-semibold">Đơn vị chủ trì</span>
                  <p className="font-bold text-foreground mt-0.5">{getOrgName(selectedTpl.ownerUnitId)}</p>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground font-semibold">Chu kỳ cập nhật</span>
                  <p className="font-bold text-foreground mt-0.5">{selectedTpl.frequency}</p>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground font-semibold">Phiên bản thiết kế</span>
                  <p className="font-bold text-foreground mt-0.5">v{selectedTpl.version}</p>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground font-semibold">Quyền Governance</span>
                  <div className="flex items-center gap-1 mt-0.5">
                    {hasGovernancePermission ? (
                      <Badge variant="default" className="text-[8px] bg-emerald-500 hover:bg-emerald-600 px-1 py-px rounded font-bold">Cho phép</Badge>
                    ) : (
                      <Badge variant="secondary" className="text-[8px] bg-muted px-1 py-px rounded font-bold">Chỉ xem</Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Fields Table */}
              <div className="space-y-3.5">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Danh sách trường chỉ tiêu dữ liệu
                </h3>
                <div className="border border-border/60 rounded-lg overflow-hidden">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead className="bg-muted/40 border-b border-border/60 text-muted-foreground font-semibold">
                      <tr>
                        <th className="py-2.5 px-3">Mã trường (Field Key)</th>
                        <th className="py-2.5 px-3">Tên trường (Label)</th>
                        <th className="py-2.5 px-3">Kiểu dữ liệu (Type)</th>
                        <th className="py-2.5 px-3 text-center">Bắt buộc</th>
                        <th className="py-2.5 px-3">Ràng buộc (Validation)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {selectedTpl.fields.map((f) => (
                        <tr key={f.code} className="hover:bg-muted/5 transition-colors">
                          <td className="py-2.5 px-3 font-semibold text-foreground">{f.code}</td>
                          <td className="py-2.5 px-3 text-muted-foreground">{f.name}</td>
                          <td className="py-2.5 px-3 text-muted-foreground">{f.type}</td>
                          <td className="py-2.5 px-3 text-center">
                            {f.required ? (
                              <Badge variant="default" className="text-[8px] bg-rose-500 hover:bg-rose-600 px-1.5 py-px">Bắt buộc</Badge>
                            ) : (
                              <span className="text-muted-foreground/40">—</span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-muted-foreground font-medium">{f.validation || 'Không có'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Governance message check */}
              {!hasGovernancePermission && (
                <div className="rounded-lg bg-amber-500/5 border border-amber-500/20 p-3.5 flex gap-2 items-start text-xs text-amber-700 dark:text-amber-400">
                  <ShieldAlert className="size-4 shrink-0 mt-0.5" />
                  <span>
                    Tài khoản của bạn có vai trò <strong>{currentRole}</strong> (Chỉ xem/Nhập liệu). Bạn không thể thay đổi thiết kế cấu trúc biểu mẫu này. Vui lòng liên hệ cán bộ Văn phòng UBND để đề xuất thay đổi.
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
