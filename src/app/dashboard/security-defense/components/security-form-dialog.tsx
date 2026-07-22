'use client';

import * as React from 'react';
import { Button, Input, Label } from '@/components/ui';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { useTenant } from '@/components/layout/tenant-context';
import { toast } from 'sonner';
import {
  SecurityDefenseItem,
  SecurityIncidentRecord,
  DefenseStatisticRecord,
  SocialIssueRecord,
} from '@/types/security-defense';

interface SecurityFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  tabType: string; // 'security' | 'defense' | 'social-issues'
  editingItem: SecurityDefenseItem | null;
}

export function SecurityFormDialog({
  isOpen,
  onOpenChange,
  tabType,
  editingItem,
}: SecurityFormDialogProps) {
  const { hamlets } = useTenant();
  const isEdit = !!editingItem;

  // Common Fields
  const [villageCode, setVillageCode] = React.useState('noc-01');
  const [recordedDate, setRecordedDate] = React.useState('2026-06-22');
  const [severity, setSeverity] = React.useState<'low' | 'medium' | 'high'>('medium');
  const [resolutionNote, setResolutionNote] = React.useState('');

  // 1. Security Incidents fields
  const [incidentCode, setIncidentCode] = React.useState('');
  const [incidentType, setIncidentType] = React.useState('Trộm cắp vặt nông sản');
  const [description, setDescription] = React.useState('');
  const [reporterName, setReporterName] = React.useState('');
  const [handlerName, setHandlerName] = React.useState('');
  const [securityStatus, setSecurityStatus] = React.useState<'resolved' | 'processing' | 'pending'>('pending');

  // 2. Defense fields
  const [year, setYear] = React.useState('2026');
  const [milForceCount, setMilForceCount] = React.useState('');
  const [youthEnlistedCount, setYouthEnlistedCount] = React.useState('');
  const [trainingClassCount, setTrainingClassCount] = React.useState('');
  const [trainingAttendeeCount, setTrainingAttendeeCount] = React.useState('');
  const [patrolCount, setPatrolCount] = React.useState('');
  const [budgetDefenseVnd, setBudgetDefenseVnd] = React.useState('');
  const [defenseNote, setDefenseNote] = React.useState('');

  // 3. Social Issues fields
  const [issueCode, setIssueCode] = React.useState('');
  const [issueType, setIssueType] = React.useState('Học sinh có nguy cơ bỏ học');
  const [affectedCount, setAffectedCount] = React.useState('');
  const [socialStatus, setSocialStatus] = React.useState<'active' | 'underMonitoring' | 'resolved'>('active');
  const [handlerDepartment, setHandlerDepartment] = React.useState('Đoàn Thanh niên xã');

  // Sync state when editingItem changes
  React.useEffect(() => {
    if (editingItem) {
      if (tabType === 'security') {
        const item = editingItem as SecurityIncidentRecord;
        setIncidentCode(item.incidentCode || '');
        setRecordedDate(item.recordedDate || '2026-06-22');
        setVillageCode(item.villageCode || 'noc-01');
        setIncidentType(item.incidentType || 'Trộm cắp vặt nông sản');
        setSeverity(item.severity || 'medium');
        setReporterName(item.reporterName || '');
        setHandlerName(item.handlerName || '');
        setSecurityStatus(item.status || 'pending');
        setDescription(item.description || '');
        setResolutionNote(item.resolutionNote || '');
      } else if (tabType === 'defense') {
        const item = editingItem as DefenseStatisticRecord;
        setYear(String(item.year || '2026'));
        setMilForceCount(String(item.milForceCount || ''));
        setYouthEnlistedCount(String(item.youthEnlistedCount || ''));
        setTrainingClassCount(String(item.trainingClassCount || ''));
        setTrainingAttendeeCount(String(item.trainingAttendeeCount || ''));
        setPatrolCount(String(item.patrolCount || ''));
        setBudgetDefenseVnd(String(item.budgetDefenseVnd || ''));
        setDefenseNote(item.note || '');
      } else if (tabType === 'social-issues') {
        const item = editingItem as SocialIssueRecord;
        setIssueCode(item.issueCode || '');
        setRecordedDate(item.recordedDate || '2026-06-22');
        setVillageCode(item.villageCode || 'noc-01');
        setIssueType(item.issueType || 'Học sinh có nguy cơ bỏ học');
        setAffectedCount(String(item.affectedCount || ''));
        setSeverity(item.severity || 'medium');
        setSocialStatus(item.status || 'active');
        setHandlerDepartment(item.handlerDepartment || 'Đoàn Thanh niên xã');
        setResolutionNote(item.resolutionNote || '');
      }
    } else {
      // Reset values
      setVillageCode('noc-01');
      setRecordedDate('2026-06-22');
      setSeverity('medium');
      setResolutionNote('');

      setIncidentCode('');
      setIncidentType('Trộm cắp vặt nông sản');
      setDescription('');
      setReporterName('');
      setHandlerName('');
      setSecurityStatus('pending');

      setYear('2026');
      setMilForceCount('');
      setYouthEnlistedCount('');
      setTrainingClassCount('');
      setTrainingAttendeeCount('');
      setPatrolCount('');
      setBudgetDefenseVnd('');
      setDefenseNote('');

      setIssueCode('');
      setIssueType('Học sinh có nguy cơ bỏ học');
      setAffectedCount('');
      setSocialStatus('active');
      setHandlerDepartment('Đoàn Thanh niên xã');
    }
  }, [editingItem, isOpen, tabType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    toast.success(`${isEdit ? 'Cập nhật' : 'Ghi nhận'} thông tin thành công!`, {
      description: `Đã lưu hồ sơ an ninh - quốc phòng vào cơ sở dữ liệu.`,
    });

    onOpenChange(false);
  };

  const getTitle = () => {
    const prefix = isEdit ? 'Cập nhật' : 'Ghi nhận';
    switch (tabType) {
      case 'security': return `${prefix} Vụ việc ANTT`;
      case 'defense': return `${prefix} Số liệu Quốc phòng`;
      case 'social-issues': return `${prefix} Vấn đề Tệ nạn - Xã hội`;
      default: return `${prefix} thông tin an ninh`;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-sm font-bold">{getTitle()}</DialogTitle>
          <DialogDescription className="text-xs">
            Cập nhật tình hình an ninh trật tự, công tác quốc phòng địa phương và hỗ trợ giải quyết vấn nạn xã hội xã Lao Bảo.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Section for security and social issues location selection */}
          {tabType !== 'defense' && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="villageCode" className="text-xs">Thôn địa bàn</Label>
                <Select value={villageCode} onValueChange={setVillageCode}>
                  <SelectTrigger id="villageCode" className="h-9 text-xs bg-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border text-xs">
                    {hamlets.map(h => (
                      <SelectItem key={h.code} value={h.code} className="cursor-pointer">{h.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="recordedDate" className="text-xs">Ngày ghi nhận</Label>
                <Input id="recordedDate" type="date" value={recordedDate} onChange={(e) => setRecordedDate(e.target.value)} className="h-9 text-xs" />
              </div>
            </div>
          )}

          {tabType === 'security' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="incidentCode" className="text-xs">Mã vụ việc <span className="text-destructive">*</span></Label>
                  <Input id="incidentCode" value={incidentCode} onChange={(e) => setIncidentCode(e.target.value)} placeholder="VU-AN-2026-..." className="h-9 text-xs" required />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="incidentType" className="text-xs">Loại vụ việc</Label>
                  <Select value={incidentType} onValueChange={setIncidentType}>
                    <SelectTrigger id="incidentType" className="h-9 text-xs bg-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border text-xs">
                      <SelectItem value="Trộm cắp vặt nông sản" className="cursor-pointer">Trộm cắp vặt nông sản</SelectItem>
                      <SelectItem value="Gây rối trật tự công cộng" className="cursor-pointer">Gây rối trật tự công cộng</SelectItem>
                      <SelectItem value="Tranh chấp ranh giới đất đai" className="cursor-pointer">Tranh chấp đất đai</SelectItem>
                      <SelectItem value="Vi phạm quy định phòng cháy rừng" className="cursor-pointer">Vi phạm quy định phòng cháy rừng</SelectItem>
                      <SelectItem value="Lấn chiếm hành lang an toàn giao thông" className="cursor-pointer">Lấn chiếm hành lang giao thông</SelectItem>
                      <SelectItem value="Xích mích nội bộ gia đình" className="cursor-pointer">Xích mích nội bộ gia đình</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="reporterName" className="text-xs">Người báo tin</Label>
                  <Input id="reporterName" value={reporterName} onChange={(e) => setReporterName(e.target.value)} placeholder="Tên người dân báo tin" className="h-9 text-xs" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="handlerName" className="text-xs">Cán bộ phụ trách xử lý</Label>
                  <Input id="handlerName" value={handlerName} onChange={(e) => setHandlerName(e.target.value)} placeholder="Cán bộ điều tra / hòa giải" className="h-9 text-xs" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="severity" className="text-xs">Mức độ nguy hại</Label>
                  <Select value={severity} onValueChange={(v) => setSeverity(v as 'low' | 'medium' | 'high')}>
                    <SelectTrigger id="severity" className="h-9 text-xs bg-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border text-xs">
                      <SelectItem value="low" className="cursor-pointer">Thấp (Mâu thuẫn nhỏ)</SelectItem>
                      <SelectItem value="medium" className="cursor-pointer">Trung bình</SelectItem>
                      <SelectItem value="high" className="cursor-pointer">Cao (Nghiêm trọng)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="securityStatus" className="text-xs">Tình trạng xử lý</Label>
                  <Select value={securityStatus} onValueChange={(v) => setSecurityStatus(v as 'resolved' | 'processing' | 'pending')}>
                    <SelectTrigger id="securityStatus" className="h-9 text-xs bg-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border text-xs">
                      <SelectItem value="pending" className="cursor-pointer">Chờ tiếp nhận</SelectItem>
                      <SelectItem value="processing" className="cursor-pointer">Đang xử lý</SelectItem>
                      <SelectItem value="resolved" className="cursor-pointer">Đã hòa giải xong</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="description" className="text-xs">Tóm tắt diễn biến vụ việc <span className="text-destructive">*</span></Label>
                <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Mô tả tóm tắt nội dung..." className="h-9 text-xs" required />
              </div>
            </>
          )}

          {tabType === 'defense' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="year" className="text-xs">Năm báo cáo</Label>
                  <Input id="year" type="number" value={year} onChange={(e) => setYear(e.target.value)} className="h-9 text-xs" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="milForceCount" className="text-xs">Lực lượng tự vệ (chiến sĩ) <span className="text-destructive">*</span></Label>
                  <Input id="milForceCount" type="number" value={milForceCount} onChange={(e) => setMilForceCount(e.target.value)} placeholder="130" className="h-9 text-xs" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="youthEnlistedCount" className="text-xs">Thanh niên nhập ngũ</Label>
                  <Input id="youthEnlistedCount" type="number" value={youthEnlistedCount} onChange={(e) => setYouthEnlistedCount(e.target.value)} placeholder="15" className="h-9 text-xs" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="patrolCount" className="text-xs">Lượt tuần tra địa bàn</Label>
                  <Input id="patrolCount" type="number" value={patrolCount} onChange={(e) => setPatrolCount(e.target.value)} placeholder="30" className="h-9 text-xs" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="trainingClassCount" className="text-xs">Số lớp tập huấn huấn luyện</Label>
                  <Input id="trainingClassCount" type="number" value={trainingClassCount} onChange={(e) => setTrainingClassCount(e.target.value)} placeholder="4" className="h-9 text-xs" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="trainingAttendeeCount" className="text-xs">Tổng quân số huấn luyện</Label>
                  <Input id="trainingAttendeeCount" type="number" value={trainingAttendeeCount} onChange={(e) => setTrainingAttendeeCount(e.target.value)} placeholder="125" className="h-9 text-xs" />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="budgetDefenseVnd" className="text-xs font-semibold">Ngân sách quốc phòng địa phương (VND)</Label>
                <Input id="budgetDefenseVnd" type="number" value={budgetDefenseVnd} onChange={(e) => setBudgetDefenseVnd(e.target.value)} placeholder="200000000" className="h-9 text-xs" />
              </div>

              <div className="space-y-1">
                <Label htmlFor="defenseNote" className="text-xs">Ghi chú hoạt động quốc phòng</Label>
                <Input id="defenseNote" value={defenseNote} onChange={(e) => setDefenseNote(e.target.value)} placeholder="Hoàn thành chỉ tiêu tuyển quân tốt..." className="h-9 text-xs" />
              </div>
            </>
          )}

          {tabType === 'social-issues' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="issueCode" className="text-xs">Mã vụ việc xã hội <span className="text-destructive">*</span></Label>
                  <Input id="issueCode" value={issueCode} onChange={(e) => setIssueCode(e.target.value)} placeholder="VD-XH-2026-..." className="h-9 text-xs" required />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="issueType" className="text-xs">Vấn nạn / Vấn đề cần theo dõi</Label>
                  <Select value={issueType} onValueChange={setIssueType}>
                    <SelectTrigger id="issueType" className="h-9 text-xs bg-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border text-xs">
                      <SelectItem value="Học sinh có nguy cơ bỏ học" className="cursor-pointer">Học sinh có nguy cơ bỏ học</SelectItem>
                      <SelectItem value="Tảo hôn / Kết hôn cận huyết thống" className="cursor-pointer">Tảo hôn / Kết hôn cận huyết</SelectItem>
                      <SelectItem value="Người cần hỗ trợ cai nghiện" className="cursor-pointer">Cần hỗ trợ cai nghiện chất</SelectItem>
                      <SelectItem value="Hộ có dấu hiệu bạo lực gia đình" className="cursor-pointer">Hộ có bạo lực gia đình</SelectItem>
                      <SelectItem value="Trẻ em hoàn cảnh đặc biệt khó khăn" className="cursor-pointer">Trẻ em hoàn cảnh khó khăn</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="affectedCount" className="text-xs">Số đối tượng ảnh hưởng (Người)</Label>
                  <Input id="affectedCount" type="number" value={affectedCount} onChange={(e) => setAffectedCount(e.target.value)} placeholder="2" className="h-9 text-xs" />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="handlerDepartment" className="text-xs">Đơn vị phụ trách chính</Label>
                  <Select value={handlerDepartment} onValueChange={setHandlerDepartment}>
                    <SelectTrigger id="handlerDepartment" className="h-9 text-xs bg-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border text-xs">
                      <SelectItem value="Đoàn Thanh niên xã" className="cursor-pointer">Đoàn Thanh niên xã</SelectItem>
                      <SelectItem value="Hội Phụ nữ xã" className="cursor-pointer">Hội Phụ nữ xã</SelectItem>
                      <SelectItem value="Công an xã" className="cursor-pointer">Công an xã</SelectItem>
                      <SelectItem value="Cán bộ Lao động - TB&XH" className="cursor-pointer">Lao động - TB&XH</SelectItem>
                      <SelectItem value="Ban nhân dân thôn" className="cursor-pointer">Ban nhân dân thôn</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="socialSeverity" className="text-xs">Mức độ nguy cấp</Label>
                  <Select value={severity} onValueChange={(v) => setSeverity(v as 'low' | 'medium' | 'high')}>
                    <SelectTrigger id="socialSeverity" className="h-9 text-xs bg-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border text-xs">
                      <SelectItem value="low" className="cursor-pointer">Thấp (Ít nguy hại)</SelectItem>
                      <SelectItem value="medium" className="cursor-pointer">Trung bình</SelectItem>
                      <SelectItem value="high" className="cursor-pointer">Cao (Khẩn cấp)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="socialStatus" className="text-xs">Tình trạng hồ sơ</Label>
                  <Select value={socialStatus} onValueChange={(v) => setSocialStatus(v as 'active' | 'underMonitoring' | 'resolved')}>
                    <SelectTrigger id="socialStatus" className="h-9 text-xs bg-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border text-xs">
                      <SelectItem value="active" className="cursor-pointer">Mới ghi nhận (Cần lưu ý)</SelectItem>
                      <SelectItem value="underMonitoring" className="cursor-pointer">Đang theo dõi sát</SelectItem>
                      <SelectItem value="resolved" className="cursor-pointer">Đã xử lý ổn định</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}

          {/* Conditional resolution note */}
          {((tabType === 'security' && securityStatus === 'resolved') ||
            (tabType === 'social-issues' && socialStatus === 'resolved')) && (
              <div className="space-y-1">
                <Label htmlFor="resolutionNote" className="text-xs">Kết quả hòa giải / Biện pháp xử lý <span className="text-destructive">*</span></Label>
                <Input
                  id="resolutionNote"
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  placeholder="Ví dụ: Đã hòa giải thành công và ký biên bản cam kết..."
                  className="h-9 text-xs"
                  required
                />
              </div>
            )}

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" size="sm" className="cursor-pointer shadow-none text-xs">Hủy</Button>
            </DialogClose>
            <Button type="submit" size="sm" className="cursor-pointer shadow-none text-xs">Lưu hồ sơ</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
