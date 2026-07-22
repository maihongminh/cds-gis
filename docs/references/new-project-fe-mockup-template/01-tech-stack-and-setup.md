# 01 — Tech Stack & Setup (Bộ công nghệ và cài đặt)

## Tech stack chuẩn

> **Quy tắc phiên bản**: Nếu clone từ source cũ thì ưu tiên theo `package.json` của source hiện tại. Nếu tạo project mới hoàn toàn thì dùng **latest stable**.

| Công nghệ | Vai trò | Ghi chú |
|---|---|---|
| **Next.js** (latest stable) | Framework chính, App Router | Dùng App Router, không Pages Router |
| **React** (latest stable) | Thư viện UI | React Server Components khi cần |
| **TypeScript** (latest stable) | Ngôn ngữ | Strict mode bật |
| **Tailwind CSS** (latest stable, v4+) | CSS utility-first | Dùng `@tailwindcss/postcss`, CSS-first config |
| **Shadcn UI** | Thư viện component nền | Style `new-york`, base color `neutral` |
| **Radix UI** | Primitive headless | Cơ sở cho Shadcn UI, import qua shadcn |
| **lucide-react** | Icon library | Thay thế Heroicons/FontAwesome |
| **next-themes** | Light/Dark/System theme | Class-based (`attribute="class"`) |
| **class-variance-authority (CVA)** | Variant pattern | Dùng trong Button, Badge... |
| **clsx** | Conditional class | Hỗ trợ `cn()` utility |
| **tailwind-merge** | Merge class an toàn | Kết hợp với clsx trong `cn()` |
| **@tanstack/react-query** | State management API | Cache, refetch, mutation |
| **axios** | HTTP client | Interceptor cho CSRF token |
| **sonner** | Toast notification | Thông báo hành động |
| **date-fns** | Date utility | Format, parse ngày (nếu cần) |

### Dev dependencies

| Package | Vai trò |
|---|---|
| `@tailwindcss/postcss` | PostCSS plugin cho Tailwind v4 |
| `tw-animate-css` | Animation utility |
| `eslint` + `eslint-config-next` | Kiểm tra code |
| `@types/node`, `@types/react`, `@types/react-dom` | TypeScript type definitions |
| `shadcn` | CLI cài component |

---

## Lệnh setup mẫu

### Tạo project mới hoàn toàn

```bash
# 1. Tạo Next.js project
npx -y create-next-app@latest ./ --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# 2. Cài dependencies chính
npm install next-themes lucide-react class-variance-authority clsx tailwind-merge
npm install @tanstack/react-query axios sonner

# 3. Cài dev dependencies
npm install -D tw-animate-css

# 4. Khởi tạo Shadcn UI
npx shadcn@latest init
# Chọn: style = new-york, base color = neutral, CSS variables = yes

# 5. Cài Shadcn components nền tảng
npx shadcn@latest add button card input label textarea select table badge dropdown-menu dialog alert-dialog tabs sheet separator scroll-area avatar skeleton tooltip popover sonner accordion collapsible command
```

### Clone từ source cũ

```bash
# 1. Clone source gốc
git clone [REPO_URL] [PROJECT_NAME]
cd [PROJECT_NAME]

# 2. Cài dependencies
npm install

# 3. Xóa mock data và module nghiệp vụ cũ (giữ layout, theme, common)
# Xóa: src/data/mock-*.ts (tạo lại theo nghiệp vụ mới)
# Xóa: src/types/* (tạo lại theo entity mới)
# Xóa: src/app/dashboard/[module-cũ]/ (tạo module mới)
# Giữ: src/components/layout/*, src/components/common/*, src/components/theme/*
# Giữ: src/hooks/*, src/lib/*
```

### Tạo cấu trúc thư mục

```bash
mkdir -p src/data src/types src/hooks src/components/common src/components/layout src/components/theme
```

### Tạo file nền tảng

```bash
# File cần tạo ngay
# - src/lib/utils.ts         → hàm cn()
# - src/lib/apiClient.ts     → axios instance
# - src/lib/ApiProvider.tsx   → React Query provider
# - src/components/theme/theme-provider.tsx → next-themes wrapper
# - src/components/theme/theme-toggle.tsx   → toggle button
# - src/app/layout.tsx        → root layout
# - src/app/globals.css        → color tokens
```

---

## Cấu hình quan trọng

### `components.json` (Shadcn UI config)

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

### `postcss.config.mjs`

```javascript
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
export default config;
```

### `tsconfig.json` — Path alias

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

## Quy tắc sử dụng

### ✅ Nên làm

- Dùng `lucide-react` cho tất cả icon. Không trộn nhiều icon library.
- Dùng `cn()` (từ `src/lib/utils.ts`) khi cần merge class có điều kiện.
- Dùng CVA khi tạo component có nhiều variant.
- Dùng `next-themes` với `attribute="class"` cho dark mode.
- Dùng CSS variables (`--primary`, `--background`...) thay vì hard-code màu.
- Dùng `next/font/google` cho font — hỗ trợ tiếng Việt (`subsets: ['vietnamese', 'latin']`).

### ❌ Không nên làm

- Không dùng UI library khác (MUI, Ant Design, Chakra...) trừ khi có yêu cầu đặc biệt.
- Không trộn nhiều icon library (chỉ dùng lucide-react).
- Không tự viết component primitive nếu Shadcn UI đã có.
- Không dùng inline `style={{}}` trừ trường hợp bất khả kháng (SVG dynamic).
- Không import font từ CDN, dùng `next/font/google`.
- Không dùng `useState` + `fetch` cho data fetching khi đã có React Query hooks.
