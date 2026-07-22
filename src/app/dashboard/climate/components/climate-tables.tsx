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
import { StatusBadge, SectionCard, ActionMenu } from '@/components/common';
import { Wind, AlertCircle, CheckCircle, Archive } from 'lucide-react';
import { DisasterEvent, WeatherMonthlyRecord, AgricultureRiskAlert } from '@/types/climate';

// 1. Disaster Events Table
interface DisasterEventsTableProps {
  data: DisasterEvent[];
  userRole: string;
  onEdit: (item: DisasterEvent) => void;
  onDelete: (item: DisasterEvent) => void;
  onResolve: (item: DisasterEvent) => void;
}

export function DisasterEventsTable({ data, userRole, onEdit, onDelete, onResolve }: DisasterEventsTableProps) {
  const getDisasterLabel = (type: string) => {
    switch (type) {
      case 'landslide': return 'Sạt lở đất';
      case 'flashFlood': return 'Lũ quét';
      case 'storm': return 'Giông bão';
      case 'frost': return 'Sương muối';
      case 'drought': return 'Hạn hán';
      default: return 'Thiên tai khác';
    }
  };

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'high':
        return <span className="text-[10px] px-1.5 py-0.5 rounded-sm font-bold bg-rose-500/10 text-rose-500 uppercase">Nghiêm trọng</span>;
      case 'medium':
        return <span className="text-[10px] px-1.5 py-0.5 rounded-sm font-bold bg-amber-500/10 text-amber-500 uppercase">Trung bình</span>;
      default:
        return <span className="text-[10px] px-1.5 py-0.5 rounded-sm font-bold bg-muted text-muted-foreground uppercase">Thấp</span>;
    }
  };

  return (
    <SectionCard title="Sự kiện thiên tai trên địa bàn">
      <div className="overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader className="bg-muted/40 border-b border-border/60">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs">Mã sự kiện</TableHead>
              <TableHead className="text-xs">Loại thiên tai</TableHead>
              <TableHead className="text-xs">Thời gian xảy ra</TableHead>
              <TableHead className="text-xs">Khu vực ảnh hưởng</TableHead>
              <TableHead className="text-center text-xs">Mức độ</TableHead>
              <TableHead className="text-right text-xs">Thiệt hại ước tính (VND)</TableHead>
              <TableHead className="text-center text-xs">Tình trạng</TableHead>
              <TableHead className="w-12 text-center text-xs">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-xs text-muted-foreground">Không có ghi nhận sự kiện thiên tai.</TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/30 border-b border-border/40 text-xs">
                  <TableCell className="font-mono font-bold text-muted-foreground">{item.eventCode}</TableCell>
                  <TableCell className="font-bold text-foreground">{getDisasterLabel(item.disasterType)}</TableCell>
                  <TableCell>{item.eventDate}</TableCell>
                  <TableCell className="max-w-[200px] truncate" title={item.affectedHamlets.join(', ')}>
                    {item.affectedHamlets.join(', ')}
                  </TableCell>
                  <TableCell className="text-center">{getSeverityBadge(item.severity)}</TableCell>
                  <TableCell className="text-right font-semibold text-rose-600 dark:text-rose-400">
                    {item.estimatedDamageVnd.toLocaleString()} đ
                  </TableCell>
                  <TableCell className="text-center">
                    <StatusBadge
                      status={item.status === 'resolved' ? 'active' : item.status === 'processing' ? 'processing' : 'warning'}
                      customLabel={item.status === 'resolved' ? 'Đã khắc phục' : item.status === 'processing' ? 'Đang ứng phó' : 'Đang diễn ra'}
                    />
                  </TableCell>
                  <TableCell className="p-0 text-center">
                    <ActionMenu
                      entityName="sự kiện thiên tai"
                      userRole={userRole}
                      onEdit={() => onEdit(item)}
                      onDelete={() => onDelete(item)}
                      customActions={
                        item.status !== 'resolved'
                          ? [
                              {
                                label: 'Đã khắc phục',
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

// 2. Weather Records Table
interface WeatherRecordsTableProps {
  data: WeatherMonthlyRecord[];
}

export function WeatherRecordsTable({ data }: WeatherRecordsTableProps) {
  return (
    <SectionCard title="Số liệu thời tiết cơ bản theo tháng">
      <div className="overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader className="bg-muted/40 border-b border-border/60">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs">Tháng/Năm</TableHead>
              <TableHead className="text-right text-xs">Lượng mưa (mm)</TableHead>
              <TableHead className="text-right text-xs">Nhiệt độ TB (°C)</TableHead>
              <TableHead className="text-right text-xs">Độ ẩm TB (%)</TableHead>
              <TableHead className="text-right text-xs">Số giờ nắng (giờ)</TableHead>
              <TableHead className="text-xs">Nguồn số liệu</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-xs text-muted-foreground">Không có dữ liệu thời tiết.</TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/30 border-b border-border/40 text-xs">
                  <TableCell className="font-bold text-foreground">Tháng {item.month}/{item.year}</TableCell>
                  <TableCell className="text-right font-semibold text-sky-600 dark:text-sky-400">{item.rainfallMm} mm</TableCell>
                  <TableCell className="text-right font-semibold text-amber-600 dark:text-amber-400">{item.averageTemperature} °C</TableCell>
                  <TableCell className="text-right text-muted-foreground">{item.humidityPercentage}%</TableCell>
                  <TableCell className="text-right text-muted-foreground">{item.sunshineHours} giờ</TableCell>
                  <TableCell className="text-muted-foreground max-w-[200px] truncate" title={item.source}>{item.source}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </SectionCard>
  );
}

// 3. Risk Alerts Table
interface RiskAlertsTableProps {
  data: AgricultureRiskAlert[];
  userRole: string;
  onEdit: (item: AgricultureRiskAlert) => void;
  onDelete: (item: AgricultureRiskAlert) => void;
  onArchive: (item: AgricultureRiskAlert) => void;
}

export function RiskAlertsTable({ data, userRole, onEdit, onDelete, onArchive }: RiskAlertsTableProps) {
  const getSeverityColor = (sev: string) => {
    switch (sev) {
      case 'critical': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      case 'warning': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      default: return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
    }
  };

  const getSeverityLabel = (sev: string) => {
    switch (sev) {
      case 'critical': return 'Nguy cấp';
      case 'warning': return 'Cảnh báo';
      default: return 'Thông tin';
    }
  };

  return (
    <SectionCard title="Danh sách cảnh báo rủi ro nông nghiệp">
      <div className="overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader className="bg-muted/40 border-b border-border/60">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs">Mã cảnh báo</TableHead>
              <TableHead className="text-xs">Loại rủi ro</TableHead>
              <TableHead className="text-xs">Cây trồng chịu ảnh hưởng</TableHead>
              <TableHead className="text-xs">Thôn phát sóng</TableHead>
              <TableHead className="text-center text-xs">Mức độ nguy hiểm</TableHead>
              <TableHead className="text-xs">Khuyến nghị kỹ thuật</TableHead>
              <TableHead className="text-xs">Ngày phát hành</TableHead>
              <TableHead className="text-center text-xs">Trạng thái</TableHead>
              <TableHead className="w-12 text-center text-xs">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center text-xs text-muted-foreground">Không có cảnh báo rủi ro nào.</TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/30 border-b border-border/40 text-xs">
                  <TableCell className="font-mono font-bold text-muted-foreground">{item.alertCode}</TableCell>
                  <TableCell className="font-bold text-foreground">{item.riskType}</TableCell>
                  <TableCell className="font-semibold text-cyan-600 dark:text-cyan-400">
                    {item.affectedCropTypeCodes.join(', ') === 'ca-phe-arabica' ? 'Cà phê Arabica' : 'Chuối Lao Bảo, Lúa rẫy'}
                  </TableCell>
                  <TableCell className="font-medium">{item.affectedHamlets.join(', ')}</TableCell>
                  <TableCell className="text-center">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-sm font-bold uppercase border ${getSeverityColor(item.severity)}`}>
                      {getSeverityLabel(item.severity)}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate text-muted-foreground" title={item.recommendations}>
                    {item.recommendations}
                  </TableCell>
                  <TableCell>{item.publishDate}</TableCell>
                  <TableCell className="text-center">
                    <StatusBadge
                      status={item.status === 'active' ? 'active' : 'inactive'}
                      customLabel={item.status === 'active' ? 'Có hiệu lực' : 'Đã lưu trữ'}
                    />
                  </TableCell>
                  <TableCell className="p-0 text-center">
                    <ActionMenu
                      entityName="cảnh báo rủi ro"
                      userRole={userRole}
                      onEdit={() => onEdit(item)}
                      onDelete={() => onDelete(item)}
                      customActions={
                        item.status === 'active'
                          ? [
                              {
                                label: 'Lưu trữ',
                                icon: <Archive className="size-3.5 text-muted-foreground" />,
                                onClick: () => onArchive(item),
                                className: 'text-muted-foreground focus:text-foreground focus:bg-muted',
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
