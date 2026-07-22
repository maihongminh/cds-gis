# 12 — Shadcn Component Governance

## Mục đích

Tài liệu này quy định cách sử dụng `shadcn/ui` trong toàn bộ project để đảm bảo:

- UI nhất quán.
- Không lặp lại code primitive.
- Khi cần chỉnh style chung, chỉ cần chỉnh một lần trong `src/components/ui`.
- Các module nghiệp vụ chỉ compose lại component, không tự viết lại Button, Card, Input, Table, Dialog...
- Dễ bảo trì khi dự án phát triển nhiều module.

---

## Nguyên tắc cốt lõi: Shadcn-first

Toàn bộ UI primitive phải ưu tiên dùng component tải về từ `shadcn/ui` và đặt trong:

```txt
src/components/ui
```

Không tự viết lại UI primitive bằng HTML thô nếu shadcn/ui đã có component tương ứng.

Ví dụ:

| Nhu cầu UI            | Bắt buộc dùng                          |
| --------------------- | -------------------------------------- |
| Button                | `@/components/ui/button`               |
| Card                  | `@/components/ui/card`                 |
| Input                 | `@/components/ui/input`                |
| Label                 | `@/components/ui/label`                |
| Textarea              | `@/components/ui/textarea`             |
| Select                | `@/components/ui/select`               |
| Table                 | `@/components/ui/table`                |
| Badge                 | `@/components/ui/badge`                |
| Dropdown menu         | `@/components/ui/dropdown-menu`        |
| Dialog / Modal        | `@/components/ui/dialog`               |
| Confirm dialog        | `@/components/ui/alert-dialog`         |
| Tabs                  | `@/components/ui/tabs`                 |
| Drawer / Mobile sheet | `@/components/ui/sheet`                |
| Separator             | `@/components/ui/separator`            |
| Scroll area           | `@/components/ui/scroll-area`          |
| Avatar                | `@/components/ui/avatar`               |
| Skeleton              | `@/components/ui/skeleton`             |
| Tooltip               | `@/components/ui/tooltip`              |
| Popover               | `@/components/ui/popover`              |
| Toast                 | `@/components/ui/sonner` hoặc `sonner` |

---

## Component bắt buộc cài ở giai đoạn foundation

Khi setup project mới hoặc khi chuẩn hóa project, cần đảm bảo các component sau đã tồn tại trong `src/components/ui`:

```bash
npx shadcn@latest add button card input label textarea select table badge dropdown-menu dialog alert-dialog tabs sheet separator scroll-area avatar skeleton tooltip popover sonner
```

Có thể cài thêm component shadcn khác khi cần, nhưng không được thay thế bằng UI library khác.

---

## Quy tắc import

### Đúng

```tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
```

### Sai

```tsx
import { Button } from "some-ui-library";
import * as RadixDialog from "@radix-ui/react-dialog";
```

Không import trực tiếp từ Radix UI trong module nghiệp vụ. Radix chỉ được dùng bên trong file shadcn/ui khi cần.

---

## Quy tắc sử dụng

### Button

Không dùng:

```tsx
<button className="...">Lưu</button>
```

Dùng:

```tsx
<Button variant="default" size="sm" className="...">
  Lưu
</Button>
```

### Card

Không dùng:

```tsx
<div className="bg-card border border-border rounded-xl p-6">
  ...
</div>
```

Dùng:

```tsx
<Card>
  <CardHeader>
    <CardTitle>Tiêu đề</CardTitle>
  </CardHeader>
  <CardContent>
    Nội dung
  </CardContent>
</Card>
```

### Input / Label / Select

Không dùng:

```tsx
<label>Thôn/nóc</label>
<input />
<select />
```

Dùng:

```tsx
<Label>Thôn/nóc</Label>
<Input />
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Chọn thôn/nóc" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="all">Tất cả</SelectItem>
  </SelectContent>
</Select>
```

### Table

Không dùng table HTML trực tiếp trong module page:

```tsx
<table>
  ...
</table>
```

Dùng shadcn Table trong `DataTableShell` hoặc trong component bảng chuyên biệt:

