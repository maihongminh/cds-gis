// src/app/dashboard/settings/page.tsx
"use client";

import { PageHeader } from "@/components/common";
import { useTenant } from "@/components/layout/tenant-context";
import { Badge, Button, Card, CardContent, CardHeader, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";
import { Bell, CalendarDays, Clock, Settings, ShieldCheck } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

interface DataGroupFrequency {
  id: string;
  name: string;
  frequency: "daily" | "weekly" | "monthly" | "quarterly" | "annually" | "onChange" | "specialized";
  reminderDays: number;
}

const INITIAL_FREQUENCIES: DataGroupFrequency[] = [
  { id: "fg-1", name: "Nhóm dữ liệu Nông nghiệp & Canh tác", frequency: "quarterly", reminderDays: 3 },
  { id: "fg-2", name: "Nhóm dữ liệu Đất đai & Địa chính", frequency: "annually", reminderDays: 5 },
  { id: "fg-3", name: "Nhóm dữ liệu Du lịch & Dịch vụ thôn", frequency: "monthly", reminderDays: 3 },
  { id: "fg-4", name: "Nhóm dữ liệu Hạ tầng Giao thông nông thôn", frequency: "quarterly", reminderDays: 3 },
  { id: "fg-5", name: "Nhóm dữ liệu Giáo dục (Điểm trường/Học sinh)", frequency: "monthly", reminderDays: 3 },
  { id: "fg-6", name: "Nhóm dữ liệu Y tế & Cơ sở khám bệnh", frequency: "monthly", reminderDays: 3 },
  { id: "fg-7", name: "Nhóm dữ liệu An sinh xã hội & Trợ cấp nghèo", frequency: "monthly", reminderDays: 3 },
  { id: "fg-8", name: "Nhóm dữ liệu Quốc phòng, An ninh biên giới", frequency: "specialized", reminderDays: 7 },
  { id: "fg-9", name: "Nhóm dữ liệu Phòng chống thiên tai & Khẩn cấp", frequency: "onChange", reminderDays: 1 },
];

export default function SettingsPage() {
  const { currentRole } = useTenant();
  const [frequencies, setFrequencies] = React.useState<DataGroupFrequency[]>(INITIAL_FREQUENCIES);
  const [reminderThreshold, setReminderThreshold] = React.useState<number>(3); // 3 days before overdue

  const isEditable = currentRole === "admin" || currentRole === "data_governance";

  const handleUpdateFrequency = (id: string, value: any) => {
    setFrequencies((prev) => prev.map((f) => (f.id === id ? { ...f, frequency: value } : f)));
  };

  const handleUpdateReminder = (id: string, value: number) => {
    setFrequencies((prev) => prev.map((f) => (f.id === id ? { ...f, reminderDays: value } : f)));
  };

  const handleSaveSettings = () => {
    toast.success("Đã lưu cấu hình tần suất cập nhật dữ liệu và thiết lập nhắc nhở trước hạn.");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <PageHeader
        title={
          <>
            <Settings className="w-6 h-6 text-primary" />
            Cấu hình Tần suất &amp; Quy chế dữ liệu
          </>
        }
        description="Quản lý quy trình chốt số liệu định kỳ xã Lao Bảo và cài đặt tự động cảnh báo nhắc nhở cập nhật."
        actions={
          isEditable && (
            <Button onClick={handleSaveSettings} size="sm" className="h-9 text-xs cursor-pointer gap-1.5 shadow-none font-semibold">
              <ShieldCheck className="size-4" />
              Lưu thiết lập
            </Button>
          )
        }
      />

      {/* Strict administrative data lock rules card */}
      <Card className="border-emerald-500/20 bg-emerald-500/5 p-4 rounded-xl flex gap-3">
        <CalendarDays className="size-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-foreground text-xs uppercase tracking-wider">Quy chế chốt dữ liệu cấp phòng xã Lao Bảo (Rule 20)</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Nhằm phục vụ báo cáo định kỳ lên HĐND xã và Sở ngành Tỉnh Quảng Trị, hệ thống áp đặt quy chế:
            <strong> Chốt dữ liệu trước ngày 20 của tháng cuối cùng mỗi Quý</strong> (Ví dụ: Ngày 20/03, 20/06, 20/09, 20/12). Đến thời hạn trên, toàn bộ dữ liệu nhập liệu của các phân hệ sẽ tự động
            khóa (Lock) để kiểm tra kiểm toán tính nhất quán, cán bộ chuyên trách không thể sửa đổi trừ khi có sự phê chuẩn đặc biệt từ Lãnh đạo xã.
          </p>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Frequency Table configuration (Col-span 2) */}
        <div className="lg:col-span-2">
          <Card className="border-border bg-card shadow-2xs overflow-hidden">
            <CardHeader>
              <h3 className="font-bold text-foreground flex items-center gap-1.5">
                <Clock className="size-4 text-primary" /> Thiết lập tần suất cập nhật dữ liệu 9 phân hệ
              </h3>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-muted/40 border-b border-border/60 text-muted-foreground font-semibold">
                  <tr>
                    <th className="py-3.5 px-4">Nhóm dữ liệu chuyên ngành</th>
                    <th className="py-3.5 px-4">Tần suất cập nhật chuẩn</th>
                    <th className="py-3.5 px-4">Nhắc nhở trước hạn</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 font-medium">
                  {frequencies.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/5 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-foreground">{item.name}</td>
                      <td className="py-3.5 px-4">
                        <Select disabled={!isEditable} value={item.frequency} onValueChange={(val: any) => handleUpdateFrequency(item.id, val)}>
                          <SelectTrigger className="w-full h-8 text-xs bg-background border-border shadow-none cursor-pointer">
                            <SelectValue placeholder="Tần suất" />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-border text-xs">
                            <SelectItem value="daily" className="cursor-pointer">
                              Hằng ngày
                            </SelectItem>
                            <SelectItem value="weekly" className="cursor-pointer">
                              Hằng tuần
                            </SelectItem>
                            <SelectItem value="monthly" className="cursor-pointer">
                              Hằng tháng
                            </SelectItem>
                            <SelectItem value="quarterly" className="cursor-pointer">
                              Hằng quý
                            </SelectItem>
                            <SelectItem value="annually" className="cursor-pointer">
                              Hằng năm
                            </SelectItem>
                            <SelectItem value="onChange" className="cursor-pointer">
                              Khi có biến động
                            </SelectItem>
                            <SelectItem value="specialized" className="cursor-pointer">
                              Chuyên ngành đặc thù
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <Input
                            type="number"
                            disabled={!isEditable}
                            value={item.reminderDays}
                            onChange={(e) => handleUpdateReminder(item.id, Number(e.target.value))}
                            className="bg-background border-border text-xs h-8 shadow-none w-16"
                          />
                          <span className="text-muted-foreground text-[10px]">ngày trước hạn</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Global reminder notifications settings (Col-span 1) */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="border-border bg-card">
            <CardHeader>
              <h3 className="font-bold text-foreground flex items-center gap-1.5">
                <Bell className="size-4 text-primary" /> Thiết lập hệ thống Cảnh báo nhắc nhở
              </h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <label className="font-bold text-foreground">Ngưỡng thời gian phát cảnh báo quá hạn</label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    disabled={!isEditable}
                    value={reminderThreshold}
                    onChange={(e) => setReminderThreshold(Number(e.target.value))}
                    className="bg-background border-border text-xs h-9 shadow-none w-20"
                  />
                  <span className="text-muted-foreground">ngày trước khi trễ hạn</span>
                </div>
                <p className="text-[9px] text-muted-foreground leading-normal mt-1">
                  Khi chỉ số chưa được cập nhật dữ liệu mới và cách mốc chốt {reminderThreshold} ngày, hệ thống sẽ tự động gửi email và thông báo đẩy (push notification) cảnh báo đến tài khoản cán bộ
                  chuyên trách.
                </p>
              </div>

              <div className="p-3 bg-muted/20 border border-border rounded-xl space-y-1.5">
                <span className="font-bold text-foreground block">Ngưỡng kiểm soát:</span>
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>Trạng thái trước hạn:</span>
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20 text-[8px] font-bold py-0.5">
                    Nhắc nhở (T-3)
                  </Badge>
                </div>
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>Trạng thái trễ hạn:</span>
                  <Badge variant="outline" className="bg-rose-500/10 text-rose-600 border-rose-500/20 text-[8px] font-bold py-0.5">
                    Trễ hạn (Overdue)
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
