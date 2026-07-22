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
import { SectionCard } from '@/components/common';
import { ActionMenu } from '@/components/common';
import { BarChart3, Users, Briefcase, Landmark } from 'lucide-react';
import { CheckCircle, Wrench } from 'lucide-react';
import {
  EconomicIndicatorRecord,
  SocialIndicatorRecord,
  LaborEmploymentIndicatorRecord,
  InfrastructureIndicatorRecord,
} from '@/types/socio-economic';

// 1. Economic Indicators Table
interface EconomicTableProps {
  data: EconomicIndicatorRecord[];
  userRole: string;
  onEdit: (item: EconomicIndicatorRecord) => void;
  onDelete: (item: EconomicIndicatorRecord) => void;
}

export function EconomicTable({ data, userRole, onEdit, onDelete }: EconomicTableProps) {
  return (
    <SectionCard title="Chỉ tiêu phát triển kinh tế xã Lao Bảo">
      <div className="overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader className="bg-muted/40 border-b border-border/60">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs">Năm</TableHead>
              <TableHead className="text-right text-xs">Giá trị SX (Tỷ VND)</TableHead>
              <TableHead className="text-right text-xs">Nông - Lâm - Thủy sản</TableHead>
              <TableHead className="text-right text-xs">Công nghiệp - Xây dựng</TableHead>
              <TableHead className="text-right text-xs">Dịch vụ</TableHead>
              <TableHead className="text-right text-xs">Tốc độ tăng trưởng</TableHead>
              <TableHead className="text-right text-xs">Thu nhập bình quân (Tr.đ/năm)</TableHead>
              <TableHead className="text-right text-xs">Thu ngân sách (Tr.đ)</TableHead>
              <TableHead className="text-right text-xs">Chi ngân sách (Tr.đ)</TableHead>
              <TableHead className="w-12 text-center text-xs">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="h-24 text-center text-xs text-muted-foreground">Không có số liệu kinh tế.</TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/30 border-b border-border/40 text-xs">
                  <TableCell className="font-bold text-foreground">{item.year}</TableCell>
                  <TableCell className="text-right font-bold text-blue-600 dark:text-blue-400">
                    <span className="flex items-center justify-end gap-1">
                      <BarChart3 className="size-3 text-muted-foreground" />
                      {item.totalProductionValueBillion} tỷ
                    </span>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">{item.agricultureProductionValueBillion} tỷ</TableCell>
                  <TableCell className="text-right text-muted-foreground">{item.industryConstructionValueBillion} tỷ</TableCell>
                  <TableCell className="text-right text-muted-foreground">{item.serviceValueBillion} tỷ</TableCell>
                  <TableCell className="text-right font-semibold text-emerald-600">+{item.gdpGrowthPercent}%</TableCell>
                  <TableCell className="text-right font-semibold">{item.averageIncomePerCapitaMillion} tr.đ</TableCell>
                  <TableCell className="text-right text-emerald-600 font-bold">{item.budgetRevenueMillion.toLocaleString()} tr.đ</TableCell>
                  <TableCell className="text-right text-rose-600">{item.budgetExpenditureMillion.toLocaleString()} tr.đ</TableCell>
                  <TableCell className="p-0 text-center">
                    <ActionMenu
                      entityName="chỉ tiêu kinh tế"
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

// 2. Social Indicators Table
interface SocialTableProps {
  data: SocialIndicatorRecord[];
  userRole: string;
  onEdit: (item: SocialIndicatorRecord) => void;
  onDelete: (item: SocialIndicatorRecord) => void;
}

export function SocialTable({ data, userRole, onEdit, onDelete }: SocialTableProps) {
  return (
    <SectionCard title="Chỉ tiêu Văn hóa - Xã hội và Dân cư">
      <div className="overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader className="bg-muted/40 border-b border-border/60">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs">Năm</TableHead>
              <TableHead className="text-xs">Địa bàn</TableHead>
              <TableHead className="text-right text-xs">Tổng dân số</TableHead>
              <TableHead className="text-right text-xs">Số hộ dân</TableHead>
              <TableHead className="text-right text-xs">Hộ nghèo (Số hộ / %)</TableHead>
              <TableHead className="text-right text-xs">Hộ cận nghèo (Số hộ / %)</TableHead>
              <TableHead className="text-center text-xs">Trường chuẩn QG</TableHead>
              <TableHead className="text-right text-xs">Thôn văn hóa (%)</TableHead>
              <TableHead className="text-right text-xs">Tỷ lệ BHYT (%)</TableHead>
              <TableHead className="w-12 text-center text-xs">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="h-24 text-center text-xs text-muted-foreground">Không có số liệu xã hội.</TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/30 border-b border-border/40 text-xs">
                  <TableCell className="font-bold text-foreground">{item.year}</TableCell>
                  <TableCell className="font-semibold text-foreground">{item.villageName || 'Toàn xã'}</TableCell>
                  <TableCell className="text-right font-medium">{item.totalPopulation.toLocaleString()} người</TableCell>
                  <TableCell className="text-right font-medium">{item.totalHouseholds.toLocaleString()} hộ</TableCell>
                  <TableCell className="text-right font-semibold text-rose-600">
                    {item.poorHouseholdsCount} hộ ({item.poorHouseholdsPercent}%)
                  </TableCell>
                  <TableCell className="text-right text-amber-600 font-semibold">
                    {item.nearPoorHouseholdsCount} hộ ({item.nearPoorHouseholdsPercent}%)
                  </TableCell>
                  <TableCell className="text-center font-bold text-muted-foreground">
                    {item.nationalStandardSchoolsCount !== undefined ? `${item.nationalStandardSchoolsCount} trường` : '-'}
                  </TableCell>
                  <TableCell className="text-right text-indigo-600 font-semibold">
                    {item.cultureVillagePercent !== undefined ? `${item.cultureVillagePercent}%` : '-'}
                  </TableCell>
                  <TableCell className="text-right text-emerald-600 font-bold">{item.healthInsurancePercent}%</TableCell>
                  <TableCell className="p-0 text-center">
                    <ActionMenu
                      entityName="chỉ tiêu xã hội"
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

// 3. Labor & Employment Table
interface LaborTableProps {
  data: LaborEmploymentIndicatorRecord[];
  userRole: string;
  onEdit: (item: LaborEmploymentIndicatorRecord) => void;
  onDelete: (item: LaborEmploymentIndicatorRecord) => void;
}

export function LaborTable({ data, userRole, onEdit, onDelete }: LaborTableProps) {
  return (
    <SectionCard title="Thống kê lao động - việc làm địa phương">
      <div className="overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader className="bg-muted/40 border-b border-border/60">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs">Năm</TableHead>
              <TableHead className="text-xs">Địa bàn</TableHead>
              <TableHead className="text-right text-xs">Dân số tuổi lao động</TableHead>
              <TableHead className="text-right text-xs">Lao động qua đào tạo (Số người / %)</TableHead>
              <TableHead className="text-right text-xs">Lao động nông nghiệp</TableHead>
              <TableHead className="text-right text-xs">Lao động phi nông nghiệp</TableHead>
              <TableHead className="text-right text-xs">Số người thất nghiệp</TableHead>
              <TableHead className="w-12 text-center text-xs">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-xs text-muted-foreground">Không có số liệu lao động.</TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/30 border-b border-border/40 text-xs">
                  <TableCell className="font-bold text-foreground">{item.year}</TableCell>
                  <TableCell className="font-semibold text-foreground">{item.villageName || 'Toàn xã'}</TableCell>
                  <TableCell className="text-right font-medium">
                    <span className="flex items-center justify-end gap-1">
                      <Users className="size-3 text-muted-foreground" />
                      {item.workingAgePopulation.toLocaleString()} người
                    </span>
                  </TableCell>
                  <TableCell className="text-right text-indigo-600 font-bold">
                    {item.trainedLaborCount.toLocaleString()} người ({item.trainedLaborPercent}%)
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">{item.agriculturalLaborCount.toLocaleString()} người</TableCell>
                  <TableCell className="text-right text-blue-600 font-semibold">{item.nonAgriculturalLaborCount.toLocaleString()} người</TableCell>
                  <TableCell className="text-right text-rose-500">{item.unemployedCount.toLocaleString()} người</TableCell>
                  <TableCell className="p-0 text-center">
                    <ActionMenu
                      entityName="chỉ tiêu lao động"
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

// 4. Infrastructure Indicators Table
interface InfrastructureTableProps {
  data: InfrastructureIndicatorRecord[];
  userRole: string;
  onEdit: (item: InfrastructureIndicatorRecord) => void;
  onDelete: (item: InfrastructureIndicatorRecord) => void;
}

export function InfrastructureTable({ data, userRole, onEdit, onDelete }: InfrastructureTableProps) {
  return (
    <SectionCard title="Tiêu chí hạ tầng kỹ thuật nông thôn">
      <div className="overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader className="bg-muted/40 border-b border-border/60">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs">Năm</TableHead>
              <TableHead className="text-xs">Địa bàn</TableHead>
              <TableHead className="text-right text-xs">Tỷ lệ đường bê tông hóa</TableHead>
              <TableHead className="text-right text-xs">Hộ dùng điện quốc gia</TableHead>
              <TableHead className="text-right text-xs">Hộ có nhà ở kiên cố</TableHead>
              <TableHead className="text-right text-xs">Nhà tiêu hợp vệ sinh</TableHead>
              <TableHead className="text-right text-xs">Kênh mương bê tông hóa</TableHead>
              <TableHead className="w-12 text-center text-xs">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-xs text-muted-foreground">Không có số liệu hạ tầng.</TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/30 border-b border-border/40 text-xs">
                  <TableCell className="font-bold text-foreground">{item.year}</TableCell>
                  <TableCell className="font-semibold text-foreground">{item.villageName || 'Toàn xã'}</TableCell>
                  <TableCell className="text-right font-bold text-muted-foreground">{item.concreteRoadPercent}%</TableCell>
                  <TableCell className="text-right text-amber-600 font-bold">{item.nationalGridPowerPercent}%</TableCell>
                  <TableCell className="text-right text-indigo-600 font-bold">{item.solidHousePercent}%</TableCell>
                  <TableCell className="text-right text-emerald-600 font-bold">{item.hygienicLatrinePercent}%</TableCell>
                  <TableCell className="text-right text-blue-600 font-bold">{item.irrigationChannelConcretePercent}%</TableCell>
                  <TableCell className="p-0 text-center">
                    <ActionMenu
                      entityName="chỉ tiêu hạ tầng"
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
