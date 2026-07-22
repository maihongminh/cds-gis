// src/app/dashboard/data-search/page.tsx

'use client';

import * as React from 'react';
import { useTenant } from '@/components/layout/tenant-context';
import { checkPermission } from '@/lib/permissions';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Badge,
} from '@/components/ui';
import { Search, ListFilter, ShieldCheck, ShieldAlert, Eye, EyeOff } from 'lucide-react';
import { MOCK_ORGANIZATIONS } from '@/data/mock-organizations';
import { VILLAGES } from '@/data/laobao-administrative-units';
import { SecurityLevel, WorkflowStatus } from '@/types';
import { SecurityLevelBadge } from '@/components/common/SecurityLevelBadge';
import { WorkflowStatusBadge } from '@/components/common/WorkflowStatusBadge';
import { PageHeader } from '@/components/common';
import { toast } from 'sonner';

interface SearchResultRecord {
  id: string;
  title: string;
  dataGroup: string;
  villageCode: string;
  reportingPeriod: string;
  organizationUnitId: string;
  workflowStatus: WorkflowStatus;
  securityLevel: SecurityLevel;
  previewText: string;
}

const MOCK_SEARCH_RECORDS: SearchResultRecord[] = [
  {
    id: 'rec-1',
    title: 'Hộ tịch & Nhân khẩu thôn Ka Tăng',
    dataGroup: 'population',
    villageCode: '30283-01',
    reportingPeriod: '2026',
    organizationUnitId: 'unit-ubnd',
    workflowStatus: 'published',
    securityLevel: 'public',
    previewText: '1,450 nhân khẩu, 320 hộ gia đình. Tỷ lệ gia tăng dân số tự nhiên: 0.85%.'
  },
  {
    id: 'rec-2',
    title: 'Báo cáo Sản lượng Sắn Ka Tăng Vụ Xuân 2026',
    dataGroup: 'agriculture',
    villageCode: '30283-01',
    reportingPeriod: '2026-M06',
    organizationUnitId: 'unit-eco',
    workflowStatus: 'published',
    securityLevel: 'public',
    previewText: 'Diện tích gieo trồng: 24.4 ha, sản lượng thu hoạch đạt 51.8 tấn sắn củ tươi.'
  },
  {
    id: 'rec-3',
    title: 'Danh sách tiêm vắc-xin LMLM đàn bò Ka Tăng',
    dataGroup: 'agriculture',
    villageCode: '30283-01',
    reportingPeriod: '2026-M06',
    organizationUnitId: 'unit-eco',
    workflowStatus: 'unit_approved',
    securityLevel: 'shared',
    previewText: 'Đã hoàn tất tiêm phòng cho 142 con bò sữa và bò thịt tại địa bàn thôn Ka Tăng.'
  },
  {
    id: 'rec-4',
    title: 'Biên phòng phối hợp tuần tra biên giới mốc 605',
    dataGroup: 'defense',
    villageCode: '30283-01',
    reportingPeriod: '2026-Q1',
    organizationUnitId: 'unit-military',
    workflowStatus: 'published',
    securityLevel: 'confidential',
    previewText: 'Tổ chức tuần tra chung 4 đợt bảo vệ đường biên mốc giới, phát hiện 1 trường hợp xâm nhập trái phép.'
  },
  {
    id: 'rec-5',
    title: 'Hồ sơ kỹ thuật Phương án Phòng thủ xã Lao Bảo',
    dataGroup: 'defense',
    villageCode: 'all',
    reportingPeriod: '2026',
    organizationUnitId: 'unit-military',
    workflowStatus: 'published',
    securityLevel: 'confidential',
    previewText: 'Sơ đồ bố trí trận địa, lực lượng dân quân tự vệ phối hợp khẩn cấp khi có tình huống phòng thủ biên giới.'
  }
];

