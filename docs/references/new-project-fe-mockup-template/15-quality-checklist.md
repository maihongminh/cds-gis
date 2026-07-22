# 15 — Quality Checklist (Checklist kiểm tra chất lượng)

> **Hướng dẫn**: Chạy qua checklist này trước mỗi commit hoặc trước khi hoàn thành 1 phase. Đánh dấu `[x]` cho mục đã kiểm tra.

---

## 1. Build & TypeScript

- [ ] `npm run build` — PASS không lỗi.
- [ ] Không có lỗi TypeScript.
- [ ] Không dùng `any` type (trừ bất khả kháng).
- [ ] Không có `// @ts-ignore` hoặc `// @ts-nocheck`.
- [ ] Không có unused imports.
- [ ] Không có unused variables.
- [ ] Tất cả comment trong code viết bằng **tiếng Anh**.

---

## 2. Import & Dependencies

- [ ] Import dùng path alias `@/` (không `../../`).
- [ ] Không có broken imports.
- [ ] Không có circular imports.
- [ ] `'use client'` directive đặt đúng chỗ.

---

## 3. Shadcn UI Governance

- [ ] Tất cả Button nghiệp vụ dùng `@/components/ui/button`.
- [ ] Tất cả Card dùng `@/components/ui/card`.
- [ ] Tất cả form/filter dùng `Input`, `Label`, `Select` từ shadcn.
- [ ] Tất cả bảng dùng `Table` primitives từ shadcn.
- [ ] Badge trạng thái dùng `Badge` từ shadcn.
- [ ] Dropdown action dùng `DropdownMenu`.
- [ ] Modal/form popup dùng `Dialog`.
- [ ] Confirm destructive dùng `AlertDialog`.
- [ ] Tabs dùng `Tabs` từ shadcn.
- [ ] Không tự viết lại UI primitive bằng HTML thô.
- [ ] Không import trực tiếp từ Radix trong module nghiệp vụ.
- [ ] Không dùng UI library khác ngoài shadcn/ui.

---

## 4. Không hard-code color

- [ ] Không có `bg-white`, `text-black`, `bg-gray-100` (ngoại trừ chart SVG).
- [ ] Dùng semantic tokens: `bg-background`, `text-foreground`, `bg-card`, `border-border`.
- [ ] Primary color dùng `bg-primary`, `text-primary`, `text-primary-foreground`.
- [ ] Muted color dùng `bg-muted`, `text-muted-foreground`.

---

## 5. Dark Mode

- [ ] Toggle Light/Dark/System hoạt động.
- [ ] Không có text đen trên nền tối (hoặc ngược lại).
- [ ] Card, table, sidebar background đúng trong dark mode.
- [ ] Chart colors rõ ràng trong dark mode.
- [ ] Landing page dark mode hoạt động.
- [ ] Login page dark mode hoạt động.

---

## 6. Responsive

- [ ] Mobile (375px): layout không tràn, sidebar ẩn, hamburger hoạt động.
- [ ] Tablet (768px): grid chuyển cột đúng.
- [ ] Desktop (1440px): layout đầy đủ, sidebar mở, spacing thoáng.
- [ ] Table có `overflow-x-auto` trên mobile.
- [ ] Touch target đủ lớn (min 44px).

---

## 7. Sidebar & Menu

- [ ] Sidebar collapsed: icon-only, tooltip hiện đúng.
- [ ] Sidebar expanded: icon + text, accordion hoạt động.
- [ ] Accordion cấp 2: Plus/Minus toggle, submenu collapse/expand.
- [ ] Active state highlight đúng (route matching).
- [ ] Collapsed mode: group icon có Plus/Minus indicator.
- [ ] Collapsed mode: submenu icon-only có tooltip.

---

## 8. Mobile Drawer

- [ ] Hamburger button mở drawer.
- [ ] Overlay backdrop xuất hiện.
- [ ] Nút X đóng drawer.
- [ ] Click overlay đóng drawer.
- [ ] Click menu item đóng drawer.
- [ ] Mobile footer: search, tenant switcher, user menu, theme toggle.

---

## 9. Header

- [ ] Desktop: SidebarToggle, TenantSwitcher, Search(XL), Notifications, ThemeToggle, UserMenu.
- [ ] Mobile: Logo+AppName, Notifications, Hamburger.
- [ ] Sticky top-0, backdrop-blur hoạt động.

---

## 10. Mock Data

- [ ] Không hard-code data trong component (import từ `src/data/`).
- [ ] Type import từ `src/types/`.
- [ ] Mock data có ID ổn định (seeded random).
- [ ] Dashboard KPI nhất quán với list page.
- [ ] Filter hoạt động đúng.
- [ ] Sort hoạt động đúng.
- [ ] Pagination hoạt động đúng.

---

## 11. RBAC

- [ ] Sidebar menu items ẩn/hiện theo role.
- [ ] Route guard: truy cập route không có quyền → access-denied.
- [ ] Login page: role selector hoạt động.
- [ ] Cookie `app_role` set đúng.

---

## 12. Accessibility

- [ ] Button/link có `aria-label` hoặc text content.
- [ ] Hover state visible.
- [ ] Focus ring visible.
- [ ] Form input có label.
- [ ] Icon-only button có title.
- [ ] `<html>` có `lang` attribute.

---

## 13. Frappe-ready

- [ ] `src/hooks/` có đủ: useGetList, useGetDoc, useCreateDoc, useUpdateDoc, useDeleteDoc.
- [ ] `src/lib/apiClient.ts` có CSRF interceptor.
- [ ] `src/lib/ApiProvider.tsx` có React Query provider.
- [ ] Component không biết source data (mock hay API).

---

## 14. Không copy nghiệp vụ cũ

- [ ] Không có route/module từ dự án cũ.
- [ ] Không có mock data từ dự án cũ.
- [ ] Không có tên/logo dự án cũ.
- [ ] Không có text nghiệp vụ cũ.
- [ ] Role names là của dự án mới.

---

## Quick Pre-Commit Check

```bash
# 1. Build check
npm run build

# 2. Lint check
npm run lint

# 3. Type check
npx tsc --noEmit

# 4. File changes
git status
git diff --stat
```
