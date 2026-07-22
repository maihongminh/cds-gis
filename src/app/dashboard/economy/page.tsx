// src/app/dashboard/economy/page.tsx

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
  Briefcase,
  Building,
  Store,
  Award,
  TrendingUp,
  Wallet,
  Wrench,
  Plus,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  FileSpreadsheet,
  MapPin,
  Map,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { toast } from 'sonner';
import { ActionMenu, PageHeader } from '@/components/common';
import { WorkflowStatusBadge } from '@/components/common/WorkflowStatusBadge';
import { SecurityLevelBadge } from '@/components/common/SecurityLevelBadge';
import { VILLAGES } from '@/data/laobao-administrative-units';
import { WorkflowStatus, SecurityLevel } from '@/types';
import { BudgetRevenueTimeSeriesChart } from '../components/charts/budget-revenue-time-series-chart';
import { InvestmentTrendChart } from '../components/charts/investment-trend-chart';

// Interfaces
interface BusinessEntity {
  id: string;
  name: string;
  organizationType: 'Enterprise' | 'Cooperative' | 'CooperativeGroup' | 'BusinessHousehold';
  taxCode: string;
  villageCode: string;
  address: string;
  industry: string;
  registeredCapital: number;
  status: 'Active' | 'Paused' | 'Dissolved';
  establishedDate: string;
  workflowStatus: WorkflowStatus;
  securityLevel: SecurityLevel;
}

interface MarketPoint {
  id: string;
  name: string;
  type: 'Market' | 'Mall' | 'Logistics' | 'ServicePoint';
  address: string;
  scale: string;
  managingUnit: string;
  workflowStatus: WorkflowStatus;
}

interface OcopProduct {
  id: string;
  productName: string;
  ownerName: string;
  starRating: number;
  recognitionYear: number;
  revenueAnnually: number;
  workflowStatus: WorkflowStatus;
}

interface PublicInvestment {
  id: string;
  projectName: string;
  investor: string;
  totalInvestment: number;
  fundingSource: string;
  disbursementInPeriod: number;
  cumulativeDisbursement: number;
  progressPercent: number;
  workflowStatus: WorkflowStatus;
}

const INITIAL_BUSINESSES: BusinessEntity[] = [
  {
    id: 'biz-1',
    name: 'Công ty Cổ phần Thương mại & Logistics Cửa khẩu Lao Bảo',
    organizationType: 'Enterprise',
    taxCode: '3200123456',
    villageCode: 'ka-tang',
    address: 'Thôn Ka Tăng, Xã Lao Bảo, Tỉnh Quảng Trị',
    industry: 'Logistics & Vận tải',
    registeredCapital: 12000000000,
    status: 'Active',
    establishedDate: '2018-05-14',
    workflowStatus: 'published',
    securityLevel: 'public',
  },
  {
    id: 'biz-2',
    name: 'HTX Nông nghiệp sạch Chế biến Dược liệu Lao Bảo',
    organizationType: 'Cooperative',
    taxCode: '3200123987',
    villageCode: 'tan-thanh',
    address: 'Thôn Tân Thành, Xã Lao Bảo, Tỉnh Quảng Trị',
    industry: 'Sản xuất & Chế biến Dược liệu',
    registeredCapital: 3500000000,
    status: 'Active',
    establishedDate: '2021-09-20',
    workflowStatus: 'published',
    securityLevel: 'public',
  },
  {
    id: 'biz-3',
    name: 'Tổ hợp tác Trồng chuối lùn Ka Tăng xuất khẩu',
    organizationType: 'CooperativeGroup',
    taxCode: '3200543210',
    villageCode: 'ka-tang',
    address: 'Thôn Ka Tăng, Xã Lao Bảo, Tỉnh Quảng Trị',
    industry: 'Trồng trọt & Xuất khẩu chuối',
    registeredCapital: 450000000,
    status: 'Active',
    establishedDate: '2022-03-11',
    workflowStatus: 'published',
    securityLevel: 'public',
  },
  {
    id: 'biz-4',
    name: 'Hộ kinh doanh Homestay & Ẩm thực Ka Tăng Border',
    organizationType: 'BusinessHousehold',
    taxCode: '8123456789',
    villageCode: 'ka-tang',
    address: 'Bản Ka Tăng, Xã Lao Bảo, Tỉnh Quảng Trị',
    industry: 'Lưu trú & Dịch vụ ẩm thực',
    registeredCapital: 250000000,
    status: 'Active',
    establishedDate: '2023-06-15',
    workflowStatus: 'draft',
    securityLevel: 'public',
  }
];

