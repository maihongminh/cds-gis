# 02 — UI System (Hệ thống giao diện)

## Tổng quan phong cách thiết kế

Project sử dụng phong cách **clean, professional, neutral** — phù hợp cho hệ thống quản lý nghiệp vụ, admin dashboard, và trang giới thiệu sản phẩm.

Hệ thống giao diện này được thiết kế linh hoạt để có thể dễ dàng thay đổi cấu hình hiển thị, màu sắc và kiểu dáng tùy thuộc vào các nguồn thiết kế khác nhau của từng dự án cụ thể.

---

## Nguồn thiết kế (Design Source) & Thứ tự ưu tiên

Dự án mới khi khởi động có thể lựa chọn phong cách thiết kế từ một hoặc nhiều nguồn sau đây:

1. **Brand Guideline (Hướng dẫn thương hiệu) riêng**: Tài liệu quy chuẩn màu sắc, typography và logo riêng của khách hàng hoặc tổ chức.
2. **shadcn/ui Theme Tokens**: Các biến CSS (CSS variables) màu sắc được sinh ra từ trang cấu hình theme của shadcn/ui.
3. **Website Reference (Trang web tham chiếu)**: Một sản phẩm web có sẵn mà dự án muốn học hỏi về phong cách layout, khoảng cách, kiểu bo góc, hoặc hiệu ứng chuyển động.
4. **Default Template Style (Phong cách mặc định)**: Style có sẵn của template (lấy cảm hứng từ **Vercel-style** tối giản, tương phản cao, và tối ưu hóa cho tiếng Việt).

### Thứ tự ưu tiên áp dụng (Priority):
> [!IMPORTANT]
> Khi thiết kế giao diện cho project mới, AI và lập trình viên cần tuân thủ thứ tự ưu tiên sau:
> 1. **Brand Guideline** (Ưu tiên số 1 - nếu được cung cấp).
> 2. **shadcn/ui Theme Tokens** (Ưu tiên số 2 - dùng để cấu hình bảng màu CSS).
> 3. **Website Reference** (Ưu tiên số 3 - chỉ tham khảo học hỏi tinh thần thiết kế, không sao chép hình ảnh/thương hiệu).
> 4. **Default Template Style** (Ưu tiên số 4 - phương án mặc định).

---

## Hướng dẫn áp dụng shadcn/ui Theme Tokens

Khi cấu hình màu sắc từ shadcn/ui Customizer, hãy tuân thủ quy trình tích hợp sau:

### 1. Cấu hình CSS Variables trong `globals.css`
* Copy block `:root { ... }` (light mode tokens) dán vào vùng tương ứng trong `src/app/globals.css`.
* Copy block `.dark { ... }` (dark mode tokens) dán vào vùng tương ứng trong globals.css.
* **Đảo bảo tương thích Dark Mode**: Trong trường hợp nguồn cấp chỉ cung cấp token light mode (`:root`), lập trình viên/AI cần tự tạo thêm block `.dark` tương ứng bằng cách đảo màu hợp lý để đảm bảo giao diện hiển thị tốt ở chế độ tối.

### 2. Sử dụng Semantic Tokens thay vì Hard-code màu
Mọi component trong dự án bắt buộc phải sử dụng các class màu ngữ nghĩa (semantic tokens) của Tailwind để đảm bảo tính đồng bộ khi đổi theme hoặc bật/tắt dark mode. Không sử dụng class màu tuyệt đối (như `bg-white`, `text-black`, `bg-zinc-100`).

Các class màu ngữ nghĩa bắt buộc dùng:
* `bg-background`: Màu nền trang chính.
* `text-foreground`: Màu chữ chính toàn app.
* `bg-card` & `text-card-foreground`: Màu nền và màu chữ trên thẻ (Card).
* `border-border`: Màu đường viền (table, card, divider).
* `bg-primary` & `text-primary-foreground`: Màu thương hiệu chủ đạo và màu chữ hiển thị trên nút bấm chính.
* `bg-muted` & `text-muted-foreground`: Màu nền phụ (toolbar, badge) và chữ chú thích.
* `bg-accent` & `text-accent-foreground`: Màu nền và chữ khi hover vào các thẻ/dòng/nút bấm.

## Các ví dụ cấu hình nguồn giao diện (UI Style Examples)

Dưới đây là các ví dụ minh họa cách khai báo cấu hình phần `UI_STYLE` tương ứng với các nguồn thiết kế khác nhau khi điền thông tin khởi tạo dự án:

### Kiểu 1 — Dùng website tham khảo