export default function DataSearchPage() {
  const { currentRole } = useTenant();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [dataGroup, setDataGroup] = React.useState('all');
  const [selectedVillage, setSelectedVillage] = React.useState('all');
  const [selectedOrg, setSelectedOrg] = React.useState('all');
  const [securityLevel, setSecurityLevel] = React.useState('all');

  const getOrgName = (unitId: string) => {
    const org = MOCK_ORGANIZATIONS.find((o) => o.id === unitId);
    return org ? org.name : 'Không xác định';
  };

  const getVillageName = (code: string) => {
    if (code === 'all') return 'Toàn xã';
    const found = VILLAGES.find((v) => v.code === code);
    return found ? found.name : code;
  };

  // Check if current role has access to confidential security level
  const userSecurityLevel: SecurityLevel = React.useMemo(() => {
    if (currentRole === 'admin' || currentRole === 'data_governance' || currentRole === 'commune_leader') {
      return 'confidential';
    }
    if (currentRole === 'unit_leader') {
      return 'shared';
    }
    return 'public';
  }, [currentRole]);

  const hasAccessToLevel = (recordLevel: SecurityLevel) => {
    if (userSecurityLevel === 'confidential') return true;
    if (userSecurityLevel === 'shared') return recordLevel !== 'confidential';
    return recordLevel === 'public';
  };

  const filteredResults = React.useMemo(() => {
    return MOCK_SEARCH_RECORDS.filter((r) => {
      // 1. CONFIDENTIAL SECURITY GUARD CHECK - CRITICAL REQUIREMENT
      if (!hasAccessToLevel(r.securityLevel)) {
        return false;
      }

      // 2. Keyword Filter
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.previewText.toLowerCase().includes(q);

      // 3. Category Filters
      const matchesGroup = dataGroup === 'all' || r.dataGroup === dataGroup;
      const matchesVillage = selectedVillage === 'all' || r.villageCode === selectedVillage;
      const matchesOrg = selectedOrg === 'all' || r.organizationUnitId === selectedOrg;
      const matchesSec = securityLevel === 'all' || r.securityLevel === securityLevel;

      return matchesSearch && matchesGroup && matchesVillage && matchesOrg && matchesSec;
    });
  }, [searchQuery, dataGroup, selectedVillage, selectedOrg, securityLevel, userSecurityLevel]);

  const handleInspect = (r: SearchResultRecord) => {
    toast.success(`Đang trích xuất bản ghi "${r.title}"...`);
  };

  return (
    <div className="space-y-6 pb-10 animate-fade-in">
      <PageHeader
        title={
          <>
            <Search className="w-6 h-6 text-primary" />
            Tra cứu Dữ liệu Đa ngành
          </>
        }
        description="Cổng tra cứu tập trung toàn bộ cơ sở dữ liệu số chỉ tiêu kinh tế xã hội và bảo mật xã Lao Bảo."
      />

      {/* Advanced search panel */}
      <Card className="border-border bg-card shadow-2xs">
        <CardHeader>
          <CardTitle className="text-sm font-bold text-foreground flex items-center gap-1.5">
            <ListFilter className="size-4.5 text-primary" />
            Bộ lọc tra cứu nâng cao
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
            {/* Keyword */}
            <div className="md:col-span-2 grid gap-1.5">
              <Input
                id="search-kw"
                placeholder="Nhập từ khóa tìm kiếm nội dung..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-background border-border text-xs h-9 shadow-none"
              />
            </div>

            {/* Data Group */}
            <Select value={dataGroup} onValueChange={setDataGroup}>
              <SelectTrigger id="search-group" className="bg-background border-border text-xs h-9">
                <SelectValue placeholder="Nhóm dữ liệu" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="cursor-pointer text-xs">Tất cả nhóm</SelectItem>
                <SelectItem value="population" className="cursor-pointer text-xs">Hành chính & Dân cư</SelectItem>
                <SelectItem value="agriculture" className="cursor-pointer text-xs">Nông nghiệp & Môi trường</SelectItem>
                <SelectItem value="defense" className="cursor-pointer text-xs">Quốc phòng - An ninh</SelectItem>
              </SelectContent>
            </Select>

            {/* Village */}
            <Select value={selectedVillage} onValueChange={setSelectedVillage}>
              <SelectTrigger id="search-village" className="bg-background border-border text-xs h-9">
                <SelectValue placeholder="Thôn" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="cursor-pointer text-xs">Tất cả địa bàn</SelectItem>
                {VILLAGES.map((v) => (
                  <SelectItem key={v.code} value={v.code} className="cursor-pointer text-xs">
                    Thôn {v.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Security */}
            <Select value={securityLevel} onValueChange={setSecurityLevel}>
              <SelectTrigger id="search-sec" className="bg-background border-border text-xs h-9">
                <SelectValue placeholder="Độ bảo mật" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="cursor-pointer text-xs">Tất cả mức</SelectItem>
                <SelectItem value="public" className="cursor-pointer text-xs">Công khai (Public)</SelectItem>
                <SelectItem value="shared" className="cursor-pointer text-xs">Nội bộ (Shared)</SelectItem>
                <SelectItem value="confidential" className="cursor-pointer text-xs">Mật (Confidential)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results grid */}
      <div className="space-y-4">
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span>Tìm thấy <strong>{filteredResults.length} bản ghi</strong> khớp điều kiện lọc.</span>
          <span className="bg-primary/5 px-2 py-0.5 border border-primary/20 text-primary font-bold rounded-md">
            Mức truy cập tối đa: {userSecurityLevel.toUpperCase()}
          </span>
        </div>

        {filteredResults.length === 0 ? (
          <div className="border border-border rounded-xl p-10 text-center space-y-3 bg-muted/5 min-h-[200px] flex flex-col justify-center items-center">
            <Search className="size-8 text-muted-foreground/60 mb-2" />
            <h3 className="text-xs font-bold text-foreground">Không tìm thấy bản ghi</h3>
            <p className="text-[10px] text-muted-foreground max-w-sm">
              Không có chỉ mục số liệu nào khớp với từ khóa hoặc bạn không có cấp độ clearance bảo mật để xem các chỉ tiêu này.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {filteredResults.map((r) => (
              <Card key={r.id} className="border-border bg-card hover:shadow-2xs transition-shadow">
                <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Badge variant="outline" className="px-1.5 py-0 text-[8.5px] uppercase font-bold text-primary border-primary/20 bg-primary/5">
                        {r.dataGroup}
                      </Badge>
                      <SecurityLevelBadge level={r.securityLevel} showIcon={false} />
                      <WorkflowStatusBadge status={r.workflowStatus} />
                    </div>
                    <h3 className="text-xs font-bold text-foreground leading-tight truncate">
                      {r.title}
                    </h3>
                    <p className="text-[11px] text-muted-foreground italic leading-relaxed">
                      &quot;{r.previewText}&quot;
                    </p>
                    <p className="text-[10px] text-muted-foreground/80 font-medium">
                      Đơn vị: {getOrgName(r.organizationUnitId)} | Địa bàn: {getVillageName(r.villageCode)} | Kỳ: {r.reportingPeriod}
                    </p>
                  </div>

                  <div className="flex items-center shrink-0">
                    <Button
                      onClick={() => handleInspect(r)}
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs cursor-pointer gap-1 px-3 shadow-none"
                    >
                      <Eye className="size-3.5" />
                      Chi tiết
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
