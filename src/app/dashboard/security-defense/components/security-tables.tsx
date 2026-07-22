'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui';
import { StatusBadge, SectionCard } from '@/components/common';
import { ActionMenu } from '@/components/common';
import { Shield, HeartHandshake, CheckCircle, Users } from 'lucide-react';
import {
  SecurityIncidentRecord,
  DefenseStatisticRecord,
  SocialIssueRecord,
} from '@/types/security-defense';

// Severity Helper
const renderSeverityBadge = (severity: 'low' | 'medium' | 'high') => {
  switch (severity) {
    case 'high':
      return <span className="text-[10px] px-1.5 py-0.5 rounded-sm font-bold bg-rose-500/10 text-rose-600 uppercase border border-rose-500/20">Cao</span>;
    case 'medium':
      return <span className="text-[10px] px-1.5 py-0.5 rounded-sm font-bold bg-amber-500/10 text-amber-600 uppercase border border-amber-500/20">Vừa</span>;
    default:
      return <span className="text-[10px] px-1.5 py-0.5 rounded-sm font-bold bg-muted text-muted-foreground uppercase border border-border">Thấp</span>;
  }
};

// 1. Security Incidents Table
interface SecurityIncidentsTableProps {
  data: SecurityIncidentRecord[];
  userRole: string;
  onEdit: (item: SecurityIncidentRecord) => void;
  onDelete: (item: SecurityIncidentRecord) => void;
  onResolve: (item: SecurityIncidentRecord) => void;
}

