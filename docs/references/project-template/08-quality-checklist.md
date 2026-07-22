# 08 — Quality Checklist (Danh sách kiểm tra chất lượng)

## Cách sử dụng

Chạy qua checklist này **trước mỗi commit** hoặc **trước khi hoàn thành 1 milestone**. Đánh dấu `[x]` cho mục đã kiểm tra.

---

## 1. Build & TypeScript

- [ ] `npm run build` — PASS không lỗi.
- [ ] Không có lỗi TypeScript (red squiggly lines trong IDE).
- [ ] Không dùng `any` type (trừ trường hợp bất khả kháng, có comment giải thích).
- [ ] Không có `// @ts-ignore` hoặc `// @ts-nocheck`.
- [ ] Không có unused imports (import nhưng không dùng).
- [ ] Không có unused variables (biến khai báo nhưng không dùng).
- [ ] Tất cả comment trong code (`//`, `/* */`, `/** */`, `{/* */}`) phải viết bằng **tiếng Anh** — không dùng tiếng Việt trong comment.

---

## 2. Import & Dependencies

- [ ] Tất cả import sử dụng path alias `@/` (không dùng relative path `../../`).
- [ ] Không có broken imports (import file không tồn tại).
- [ ] Không có circular imports (A imports B, B imports A).
- [ ] Package.json không có dependency thừa (cài nhưng không dùng).
- [ ] `'use client'` directive đặt đúng chỗ (component có state/hooks/event).

---

## 3. Hydration & SSR

- [ ] Không có hydration warning trong browser console.
- [ ] Component dùng `useEffect` + `useState` cho mounted check khi cần (theme icon, random data...).
- [ ] `<html>` tag có `suppressHydrationWarning` (cho next-themes).
- [ ] Leaflet/Map component dùng `dynamic import` với `{ ssr: false }`.
- [ ] Không dùng `window`, `document`, `localStorage` trực tiếp — wrap trong `typeof window !== 'undefined'` check.

---

## 4. Responsive

- [ ] Mobile (375px): Layout không bị tràn, sidebar ẩn, hamburger menu hoạt động.
- [ ] Tablet (768px): Grid chuyển từ 1 cột sang 2 cột.
- [ ] Desktop (1440px): Layout đầy đủ, sidebar mở, spacing thoáng.
- [ ] Table có `overflow-x-auto` để scroll ngang trên mobile.
- [ ] Text không bị cắt (dùng `truncate` khi cần).
- [ ] Button/link có kích thước đủ lớn trên touch device (min 44px tap target).

---

## 5. Dark Mode

- [ ] Toggle Light/Dark/System hoạt động.
- [ ] Không có text đen trên nền tối (hoặc ngược lại).
- [ ] Card, table, sidebar background đúng trong dark mode.
- [ ] Chart colors vẫn rõ ràng trong dark mode.
- [ ] Landing page dark mode hoạt động.
- [ ] Login page dark mode hoạt động.
- [ ] Không có hard-coded color (`bg-white`, `text-black`, `bg-gray-100`...).

---

## 6. Theme & Design Source

- [ ] Theme token trong `globals.css` khớp với nguồn được chọn.
- [ ] Nếu dùng shadcn/ui token, đã copy đủ `:root` và `.dark` nếu có.
- [ ] Nếu tham khảo website khác, chỉ học theo style (layout, spacing, typography, border radius, card, button, motion...), không copy nội dung/hình ảnh/thương hiệu.
- [ ] Component vẫn dùng semantic token, không hard-code màu.
- [ ] Primary color đủ contrast với `primary-foreground` (đảm bảo độ tương phản đọc được).
- [ ] Border, card, muted, accent hiển thị rõ và nhất quán ở cả 2 chế độ light/dark mode.

---

## 7. Data & State

- [ ] Không hard-code data trong component (import từ `src/data/`).
- [ ] Type import từ `src/types/` (không define inline).
- [ ] Mock data có ID ổn định (không random mỗi lần load).
- [ ] Filter hoạt động đúng (lọc đúng field, reset đúng).
- [ ] Sort hoạt động đúng (asc, desc, reset).
- [ ] Pagination hoạt động đúng (first, prev, next, last).
- [ ] Dashboard KPI số liệu nhất quán với list page.

