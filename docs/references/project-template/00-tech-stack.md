# 00 — Tech Stack (Bộ công nghệ)

## Tổng quan

Project sử dụng bộ công nghệ frontend hiện đại, ưu tiên **Developer Experience (trải nghiệm phát triển)** và **tốc độ phát triển với AI**. Backend được thiết kế theo pattern **mock data trước, tích hợp API sau**.

## Bảng công nghệ

> **Lưu ý về phiên bản (Version Guideline)**: Để tránh xung đột và đảm bảo tính lâu dài, các phiên bản công nghệ dưới đây nên được thiết lập theo **latest stable (phiên bản ổn định mới nhất)** hoặc **theo package.json của project**. Các phiên bản cụ thể ở dự án gốc chỉ mang tính chất tham chiếu (Next.js 15.x/16.x, React 19.x, TypeScript 5.x, Tailwind v4, v.v.).

| Công nghệ | Phiên bản | Vai trò | Ghi chú |
|---|---|---|---|
| **Next.js** | Latest stable (hoặc theo package.json) | Framework chính, routing, SSR/SSG, layout | Dùng App Router, không dùng Pages Router |
| **React** | Latest stable (hoặc theo package.json) | Thư viện UI | Dùng React Server Components (RSC) khi có thể |
| **TypeScript** | Latest stable (hoặc theo package.json) | Ngôn ngữ lập trình | Strict mode bật |
| **Tailwind CSS** | Latest stable (hoặc theo package.json) | CSS utility-first | Dùng `@tailwindcss/postcss`, không dùng Tailwind config file riêng |
| **Shadcn UI** | Latest stable (hoặc theo package.json) | Thư viện component nền | Style `new-york`, base color `neutral` |
| **Radix UI** | Latest stable (hoặc theo package.json) | Primitive component headless | Cơ sở cho Shadcn UI |
| **lucide-react** | Latest stable (hoặc theo package.json) | Icon library | Thay thế Heroicons/FontAwesome |
| **next-themes** | Latest stable (hoặc theo package.json) | Light/Dark/System theme | Class-based (`attribute="class"`) |
| **class-variance-authority (CVA)** | Latest stable (hoặc theo package.json) | Variant pattern cho component | Dùng trong Button, Badge... |
| **clsx + tailwind-merge** | Latest stable (hoặc theo package.json) | Merge class an toàn | Hàm `cn()` trong `src/lib/utils.ts` |
| **@tanstack/react-query** | Latest stable (hoặc theo package.json) | State management cho API | Cache, refetch, mutation |
| **axios** | Latest stable (hoặc theo package.json) | HTTP client | Dùng interceptor cho CSRF token |
| **Leaflet + React Leaflet** | Latest stable (hoặc theo package.json) | Bản đồ GIS tương tác | Chỉ dùng nếu project có bản đồ |

## Package phát triển (devDependencies)

| Package | Vai trò |
|---|---|
| `eslint` + `eslint-config-next` | Kiểm tra chất lượng code |
| `tw-animate-css` | Animation utility cho Tailwind |
| `@types/node`, `@types/react`, `@types/react-dom` | TypeScript type definitions |
| `@types/leaflet` | Type cho Leaflet (nếu dùng map) |

## Vai trò chi tiết từng công nghệ

### Next.js App Router

- **Routing**: Mỗi folder trong `src/app/` là một route. File `page.tsx` là page, `layout.tsx` là layout wrapper.
- **Layout nesting**: Root layout → Dashboard layout → Module page.
- **Middleware**: `src/middleware.ts` xử lý auth redirect.
- **Rewrites**: Proxy `/api/*` sang backend (Frappe hoặc backend khác).

### Tailwind CSS v4

- **Không dùng `tailwind.config.ts`**: Tailwind v4 dùng CSS-first config thông qua `globals.css`.
- **PostCSS**: Cấu hình tại `postcss.config.mjs` với plugin `@tailwindcss/postcss`.
- **CSS Variables**: Color tokens định nghĩa bằng `oklch()` color space trong `:root` và `.dark`.
- **Custom variant**: `@custom-variant dark (&:is(.dark *))` để hỗ trợ class-based dark mode.

### Shadcn UI

- **Style**: `new-york` (clean, minimal).
- **Config**: `components.json` tại root.
- **Import alias**: `@/components/ui/*`.
- **Cài component**: `npx shadcn@latest add [component-name]`.
- **Customization**: Component được copy vào project, có thể chỉnh sửa tự do.

### Mock Data → API

- **Giai đoạn 1 (Mock)**: Dữ liệu giả đặt trong `src/data/`, import trực tiếp trong component.
- **Giai đoạn 2 (API)**: Thay import mock bằng custom hooks (`src/hooks/`) gọi API qua axios.
- **React Query**: Quản lý cache, loading state, error state khi chuyển sang API.

## Quy ước sử dụng package

### ✅ Nên làm

- Dùng `lucide-react` cho tất cả icon. Không trộn nhiều icon library.
- Dùng `cn()` (từ `src/lib/utils.ts`) khi cần merge class có điều kiện.
- Dùng CVA (`class-variance-authority`) khi tạo component có nhiều variant.
- Dùng `next-themes` với `attribute="class"` cho dark mode.
- Dùng CSS variables (`--primary`, `--background`...) thay vì hard-code màu.

### ❌ Không nên làm

- Không dùng inline `style={{}}` trừ trường hợp bất khả kháng (SVG dynamic).
- Không import font từ CDN, dùng `next/font/google`.
- Không cài thêm UI library khác (Material UI, Ant Design...) trừ khi có lý do rõ ràng.
- Không dùng `useState` + `fetch` cho data fetching khi đã có React Query hooks.

## Backend tương lai

Template được thiết kế tương thích với nhiều loại backend:

| Backend | Ghi chú |
|---|---|
| **Frappe/ERPNext** | Hooks sẵn trong `src/hooks/` cho Frappe API pattern |
| **REST API** | Dùng axios + React Query, đổi endpoint |
| **Supabase** | Thay axios bằng Supabase client |
| **Firebase** | Thay axios bằng Firebase SDK |

Khi chuyển backend, chỉ cần:

1. Sửa `src/lib/apiClient.ts` (hoặc thay bằng client mới).
2. Sửa hooks trong `src/hooks/` để gọi đúng API format.
3. Giữ nguyên component, type, và data flow.

## Deployment

| Platform | Config |
|---|---|
| **Cloudflare Workers** | `wrangler.toml`, `open-next.config.ts` |
| **Vercel** | Mặc định Next.js, không cần config thêm |
| **Docker** | Dockerfile tùy chỉnh |

> **Ghi chú**: Project gốc dùng Cloudflare Workers với `@opennextjs/cloudflare`. Có thể bỏ package này nếu deploy nền tảng khác.