```txt
UI_STYLE_SOURCE:
  - [x] Tham khảo website khác

DESIGN_REFERENCE:
  - Website URL hoặc mô tả style: https://example.com
  - Những điểm cần học theo:
    - Layout: dashboard rộng, nhiều card, sidebar tối giản
    - Spacing: thoáng, nhiều khoảng trắng
    - Card style: border nhẹ, shadow rất nhỏ
    - Button style: pill button, icon trước text
    - Typography: heading đậm, body dễ đọc
    - Motion/animation: fade nhẹ khi hover
```

### Kiểu 2 — Dùng shadcn/ui theme

```txt
UI_STYLE_SOURCE:
  - [x] Dùng shadcn/ui theme token

SHADCN_THEME_TOKENS:
  ```css
  :root {
    --background: oklch(1 0 0);
    --foreground: oklch(0.145 0 0);
    --primary: oklch(0.205 0 0);
    /* ... */
  }

  .dark {
    --background: oklch(0.145 0 0);
    --foreground: oklch(0.97 0 0);
    --primary: oklch(0.97 0 0);
    /* ... */
  }
  ```
```

### Kiểu 3 — Dùng brand guideline riêng

```txt
UI_STYLE_SOURCE:
  - [x] Dùng brand guideline riêng

BRAND_GUIDELINE:
  - Logo: đã có trong public/logo.svg
  - Màu chính: #0068d6
  - Màu phụ: #52aeff
  - Font: Be Vietnam Pro
  - Tone giao diện: hiện đại, tin cậy, tối giản
```

---

## Color System (Hệ thống màu sắc)

### Color Tokens

Tất cả màu được định nghĩa bằng **CSS Variables** trong `src/app/globals.css`, sử dụng **oklch()** color space.

```css
/* Cách khai báo trong globals.css */
:root {
  --background: oklch(1 0 0);           /* Trắng */
  --foreground: oklch(0.145 0 0);       /* Đen gần tuyệt đối */
  --primary: oklch(28% 0 271);          /* Màu chủ đạo */
  --primary-foreground: oklch(0.971 0.013 17.38);
  --muted: oklch(0.97 0 0);            /* Nền phụ */
  --muted-foreground: oklch(0.556 0 0); /* Text phụ */
  --border: oklch(0.922 0 0);          /* Viền */
  --card: oklch(1 0 0);               /* Nền card */
  --destructive: oklch(0.577 0.245 27.325); /* Đỏ cảnh báo */
  /* ... */
}
```

### Cách áp dụng cho project mới

1. **Đổi `--primary`**: Chọn màu chủ đạo phù hợp nghiệp vụ (xanh dương cho fintech, xanh lá cho y tế...).
2. **Giữ nguyên `--background`, `--foreground`, `--muted`**: Đây là neutral colors, phù hợp mọi project.
3. **Giữ nguyên `--border`, `--ring`, `--input`**: Đảm bảo consistency (tính nhất quán) cho form/table.
4. **Tùy chỉnh `--chart-1` đến `--chart-5`**: Đổi palette biểu đồ theo brand color.

### Bảng color token

| Token | Light Mode | Dark Mode | Dùng cho |
|---|---|---|---|
| `--background` | Trắng | Tối đen | Nền trang |
| `--foreground` | Đen | Trắng ngà | Text chính |
| `--card` | Trắng | Xám tối | Nền card |
| `--primary` | Tùy brand | Sáng hơn light | Button, link, accent |
| `--muted` | Xám nhạt | Xám tối | Nền phụ, toolbar |
| `--muted-foreground` | Xám trung | Xám sáng | Text phụ, label |
| `--border` | Xám nhạt | Trắng 10% opacity | Viền card, table |
| `--destructive` | Đỏ | Đỏ sáng hơn | Delete, error |
| `--accent` | Xám nhạt | Xám tối | Hover background |

---

## Dark Mode

### Cách hoạt động

1. **next-themes** thêm class `.dark` vào `<html>`.
2. **Tailwind** dùng `@custom-variant dark (&:is(.dark *))` để kích hoạt `dark:` utilities.
3. **CSS Variables** được override trong block `.dark {}` của `globals.css`.

### Cách dùng trong code

```tsx
// Dùng Tailwind dark: variant
<div className="bg-card dark:bg-secondary text-foreground">

// Hoặc dùng CSS variable (tự động chuyển đổi)
<div className="bg-background text-foreground">
  {/* Không cần dark: prefix — CSS variable tự đổi */}
</div>
```

### Quy tắc dark mode

