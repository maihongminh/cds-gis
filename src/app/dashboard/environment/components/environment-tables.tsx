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
import { CheckCircle, ShieldAlert, Award, FileSpreadsheet } from 'lucide-react';
import {
  WasteRecord,
  WasteClassificationRecord,
  WasteTreatmentHouseholdRecord,
  EnvironmentRegistrationRecord,
  EnvironmentPermit,
  EnvironmentViolation,
  EnvironmentPenalty,
  EnvironmentComplaint,
  EnvironmentTraining
} from '@/types/environment';

// === 1. WASTE TABLES ===
interface WasteTableProps {
  wasteData: WasteRecord[];
  classData: WasteClassificationRecord[];
  userRole: string;
  onEdit: (item: WasteRecord) => void;
  onDelete: (item: WasteRecord) => void;
}

export function WasteTable({ wasteData, classData, userRole, onEdit, onDelete }: WasteTableProps) {
  return (
    <div className="space-y-6">
      <SectionCard title="Sản lượng rác thải hàng tháng">
        <div className="overflow-x-auto rounded-lg border border-border">
          <Table>
            <TableHeader className="bg-muted/40 border-b border-border/60">
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs">Thời gian</TableHead>
                <TableHead className="text-xs">Thôn địa bàn</TableHead>
                <TableHead className="text-right text-xs">Rác phát sinh (tấn)</TableHead>
                <TableHead className="text-right text-xs">Hữu cơ</TableHead>
                <TableHead className="text-right text-xs">Vô cơ</TableHead>
                <TableHead className="text-right text-xs">Độc hại</TableHead>
                <TableHead className="text-right text-xs">Đã thu gom</TableHead>
                <TableHead className="w-12 text-center text-xs">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {wasteData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-xs text-muted-foreground">Không có dữ liệu rác thải.</TableCell>
                </TableRow>
              ) : (
                wasteData.map((item, idx) => (
                  <TableRow key={idx} className="hover:bg-muted/30 border-b border-border/40 text-xs">
                    <TableCell className="font-semibold">Tháng {item.month}/{item.year}</TableCell>
                    <TableCell className="font-bold">{item.villageName}</TableCell>
                    <TableCell className="text-right font-bold text-foreground">{item.totalWasteTons} T</TableCell>
                    <TableCell className="text-right text-muted-foreground">{item.organicWasteTons} T</TableCell>
                    <TableCell className="text-right text-muted-foreground">{item.inorganicWasteTons} T</TableCell>
                    <TableCell className="text-right text-rose-500">{item.hazardousWasteTons} T</TableCell>
                    <TableCell className="text-right font-semibold text-emerald-600 dark:text-emerald-400">{item.collectedTons} T</TableCell>
                    <TableCell className="p-0 text-center">
                      <ActionMenu
                        entityName="số liệu rác thải"
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

      <SectionCard title="Tỷ lệ phân loại rác thải tại nguồn">
        <div className="overflow-x-auto rounded-lg border border-border">
          <Table>
            <TableHeader className="bg-muted/40 border-b border-border/60">
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs">Thời gian</TableHead>
                <TableHead className="text-xs">Thôn địa bàn</TableHead>
                <TableHead className="text-right text-xs">Tổng số hộ</TableHead>
                <TableHead className="text-right text-xs">Hộ thực hiện phân loại</TableHead>
                <TableHead className="text-right text-xs">Hộ chưa phân loại</TableHead>
                <TableHead className="text-center text-xs">Tỷ lệ phân loại (%)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-xs text-muted-foreground">Không có dữ liệu phân loại.</TableCell>
                </TableRow>
              ) : (
                classData.map((item, idx) => {
                  const rate = item.householdCount > 0 ? (item.classifiedCount / item.householdCount * 100).toFixed(1) : '0';
                  return (
                    <TableRow key={idx} className="hover:bg-muted/30 border-b border-border/40 text-xs">
                      <TableCell className="font-semibold">Tháng {item.month}/{item.year}</TableCell>
                      <TableCell className="font-bold">{item.villageName}</TableCell>
                      <TableCell className="text-right">{item.householdCount} hộ</TableCell>
                      <TableCell className="text-right text-emerald-600 dark:text-emerald-400 font-semibold">{item.classifiedCount} hộ</TableCell>
                      <TableCell className="text-right text-rose-500">{item.notClassifiedCount} hộ</TableCell>
                      <TableCell className="text-center font-bold text-foreground">{rate}%</TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </SectionCard>
    </div>
  );
}

// === 2. PERMITS TABLES ===
interface PermitsTableProps {
  registrationData: EnvironmentRegistrationRecord[];
  permitData: EnvironmentPermit[];
  userRole: string;
  onEditReg: (item: EnvironmentRegistrationRecord) => void;
  onDeleteReg: (item: EnvironmentRegistrationRecord) => void;
  onEditPermit: (item: EnvironmentPermit) => void;
  onDeletePermit: (item: EnvironmentPermit) => void;
  onApproveReg: (item: EnvironmentRegistrationRecord) => void;
}

export function PermitsTable({
  registrationData,
  permitData,
  userRole,
  onEditReg,
  onDeleteReg,
  onEditPermit,
  onDeletePermit,
  onApproveReg,
}: PermitsTableProps) {
  return (
    <div className="space-y-6">
      <SectionCard title="Đăng ký cam kết bảo vệ môi trường">
        <div className="overflow-x-auto rounded-lg border border-border">
          <Table>
            <TableHeader className="bg-muted/40 border-b border-border/60">
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs">Mã hồ sơ</TableHead>
                <TableHead className="text-xs">Tên cơ sở đăng ký</TableHead>
                <TableHead className="text-xs">Chủ cơ sở</TableHead>
                <TableHead className="text-xs">Địa bàn</TableHead>
                <TableHead className="text-xs">Ngày nộp</TableHead>
                <TableHead className="text-xs">Người phụ trách</TableHead>
                <TableHead className="text-center text-xs">Trạng thái duyệt</TableHead>
                <TableHead className="w-12 text-center text-xs">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {registrationData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-xs text-muted-foreground">Không có hồ sơ đăng ký.</TableCell>
                </TableRow>
              ) : (
                registrationData.map((item, idx) => (
                  <TableRow key={idx} className="hover:bg-muted/30 border-b border-border/40 text-xs">
                    <TableCell className="font-mono font-bold text-muted-foreground text-[10px]">{item.id.toUpperCase()}</TableCell>
                    <TableCell className="font-bold text-foreground">{item.businessName}</TableCell>
                    <TableCell className="font-medium text-foreground">{item.ownerName}</TableCell>
                    <TableCell>{item.villageName}</TableCell>
                    <TableCell>{item.registrationDate}</TableCell>
                    <TableCell>{item.officerInCharge}</TableCell>
                    <TableCell className="text-center">
                      <StatusBadge
                        status={item.status === 'approved' ? 'active' : item.status === 'pending' ? 'processing' : 'inactive'}
                        customLabel={item.status === 'approved' ? 'Đã duyệt' : item.status === 'pending' ? 'Chờ duyệt' : 'Từ chối'}
                      />
                    </TableCell>
                    <TableCell className="p-0 text-center">
                      <ActionMenu
                        entityName="hồ sơ đăng ký môi trường"
                        userRole={userRole}
                        onEdit={() => onEditReg(item)}
                        onDelete={() => onDeleteReg(item)}
                        customActions={
                          item.status === 'pending'
                            ? [
                                {
                                  label: 'Phê duyệt',
                                  icon: <CheckCircle className="size-3.5 text-emerald-600" />,
                                  onClick: () => onApproveReg(item),
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

      <SectionCard title="Giấy phép môi trường cấp xã">
        <div className="overflow-x-auto rounded-lg border border-border">
          <Table>
            <TableHeader className="bg-muted/40 border-b border-border/60">
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs">Số giấy phép</TableHead>
                <TableHead className="text-xs">Tên cơ sở/đối tượng</TableHead>
                <TableHead className="text-xs">Địa bàn</TableHead>
                <TableHead className="text-xs">Ngày cấp</TableHead>
                <TableHead className="text-xs">Ngày hết hạn</TableHead>
                <TableHead className="text-center text-xs">Tình trạng hiệu lực</TableHead>
                <TableHead className="w-12 text-center text-xs">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {permitData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-xs text-muted-foreground">Không có giấy phép nào.</TableCell>
                </TableRow>
              ) : (
                permitData.map((item, idx) => (
                  <TableRow key={idx} className="hover:bg-muted/30 border-b border-border/40 text-xs">
                    <TableCell className="font-mono font-bold text-primary">{item.permitNumber}</TableCell>
                    <TableCell className="font-bold text-foreground">{item.businessName}</TableCell>
                    <TableCell>{item.villageName}</TableCell>
                    <TableCell>{item.issueDate}</TableCell>
                    <TableCell>{item.expiryDate}</TableCell>
                    <TableCell className="text-center">
                      <StatusBadge
                        status={item.status === 'active' ? 'active' : item.status === 'expired' ? 'inactive' : 'warning'}
                        customLabel={item.status === 'active' ? 'Còn hiệu lực' : item.status === 'expired' ? 'Hết hiệu lực' : 'Đã thu hồi'}
                      />
                    </TableCell>
                    <TableCell className="p-0 text-center">
                      <ActionMenu
                        entityName="giấy phép môi trường"
                        userRole={userRole}
                        onEdit={() => onEditPermit(item)}
                        onDelete={() => onDeletePermit(item)}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </SectionCard>
    </div>
  );
}

// === 3. VIOLATIONS TABLES ===
interface ViolationsTableProps {
  violationData: EnvironmentViolation[];
  penaltyData: EnvironmentPenalty[];
  userRole: string;
  onEditViol: (item: EnvironmentViolation) => void;
  onDeleteViol: (item: EnvironmentViolation) => void;
  onEditPen: (item: EnvironmentPenalty) => void;
  onDeletePen: (item: EnvironmentPenalty) => void;
  onResolveViol: (item: EnvironmentViolation) => void;
}

export function ViolationsTable({
  violationData,
  penaltyData,
  userRole,
  onEditViol,
  onDeleteViol,
  onEditPen,
  onDeletePen,
  onResolveViol,
}: ViolationsTableProps) {
  return (
    <div className="space-y-6">
      <SectionCard title="Vi phạm môi trường bị ghi nhận">
        <div className="overflow-x-auto rounded-lg border border-border">
          <Table>
            <TableHeader className="bg-muted/40 border-b border-border/60">
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs">Mã vụ việc</TableHead>
                <TableHead className="text-xs">Đối tượng vi phạm</TableHead>
                <TableHead className="text-xs">Hành vi vi phạm</TableHead>
                <TableHead className="text-xs">Khu vực</TableHead>
                <TableHead className="text-xs">Ngày lập biên bản</TableHead>
                <TableHead className="text-center text-xs">Mức độ</TableHead>
                <TableHead className="text-center text-xs">Xử lý</TableHead>
                <TableHead className="w-12 text-center text-xs">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {violationData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-xs text-muted-foreground">Không có ghi nhận vi phạm.</TableCell>
                </TableRow>
              ) : (
                violationData.map((item, idx) => (
                  <TableRow key={idx} className="hover:bg-muted/30 border-b border-border/40 text-xs">
                    <TableCell className="font-mono font-bold text-muted-foreground text-[10px]">{item.violationCode}</TableCell>
                    <TableCell className="font-bold text-foreground">{item.offenderName}</TableCell>
                    <TableCell className="max-w-[200px] truncate text-muted-foreground" title={item.violationType}>{item.violationType}</TableCell>
                    <TableCell>{item.villageName}</TableCell>
                    <TableCell>{item.recordedDate}</TableCell>
                    <TableCell className="text-center">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-sm font-bold uppercase ${item.severity === 'high' ? 'bg-rose-500/10 text-rose-500' : item.severity === 'medium' ? 'bg-amber-500/10 text-amber-500' : 'bg-muted text-muted-foreground'}`}>
                        {item.severity === 'high' ? 'Cao' : item.severity === 'medium' ? 'T.Bình' : 'Thấp'}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <StatusBadge
                        status={item.status === 'resolved' ? 'active' : item.status === 'processing' ? 'processing' : 'warning'}
                        customLabel={item.status === 'resolved' ? 'Đã giải quyết' : item.status === 'processing' ? 'Đang xử lý' : 'Chưa xử lý'}
                      />
                    </TableCell>
                    <TableCell className="p-0 text-center">
                      <ActionMenu
                        entityName="vi phạm môi trường"
                        userRole={userRole}
                        onEdit={() => onEditViol(item)}
                        onDelete={() => onDeleteViol(item)}
                        customActions={
                          item.status !== 'resolved'
                            ? [
                                {
                                  label: 'Xử lý nhanh',
                                  icon: <CheckCircle className="size-3.5 text-emerald-600" />,
                                  onClick: () => onResolveViol(item),
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

      <SectionCard title="Quyết định xử phạt vi phạm hành chính">
        <div className="overflow-x-auto rounded-lg border border-border">
          <Table>
            <TableHeader className="bg-muted/40 border-b border-border/60">
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs">Số quyết định</TableHead>
                <TableHead className="text-xs">Cá nhân/Tổ chức bị phạt</TableHead>
                <TableHead className="text-xs">Biên bản liên quan</TableHead>
                <TableHead className="text-right text-xs">Số tiền phạt (VND)</TableHead>
                <TableHead className="text-xs">Ngày ra quyết định</TableHead>
                <TableHead className="text-center text-xs">Tình trạng nộp phạt</TableHead>
                <TableHead className="w-12 text-center text-xs">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {penaltyData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-xs text-muted-foreground">Không có quyết định xử phạt.</TableCell>
                </TableRow>
              ) : (
                penaltyData.map((item, idx) => (
                  <TableRow key={idx} className="hover:bg-muted/30 border-b border-border/40 text-xs">
                    <TableCell className="font-mono font-bold text-rose-500">{item.penaltyNumber}</TableCell>
                    <TableCell className="font-bold text-foreground">{item.offenderName}</TableCell>
                    <TableCell className="font-mono text-muted-foreground text-[10px]">{item.violationId.toUpperCase()}</TableCell>
                    <TableCell className="text-right font-bold text-rose-600 dark:text-rose-400">{item.fineAmountVnd.toLocaleString()} đ</TableCell>
                    <TableCell>{item.issueDate}</TableCell>
                    <TableCell className="text-center">
                      <StatusBadge
                        status={item.paymentStatus === 'paid' ? 'active' : 'inactive'}
                        customLabel={item.paymentStatus === 'paid' ? 'Đã đóng phạt' : 'Chưa nộp phạt'}
                      />
                    </TableCell>
                    <TableCell className="p-0 text-center">
                      <ActionMenu
                        entityName="quyết định xử phạt"
                        userRole={userRole}
                        onEdit={() => onEditPen(item)}
                        onDelete={() => onDeletePen(item)}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </SectionCard>
    </div>
  );
}

// === 4. COMPLAINTS TABLE ===
interface ComplaintsTableProps {
  data: EnvironmentComplaint[];
  userRole: string;
  onEdit: (item: EnvironmentComplaint) => void;
  onDelete: (item: EnvironmentComplaint) => void;
  onResolve: (item: EnvironmentComplaint) => void;
}

export function ComplaintsTable({ data, userRole, onEdit, onDelete, onResolve }: ComplaintsTableProps) {
  return (
    <SectionCard title="Kiến nghị & Khiếu nại từ người dân">
      <div className="overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader className="bg-muted/40 border-b border-border/60">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs">Mã đơn</TableHead>
              <TableHead className="text-xs">Người gửi kiến nghị</TableHead>
              <TableHead className="text-xs">Thôn</TableHead>
              <TableHead className="text-xs">Nội dung tóm tắt</TableHead>
              <TableHead className="text-xs">Ngày tiếp nhận</TableHead>
              <TableHead className="text-xs">Hạn xử lý</TableHead>
              <TableHead className="text-center text-xs">Trạng thái giải quyết</TableHead>
              <TableHead className="w-12 text-center text-xs">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-xs text-muted-foreground">Không có đơn thư khiếu nại.</TableCell>
              </TableRow>
            ) : (
              data.map((item, idx) => (
                <TableRow key={idx} className="hover:bg-muted/30 border-b border-border/40 text-xs">
                  <TableCell className="font-mono font-bold text-muted-foreground text-[10px]">{item.complaintCode}</TableCell>
                  <TableCell className="font-bold text-foreground">{item.complainantName}</TableCell>
                  <TableCell className="font-medium">{item.villageName}</TableCell>
                  <TableCell className="max-w-[250px] truncate text-muted-foreground" title={item.description}>{item.description}</TableCell>
                  <TableCell>{item.receivedDate}</TableCell>
                  <TableCell className="text-muted-foreground">{item.dueDate}</TableCell>
                  <TableCell className="text-center">
                    <StatusBadge
                      status={item.status === 'resolved' ? 'active' : item.status === 'processing' ? 'processing' : 'warning'}
                      customLabel={item.status === 'resolved' ? 'Đã phản hồi' : item.status === 'processing' ? 'Đang xác minh' : 'Mới nhận'}
                    />
                  </TableCell>
                  <TableCell className="p-0 text-center">
                    <ActionMenu
                      entityName="đơn khiếu nại"
                      userRole={userRole}
                      onEdit={() => onEdit(item)}
                      onDelete={() => onDelete(item)}
                      customActions={
                        item.status !== 'resolved'
                          ? [
                              {
                                label: 'Đã phản hồi',
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

// === 5. TRAININGS TABLE ===
interface TrainingsTableProps {
  data: EnvironmentTraining[];
  userRole: string;
  onEdit: (item: EnvironmentTraining) => void;
  onDelete: (item: EnvironmentTraining) => void;
}

export function TrainingsTable({ data, userRole, onEdit, onDelete }: TrainingsTableProps) {
  return (
    <SectionCard title="Tập huấn & Tuyên truyền bảo vệ môi trường">
      <div className="overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader className="bg-muted/40 border-b border-border/60">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs">Chủ đề/Nội dung tuyên truyền</TableHead>
              <TableHead className="text-xs">Thời gian</TableHead>
              <TableHead className="text-xs">Địa điểm tổ chức</TableHead>
              <TableHead className="text-xs">Đối tượng tham gia</TableHead>
              <TableHead className="text-right text-xs">Số người tham dự</TableHead>
              <TableHead className="text-center text-xs">Đánh giá chung</TableHead>
              <TableHead className="w-12 text-center text-xs">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-xs text-muted-foreground">Không có đợt tuyên truyền nào.</TableCell>
              </TableRow>
            ) : (
              data.map((item, idx) => (
                <TableRow key={idx} className="hover:bg-muted/30 border-b border-border/40 text-xs">
                  <TableCell className="font-bold text-foreground max-w-[250px] truncate" title={item.topic}>{item.topic}</TableCell>
                  <TableCell>{item.trainingDate}</TableCell>
                  <TableCell className="max-w-[150px] truncate">{item.location}</TableCell>
                  <TableCell className="font-medium text-muted-foreground">{item.attendeeTarget}</TableCell>
                  <TableCell className="text-right font-bold">{item.attendeeCount} lượt</TableCell>
                  <TableCell className="text-center">
                    <StatusBadge
                      status={item.resultRating === 'excellent' ? 'active' : item.resultRating === 'good' ? 'processing' : 'warning'}
                      customLabel={item.resultRating === 'excellent' ? 'Xuất sắc' : item.resultRating === 'good' ? 'Tốt' : 'Trung bình'}
                    />
                  </TableCell>
                  <TableCell className="p-0 text-center">
                    <ActionMenu
                      entityName="đợt tuyên truyền"
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