const INITIAL_MARKETS: MarketPoint[] = [
  {
    id: 'mkt-1',
    name: 'Chợ Trung tâm Lao Bảo',
    type: 'Market',
    address: 'Thôn Vĩnh Đông, Xã Lao Bảo',
    scale: 'Hạng 1 - Quy mô 350 ki-ốt thương mại',
    managingUnit: 'Ban Quản lý Chợ Lao Bảo',
    workflowStatus: 'published',
  },
  {
    id: 'mkt-2',
    name: 'Trung tâm Thương mại Quốc tế Lao Bảo',
    type: 'Mall',
    address: 'Thôn Ka Tăng, Xã Lao Bảo',
    scale: 'Diện tích sàn 12.000m² - Khu phi thuế quan',
    managingUnit: 'Công ty TNHH MTV Thương mại Quảng Trị',
    workflowStatus: 'published',
  },
  {
    id: 'mkt-3',
    name: 'Bãi thông quan & Điểm Dịch vụ Logistics Cửa khẩu',
    type: 'Logistics',
    address: 'Cổng B Cửa khẩu Quốc tế Lao Bảo',
    scale: 'Diện tích bãi 4.5 ha, sức chứa 300 xe tải lớn',
    managingUnit: 'Hải quan & Công ty dịch vụ cảng bộ',
    workflowStatus: 'published',
  }
];

const INITIAL_OCOPS: OcopProduct[] = [
  {
    id: 'ocp-1',
    productName: 'Cao chè vằng Lao Bảo Quảng Trị',
    ownerName: 'HTX Chế biến Dược liệu Trường Sơn',
    starRating: 4,
    recognitionYear: 2023,
    revenueAnnually: 1850000000,
    workflowStatus: 'published',
  },
  {
    id: 'ocp-2',
    productName: 'Cà phê Arabica Khe Sanh Lao Bảo',
    ownerName: 'Công ty Cổ phần Arabica Quảng Trị',
    starRating: 5,
    recognitionYear: 2024,
    revenueAnnually: 4200000000,
    workflowStatus: 'published',
  },
  {
    id: 'ocp-3',
    productName: 'Măng khô Bản Ka Tăng',
    ownerName: 'Tổ hợp tác Lâm sản & Đặc sản Ka Tăng',
    starRating: 3,
    recognitionYear: 2025,
    revenueAnnually: 320000000,
    workflowStatus: 'draft',
  }
];

const INITIAL_PUBLIC_INVESTMENTS: PublicInvestment[] = [
  {
    id: 'pi-1',
    projectName: 'Nâng cấp, thảm nhựa Tuyến đường liên thôn Ka Tăng - Khe Đá',
    investor: 'UBND Xã Lao Bảo',
    totalInvestment: 8500000000,
    fundingSource: 'Ngân sách Tỉnh hỗ trợ & Ngân sách Xã đối ứng',
    disbursementInPeriod: 3200000000,
    cumulativeDisbursement: 6800000000,
    progressPercent: 80,
    workflowStatus: 'published',
  },
  {
    id: 'pi-2',
    projectName: 'Xây dựng Nhà Văn hóa cộng đồng thôn Làng Vây',
    investor: 'UBND Xã Lao Bảo',
    totalInvestment: 2400000000,
    fundingSource: 'Ngân sách Tỉnh Quảng Trị & Xã hội hóa đóng góp',
    disbursementInPeriod: 1000000000,
    cumulativeDisbursement: 1800000000,
    progressPercent: 75,
    workflowStatus: 'published',
  },
  {
    id: 'pi-3',
    projectName: 'Kiên cố hóa kênh mương thủy lợi thôn Trung Chín',
    investor: 'UBND Xã Lao Bảo',
    totalInvestment: 1800000000,
    fundingSource: 'Ngân sách Xã Lao Bảo',
    disbursementInPeriod: 400000000,
    cumulativeDisbursement: 400000000,
    progressPercent: 22,
    workflowStatus: 'draft',
  }
];

const MOCK_BUDGET_TREND_DATA = [
  { month: "Tháng 1", revenue: 1.1e9 },
  { month: "Tháng 2", revenue: 1.4e9 },
  { month: "Tháng 3", revenue: 1.8e9 },
  { month: "Tháng 4", revenue: 1.2e9 },
  { month: "Tháng 5", revenue: 2.1e9 },
  { month: "Tháng 6", revenue: 2.5e9 },
  { month: "Tháng 7", revenue: 1.9e9 },
  { month: "Tháng 8", revenue: 2.2e9 },
  { month: "Tháng 9", revenue: 2.6e9 },
  { month: "Tháng 10", revenue: 2.0e9 },
  { month: "Tháng 11", revenue: 2.4e9 },
  { month: "Tháng 12", revenue: 2.8e9 },
];

const MOCK_INVESTMENT_TREND_DATA = [
  { year: "2023", capitalBillion: 120, projectCount: 5 },
  { year: "2024", capitalBillion: 145, projectCount: 8 },
  { year: "2025", capitalBillion: 195, projectCount: 12 },
  { year: "2026", capitalBillion: 240, projectCount: 16 },
];

