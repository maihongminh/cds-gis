'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui';
import { StatusBadge, SectionCard } from '@/components/common';
import { ActionMenu } from '@/components/common';
import { Route, AlertOctagon, CheckCircle2 } from 'lucide-react';
import {
  RoadRecord,
  TransportStructureRecord,
  TrafficDisruptionRecord,
  RoadMaintenancePlan,
  TrafficSafetyRecord
} from '@/types/transportation';

// ─── 1. ROADS TABLE ───────────────────────────────────────────────────────────
interface RoadsTableProps {
  data: RoadRecord[];
  userRole: string;
  onEdit: (item: RoadRecord) => void;
  onDelete: (item: RoadRecord) => void;
}

export function RoadsTable({ data, userRole, onEdit, onDelete }: RoadsTableProps) {
  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'communeRoad': return 'Đường xã';
      case 'villageRoad': return 'Đường thôn';
      case 'productionRoad': return 'Đường sản xuất';
      case 'fieldRoad': return 'Đường nội đồng';
      default: return 'Khác';
    }
  };

  const getSurfaceLabel = (surf: string) => {
    switch (surf) {
      case 'asphalt': return 'Nhựa';
      case 'concrete': return 'Bê tông';
      case 'gravel': return 'Cấp phối / Đá dăm';
      case 'soil': return 'Đường đất';
      case 'mixed': return 'Hỗn hợp';
      default: return 'Khác';
    }
  };

  const getConditionLabel = (cond: string) => {
    switch (cond) {
      case 'good': return 'Tốt';
      case 'fair': return 'Khá';
      case 'degraded': return 'Xuống cấp';
      case 'dangerous': return 'Nguy hiểm';
      default: return 'Khóa tuyến';
    }
  };

  const getConditionBadgeType = (cond: string): 'active' | 'pending' | 'inactive' => {
    switch (cond) {
      case 'good': return 'active';
      case 'fair': return 'active';
      case 'degraded': return 'pending';
      default: return 'inactive'; // dangerous
    }
  };

  return (
    <SectionCard title="Danh sách các tuyến đường giao thông">
      <div className="overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader className="bg-muted/40 border-b border-border/60">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs">Mã tuyến</TableHead>
              <TableHead className="text-xs">Tên tuyến</TableHead>
              <TableHead className="text-xs">Điểm đầu / Điểm cuối</TableHead>
              <TableHead className="text-xs">Thôn đi qua</TableHead>
              <TableHead className="text-right text-xs">Chiều dài (km)</TableHead>
              <TableHead className="text-xs">Loại đường</TableHead>
              <TableHead className="text-xs">Mặt đường</TableHead>
              <TableHead className="text-center text-xs">Năm làm / Sửa</TableHead>
              <TableHead className="text-center text-xs">Tình trạng</TableHead>
              <TableHead className="w-12 text-center text-xs">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="h-24 text-center text-xs text-muted-foreground">Không có tuyến đường nào.</TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/30 border-b border-border/40 text-xs">
                  <TableCell className="font-mono font-bold text-muted-foreground">{item.code}</TableCell>
                  <TableCell className="max-w-[300px] font-bold text-foreground">
                    <div className="flex items-center gap-1.5">
                      <Route className="size-3.5 text-blue-500" />
                      {item.name}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[320px] text-muted-foreground" title={`${item.startPoint} ➜ ${item.endPoint}`}>
                    {item.startPoint} ➜ {item.endPoint}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{item.villageNames.join(', ')}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{item.lengthKm} km</TableCell>
                  <TableCell className="text-muted-foreground">{getCategoryLabel(item.category)}</TableCell>
                  <TableCell className="text-muted-foreground">{getSurfaceLabel(item.surfaceType)}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {item.builtOrUpgradedYear} {item.latestRepairYear ? `/ ${item.latestRepairYear}` : ''}
                  </TableCell>
                  <TableCell className="text-center">
                    <StatusBadge
                      status={getConditionBadgeType(item.condition)}
                      customLabel={getConditionLabel(item.condition)}
                    />
                  </TableCell>
                  <TableCell className="p-0 text-center">
                    <ActionMenu
                      entityName="tuyến đường"
                      userRole={userRole}
                      onEdit={() => onEdit(item)}
                      onDelete={() => onDelete(item)}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </SectionCard>
  );
}

