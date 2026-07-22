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
import { Textarea } from '@/components/ui/textarea';
import { useTenant } from '@/components/layout/tenant-context';
import { toast } from 'sonner';

import {
  EnvironmentItem,
  WasteRecord,
  EnvironmentRegistrationRecord,
  EnvironmentViolation,
  EnvironmentComplaint,
  EnvironmentTraining
} from '@/types/environment';

interface EnvironmentFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  tabType: string;
  editingItem: EnvironmentItem | null;
}

export function EnvironmentFormDialog({
  isOpen,
  onOpenChange,
  tabType,
  editingItem,
}: EnvironmentFormDialogProps) {
  const { hamlets } = useTenant();
  const isEdit = !!editingItem;

  // Generic fields
  const [villageCode, setVillageCode] = React.useState('noc-01');
  const [note, setNote] = React.useState('');

  // 1. Waste fields
  const [totalWaste, setTotalWaste] = React.useState('');
  const [collected, setCollected] = React.useState('');
  const [organic, setOrganic] = React.useState('');
  const [inorganic, setInorganic] = React.useState('');
  const [month, setMonth] = React.useState('6');
  const [year, setYear] = React.useState('2026');

  // 2. Registration / Permit fields
  const [bizName, setBizName] = React.useState('');
  const [ownerName, setOwnerName] = React.useState('');
  const [bizType, setBizType] = React.useState('Chăn nuôi/Trồng trọt');
  const [regDate, setRegDate] = React.useState('2026-06-15');
  const [officer, setOfficer] = React.useState('Nguyễn Văn Trị');
  const [status, setStatus] = React.useState('pending');

  // 3. Violation fields
  const [violCode, setViolCode] = React.useState('');
  const [offenderName, setOffenderName] = React.useState('');
  const [violType, setViolType] = React.useState('');
  const [violDate, setViolDate] = React.useState('2026-06-20');
  const [severity, setSeverity] = React.useState('medium');
  const [violStatus, setViolStatus] = React.useState('pending');

  // 4. Complaint fields
  const [compCode, setCompCode] = React.useState('');
  const [complainant, setComplainant] = React.useState('');
  const [desc, setDesc] = React.useState('');
  const [receivedDate, setReceivedDate] = React.useState('2026-06-18');
  const [dueDate, setDueDate] = React.useState('2026-06-25');
  const [compStatus, setCompStatus] = React.useState('received');

  // 5. Training fields
  const [topic, setTopic] = React.useState('');
  const [trainingDate, setTrainingDate] = React.useState('2026-06-22');
  const [location, setLocation] = React.useState('');
  const [target, setTarget] = React.useState('Đại diện các hộ dân');
  const [attendees, setAttendees] = React.useState('');
  const [rating, setRating] = React.useState('good');

  // Sync state when editingItem changes
  React.useEffect(() => {
    if (editingItem) {
      if ('villageCode' in editingItem) {
        setVillageCode(editingItem.villageCode || 'noc-01');
      } else {
        setVillageCode('noc-01');
      }
      if ('note' in editingItem) {
        setNote((editingItem as WasteRecord).note || '');
      } else {
        setNote('');
      }

      if (tabType === 'waste') {
        const item = editingItem as WasteRecord;
        setTotalWaste(String(item.totalWasteTons || ''));
        setCollected(String(item.collectedTons || ''));
        setOrganic(String(item.organicWasteTons || ''));
        setInorganic(String(item.inorganicWasteTons || ''));
        setMonth(String(item.month || '6'));
        setYear(String(item.year || '2026'));
      } else if (tabType === 'registrations') {
        const item = editingItem as EnvironmentRegistrationRecord;
        setBizName(item.businessName || '');
        setOwnerName(item.ownerName || '');
        setBizType(item.businessType || 'Chăn nuôi/Trồng trọt');
        setRegDate(item.registrationDate || '');
        setOfficer(item.officerInCharge || 'Nguyễn Văn Trị');
        setStatus(item.status || 'pending');
      } else if (tabType === 'violations') {
        const item = editingItem as EnvironmentViolation;
        setViolCode(item.violationCode || '');
        setOffenderName(item.offenderName || '');
        setViolType(item.violationType || '');
        setViolDate(item.recordedDate || '');
        setSeverity(item.severity || 'medium');
        setViolStatus(item.status || 'pending');
      } else if (tabType === 'complaints') {
        const item = editingItem as EnvironmentComplaint;
        setCompCode(item.complaintCode || '');
        setComplainant(item.complainantName || '');
        setDesc(item.description || '');
        setReceivedDate(item.receivedDate || '');
        setDueDate(item.dueDate || '');
        setCompStatus(item.status || 'received');
      } else if (tabType === 'trainings') {
        const item = editingItem as EnvironmentTraining;
        setTopic(item.topic || '');
        setTrainingDate(item.trainingDate || '');
        setLocation(item.location || '');
        setTarget(item.attendeeTarget || 'Đại diện các hộ dân');
        setAttendees(String(item.attendeeCount || ''));
        setRating(item.resultRating || 'good');
      }
    } else {
      setVillageCode('noc-01');
      setNote('');
      setTotalWaste('');
      setCollected('');
      setOrganic('');
      setInorganic('');
      setMonth('6');
      setYear('2026');
      setBizName('');
      setOwnerName('');
      setBizType('Chăn nuôi/Trồng trọt');
      setRegDate('2026-06-15');
      setOfficer('Nguyễn Văn Trị');
      setStatus('pending');
      setViolCode('');
      setOffenderName('');
      setViolType('');
      setViolDate('2026-06-20');
      setSeverity('medium');
      setViolStatus('pending');
      setCompCode('');
      setComplainant('');
      setDesc('');
      setReceivedDate('2026-06-18');
      setDueDate('2026-06-25');
      setCompStatus('received');
      setTopic('');
      setTrainingDate('2026-06-22');
      setLocation('');
      setTarget('Đại diện các hộ dân');
      setAttendees('');
      setRating('good');
    }
  }, [editingItem, isOpen, tabType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    toast.success(`${isEdit ? 'Cập nhật' : 'Ghi nhận'} thông tin thành công!`, {
      description: `Đã lưu bản ghi môi trường vào hệ thống.`,
    });

    onOpenChange(false);
  };

  const getTitle = () => {
    const prefix = isEdit ? 'Cập nhật' : 'Thêm mới';
    switch (tabType) {
      case 'waste': return `${prefix} số liệu Rác thải`;
      case 'registrations': return `${prefix} Hồ sơ đăng ký môi trường`;
      case 'violations': return `${prefix} Biên bản vi phạm môi trường`;
      case 'complaints': return `${prefix} Đơn thư khiếu nại`;
      case 'trainings': return `${prefix} Đợt tập huấn / Tuyên truyền`;
      default: return `${prefix} bản ghi`;
    }
  };

  const renderFields = () => {
    switch (tabType) {
      case 'waste':
        return (
          <>
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
                <Label htmlFor="month" className="text-xs">Tháng ghi nhận</Label>
                <Input id="month" type="number" value={month} onChange={(e) => setMonth(e.target.value)} className="h-9 text-xs" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="totalWaste" className="text-xs">Tổng lượng rác phát sinh (tấn) <span className="text-destructive">*</span></Label>
                <Input id="totalWaste" type="number" step="0.01" value={totalWaste} onChange={(e) => setTotalWaste(e.target.value)} placeholder="10.5..." className="h-9 text-xs" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="collected" className="text-xs">Đã thu gom xử lý (tấn) <span className="text-destructive">*</span></Label>
                <Input id="collected" type="number" step="0.01" value={collected} onChange={(e) => setCollected(e.target.value)} placeholder="8.2..." className="h-9 text-xs" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <Label htmlFor="organic" className="text-[10px]">Rác hữu cơ (tấn)</Label>
                <Input id="organic" type="number" step="0.01" value={organic} onChange={(e) => setOrganic(e.target.value)} placeholder="7.0" className="h-9 text-xs" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="inorganic" className="text-[10px]">Rác vô cơ (tấn)</Label>
                <Input id="inorganic" type="number" step="0.01" value={inorganic} onChange={(e) => setInorganic(e.target.value)} placeholder="2.5" className="h-9 text-xs" />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px]">Năm ghi nhận</Label>
                <Input type="number" value={year} onChange={(e) => setYear(e.target.value)} className="h-9 text-xs" />
              </div>
            </div>
          </>
        );
      case 'registrations':
        return (
          <>
            <div className="space-y-1">
              <Label htmlFor="bizName" className="text-xs">Tên cơ sở kinh doanh / Đối tượng <span className="text-destructive">*</span></Label>
              <Input id="bizName" value={bizName} onChange={(e) => setBizName(e.target.value)} placeholder="Ví dụ: Trại chăn nuôi heo Thôn 2..." className="h-9 text-xs" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="ownerName" className="text-xs">Chủ cơ sở <span className="text-destructive">*</span></Label>
                <Input id="ownerName" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} placeholder="Nguyễn Văn A..." className="h-9 text-xs" />
              </div>
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
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="bizType" className="text-xs">Loại hình kinh doanh</Label>
                <Input id="bizType" value={bizType} onChange={(e) => setBizType(e.target.value)} placeholder="Chăn nuôi, mộc..." className="h-9 text-xs" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="regDate" className="text-xs">Ngày nộp hồ sơ</Label>
                <Input id="regDate" type="date" value={regDate} onChange={(e) => setRegDate(e.target.value)} className="h-9 text-xs" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="officer" className="text-xs">Cán bộ phụ trách</Label>
                <Input id="officer" value={officer} onChange={(e) => setOfficer(e.target.value)} className="h-9 text-xs" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="status" className="text-xs">Trạng thái hồ sơ</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger id="status" className="h-9 text-xs bg-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border text-xs">
                    <SelectItem value="pending" className="cursor-pointer">Chờ duyệt (Pending)</SelectItem>
                    <SelectItem value="approved" className="cursor-pointer">Đã phê duyệt (Approved)</SelectItem>
                    <SelectItem value="rejected" className="cursor-pointer">Từ chối (Rejected)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        );
      case 'violations':
        return (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="violCode" className="text-xs">Mã vụ việc <span className="text-destructive">*</span></Label>
                <Input id="violCode" value={violCode} onChange={(e) => setViolCode(e.target.value)} placeholder="VP-MT-2026-..." className="h-9 text-xs" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="offenderName" className="text-xs">Đối tượng vi phạm <span className="text-destructive">*</span></Label>
                <Input id="offenderName" value={offenderName} onChange={(e) => setOffenderName(e.target.value)} placeholder="Tên hộ dân / Cơ sở gỗ..." className="h-9 text-xs" />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="violType" className="text-xs">Hành vi vi phạm <span className="text-destructive">*</span></Label>
              <Input id="violType" value={violType} onChange={(e) => setViolType(e.target.value)} placeholder="Xả thải chưa qua xử lý ra suối..." className="h-9 text-xs" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="villageCode" className="text-xs">Khu vực vi phạm (Thôn)</Label>
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
                <Label htmlFor="violDate" className="text-xs">Ngày lập biên bản</Label>
                <Input id="violDate" type="date" value={violDate} onChange={(e) => setViolDate(e.target.value)} className="h-9 text-xs" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="severity" className="text-xs">Mức độ nghiêm trọng</Label>
                <Select value={severity} onValueChange={setSeverity}>
                  <SelectTrigger id="severity" className="h-9 text-xs bg-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border text-xs">
                    <SelectItem value="low" className="cursor-pointer">Thấp</SelectItem>
                    <SelectItem value="medium" className="cursor-pointer">Trung bình</SelectItem>
                    <SelectItem value="high" className="cursor-pointer">Nghiêm trọng (High)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="violStatus" className="text-xs">Tình trạng giải quyết</Label>
                <Select value={violStatus} onValueChange={setViolStatus}>
                  <SelectTrigger id="violStatus" className="h-9 text-xs bg-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border text-xs">
                    <SelectItem value="pending" className="cursor-pointer">Chờ xử lý</SelectItem>
                    <SelectItem value="processing" className="cursor-pointer">Đang xử lý</SelectItem>
                    <SelectItem value="resolved" className="cursor-pointer">Đã xử lý (Resolved)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        );
      case 'complaints':
        return (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="compCode" className="text-xs">Mã đơn khiếu nại <span className="text-destructive">*</span></Label>
                <Input id="compCode" value={compCode} onChange={(e) => setCompCode(e.target.value)} placeholder="ĐƠN-MT-..." className="h-9 text-xs" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="complainant" className="text-xs">Người gửi kiến nghị <span className="text-destructive">*</span></Label>
                <Input id="complainant" value={complainant} onChange={(e) => setComplainant(e.target.value)} placeholder="Ông/Bà..." className="h-9 text-xs" />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="desc" className="text-xs">Nội dung khiếu nại (tóm tắt) <span className="text-destructive">*</span></Label>
              <Textarea id="desc" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Mùi hôi bốc lên từ trang trại chăn nuôi..." className="text-xs min-h-[60px]" />
            </div>
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
                <Label htmlFor="receivedDate" className="text-xs">Ngày tiếp nhận</Label>
                <Input id="receivedDate" type="date" value={receivedDate} onChange={(e) => setReceivedDate(e.target.value)} className="h-9 text-xs" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="dueDate" className="text-xs">Thời hạn giải quyết</Label>
                <Input id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="h-9 text-xs" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="compStatus" className="text-xs">Trạng thái giải quyết</Label>
                <Select value={compStatus} onValueChange={setCompStatus}>
                  <SelectTrigger id="compStatus" className="h-9 text-xs bg-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border text-xs">
                    <SelectItem value="received" className="cursor-pointer">Mới nhận</SelectItem>
                    <SelectItem value="processing" className="cursor-pointer">Đang xử lý</SelectItem>
                    <SelectItem value="resolved" className="cursor-pointer">Đã phản hồi (Resolved)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        );
      case 'trainings':
        return (
          <>
            <div className="space-y-1">
              <Label htmlFor="topic" className="text-xs">Chủ đề / Nội dung tuyên truyền tập huấn <span className="text-destructive">*</span></Label>
              <Input id="topic" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Tuyên truyền phân loại rác..." className="h-9 text-xs" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="trainingDate" className="text-xs">Ngày tổ chức</Label>
                <Input id="trainingDate" type="date" value={trainingDate} onChange={(e) => setTrainingDate(e.target.value)} className="h-9 text-xs" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="location" className="text-xs">Địa điểm tổ chức <span className="text-destructive">*</span></Label>
                <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Nhà sinh hoạt cộng đồng..." className="h-9 text-xs" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1 col-span-2">
                <Label htmlFor="target" className="text-xs">Đối tượng tham gia</Label>
                <Input id="target" value={target} onChange={(e) => setTarget(e.target.value)} className="h-9 text-xs" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="attendees" className="text-xs">Số người <span className="text-destructive">*</span></Label>
                <Input id="attendees" type="number" value={attendees} onChange={(e) => setAttendees(e.target.value)} placeholder="50..." className="h-9 text-xs" />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="rating" className="text-xs">Kết quả đánh giá lớp học</Label>
              <Select value={rating} onValueChange={setRating}>
                <SelectTrigger id="rating" className="h-9 text-xs bg-card">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border text-xs">
                  <SelectItem value="excellent" className="cursor-pointer">Xuất sắc</SelectItem>
                  <SelectItem value="good" className="cursor-pointer">Tốt</SelectItem>
                  <SelectItem value="average" className="cursor-pointer">Trung bình</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-sm font-bold">{getTitle()}</DialogTitle>
          <DialogDescription className="text-xs">
            Vui lòng điền đầy đủ các thông tin để cập nhật hồ sơ ghi nhận bảo vệ môi trường xã Lao Bảo.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {renderFields()}

          {tabType !== 'trainings' && tabType !== 'waste' && (
            <div className="space-y-1">
              <Label htmlFor="note" className="text-xs">Ghi chú chi tiết / Nhật ký xử lý</Label>
              <Textarea id="note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Nhập ghi chú hoặc kết quả hòa giải xử lý..." className="text-xs min-h-[50px]" />
            </div>
          )}

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" size="sm" className="cursor-pointer shadow-none text-xs">Hủy</Button>
            </DialogClose>
            <Button type="submit" size="sm" className="cursor-pointer shadow-none text-xs">Lưu dữ liệu</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