---

## 8. Component Quality

- [ ] Component không quá dài (< 300 dòng, tách nếu dài hơn).
- [ ] `page.tsx` chỉ compose layout (không chứa logic phức tạp).
- [ ] Props interface được export khi cần.
- [ ] Component có loading state (skeleton hoặc spinner).
- [ ] Component có empty state (message khi không có data).
- [ ] Error state được handle (try/catch, error message).

---

## 9. Shadcn/UI Governance

- [ ] Tất cả Button nghiệp vụ dùng `@/components/ui/button`.
- [ ] Tất cả Card dùng `@/components/ui/card`.
- [ ] Tất cả form/filter dùng `Input`, `Label`, `Select`, `Textarea` từ shadcn/ui.
- [ ] Tất cả bảng dùng `Table` primitives từ shadcn/ui.
- [ ] Tất cả badge trạng thái dùng `Badge` từ shadcn/ui.
- [ ] Dropdown action dùng `DropdownMenu`.
- [ ] Modal/form popup dùng `Dialog`.
- [ ] Confirm delete/destructive action dùng `AlertDialog`.
- [ ] Tabs dùng `Tabs` từ shadcn/ui.
- [ ] Mobile drawer dùng `Sheet` nếu phù hợp.
- [ ] Không tự viết lại UI primitive bằng HTML thô.
- [ ] Không import trực tiếp từ Radix trong module nghiệp vụ.
- [ ] Không dùng UI library khác ngoài shadcn/ui.

---

## 10. Routing & Navigation

- [ ] Route đúng convention (kebab-case, danh từ số nhiều).
- [ ] Sidebar active state highlight đúng.
- [ ] Breadcrumb hiển thị đúng đường dẫn.
- [ ] Middleware auth guard hoạt động (redirect khi chưa login).
- [ ] Back button (browser) hoạt động đúng.
- [ ] Deep link hoạt động (copy URL → paste vào tab mới).

---

## 11. Accessibility (Truy cập dễ dàng)

- [ ] Button/link có `aria-label` hoặc text content rõ ràng.
- [ ] Button/link có trạng thái hover (visual feedback).
- [ ] Button/link có trạng thái focus (focus ring visible).
- [ ] Form input có `<label>` associated.
- [ ] Color contrast đủ (text đọc được trên background).
- [ ] Icon-only button có `title` attribute.
- [ ] `<img>` có `alt` attribute.
- [ ] `<html>` có `lang` attribute.

---

## 12. Performance

- [ ] Không import toàn bộ icon library (`import { X } from 'lucide-react'`, không `import * as icons`).
- [ ] Ảnh tối ưu size (không load ảnh 5MB cho thumbnail).
- [ ] Font load từ `next/font` (không CDN link).
- [ ] Component heavy dùng `dynamic import` khi cần.
- [ ] Không có `console.log` trong production code.

---

## 13. UX Polish

- [ ] Loading state mượt (skeleton, không blank screen).
- [ ] Page transition mượt (`animate-in fade-in duration-200`).
- [ ] Sidebar toggle animation mượt.
- [ ] Toast notification cho user actions (thêm, sửa, xóa).
- [ ] Confirm dialog cho destructive actions (xóa).
- [ ] Scroll position reset khi chuyển trang.

---

## 14. Git & Commit

- [ ] Commit message theo Conventional Commits (`feat:`, `fix:`, `style:`, `refactor:`...).
- [ ] Không commit file nhạy cảm (`.env.local`, `node_modules/`).
- [ ] `.gitignore` đầy đủ.
- [ ] Không commit file build (`.next/`, `dist/`).
- [ ] Branch name rõ ràng (`feature/dashboard`, `fix/table-sort`).

---

## Quick Pre-Commit Check

Chạy nhanh trước khi commit:

```bash
# 1. Build check
npm run build

# 2. Lint check
npm run lint

# 3. Type check (nếu tách riêng)
npx tsc --noEmit

# 4. Check file changes
git status
git diff --stat
```