export function SecurityIncidentsTable({ data, userRole, onEdit, onDelete, onResolve }: SecurityIncidentsTableProps) {
  const getIncidentStatusLabel = (status: string) => {
    switch (status) {
      case 'resolved': return 'Đã hòa giải';
      case 'processing': return 'Đang xử lý';
      default: return 'Chờ tiếp nhận';
    }
  };

  const getIncidentStatusBadgeType = (status: string): 'active' | 'pending' | 'inactive' => {
    switch (status) {
      case 'resolved': return 'active';
      case 'processing': return 'pending';
      default: return 'inactive';
    }
  };

  return (
    <SectionCard title="Sổ nhật ký vụ việc an ninh trật tự">
      <div className="overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader className="bg-muted/40 border-b border-border/60">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs">Mã vụ việc</TableHead>
              <TableHead className="text-xs">Ngày ghi nhận</TableHead>
              <TableHead className="text-xs">Thôn</TableHead>
              <TableHead className="text-xs">Loại sự việc</TableHead>
              <TableHead className="text-center text-xs">Mức độ</TableHead>
              <TableHead className="text-xs">Người trình báo</TableHead>
              <TableHead className="text-xs">Cán bộ phụ trách</TableHead>
              <TableHead className="text-center text-xs">Trạng thái</TableHead>
              <TableHead className="w-12 text-center text-xs">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center text-xs text-muted-foreground">Không có vụ việc nào được ghi nhận.</TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/30 border-b border-border/40 text-xs">
                  <TableCell className="font-mono font-bold text-muted-foreground">{item.incidentCode}</TableCell>
                  <TableCell className="font-medium text-muted-foreground">{item.recordedDate}</TableCell>
                  <TableCell className="font-bold text-foreground">{item.villageName}</TableCell>
                  <TableCell className="font-bold text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Shield className="size-3.5 text-blue-600" />
                      {item.incidentType}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{renderSeverityBadge(item.severity)}</TableCell>
                  <TableCell className="text-muted-foreground">{item.reporterName}</TableCell>
                  <TableCell className="text-muted-foreground">{item.handlerName}</TableCell>
                  <TableCell className="text-center">
                    <StatusBadge
                      status={getIncidentStatusBadgeType(item.status)}
                      customLabel={getIncidentStatusLabel(item.status)}
                    />
                  </TableCell>
                  <TableCell className="p-0 text-center">
                    <ActionMenu
                      entityName="vụ việc an ninh"
                      userRole={userRole}
                      onEdit={() => onEdit(item)}
                      onDelete={() => onDelete(item)}
                      customActions={
                        item.status !== 'resolved'
                          ? [
                            {
                              label: 'Hòa giải',
                              icon: <CheckCircle className="size-3.5 text-emerald-600" />,
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

// 2. Defense Statistics Table
interface DefenseStatisticsTableProps {
  data: DefenseStatisticRecord[];
  userRole: string;
  onEdit: (item: DefenseStatisticRecord) => void;
  onDelete: (item: DefenseStatisticRecord) => void;
}

export function DefenseStatisticsTable({ data, userRole, onEdit, onDelete }: DefenseStatisticsTableProps) {
  return (
    <SectionCard title="Chỉ tiêu quốc phòng địa phương qua các năm">
      <div className="overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader className="bg-muted/40 border-b border-border/60">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs">Năm</TableHead>
              <TableHead className="text-right text-xs">Lực lượng dân quân (Người)</TableHead>
              <TableHead className="text-right text-xs">Thanh niên nhập ngũ (Người)</TableHead>
              <TableHead className="text-right text-xs">Số lớp huấn luyện (Lớp)</TableHead>
              <TableHead className="text-right text-xs">Lực lượng tham gia huấn luyện</TableHead>
              <TableHead className="text-right text-xs">Lượt tuần tra địa bàn</TableHead>
              <TableHead className="text-right text-xs">Ngân sách quốc phòng (VND)</TableHead>
              <TableHead className="w-12 text-center text-xs">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-xs text-muted-foreground">Không có số liệu quốc phòng.</TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/30 border-b border-border/40 text-xs">
                  <TableCell className="font-bold text-foreground">{item.year}</TableCell>
                  <TableCell className="text-right font-bold text-blue-600">{item.milForceCount} người</TableCell>
                  <TableCell className="text-right font-bold text-emerald-600">{item.youthEnlistedCount} thanh niên</TableCell>
                  <TableCell className="text-right text-muted-foreground">{item.trainingClassCount} lớp</TableCell>
                  <TableCell className="text-right text-muted-foreground">{item.trainingAttendeeCount} lượt người</TableCell>
                  <TableCell className="text-right font-semibold text-indigo-600">{item.patrolCount} lượt</TableCell>
                  <TableCell className="text-right font-bold text-emerald-600">{item.budgetDefenseVnd.toLocaleString()} đ</TableCell>
                  <TableCell className="p-0 text-center">
                    <ActionMenu
                      entityName="số liệu quốc phòng"
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

// 3. Social Issues Table
interface SocialIssuesTableProps {
  data: SocialIssueRecord[];
  userRole: string;
  onEdit: (item: SocialIssueRecord) => void;
  onDelete: (item: SocialIssueRecord) => void;
  onResolve: (item: SocialIssueRecord) => void;
}

export function SocialIssuesTable({ data, userRole, onEdit, onDelete, onResolve }: SocialIssuesTableProps) {
  const getSocialStatusLabel = (status: string) => {
    switch (status) {
      case 'resolved': return 'Đã giải quyết';
      case 'underMonitoring': return 'Theo dõi sát';
      default: return 'Cần lưu ý';
    }
  };

  const getSocialStatusBadgeType = (status: string): 'active' | 'pending' | 'inactive' => {
    switch (status) {
      case 'resolved': return 'active';
      case 'underMonitoring': return 'pending';
      default: return 'inactive';
    }
  };

  return (
    <SectionCard title="Sổ theo dõi tệ nạn và các vấn đề xã hội cần trợ giúp">
      <div className="overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader className="bg-muted/40 border-b border-border/60">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs">Mã hồ sơ</TableHead>
              <TableHead className="text-xs">Ngày ghi nhận</TableHead>
              <TableHead className="text-xs">Thôn</TableHead>
              <TableHead className="text-xs">Vấn đề cần hỗ trợ</TableHead>
              <TableHead className="text-right text-xs">Số người chịu tác động</TableHead>
              <TableHead className="text-center text-xs">Mức độ nguy cơ</TableHead>
              <TableHead className="text-xs">Đơn vị phụ trách</TableHead>
              <TableHead className="text-center text-xs">Trạng thái</TableHead>
              <TableHead className="w-12 text-center text-xs">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center text-xs text-muted-foreground">Không có vấn đề xã hội nào.</TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/30 border-b border-border/40 text-xs">
                  <TableCell className="font-mono font-bold text-muted-foreground">{item.issueCode}</TableCell>
                  <TableCell className="font-medium text-muted-foreground">{item.recordedDate}</TableCell>
                  <TableCell className="font-bold text-foreground">{item.villageName}</TableCell>
                  <TableCell className="font-bold text-rose-700">
                    <div className="flex items-center gap-1.5">
                      <HeartHandshake className="size-3.5 text-rose-500" />
                      {item.issueType}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium text-muted-foreground">{item.affectedCount} người</TableCell>
                  <TableCell className="text-center">{renderSeverityBadge(item.severity)}</TableCell>
                  <TableCell className="text-muted-foreground">{item.handlerDepartment}</TableCell>
                  <TableCell className="text-center">
                    <StatusBadge
                      status={getSocialStatusBadgeType(item.status)}
                      customLabel={getSocialStatusLabel(item.status)}
                    />
                  </TableCell>
                  <TableCell className="p-0 text-center">
                    <ActionMenu
                      entityName="vấn đề xã hội"
                      userRole={userRole}
                      onEdit={() => onEdit(item)}
                      onDelete={() => onDelete(item)}
                      customActions={
                        item.status !== 'resolved'
                          ? [
                            {
                              label: 'Đã xử lý',
                              icon: <CheckCircle className="size-3.5 text-emerald-600" />,
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
