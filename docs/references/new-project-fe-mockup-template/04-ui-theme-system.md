# 04 — UI Theme System (Hệ thống giao diện & Theme)

## Tổng quan

Dự án mới được giữ nguyên **toàn bộ hệ thống giao diện** của source hiện tại:

- ✅ Bố cục (layout structure).
- ✅ Card style, border radius, shadow.
- ✅ Typography scale, font weight.
- ✅ Spacing pattern.
- ✅ Dark mode behavior.
- ✅ Semantic token usage.
- ✅ Animation & transition pattern.

Dự án mới **chỉ thay đổi**:

- 🔄 Màu **primary** (biến `--primary` và các token liên quan).
- 🔄 Logo.
- 🔄 Tên dự án.
- 🔄 Nội dung nghiệp vụ.
- 🔄 Font (nếu muốn, nhưng phải hỗ trợ tiếng Việt).

> **QUAN TRỌNG**: `PRIMARY_COLOR` là biến đầu vào bắt buộc của dự án mới. Các token còn lại ưu tiên giữ theo source hiện tại để giảm công chỉnh sửa UI.

---

## Nguồn thiết kế & Thứ tự ưu tiên

Khi khởi tạo dự án mới, chọn nguồn thiết kế theo thứ tự ưu tiên:

1. **Brand Guideline** (nếu khách hàng cung cấp) — ưu tiên cao nhất.
2. **shadcn/ui Theme Tokens** — dùng CSS variables từ shadcn/ui customizer.
3. **Website Reference** — tham khảo style từ website khác (layout, spacing, card, button...).
4. **Default Template Style** — style mặc định từ source hiện tại.

---

## Color System

### Color Tokens (CSS Variables)

Tất cả màu được định nghĩa bằng CSS Variables trong `src/app/globals.css`, sử dụng **oklch()** color space.

```css
/* src/app/globals.css */
:root {
  /* Nền & chữ */
  --background: oklch(1 0 0);           /* Trắng */
  --foreground: oklch(0.145 0 0);       /* Đen gần tuyệt đối */

  /* Màu chủ đạo — ĐỔI CHO DỰ ÁN MỚI */
  --primary: oklch(...);                /* [PRIMARY_COLOR] */
  --primary-foreground: oklch(...);     /* Chữ trên nền primary */

  /* Neutral tokens — GIỮ NGUYÊN */
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  --destructive: oklch(0.577 0.245 27.325);

  /* Sidebar tokens */
  --sidebar: oklch(100% 0.00011 271.152);
  --sidebar-foreground: oklch(0.145 0 0);
  --sidebar-primary: oklch(...);       /* Đổi cùng primary */
  --sidebar-accent: oklch(0.97 0 0);
  --sidebar-border: oklch(0.922 0 0);

  /* Chart palette */
  --chart-1: oklch(...);
  --chart-2: oklch(...);
  --chart-3: oklch(...);
  --chart-4: oklch(...);
  --chart-5: oklch(...);

  /* Border radius */
  --radius: 0.45rem;
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.205 0 0);
  --card-foreground: oklch(0.985 0 0);
  /* ... đảo ngược các token cho dark mode */
}
```

### Cách áp dụng cho dự án mới

1. **Đổi `--primary`** — chọn màu chủ đạo phù hợp nghiệp vụ.
2. **Đổi `--primary-foreground`** — đảm bảo contrast đủ đọc trên nền primary.
3. **Đổi `--sidebar-primary`** — sidebar active state.
4. **Đổi `--chart-1` → `--chart-5`** — palette biểu đồ theo brand.
5. **Giữ nguyên** `--background`, `--foreground`, `--muted`, `--border`, `--card` — neutral tokens.

---

## Quy tắc sử dụng Semantic Tokens

### ✅ BẮT BUỘC dùng semantic tokens

```tsx
// Nền
className="bg-background"          // Nền trang chính
className="bg-card"                // Nền card
className="bg-muted"               // Nền phụ (toolbar, badge)
className="bg-accent"              // Nền hover
className="bg-primary"             // Nền button chính
className="bg-sidebar"             // Nền sidebar
className="bg-muted/80"            // Nền content area

// Chữ
className="text-foreground"        // Chữ chính
className="text-card-foreground"   // Chữ trên card
className="text-muted-foreground"  // Chữ phụ, chú thích
className="text-primary-foreground" // Chữ trên button chính
className="text-primary"           // Chữ màu primary (link, active)

// Viền
className="border-border"          // Viền card, table, divider
className="border-sidebar-border"  // Viền sidebar
className="border-input"           // Viền input
```

### ❌ KHÔNG hard-code màu

```tsx
// SAI
className="bg-white"               // ❌ Không chuyển dark mode
className="text-black"             // ❌ Không chuyển dark mode
className="bg-gray-100"            // ❌ Hard-code
className="bg-zinc-900"            // ❌ Hard-code

// ĐÚNG
className="bg-background"          // ✅ Tự chuyển theo theme
className="text-foreground"        // ✅ Tự chuyển theo theme
className="bg-muted"               // ✅ Semantic token
```