// ─── 2. STRUCTURES TABLE ──────────────────────────────────────────────────────
interface StructuresTableProps {
  data: TransportStructureRecord[];
  userRole: string;
  onEdit: (item: TransportStructureRecord) => void;
  onDelete: (item: TransportStructureRecord) => void;
}

export function StructuresTable({ data, userRole, onEdit, onDelete }: StructuresTableProps) {
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'suspensionBridge': return 'Cầu treo';
      case 'concreteBridge': return 'Cầu bê tông';
      case 'culvert': return 'Cống thoát nước';
      case 'overflowSpillway': return 'Ngầm tràn';
      default: return 'Khác';
    }
  };

  const getConditionLabel = (cond: string) => {
    switch (cond) {
      case 'good': return 'Tốt / Ổn định';
      case 'fair': return 'Trung bình';
      case 'degraded': return 'Yếu / Xuống cấp';
      case 'dangerous': return 'Nguy hiểm';
      default: return 'Cấm qua lại';
    }
  };

  const getConditionBadgeType = (cond: string): 'active' | 'pending' | 'inactive' => {
    switch (cond) {
      case 'good': return 'active';
      case 'fair': return 'active';
      case 'degraded': return 'pending';
      default: return 'inactive'; // dangerous / closed
    }
  };

  return (
    <SectionCard title="Danh sách cầu, cống, ngầm tràn dân sinh">
      <div className="overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader className="bg-muted/40 border-b border-border/60">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs">Mã công trình</TableHead>
              <TableHead className="text-xs">Tên cầu / cống</TableHead>
              <TableHead className="text-xs">Tuyến đường</TableHead>
              <TableHead className="text-xs">Vị trí (Km)</TableHead>
              <TableHead className="text-xs">Thôn phụ trách</TableHead>
              <TableHead className="text-xs">Loại</TableHead>
              <TableHead className="text-right text-xs">Tải trọng (Tấn)</TableHead>
              <TableHead className="text-center text-xs">Năm xây</TableHead>
              <TableHead className="text-center text-xs">Hiện trạng</TableHead>
              <TableHead className="text-center text-xs">Mức rủi ro</TableHead>
              <TableHead className="w-12 text-center text-xs">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} className="h-24 text-center text-xs text-muted-foreground">Không có công trình nào.</TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/30 border-b border-border/40 text-xs">
                  <TableCell className="font-mono font-bold text-muted-foreground">{item.code}</TableCell>
                  <TableCell className="font-bold text-foreground">{item.name}</TableCell>
                  <TableCell className="font-medium text-muted-foreground">{item.roadName}</TableCell>
                  <TableCell className="font-mono text-muted-foreground">{item.kmPosition || '-'}</TableCell>
                  <TableCell className="font-semibold text-muted-foreground">{item.villageName}</TableCell>
                  <TableCell className="font-semibold text-muted-foreground">{getTypeLabel(item.type)}</TableCell>
                  <TableCell className="text-right font-bold text-blue-600">
                    {item.loadCapacityTon ? `${item.loadCapacityTon} tấn` : '-'}
                  </TableCell>
                  <TableCell className="text-center text-muted-foreground">{item.builtYear}</TableCell>
                  <TableCell className="text-center">
                    <StatusBadge
                      status={getConditionBadgeType(item.condition)}
                      customLabel={getConditionLabel(item.condition)}
                    />
                  </TableCell>
                  <TableCell className="text-center font-bold">
                    {item.riskLevel === 'high' ? (
                      <span className="text-rose-600 text-[10px] flex items-center justify-center gap-0.5">
                        <AlertOctagon className="size-3" />
                        CAO
                      </span>
                    ) : item.riskLevel === 'medium' ? (
                      <span className="text-amber-600 text-[10px]">TRUNG BÌNH</span>
                    ) : (
                      <span className="text-emerald-600 text-[10px]">THẤP</span>
                    )}
                  </TableCell>
                  <TableCell className="p-0 text-center">
                    <ActionMenu
                      entityName="công trình cầu đường"
                      userRole={userRole}
                      onEdit={() => onEdit(item)}
                      onDelete={() => onDelete(item)}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </SectionCard>
  );
}