export default function EconomyPage() {
  const { currentRole } = useTenant();
  const [activeTab, setActiveTab] = React.useState('businesses');

  // Datasets
  const [businesses, setBusinesses] = React.useState<BusinessEntity[]>(INITIAL_BUSINESSES);
  const [markets, setMarkets] = React.useState<MarketPoint[]>(INITIAL_MARKETS);
  const [ocops, setOcops] = React.useState<OcopProduct[]>(INITIAL_OCOPS);
  const [investments, setInvestments] = React.useState<PublicInvestment[]>(INITIAL_PUBLIC_INVESTMENTS);

  // Search & Filter
  const [searchQuery, setSearchQuery] = React.useState('');

  // Modals
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);
  const [activeRecord, setActiveRecord] = React.useState<any | null>(null);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [formType, setFormType] = React.useState<'business' | 'market' | 'ocop' | 'investment'>('business');
  const [formRecord, setFormRecord] = React.useState<any>({});

  // Summary indicators
  const stats = React.useMemo(() => {
    const activeBiz = businesses.filter((b) => b.status === 'Active').length;
    const ocopTotal = ocops.length;
    const budgetRevenue = 6850000000; // Mock cumulative local budget revenue
    const investmentTotal = investments.reduce((sum, curr) => sum + curr.totalInvestment, 0);
    const investmentDisbursed = investments.reduce((sum, curr) => sum + curr.cumulativeDisbursement, 0);
    const averageDisbursedRate = investmentTotal > 0 ? (investmentDisbursed / investmentTotal) * 100 : 0;

    return { activeBiz, ocopTotal, budgetRevenue, averageDisbursedRate };
  }, [businesses, ocops, investments]);

  // Filters
  const filteredBusinesses = React.useMemo(() => {
    return businesses.filter((b) => b.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [businesses, searchQuery]);

  const filteredMarkets = React.useMemo(() => {
    return markets.filter((m) => m.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [markets, searchQuery]);

  const filteredOcops = React.useMemo(() => {
    return ocops.filter((o) => o.productName.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [ocops, searchQuery]);

  const filteredInvestments = React.useMemo(() => {
    return investments.filter((i) => i.projectName.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [investments, searchQuery]);

  // Export
  const handleExport = () => {
    toast.success(`Đang trích xuất Excel bảng tổng hợp kinh tế Quý II/2026...`);
  };

  // Workflow actions
  const handleWorkflowAction = (rec: any, type: string, action: WorkflowStatus) => {
    if (type === 'business') {
      setBusinesses((prev) => prev.map((b) => (b.id === rec.id ? { ...b, workflowStatus: action } : b)));
    } else if (type === 'market') {
      setMarkets((prev) => prev.map((m) => (m.id === rec.id ? { ...m, workflowStatus: action } : m)));
    } else if (type === 'ocop') {
      setOcops((prev) => prev.map((o) => (o.id === rec.id ? { ...o, workflowStatus: action } : o)));
    } else if (type === 'investment') {
      setInvestments((prev) => prev.map((i) => (i.id === rec.id ? { ...i, workflowStatus: action } : i)));
    }
    toast.success(`Đã cập nhật trạng thái quy trình phê duyệt thành công!`);
    setIsDetailOpen(false);
  };

  // CRUD
  const handleDelete = (id: string, type: string, name: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa bản ghi: ${name}?`)) {
      if (type === 'business') {
        setBusinesses((prev) => prev.filter((b) => b.id !== id));
      } else if (type === 'market') {
        setMarkets((prev) => prev.filter((m) => m.id !== id));
      } else if (type === 'ocop') {
        setOcops((prev) => prev.filter((o) => o.id !== id));
      } else if (type === 'investment') {
        setInvestments((prev) => prev.filter((i) => i.id !== id));
      }
      toast.info(`Đã xóa bản ghi ${name}.`);
    }
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (formType === 'business') {
      if (formRecord.id) {
        setBusinesses((prev) => prev.map((b) => (b.id === formRecord.id ? { ...b, ...formRecord, workflowStatus: 'draft' } : b)));
        toast.success('Đã cập nhật thông tin doanh nghiệp!');
      } else {
        const newBiz: BusinessEntity = {
          id: `biz-${Date.now()}`,
          name: formRecord.name || 'Doanh nghiệp mới',
          organizationType: formRecord.organizationType || 'Enterprise',
          taxCode: formRecord.taxCode || '3200000000',
          villageCode: formRecord.villageCode || 'ka-tang',
          address: formRecord.address || 'Lao Bảo',
          industry: formRecord.industry || 'Thương mại',
          registeredCapital: Number(formRecord.registeredCapital || 0),
          status: 'Active',
          establishedDate: new Date().toISOString().split('T')[0],
          workflowStatus: 'draft',
          securityLevel: 'public',
        };
        setBusinesses((prev) => [newBiz, ...prev]);
        toast.success('Thêm mới doanh nghiệp thành công!');
      }
    } else if (formType === 'ocop') {
      if (formRecord.id) {
        setOcops((prev) => prev.map((o) => (o.id === formRecord.id ? { ...o, ...formRecord, workflowStatus: 'draft' } : o)));
        toast.success('Đã cập nhật sản phẩm OCOP!');
      } else {
        const newOcop: OcopProduct = {
          id: `ocp-${Date.now()}`,
          productName: formRecord.productName || 'Sản phẩm mới',
          ownerName: formRecord.ownerName || 'Hộ kinh doanh',
          starRating: Number(formRecord.starRating || 3),
          recognitionYear: Number(formRecord.recognitionYear || 2026),
          revenueAnnually: Number(formRecord.revenueAnnually || 0),
          workflowStatus: 'draft',
        };
        setOcops((prev) => [newOcop, ...prev]);
        toast.success('Thêm mới OCOP thành công!');
      }
    }
    setIsFormOpen(false);
  };

  const handleOpenEdit = (rec: any, type: 'business' | 'market' | 'ocop' | 'investment') => {
    setFormType(type);
    setFormRecord({ ...rec });
    setIsFormOpen(true);
  };

  const handleOpenAdd = (type: 'business' | 'market' | 'ocop' | 'investment') => {
    setFormType(type);
    setFormRecord(
      type === 'business'
        ? { name: '', organizationType: 'Enterprise', taxCode: '', villageCode: 'ka-tang', address: '', industry: '', registeredCapital: 100000000 }
        : type === 'ocop'
          ? { productName: '', ownerName: '', starRating: 3, recognitionYear: 2026, revenueAnnually: 100000000 }
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
            <Building className="w-6 h-6 text-primary" />
            CSDL Kinh tế &amp; Đầu tư công
          </>
        }
        description="Chủ trì bởi Phòng Kinh tế xã Lao Bảo. Quản lý doanh nghiệp, OCOP, dự án đầu tư công và ngân sách địa phương."
        actions={
          <>
            <Button
              onClick={handleExport}
              variant="outline"
              size="sm"
              className="h-9 text-xs cursor-pointer gap-1.5 shadow-none border-border"
            >
              <FileSpreadsheet className="size-4" />
              Báo cáo quý
            </Button>
            {(currentRole === 'admin' || currentRole === 'data_officer') && (
              <Button
                onClick={() => handleOpenAdd(activeTab === 'ocops' ? 'ocop' : 'business')}
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

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border-border bg-card p-4 flex items-center gap-3">
          <div className="p-3 bg-primary/10 text-primary rounded-xl shrink-0">
            <Building className="size-5" />
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Doanh nghiệp, HTX</span>
            <h3 className="text-base font-bold text-foreground mt-0.5">{stats.activeBiz} đơn vị</h3>
          </div>
        </Card>

        <Card className="border-border bg-card p-4 flex items-center gap-3">
          <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl shrink-0">
            <Award className="size-5" />
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Sản phẩm OCOP</span>
            <h3 className="text-base font-bold text-foreground mt-0.5">{stats.ocopTotal} sản phẩm</h3>
          </div>
        </Card>

        <Card className="border-border bg-card p-4 flex items-center gap-3">
          <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl shrink-0">
            <Wallet className="size-5" />
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Thu Ngân sách quý</span>
            <h3 className="text-base font-bold text-foreground mt-0.5">
              {(stats.budgetRevenue / 1000000000).toFixed(2)} tỷ VNĐ
            </h3>
          </div>
        </Card>

        <Card className="border-border bg-card p-4 flex items-center gap-3">
          <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl shrink-0">
            <Wrench className="size-5" />
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Đầu tư công giải ngân</span>
            <h3 className="text-base font-bold text-foreground mt-0.5">{stats.averageDisbursedRate.toFixed(1)}% tỷ lệ</h3>
          </div>
        </Card>
      </div>

      {/* Tabs navigation */}
      <div className="flex border-b border-border gap-2 overflow-x-auto pb-px shrink-0">
        {[
          { id: 'businesses', label: 'Doanh nghiệp & Hộ kinh doanh' },
          { id: 'markets', label: 'Chợ & Logistics biên giới' },
          { id: 'ocops', label: 'Cơ sở & Sản phẩm OCOP' },
          { id: 'budget', label: 'Thu - Chi ngân sách' },
          { id: 'investments', label: 'Dự án đầu tư công' },
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

      {/* Search filters bar */}
      {activeTab !== 'budget' && (
        <Card className="border-border bg-card shadow-2xs">
          <CardContent className="flex gap-3">
            <div className="flex-1">
              <Input
                placeholder="Tìm kiếm nhanh dự án, cơ sở, sản phẩm hoặc doanh nghiệp..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-background border-border text-xs h-9 shadow-none"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab views */}
      <div className="space-y-4">
        {activeTab === 'businesses' && (
          <Card className="border-border bg-card shadow-2xs overflow-hidden pb-0!">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-muted/40 border-b border-border/60 text-muted-foreground font-semibold">
                  <tr>
                    <th className="py-3.5 px-4">Tên đơn vị kinh tế</th>
                    <th className="py-3.5 px-4">Phân loại</th>
                    <th className="py-3.5 px-4">Mã số thuế</th>
                    <th className="py-3.5 px-4">Lĩnh vực ngành nghề</th>
                    <th className="py-3.5 px-4 text-right">Vốn đăng ký (VNĐ)</th>
                    <th className="py-3.5 px-4">Trạng thái</th>
                    <th className="py-3.5 px-4 text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 font-medium">
                  {filteredBusinesses.map((b) => (
                    <tr key={b.id} className="hover:bg-muted/5 transition-colors">
                      <td className="py-3.5 px-4 text-foreground font-semibold flex items-center gap-1.5">
                        <Building className="size-3.5 text-primary" />
                        {b.name}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant="outline" className="font-semibold bg-muted/60">
                          {b.organizationType === 'Enterprise'
                            ? 'Doanh nghiệp'
                            : b.organizationType === 'Cooperative'
                              ? 'Hợp tác xã'
                              : b.organizationType === 'CooperativeGroup'
                                ? 'Tổ hợp tác'
                                : 'Hộ kinh doanh'}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-muted-foreground">{b.taxCode}</td>
                      <td className="py-3.5 px-4 text-muted-foreground">{b.industry}</td>
                      <td className="py-3.5 px-4 text-right font-bold text-foreground">
                        {b.registeredCapital.toLocaleString('vi-VN')}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600 font-semibold text-[8px] h-4">
                          Hoạt động
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <ActionMenu
                          entityName="đơn vị kinh tế"
                          onView={() => {
                            setActiveRecord({ ...b, type: 'business' });
                            setIsDetailOpen(true);
                          }}
                          onEdit={(currentRole === 'admin' || currentRole === 'data_officer') ? () => handleOpenEdit(b, 'business') : undefined}
                          onDelete={(currentRole === 'admin' || currentRole === 'data_officer') ? () => setBusinesses((prev) => prev.filter((item) => item.id !== b.id)) : undefined}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {activeTab === 'markets' && (
          <div className="grid grid-cols-1 gap-4">
            {filteredMarkets.map((m) => (
              <Card key={m.id} className="border-border bg-card hover:shadow-2xs transition-shadow">
                <CardHeader className="pb-3 flex flex-row items-start justify-between gap-4 flex-wrap">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Badge variant="outline" className="px-1.5 py-0 text-[8.5px] uppercase font-bold text-primary border-primary/20 bg-primary/5">
                        {m.type.toUpperCase()}
                      </Badge>
                    </div>
                    <CardTitle className="text-sm font-bold text-foreground leading-tight">
                      {m.name}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="size-3.5 text-muted-foreground" />
                      {m.address}
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 pb-4 border-t border-border/40 mt-3 flex justify-between items-center text-[10px] text-muted-foreground">
                  <span>Quy mô: <strong>{m.scale}</strong></span>
                  <span>Đơn vị vận hành: <strong>{m.managingUnit}</strong></span>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'ocops' && (
          <Card className="border-border bg-card shadow-2xs overflow-hidden pb-0!">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-muted/40 border-b border-border/60 text-muted-foreground font-semibold">
                  <tr>
                    <th className="py-3.5 px-4">Tên sản phẩm OCOP</th>
                    <th className="py-3.5 px-4">Chủ thể sản xuất</th>
                    <th className="py-3.5 px-4 text-center">Xếp hạng Sao</th>
                    <th className="py-3.5 px-4 text-center">Năm công nhận</th>
                    <th className="py-3.5 px-4 text-right">Doanh thu năm ước tính (VNĐ)</th>
                    <th className="py-3.5 px-4">Trạng thái duyệt</th>
                    <th className="py-3.5 px-4 text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 font-medium">
                  {filteredOcops.map((o) => (
                    <tr key={o.id} className="hover:bg-muted/5 transition-colors">
                      <td className="py-3.5 px-4 text-foreground font-semibold flex items-center gap-1.5">
                        <Award className="size-3.5 text-amber-500" />
                        {o.productName}
                      </td>
                      <td className="py-3.5 px-4 text-muted-foreground">{o.ownerName}</td>
                      <td className="py-3.5 px-4 text-center font-bold text-amber-500">
                        {'★'.repeat(o.starRating)}
                      </td>
                      <td className="py-3.5 px-4 text-center text-muted-foreground">{o.recognitionYear}</td>
                      <td className="py-3.5 px-4 text-right font-bold text-foreground">
                        {o.revenueAnnually.toLocaleString('vi-VN')}
                      </td>
                      <td className="py-3.5 px-4">
                        <WorkflowStatusBadge status={o.workflowStatus} />
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <ActionMenu
                          entityName="sản phẩm OCOP"
                          onView={() => {
                            setActiveRecord({ ...o, type: 'ocop' });
                            setIsDetailOpen(true);
                          }}
                          onEdit={(currentRole === 'admin' || currentRole === 'data_officer') ? () => handleOpenEdit(o, 'ocop') : undefined}
                          onDelete={(currentRole === 'admin' || currentRole === 'data_officer') ? () => setOcops((prev) => prev.filter((item) => item.id !== o.id)) : undefined}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {activeTab === 'budget' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Revenue Details */}
              <Card className="lg:col-span-2 border-border bg-card p-6 space-y-6">
                <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <ArrowUpRight className="size-4.5 text-emerald-500" />
                  Các nguồn thu ngân sách địa phương lũy kế 2026
                </h3>
                <div className="space-y-4">
                  {[
                    { source: 'Thuế GTGT & TNDN ngoài quốc doanh', value: 3200000000, estimate: 5500000000 },
                    { source: 'Lệ phí trước bạ nhà đất & quyền sử dụng đất', value: 1500000000, estimate: 3000000000 },
                    { source: 'Phí dịch vụ hành chính công & kinh doanh biên giới', value: 1150000000, estimate: 2000000000 },
                    { source: 'Các nguồn thu sự nghiệp, thu khác', value: 1000000000, estimate: 2000000000 },
                  ].map((s, idx) => {
                    const percent = (s.value / s.estimate) * 100;
                    return (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-semibold text-foreground">{s.source}</span>
                          <span className="text-muted-foreground font-semibold">
                            {s.value.toLocaleString('vi-VN')} / {s.estimate.toLocaleString('vi-VN')} VNĐ ({percent.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                          <div
                            style={{ width: `${percent}%` }}
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>

              {/* Expenditure Details */}
              <Card className="border-border bg-card p-6 space-y-4">
                <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <ArrowDownRight className="size-4.5 text-rose-500" />
                  Cơ cấu chi ngân sách xã (2026)
                </h3>
                <div className="space-y-3.5">
                  {[
                    { name: 'Đầu tư phát triển', val: 3500000000, color: 'bg-primary' },
                    { name: 'Chi thường xuyên hành chính', val: 2800000000, color: 'bg-indigo-500' },
                    { name: 'Chi sự nghiệp giáo dục, văn hóa', val: 1200000000, color: 'bg-amber-500' },
                    { name: 'Chi an sinh xã hội & quốc phòng', val: 8500000000, color: 'bg-rose-500' },
                  ].map((exp, idx) => (
                    <div key={idx} className="p-3 border border-border bg-muted/10 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`size-3 rounded-full ${exp.color}`} />
                        <span className="font-semibold text-foreground">{exp.name}</span>
                      </div>
                      <span className="font-bold text-foreground">{exp.val.toLocaleString('vi-VN')} VNĐ</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
            
            <div>
              <BudgetRevenueTimeSeriesChart data={MOCK_BUDGET_TREND_DATA} />
            </div>
          </div>
        )}


        {activeTab === 'investments' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <InvestmentTrendChart data={MOCK_INVESTMENT_TREND_DATA} />
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {filteredInvestments.map((i) => (
                <Card key={i.id} className="border-border bg-card hover:shadow-2xs transition-shadow">
                  <CardHeader className="pb-3 flex flex-row items-start justify-between gap-4 flex-wrap">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Badge variant="outline" className="px-1.5 py-0 text-[8.5px] uppercase font-bold text-emerald-600 bg-emerald-500/5 border-emerald-500/20">
                          {i.progressPercent}% TIẾN ĐỘ THỰC ĐỊA
                        </Badge>
                        <WorkflowStatusBadge status={i.workflowStatus} />
                      </div>
                      <CardTitle className="text-sm font-bold text-foreground leading-tight mt-1">
                        {i.projectName}
                      </CardTitle>
                      <p className="text-[11px] text-muted-foreground">
                        Chủ đầu tư: <strong>{i.investor}</strong> | Nguồn vốn: {i.fundingSource}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        onClick={() => {
                          setActiveRecord({ ...i, type: 'investment' });
                          setIsDetailOpen(true);
                        }}
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs cursor-pointer gap-1 shadow-none border-border"
                      >
                        <Eye className="size-3.5" />
                        Chi tiết
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-3 pb-4 border-t border-border/40 flex justify-between items-center text-xs text-muted-foreground flex-wrap gap-2">
                    <span>Tổng mức đầu tư: <strong className="text-foreground font-bold">{i.totalInvestment.toLocaleString('vi-VN')} VNĐ</strong></span>
                    <span>Giải ngân lũy kế: <strong className="text-foreground font-bold">{i.cumulativeDisbursement.toLocaleString('vi-VN')} VNĐ ({(i.cumulativeDisbursement / i.totalInvestment * 100).toFixed(1)}%)</strong></span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Record details dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-foreground">
              Chi tiết Hồ sơ nghiệp vụ
            </DialogTitle>
            <DialogDescription className="text-xs">
              Trích xuất dữ liệu CSDL xã Lao Bảo
            </DialogDescription>
          </DialogHeader>

          {activeRecord && (
            <div className="space-y-4 py-2 text-xs">
              {activeRecord.type === 'business' && (
                <>
                  <div className="p-3 bg-muted/20 border border-border rounded-xl space-y-1">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">Tên doanh nghiệp</span>
                    <p className="font-bold text-foreground text-xs leading-normal">{activeRecord.name}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-muted/20 border border-border rounded-xl">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Mã số thuế / Tax Code</span>
                      <p className="font-bold text-foreground mt-0.5">{activeRecord.taxCode}</p>
                    </div>
                    <div className="p-3 bg-muted/20 border border-border rounded-xl">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Vốn đăng ký</span>
                      <p className="font-bold text-foreground mt-0.5">{activeRecord.registeredCapital.toLocaleString('vi-VN')} VNĐ</p>
                    </div>
                  </div>
                  <div className="p-3 bg-muted/20 border border-border rounded-xl space-y-1">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">Địa chỉ thực tế</span>
                    <p className="font-medium text-foreground leading-normal">{activeRecord.address}</p>
                  </div>
                </>
              )}

              {activeRecord.type === 'ocop' && (
                <>
                  <div className="p-3 bg-muted/20 border border-border rounded-xl space-y-1">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">Sản phẩm OCOP</span>
                    <p className="font-bold text-foreground text-xs leading-normal">{activeRecord.productName}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-muted/20 border border-border rounded-xl">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Xếp hạng OCOP</span>
                      <p className="font-bold text-amber-500 mt-0.5">{'★'.repeat(activeRecord.starRating)} ({activeRecord.starRating} Sao)</p>
                    </div>
                    <div className="p-3 bg-muted/20 border border-border rounded-xl">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Năm chứng nhận</span>
                      <p className="font-bold text-foreground mt-0.5">{activeRecord.recognitionYear}</p>
                    </div>
                  </div>
                  <div className="p-3 bg-muted/20 border border-border rounded-xl space-y-1">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">Chủ thể OCOP</span>
                    <p className="font-bold text-primary leading-normal">{activeRecord.ownerName}</p>
                  </div>
                  <div className="p-3 bg-muted/20 border border-border rounded-xl">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">Doanh thu ước lượng năm</span>
                    <p className="font-bold text-foreground mt-0.5">{activeRecord.revenueAnnually.toLocaleString('vi-VN')} VNĐ</p>
                  </div>
                </>
              )}

              {activeRecord.type === 'investment' && (
                <>
                  <div className="p-3 bg-muted/20 border border-border rounded-xl space-y-1">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">Tên dự án đầu tư công</span>
                    <p className="font-bold text-foreground text-xs leading-normal">{activeRecord.projectName}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-muted/20 border border-border rounded-xl">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Tổng đầu tư phê duyệt</span>
                      <p className="font-bold text-foreground mt-0.5">{activeRecord.totalInvestment.toLocaleString('vi-VN')} VNĐ</p>
                    </div>
                    <div className="p-3 bg-muted/20 border border-border rounded-xl">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Tiến độ thực tế</span>
                      <p className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{activeRecord.progressPercent}%</p>
                    </div>
                  </div>
                  <div className="p-3 bg-muted/20 border border-border rounded-xl space-y-1">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">Nguồn vốn chỉ định</span>
                    <p className="font-medium text-foreground leading-normal">{activeRecord.fundingSource}</p>
                  </div>
                </>
              )}

              <Separator className="bg-border/60" />

              {/* Workflow Actions */}
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-foreground">Trạng thái quy trình:</span>
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
                ? `Cập nhật thông tin ${formType === 'ocop' ? 'Sản phẩm OCOP' : 'Doanh nghiệp'}`
                : `Thêm mới ${formType === 'ocop' ? 'Sản phẩm OCOP' : 'Doanh nghiệp'}`}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Nhập các tham số định danh kinh tế, OCOP xã Lao Bảo.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveForm} className="space-y-4 py-2 text-xs">
            {formType === 'business' && (
              <>
                <div className="grid gap-1.5">
                  <label className="font-bold text-foreground">Tên doanh nghiệp / Đơn vị kinh tế</label>
                  <Input
                    value={formRecord.name || ''}
                    onChange={(e) => setFormRecord((prev: any) => ({ ...prev, name: e.target.value }))}
                    placeholder="Nhập tên doanh nghiệp..."
                    className="bg-background border-border text-xs h-9 shadow-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-1.5">
                    <label className="font-bold text-foreground">Phân loại tổ chức</label>
                    <Select
                      value={formRecord.organizationType || 'Enterprise'}
                      onValueChange={(val) => setFormRecord((prev: any) => ({ ...prev, organizationType: val }))}
                    >
                      <SelectTrigger className="w-full h-9 text-xs bg-background border-border shadow-none cursor-pointer">
                        <SelectValue placeholder="Chọn phân loại" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border text-xs">
                        <SelectItem value="Enterprise" className="cursor-pointer">Doanh nghiệp</SelectItem>
                        <SelectItem value="Cooperative" className="cursor-pointer">Hợp tác xã</SelectItem>
                        <SelectItem value="CooperativeGroup" className="cursor-pointer">Tổ hợp tác</SelectItem>
                        <SelectItem value="BusinessHousehold" className="cursor-pointer">Hộ kinh doanh</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-1.5">
                    <label className="font-bold text-foreground">Mã số thuế / MST</label>
                    <Input
                      value={formRecord.taxCode || ''}
                      onChange={(e) => setFormRecord((prev: any) => ({ ...prev, taxCode: e.target.value }))}
                      placeholder="Nhập MST..."
                      className="bg-background border-border text-xs h-9 shadow-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-1.5">
                    <label className="font-bold text-foreground">Lĩnh vực kinh doanh</label>
                    <Input
                      value={formRecord.industry || ''}
                      onChange={(e) => setFormRecord((prev: any) => ({ ...prev, industry: e.target.value }))}
                      placeholder="Lĩnh vực..."
                      className="bg-background border-border text-xs h-9 shadow-none"
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <label className="font-bold text-foreground">Vốn đăng ký (VNĐ)</label>
                    <Input
                      type="number"
                      value={formRecord.registeredCapital || ''}
                      onChange={(e) => setFormRecord((prev: any) => ({ ...prev, registeredCapital: Number(e.target.value) }))}
                      placeholder="Vốn điều lệ..."
                      className="bg-background border-border text-xs h-9 shadow-none"
                    />
                  </div>
                </div>
                <div className="grid gap-1.5">
                  <label className="font-bold text-foreground">Địa chỉ cơ sở</label>
                  <Input
                    value={formRecord.address || ''}
                    onChange={(e) => setFormRecord((prev: any) => ({ ...prev, address: e.target.value }))}
                    placeholder="Địa chỉ..."
                    className="bg-background border-border text-xs h-9 shadow-none"
                  />
                </div>
              </>
            )}

            {formType === 'ocop' && (
              <>
                <div className="grid gap-1.5">
                  <label className="font-bold text-foreground">Tên sản phẩm OCOP</label>
                  <Input
                    value={formRecord.productName || ''}
                    onChange={(e) => setFormRecord((prev: any) => ({ ...prev, productName: e.target.value }))}
                    placeholder="Nhập tên sản phẩm..."
                    className="bg-background border-border text-xs h-9 shadow-none"
                  />
                </div>
                <div className="grid gap-1.5">
                  <label className="font-bold text-foreground">Chủ thể OCOP (Chủ hộ / HTX)</label>
                  <Input
                    value={formRecord.ownerName || ''}
                    onChange={(e) => setFormRecord((prev: any) => ({ ...prev, ownerName: e.target.value }))}
                    placeholder="Chủ thể sản xuất..."
                    className="bg-background border-border text-xs h-9 shadow-none"
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="grid gap-1.5">
                    <label className="font-bold text-foreground">Xếp sao OCOP</label>
                    <Select
                      value={String(formRecord.starRating || 3)}
                      onValueChange={(val) => setFormRecord((prev: any) => ({ ...prev, starRating: Number(val) }))}
                    >
                      <SelectTrigger className="w-full h-9 text-xs bg-background border-border shadow-none cursor-pointer">
                        <SelectValue placeholder="Số sao" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border text-xs">
                        <SelectItem value="3" className="cursor-pointer">3 Sao</SelectItem>
                        <SelectItem value="4" className="cursor-pointer">4 Sao</SelectItem>
                        <SelectItem value="5" className="cursor-pointer">5 Sao</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-1.5">
                    <label className="font-bold text-foreground">Năm xếp hạng</label>
                    <Input
                      type="number"
                      value={formRecord.recognitionYear || ''}
                      onChange={(e) => setFormRecord((prev: any) => ({ ...prev, recognitionYear: Number(e.target.value) }))}
                      className="bg-background border-border text-xs h-9 shadow-none"
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <label className="font-bold text-foreground">Doanh thu ước năm</label>
                    <Input
                      type="number"
                      value={formRecord.revenueAnnually || ''}
                      onChange={(e) => setFormRecord((prev: any) => ({ ...prev, revenueAnnually: Number(e.target.value) }))}
                      className="bg-background border-border text-xs h-9 shadow-none"
                    />
                  </div>
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