```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Mã</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>HD-001</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### Badge

Không dùng:

```tsx
<span className="rounded-full px-2 py-1">Đang hoạt động</span>
```

Dùng:

```tsx
<Badge variant="secondary">Đang hoạt động</Badge>
```

### Dialog / AlertDialog

Các action như thêm, sửa, xóa, import, export, sao lưu, khôi phục phải dùng:

* `Dialog` cho form hoặc modal thông tin.
* `AlertDialog` cho xác nhận hành động nguy hiểm như xóa, vô hiệu hóa, khôi phục dữ liệu.

Không tự dựng modal bằng `div fixed inset-0`.

### Tabs

Các trang chi tiết dùng:

```tsx
Tabs
TabsList
TabsTrigger
TabsContent
```

Không tự viết tab system nếu shadcn Tabs đáp ứng được.

### Mobile Drawer / Sidebar

Mobile drawer nên ưu tiên dùng `Sheet` nếu phù hợp.

Nếu cần custom sidebar phức tạp, vẫn phải:

* Dùng `Button` cho trigger/close button.
* Dùng `ScrollArea` cho vùng menu dài.
* Dùng `Separator` cho divider.
* Không hard-code màu.

---

## Component nghiệp vụ và UI primitive

Project được chia thành 2 lớp component:

### 1. UI primitives

Đặt tại:

```txt
src/components/ui
```

Đây là component tải về từ shadcn/ui.

Ví dụ:

* `button.tsx`
* `card.tsx`
* `input.tsx`
* `table.tsx`
* `dialog.tsx`

Chỉ chỉnh style primitive tại đây khi muốn thay đổi toàn hệ thống.

### 2. Business/common wrappers

Đặt tại:

```txt
src/components/common
src/components/layout
src/app/dashboard/[module]/components
```

Các component này được phép tạo mới, nhưng phải compose từ shadcn primitives.

Ví dụ:

* `MetricCard` dùng `Card`.
* `PageHeader` dùng `Button`.
* `DataTableShell` dùng `Table`.
* `StatusBadge` dùng `Badge`.
* `ActionMenu` dùng `DropdownMenu`.
* `ModuleFilters` dùng `Input`, `Select`, `Label`.
* `ModuleFormDialog` dùng `Dialog`, `Input`, `Select`, `Button`.

Không tạo custom primitive trùng chức năng với shadcn.

---

## Quy tắc className

Được truyền `className` để tinh chỉnh layout và spacing.

Ví dụ:

```tsx
<Button className="gap-2">
  <Plus className="size-4" />
  Thêm mới
</Button>
```

Không hard-code màu tuyệt đối.

### Đúng

```tsx
className="bg-background text-foreground border-border"
className="bg-card text-card-foreground"
className="text-muted-foreground"
className="bg-primary text-primary-foreground"
```

### Sai

```tsx
className="bg-white text-black"
className="bg-gray-100 text-gray-900"
className="dark:bg-zinc-900"
```

Chỉ dùng màu tuyệt đối cho chart/SVG khi thật sự cần, và phải có lý do rõ ràng.

---

## Quy tắc khi tạo module mới

Trước khi tạo module mới, AI phải kiểm tra:

1. Component shadcn cần dùng đã có trong `src/components/ui` chưa.
2. Nếu chưa có, cài bằng `npx shadcn@latest add [component-name]`.
3. Tạo business component bằng cách compose từ shadcn primitives.
4. Không viết lại Button, Card, Input, Select, Table, Badge, Dialog, Tabs.
5. Không tạo component UI primitive mới nếu shadcn đã có sẵn.

---

## Checklist review shadcn/ui

Trước khi hoàn thành task, kiểm tra:

* [ ] Không còn `<button>` cho action nghiệp vụ nếu có thể dùng `Button`.
* [ ] Không còn `<input>` cho form/filter nếu có thể dùng `Input`.
* [ ] Không còn `<select>` nếu có thể dùng `Select`.
* [ ] Không còn `<table>` trong module page nếu có thể dùng `Table`.
* [ ] Không còn badge tự viết bằng `<span>`.
* [ ] Không còn modal tự viết bằng `div fixed inset-0`.
* [ ] Không import trực tiếp từ Radix trong module nghiệp vụ.
* [ ] Không dùng UI library khác ngoài shadcn/ui.
* [ ] Common components compose từ shadcn primitives.
* [ ] Layout components dùng Button, Avatar, DropdownMenu, Sheet, ScrollArea, Separator khi phù hợp.
* [ ] Không hard-code màu.
* [ ] Dark mode vẫn hoạt động.

---

## Output bắt buộc sau mỗi task UI

Sau mỗi task có liên quan đến UI, AI phải báo cáo:

1. Shadcn components đã dùng.
2. Shadcn components đã cài thêm nếu có.
3. Files đã tạo/sửa.
4. Component nào còn dùng HTML thô và lý do.
5. Kết quả kiểm tra lint/type/build nếu có chạy.