- **Ưu tiên dùng semantic token** (`bg-background`, `text-foreground`) — tự động chuyển sáng/tối.
- **Chỉ dùng `dark:` prefix** khi cần override cụ thể (ví dụ: `dark:bg-zinc-800`).
- **Tránh hard-code màu** (`bg-white`, `text-black`) — sẽ không chuyển đổi.

---

## Typography

### Font chữ

```tsx
// src/app/layout.tsx
import { Be_Vietnam_Pro } from 'next/font/google';

const beVietnamPro = Be_Vietnam_Pro({
  variable: '--font-be-vietnam-pro',
  subsets: ['vietnamese', 'latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
});
```

**Tùy chỉnh cho project mới**: Đổi font nếu cần, nhưng đảm bảo:
- Hỗ trợ tiếng Việt (subset `vietnamese`).
- Có đủ weight: 400 (regular), 500 (medium), 600 (semibold), 700 (bold).
- Font gợi ý: `Inter`, `Be Vietnam Pro`, `Roboto`, `Nunito Sans`.

### Quy tắc Typography

| Loại | Class Tailwind | Dùng cho |
|---|---|---|
| Page title (H1) | `text-3xl font-semibold tracking-tight` | Tiêu đề trang |
| Section title (H2) | `text-base font-bold` | Tiêu đề section trong card |
| Card title (H3) | `text-2xl font-bold tracking-tight` | Giá trị KPI metric |
| Body text | `text-sm font-medium` | Mô tả, nội dung |
| Label | `text-xs font-semibold uppercase tracking-wider` | Label form, table header |
| Caption | `text-xs text-muted-foreground` | Chú thích, timestamp |
| Landing title | `text-[30px] lg:text-[42px] font-black tracking-tight` | Tiêu đề landing page |
| Landing body | `text-[20px] font-medium leading-relaxed` | Mô tả landing page |

---

## Spacing

| Loại | Giá trị | Dùng cho |
|---|---|---|
| Page padding | `p-4 md:p-6 xl:p-8` | Main content area |
| Card padding | `p-6` | Card body |
| Section gap | `space-y-8` hoặc `gap-6` | Khoảng cách giữa sections |
| Grid gap | `gap-5` hoặc `gap-6` | Grid layout |
| Button gap | `gap-2` hoặc `gap-3` | Khoảng cách giữa buttons |
| Form field gap | `space-y-4` | Khoảng cách giữa form fields |

---

## Border Radius

Dùng CSS variable `--radius` (mặc định `0.625rem`).

```css
--radius-sm: calc(var(--radius) - 4px);  /* ~6px */
--radius-md: calc(var(--radius) - 2px);  /* ~8px */
--radius-lg: var(--radius);              /* 10px */
--radius-xl: calc(var(--radius) + 4px);  /* ~14px */
```

| Element | Class | Giá trị |
|---|---|---|
| Card | `rounded-xl` | ~14px |
| Button | `rounded-md` | ~8px |
| Badge | `rounded-full` | Pill shape |
| Input | `rounded-lg` hoặc `rounded-md` | ~10px hoặc ~8px |
| Table container | `rounded-xl` | ~14px |

---

## Component Styles

### Card Style

```tsx
<div className="bg-card text-card-foreground border border-border rounded-xl shadow-xs p-6">
  {/* Card content */}
</div>
```

**Đặc điểm**: Border nhẹ (`border-border`), shadow nhỏ (`shadow-xs`), nền `bg-card`.

### Button Style (Shadcn Button + CVA)

```tsx
// 6 variants có sẵn:
<Button variant="default">Primary</Button>     // bg-primary
<Button variant="destructive">Delete</Button>  // bg-destructive
<Button variant="outline">Outline</Button>     // border + bg-background
<Button variant="secondary">Secondary</Button> // bg-secondary
<Button variant="ghost">Ghost</Button>         // transparent, hover bg-accent
<Button variant="link">Link</Button>           // underline text

// 4 sizes:
<Button size="default">Default (h-9)</Button>
<Button size="sm">Small (h-8)</Button>
<Button size="lg">Large (h-10)</Button>
<Button size="icon">Icon only (size-9)</Button>
```

### Table Style (DataTableShell)

```tsx
<DataTableShell
  data={records}
  columns={columns}
  onRowClick={handleClick}
  isLoading={loading}
  emptyMessage="Không tìm thấy dữ liệu."
  toolbar={<FilterComponent />}
/>
```

**Đặc điểm**:
- Container: `bg-card border border-border rounded-xl shadow-xs`.
- Header: `bg-background/40 text-muted-foreground font-semibold text-xs uppercase`.
- Row hover: `hover:bg-muted/40`.
- Pagination tích hợp.
- Sort tích hợp.
- Loading skeleton.
- Empty state.