> **Ngoại lệ**: Chỉ dùng màu tuyệt đối cho chart/SVG colors khi cần (ví dụ: `fill="#e5484d"`) và khi không có CSS variable phù hợp.

---

## Dark Mode

### Cách hoạt động

1. `next-themes` thêm class `.dark` vào `<html>`.
2. Tailwind dùng `@custom-variant dark (&:is(.dark *))` để kích hoạt `dark:` utilities.
3. CSS Variables được override trong block `.dark {}`.
4. Semantic tokens (`bg-background`, `text-foreground`...) tự động chuyển đổi.

### Quy tắc

- **Ưu tiên semantic token** — tự động chuyển sáng/tối, không cần `dark:` prefix.
- **Chỉ dùng `dark:` prefix** khi cần override cụ thể (ví dụ: `bg-muted/80 dark:bg-muted/5`).
- **Dark mode phải hoạt động giống source hiện tại** — test cả sidebar, header, card, table, chart.

---

## Typography

### Font chữ

```tsx
// src/app/layout.tsx
import { Be_Vietnam_Pro } from 'next/font/google';

const font = Be_Vietnam_Pro({
  variable: '--font-be-vietnam-pro',
  subsets: ['vietnamese', 'latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
});
```

> **Tùy chỉnh**: Đổi font nếu cần nhưng đảm bảo hỗ trợ tiếng Việt. Font gợi ý: `Inter`, `Be Vietnam Pro`, `Roboto`, `Nunito Sans`.

### Typography Scale

| Loại | Class Tailwind | Dùng cho |
|---|---|---|
| Page title (H1) | `text-3xl font-semibold tracking-tight` | Tiêu đề trang |
| Section title (H2) | `text-base font-bold` | Tiêu đề section trong card |
| Card metric (H3) | `text-2xl font-bold tracking-tight` | Giá trị KPI |
| Body text | `text-sm font-medium` | Mô tả, nội dung |
| Label | `text-xs font-semibold uppercase tracking-wider` | Label form, table header |
| Caption | `text-xs text-muted-foreground` | Chú thích, timestamp |

---

## Spacing, Border Radius, Shadow

### Spacing

| Loại | Giá trị | Dùng cho |
|---|---|---|
| Page padding | `p-4 md:p-6 xl:p-8` | Main content area |
| Card padding | `p-6` | Card body |
| Section gap | `space-y-8` hoặc `gap-6` | Khoảng cách giữa sections |
| Grid gap | `gap-5` hoặc `gap-6` | Grid layout |

### Border Radius

| Element | Class | Giá trị |
|---|---|---|
| Card | `rounded-xl` | ~14px |
| Button | `rounded-md` | ~8px |
| Badge | `rounded-full` | Pill shape |
| Input | `rounded-lg` | ~10px |
| Table container | `rounded-xl` | ~14px |

### Shadow

| Element | Class |
|---|---|
| Card default | `shadow-xs` |
| Card hover | `hover:shadow-sm` |

---

## Animation

```tsx
// Fade in khi mount
className="animate-in fade-in duration-200"

// Slide in
className="animate-in slide-in-from-top-1 duration-150"

// Transition cho interactive element
className="transition-all duration-200"
className="transition-colors duration-150"

// Sidebar animation
className="transition-all duration-300"
```

> Package `tw-animate-css` cung cấp animation classes. Import trong `globals.css`: `@import "tw-animate-css";`.

---

## globals.css Template

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-[FONT_VARIABLE]);
  --color-sidebar-ring: var(--sidebar-ring);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar: var(--sidebar);
  --color-chart-5: var(--chart-5);
  --color-chart-4: var(--chart-4);
  --color-chart-3: var(--chart-3);
  --color-chart-2: var(--chart-2);
  --color-chart-1: var(--chart-1);
  --color-ring: var(--ring);
  --color-input: var(--input);
  --color-border: var(--border);
  --color-destructive: var(--destructive);
  --color-accent-foreground: var(--accent-foreground);
  --color-accent: var(--accent);
  --color-muted-foreground: var(--muted-foreground);
  --color-muted: var(--muted);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-secondary: var(--secondary);
  --color-primary-foreground: var(--primary-foreground);
  --color-primary: var(--primary);
  --color-popover-foreground: var(--popover-foreground);
  --color-popover: var(--popover);
  --color-card-foreground: var(--card-foreground);
  --color-card: var(--card);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}

:root {
  /* [THAY ĐỔI CHO DỰ ÁN MỚI] */
  --primary: oklch([PRIMARY_COLOR]);
  --primary-foreground: oklch([PRIMARY_FOREGROUND]);

  /* [GIỮ NGUYÊN TỪ SOURCE HIỆN TẠI] */
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --radius: 0.45rem;
  /* ... sidebar, chart tokens */
}

.dark {
  /* [ĐẢO MÀU TƯƠNG ỨNG CHO DARK MODE] */
}

@layer base {
  * { @apply border-border outline-ring/50; }
  html { @apply scroll-smooth scroll-pt-16 overflow-x-hidden; }
  body { @apply bg-background text-foreground overflow-x-hidden; }
  .inner { @apply container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8; }
}
```
