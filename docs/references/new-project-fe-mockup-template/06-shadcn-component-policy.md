# 06 — Shadcn Component Policy (Chính sách sử dụng Shadcn UI)

## Nguyên tắc cốt lõi: Shadcn-first

> **Nếu Shadcn UI có component tương ứng thì BẮT BUỘC dùng Shadcn UI.** Không tự viết lại UI primitive.

Toàn bộ UI primitive phải import từ `src/components/ui/` — đây là component tải từ shadcn/ui CLI.

---

## Bảng component bắt buộc

| Nhu cầu UI | Component Shadcn phải dùng | Import path |
|---|---|---|
| Nút bấm | `Button` | `@/components/ui/button` |
| Thẻ / Card | `Card`, `CardHeader`, `CardTitle`, `CardContent` | `@/components/ui/card` |
| Input text | `Input` | `@/components/ui/input` |
| Label form | `Label` | `@/components/ui/label` |
| Textarea | `Textarea` | `@/components/ui/textarea` |
| Select dropdown | `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem` | `@/components/ui/select` |
| Bảng dữ liệu | `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell` | `@/components/ui/table` |
| Badge trạng thái | `Badge` | `@/components/ui/badge` |
| Menu dropdown | `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem` | `@/components/ui/dropdown-menu` |
| Dialog / Modal | `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogTitle` | `@/components/ui/dialog` |
| Dialog xác nhận | `AlertDialog`, `AlertDialogAction`, `AlertDialogCancel` | `@/components/ui/alert-dialog` |
| Tabs | `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` | `@/components/ui/tabs` |
| Sidebar mobile drawer | `Sheet` (hoặc custom drawer giống source hiện tại) | `@/components/ui/sheet` |
| Accordion menu | Custom CollapsiblePanel (giống source hiện tại) | — |
| Tooltip | `Tooltip`, `TooltipTrigger`, `TooltipContent`, `TooltipProvider` | `@/components/ui/tooltip` |
| Loading skeleton | `Skeleton` | `@/components/ui/skeleton` |
| User avatar | `Avatar`, `AvatarImage`, `AvatarFallback` | `@/components/ui/avatar` |
| Scroll area | `ScrollArea` | `@/components/ui/scroll-area` |
| Separator / Divider | `Separator` | `@/components/ui/separator` |
| Popover | `Popover`, `PopoverTrigger`, `PopoverContent` | `@/components/ui/popover` |
| Toast notification | `Sonner` / `toast()` | `sonner` |
| Command palette | `Command` | `@/components/ui/command` |

---

## Lệnh cài component nền tảng

```bash
npx shadcn@latest add button card input label textarea select table badge dropdown-menu dialog alert-dialog tabs sheet separator scroll-area avatar skeleton tooltip popover sonner accordion collapsible command
```

Nếu thiếu component nào, cài thêm bằng:

```bash
npx shadcn@latest add [component-name]
```

**Không tự tạo component thay thế nếu Shadcn đã có.**

---

## Quy tắc sử dụng

### ✅ Đúng

```tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

<Button variant="default" size="sm" className="gap-2">
  <Plus className="size-4" /> Thêm mới
</Button>
```

### ❌ Sai

```tsx
// ❌ Không dùng HTML thô cho button nghiệp vụ
<button className="...">Lưu</button>

// ❌ Không dùng div thay Card
<div className="bg-card border border-border rounded-xl p-6">...</div>

// ❌ Không dùng HTML input/select trong form
<input />, <select />, <label />

// ❌ Không import trực tiếp từ Radix
import * as RadixDialog from "@radix-ui/react-dialog";

// ❌ Không dùng UI library khác
import { Button } from "some-ui-library";
```

---

## 2 lớp component

### Lớp 1: UI Primitives (`src/components/ui/`)

- Component từ shadcn/ui CLI.
- Chỉ chỉnh style tại đây khi cần thay đổi toàn hệ thống.
- Ví dụ: `button.tsx`, `card.tsx`, `input.tsx`, `table.tsx`.

### Lớp 2: Business/Common Wrappers

- Đặt tại: `src/components/common/`, `src/components/layout/`, `src/app/dashboard/[module]/components/`.
- **Phải compose từ shadcn primitives**, không tự viết primitive mới.

| Component | Compose từ |
|---|---|
| `MetricCard` | `Card` |
| `PageHeader` | `Button` |
| `DataTableShell` | `Table` |
| `StatusBadge` | `Badge` |
| `ActionMenu` | `DropdownMenu` |
| `ModuleFilters` | `Input`, `Select`, `Label` |
| `ConfirmDialog` | `AlertDialog` |
| `FormDialog` | `Dialog`, `Input`, `Select`, `Button` |

---

## Quy tắc className

- ✅ Được truyền `className` để tinh chỉnh layout/spacing.
- ❌ Không hard-code màu tuyệt đối trong className.

```tsx
// ✅ Đúng
className="bg-background text-foreground border-border"
className="bg-card text-card-foreground"
className="text-muted-foreground"

// ❌ Sai
className="bg-white text-black"
className="bg-gray-100 text-gray-900"
```

---

## Checklist review Shadcn UI

Trước khi hoàn thành task, kiểm tra:

- [ ] Không còn `<button>` cho action nghiệp vụ nếu có thể dùng `Button`.
- [ ] Không còn `<input>` cho form/filter nếu có thể dùng `Input`.
- [ ] Không còn `<select>` nếu có thể dùng `Select`.
- [ ] Không còn `<table>` trong module page nếu có thể dùng `Table`.
- [ ] Không còn badge tự viết bằng `<span>`.
- [ ] Không còn modal tự viết bằng `div fixed inset-0`.
- [ ] Không import trực tiếp từ Radix trong module nghiệp vụ.
- [ ] Không dùng UI library khác ngoài shadcn/ui.
- [ ] Common components compose từ shadcn primitives.
- [ ] Không hard-code màu.
- [ ] Dark mode vẫn hoạt động.