// ─── 3. DISRUPTIONS TABLE ────────────────────────────────────────────────────
interface DisruptionsTableProps {
  data: TrafficDisruptionRecord[];
  userRole: string;
  onEdit: (item: TrafficDisruptionRecord) => void;
  onDelete: (item: TrafficDisruptionRecord) => void;
  onResolve: (item: TrafficDisruptionRecord) => void;
}

export function DisruptionsTable({ data, userRole, onEdit, onDelete, onResolve }: DisruptionsTableProps) {
  const getIncidentLabel = (type: string) => {
    switch (type) {
      case 'landslide': return 'Sạt lở đất';
      case 'flooding': return 'Ngập lụt';
      case 'erosion': return 'Xói lở nền';
      case 'bridgeDamage': return 'Hư hỏng cầu';
      case 'roadDamage': return 'Hư hỏng đường';
      default: return 'Khác';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'resolved': return 'Đã thông tuyến';
      case 'monitoring': return 'Đang theo dõi';
      default: return 'Đang chia cắt';
    }
  };

  const getStatusBadgeType = (status: string): 'active' | 'pending' | 'inactive' => {
    switch (status) {
      case 'resolved': return 'active';
      case 'monitoring': return 'pending';
      default: return 'inactive'; // open
    }
  };

  return (
    <SectionCard title="Nhật ký sự cố sạt lở & chia cắt giao thông do thiên tai">
      <div className="overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader className="bg-muted/40 border-b border-border/60">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs">Mã sự cố</TableHead>
              <TableHead className="text-xs">Tuyến / Công trình liên quan</TableHead>
              <TableHead className="text-xs">Vị trí ảnh hưởng</TableHead>
              <TableHead className="text-xs">Thôn</TableHead>
              <TableHead className="text-xs">Loại sự cố</TableHead>
              <TableHead className="text-center text-xs">Mức độ</TableHead>
              <TableHead className="text-xs">Thời điểm xảy ra</TableHead>
              <TableHead className="text-xs">Thời điểm thông xe</TableHead>
              <TableHead className="text-right text-xs">Số ngày tắc</TableHead>
              <TableHead className="text-center text-xs">Trạng thái</TableHead>
              <TableHead className="w-12 text-center text-xs">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} className="h-24 text-center text-xs text-muted-foreground">Không ghi nhận sự cố nào.</TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/30 border-b border-border/40 text-xs">
                  <TableCell className="font-mono font-bold text-muted-foreground">{item.code}</TableCell>
                  <TableCell className="font-bold text-foreground">
                    <div>{item.roadName}</div>
                    {item.structureName && <div className="text-[10px] text-muted-foreground font-semibold">{item.structureName}</div>}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{item.affectedArea}</TableCell>
                  <TableCell className="font-semibold text-muted-foreground">{item.villageName}</TableCell>
                  <TableCell className="font-semibold text-muted-foreground">{getIncidentLabel(item.incidentType)}</TableCell>
                  <TableCell className="text-center font-bold">
                    {item.severity === 'critical' ? (
                      <span className="text-rose-600 text-[10px] flex items-center justify-center gap-0.5">
                        <AlertOctagon className="size-3" />
                        CRITICAL
                      </span>
                    ) : item.severity === 'high' ? (
                      <span className="text-orange-500 text-[10px]">CAO</span>
                    ) : item.severity === 'medium' ? (
                      <span className="text-blue-500 text-[10px]">VỪA</span>
                    ) : (
                      <span className="text-[10px]">THẤP</span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{new Date(item.occurredAt).toLocaleString()}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {item.reopenedAt ? new Date(item.reopenedAt).toLocaleString() : 'Chưa thông'}
                  </TableCell>
                  <TableCell className="text-right font-bold text-blue-600">{item.disruptionDays} ngày</TableCell>
                  <TableCell className="text-center">
                    <StatusBadge
                      status={getStatusBadgeType(item.status)}
                      customLabel={getStatusLabel(item.status)}
                    />
                  </TableCell>
                  <TableCell className="p-0 text-center">
                    <ActionMenu
                      entityName="sự cố giao thông"
                      userRole={userRole}
                      onEdit={() => onEdit(item)}
                      onDelete={() => onDelete(item)}
                      customActions={
                        item.status !== 'resolved'
                          ? [
                            {
                              label: 'Thông tuyến',
                              icon: <CheckCircle2 className="size-3.5 text-emerald-600" />,
                              onClick: () => onResolve(item),
                              className: 'text-emerald-700 focus:text-emerald-700 focus:bg-emerald-500/10',
                            },
                          ]
                          : []
                      }
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </SectionCard>
  );
}

// ─── 4. MAINTENANCE PLANS TABLE ───────────────────────────────────────────────
interface MaintenancePlansTableProps {
  data: RoadMaintenancePlan[];
  userRole: string;
  onEdit: (item: RoadMaintenancePlan) => void;
  onDelete: (item: RoadMaintenancePlan) => void;
}

export function MaintenancePlansTable({ data, userRole, onEdit, onDelete }: MaintenancePlansTableProps) {
  const getProgressLabel = (progress: string) => {
    switch (progress) {
      case 'planned': return 'Đã lập kế hoạch';
      case 'approved': return 'Đã phê duyệt';
      case 'inProgress': return 'Đang thực hiện';
      case 'completed': return 'Đã hoàn thành';
      case 'delayed': return 'Chậm tiến độ';
      default: return 'Khác';
    }
  };

  const getProgressBadgeType = (progress: string): 'active' | 'pending' | 'inactive' => {
    switch (progress) {
      case 'completed': return 'active';
      case 'inProgress': return 'pending';
      case 'delayed': return 'inactive';
      default: return 'pending'; // planned, approved
    }
  };

  const getFundingLabel = (src: string) => {
    switch (src) {
      case 'communeBudget': return 'Ngân sách xã';
      case 'districtBudget': return 'Ngân sách huyện';
      case 'newRuralProgram': return 'Chương trình NTM';
      default: return 'Nguồn khác';
    }
  };

  return (
    <SectionCard title="Kế hoạch duy tu, bảo dưỡng công trình cầu đường năm 2026">
      <div className="overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader className="bg-muted/40 border-b border-border/60">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs">Mã kế hoạch</TableHead>
              <TableHead className="text-xs">Công trình sửa chữa</TableHead>
              <TableHead className="text-xs">Thôn địa bàn</TableHead>
              <TableHead className="text-xs">Hạng mục thi công</TableHead>
              <TableHead className="text-right text-xs">Kinh phí (VNĐ)</TableHead>
              <TableHead className="text-xs">Nguồn vốn</TableHead>
              <TableHead className="text-xs">Đơn vị thi công</TableHead>
              <TableHead className="text-xs">Thời gian triển khai</TableHead>
              <TableHead className="text-center text-xs">Tiến độ</TableHead>
              <TableHead className="w-12 text-center text-xs">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="h-24 text-center text-xs text-muted-foreground">Không có kế hoạch nào.</TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/30 border-b border-border/40 text-xs">
                  <TableCell className="font-mono font-bold text-muted-foreground">{item.code}</TableCell>
                  <TableCell className="font-bold text-foreground">
                    <div>{item.roadName}</div>
                    {item.structureName && <div className="text-[10px] text-muted-foreground font-semibold">{item.structureName}</div>}
                  </TableCell>
                  <TableCell className="font-semibold text-muted-foreground">{item.villageName}</TableCell>
                  <TableCell className="max-w-[150px] truncate text-muted-foreground" title={item.workItems.join(', ')}>
                    {item.workItems.join(', ')}
                  </TableCell>
                  <TableCell className="text-right font-bold text-emerald-600">
                    {item.estimatedBudgetVnd.toLocaleString('vi-VN')} ₫
                  </TableCell>
                  <TableCell className="font-semibold text-muted-foreground">{getFundingLabel(item.fundingSource)}</TableCell>
                  <TableCell className="max-w-[150px] truncate text-muted-foreground" title={item.implementingUnit}>
                    {item.implementingUnit}
                  </TableCell>
                  <TableCell className="max-w-[120px] truncate text-muted-foreground" title={`${item.plannedStartDate} ➜ ${item.plannedCompletionDate}`}>
                    {item.plannedStartDate} ➜ {item.plannedCompletionDate}
                  </TableCell>
                  <TableCell className="text-center">
                    <StatusBadge
                      status={getProgressBadgeType(item.progress)}
                      customLabel={getProgressLabel(item.progress)}
                    />
                  </TableCell>
                  <TableCell className="p-0 text-center">
                    <ActionMenu
                      entityName="kế hoạch duy tu"
                      userRole={userRole}
                      onEdit={() => onEdit(item)}
                      onDelete={() => onDelete(item)}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </SectionCard>
  );
}

// ─── 5. TRAFFIC SAFETY TABLE ─────────────────────────────────────────────────
interface TrafficSafetyTableProps {
  data: TrafficSafetyRecord[];
  userRole: string;
  onEdit: (item: TrafficSafetyRecord) => void;
  onDelete: (item: TrafficSafetyRecord) => void;
}

export function TrafficSafetyTable({ data, userRole, onEdit, onDelete }: TrafficSafetyTableProps) {
  return (
    <SectionCard title="Tình hình trật tự an toàn giao thông tổng hợp năm 2026">
      <div className="overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader className="bg-muted/40 border-b border-border/60">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs">Kỳ thống kê</TableHead>
              <TableHead className="text-xs">Thôn địa bàn</TableHead>
              <TableHead className="text-right text-xs">Tổng vụ phát sinh</TableHead>
              <TableHead className="text-right text-xs">Đã xử lý / hòa giải</TableHead>
              <TableHead className="text-right text-xs">Chưa xử lý ổn định</TableHead>
              <TableHead className="text-xs">Ghi chú sự kiện</TableHead>
              <TableHead className="w-12 text-center text-xs">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-xs text-muted-foreground">Không có số liệu thống kê.</TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/30 border-b border-border/40 text-xs">
                  <TableCell className="font-bold text-foreground">Tháng {item.month} / {item.year}</TableCell>
                  <TableCell className="font-semibold text-muted-foreground">{item.villageName || 'Toàn xã Lao Bảo'}</TableCell>
                  <TableCell className="text-right font-bold text-muted-foreground">{item.totalIncidents} vụ</TableCell>
                  <TableCell className="text-right font-bold text-emerald-600">{item.resolvedIncidents} vụ</TableCell>
                  <TableCell className="text-right font-bold text-rose-500">{item.unresolvedIncidents} vụ</TableCell>
                  <TableCell className="max-w-[300px] text-muted-foreground" title={item.description}>
                    {item.description || 'Không có ghi nhận đặc biệt'}
                  </TableCell>
                  <TableCell className="p-0 text-center">
                    <ActionMenu
                      entityName="số liệu an toàn giao thông"
                      userRole={userRole}
                      onEdit={() => onEdit(item)}
                      onDelete={() => onDelete(item)}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </SectionCard>
  );
}