### Form Style

```tsx
// Label
<label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
  Tên trường
</label>

// Input
<input className="w-full px-3 py-2 text-sm bg-white border border-border rounded-lg
  outline-none transition placeholder:text-muted-foreground/80
  focus:border-primary focus:ring-1 focus:ring-ring
  dark:bg-secondary dark:border-border" />

// Select
<select className="px-3 py-2 text-xs font-medium bg-background border border-border
  rounded-lg outline-none focus:ring-1 focus:ring-ring transition" />
```

### Metric Card Style

```tsx
<MetricCard
  title="Tổng hồ sơ"
  value="12,480"
  icon={<FileText className="w-4.5 h-4.5 text-blue-600" />}
  trend={{ value: 4.2, direction: 'up', label: 'so với tháng trước' }}
/>
```

**Đặc điểm**: `bg-card`, `border`, `rounded-xl`, `shadow-xs`, hover `shadow-sm`, icon trong box `bg-muted/40`.

---

## Dashboard Layout Style

```
┌──────────────────────────────────────────────┐
│  Sidebar (w-70 / w-16 collapsed)             │
│  ┌──────────────────────────────────────────┐ │
│  │ Logo                                      │ │
│  │ Nav items                                 │ │
│  │ Footer (version)                          │ │
│  └──────────────────────────────────────────┘ │
│                                              │
│  Main Area (flex-1)                          │
│  ┌──────────────────────────────────────────┐ │
│  │ Header (h-16, sticky)                    │ │
│  │  [Toggle] [Tenant] [Search] [Notif] [Theme] [User] │
│  ├──────────────────────────────────────────┤ │
│  │ Content (overflow-y-auto, p-4 md:p-6)    │ │
│  │  [PageHeader + Breadcrumbs]              │ │
│  │  [Content...]                            │ │
│  └──────────────────────────────────────────┘ │
└──────────────────────────────────────────────┘
```

**Key classes:**
- Wrapper: `flex min-h-svh`.
- Sidebar: `border-r border-sidebar-border bg-sidebar`, collapsible `w-70` ↔ `w-16`.
- Main: `flex-1 flex flex-col min-w-0 h-svh overflow-hidden`.
- Header: `sticky top-0 z-30 h-16 border-b bg-background/85 backdrop-blur`.
- Content: `flex-1 overflow-y-auto p-4 md:p-6 xl:p-8 bg-muted/30`.

---

## Landing Page Style

**Đặc điểm thiết kế:**
- Full-width sections, max content `max-w-7xl`.
- Alternating background: `bg-[#fafafa]` / `bg-card` (có `dark:` variant).
- Section padding: `py-20 sm:py-28`.
- Typography lớn: `text-[30px] lg:text-[42px] font-black`.
- Gradient orbs trang trí (subtle, `blur-3xl`).
- SectionBadge pill: `rounded-full bg-[accent]/50 ring-1`.
- Feature grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`.
- CTA button: `rounded-xl bg-[primary] px-7 py-3.5 font-bold shadow-md`.

---

## Cách dùng Shadcn UI

### Cài component mới

```bash
npx shadcn@latest add [component-name]
```

Ví dụ: `npx shadcn@latest add dialog`, `npx shadcn@latest add dropdown-menu`.

### Customize component

Component Shadcn được copy vào `src/components/ui/`. Có thể sửa trực tiếp:

```tsx
// src/components/ui/button.tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 ...",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        // Thêm variant mới tại đây
        accent: "bg-blue-600 text-white hover:bg-blue-500",
      },
    },
  }
);
```

### Quy tắc dùng Shadcn

- **Không sửa component gốc** nếu chỉ cần thay đổi nhỏ → dùng `className` prop.
- **Sửa component gốc** khi cần thay đổi cấu trúc hoặc thêm variant.
- **Luôn import từ `@/components/ui/`**, không import trực tiếp từ `radix-ui`.

---

## Animation

### Tailwind animations sử dụng

```tsx
// Fade in khi mount
className="animate-in fade-in duration-200"

// Slide in từ trên xuống
className="animate-in slide-in-from-top-1 duration-150"

// Slide in từ trên xuống (long)
className="animate-in slide-in-from-top-4 duration-200"
```

### Transition

```tsx
// Mặc định cho mọi interactive element
className="transition-all duration-200"

// Cho color changes
className="transition-colors duration-150"

// Cho hover effects
className="hover:shadow-sm transition-all duration-200"
```

> **Lưu ý**: Package `tw-animate-css` cung cấp các animation class. Import trong `globals.css`: `@import "tw-animate-css";`
