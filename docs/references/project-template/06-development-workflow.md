# 06 — Development Workflow (Quy trình phát triển)

## Thứ tự khuyến nghị cho project mới

```
 1. Project Setup              ← Khởi tạo, cài dependencies
 2. Layout                     ← Root layout, dashboard layout, sidebar, header
 3. Design System              ← globals.css, color tokens, font, Shadcn config
 4. Mock Data Model            ← Types + mock data cho entity chính
 5. Dashboard                  ← Trang tổng quan: KPI, chart, alerts
 6. Main List Page             ← Trang danh sách entity chính (có filter, sort, pagination)
 7. Detail Page                ← Trang chi tiết (tabs, sections)
 8. Secondary Modules          ← Các module phụ (workflow, documents, families...)
 9. Reports                    ← Trang thống kê & báo cáo
10. Settings                   ← Trang cấu hình, quản lý user
11. Landing Page               ← Trang giới thiệu (làm sau cùng vì cần screenshots)
12. Final QA                   ← Review, test, refactor
```

---

## Chi tiết từng bước

### Bước 1: Project Setup

**Việc cần làm:**
- Khởi tạo Next.js project.
- Cài dependencies.
- Cấu hình TypeScript, PostCSS, Shadcn.
- Tạo cấu trúc thư mục chuẩn.

```bash
# Khởi tạo project
npx -y create-next-app@latest ./  --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Cài dependencies
npm install next-themes lucide-react class-variance-authority clsx tailwind-merge
npm install @tanstack/react-query axios
npm install -D tw-animate-css

# Khởi tạo Shadcn
npx shadcn@latest init

# Cài Shadcn components cơ bản
npx shadcn@latest add button skeleton
```

**Tạo cấu trúc thư mục:**

```bash
mkdir -p src/data src/types src/hooks src/components/common src/components/layout src/components/theme
```

**Tạo file nền:**
- `src/lib/utils.ts` → hàm `cn()`.
- `src/lib/apiClient.ts` → axios instance.
- `src/lib/ApiProvider.tsx` → React Query provider.

### Bước 2: Layout

**Việc cần làm:**
- Root layout (`src/app/layout.tsx`): font, ThemeProvider, ApiProvider.
- Dashboard layout (`src/app/dashboard/layout.tsx`): sidebar + header + content.
- Sidebar (`src/components/layout/app-sidebar.tsx`): menu items, active state.
- Header (`src/components/layout/dashboard-header.tsx`): toggle, search, user menu.
- Context providers: SidebarContext, TenantContext.
- Login page placeholder (`src/app/login/page.tsx`).

**Kiểm tra:**
- [ ] Sidebar mở/đóng trên desktop.
- [ ] Sidebar drawer trên mobile.
- [ ] Header responsive.
- [ ] Theme toggle hoạt động.

### Bước 3: Design System

**Việc cần làm:**
- Cấu hình color tokens trong `globals.css` (light + dark).
- Chọn font phù hợp.
- Cấu hình Tailwind v4 imports.
- Test dark mode hoạt động.

**File quan trọng:**

```css
/* src/app/globals.css */
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-[ten-font]), sans-serif;
  /* ... other token mappings */
}

:root {
  --primary: oklch(...);  /* Đổi màu chủ đạo */
  /* ... other light mode tokens */
}

.dark {
  --primary: oklch(...);  /* Dark mode variant */
  /* ... other dark mode tokens */
}
```

### Bước 4: Mock Data Model

**Việc cần làm:**
- Định nghĩa types cho entity chính (`src/types/`).
- Tạo mock data (`src/data/`).
- Tạo administrative units / tenant data.
- Tạo mock users cho login.

**Thứ tự:** Type → Mock entity chính → Mock dashboard (compute từ entity) → Mock users.

### Bước 5: Dashboard

**Việc cần làm:**
- Trang dashboard home (`/dashboard`).
- KPI grid (MetricCard × N).
- Chart section (distribution + monthly changes).
- Table xếp hạng.
- Alert summary.

**Pattern:**

```tsx
export default function DashboardPage() {
  const { selectedScope } = useTenant();
  const summary = getDashboardSummary(selectedScope);

  return (
    <div className="space-y-8">
      <PageHeader title="Tổng quan" />
      <KpiGrid summary={summary} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DistributionChart data={summary.byCategory} />
        <MonthlyChart data={summary.monthlyChanges} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopTable data={summary.byRegion} />
        <AlertList alerts={summary.alerts} />
      </div>
    </div>
  );
}
```

### Bước 6: Main List Page

**Việc cần làm:**
- List page với DataTableShell.
- Filter panel.
- Sort, pagination.
- Row actions (edit, delete, view).
- Loading state + empty state.

### Bước 7: Detail Page

**Việc cần làm:**
- Detail page với tabs.
- Info section.
- Related items section.
- History/audit log section.
- Breadcrumb custom.

### Bước 8: Secondary Modules

**Việc cần làm:**
- Lặp lại pattern list page + detail page cho từng module phụ.
- Tạo mock data tương ứng.
- Thêm sidebar items.

### Bước 9: Reports

**Việc cần làm:**
- Trang thống kê với nhiều section.
- Biểu đồ tổng hợp.
- Bảng dữ liệu.
- Nút xuất (Excel, PDF).

### Bước 10: Settings

**Việc cần làm:**
- Trang cấu hình hệ thống.
- Quản lý người dùng.
- Phân quyền.
- Cấu hình chung.

### Bước 11: Landing Page

**Việc cần làm:**
- Hero section.
- Feature grid.
- Dashboard preview.
- Workflow steps.
- Security & roles.
- CTA section.
- Footer.

> **Lý do làm sau cùng**: Landing page thường cần screenshots từ dashboard để làm preview mockup.

### Bước 12: Final QA

**Việc cần làm:**
- Chạy `npm run build` kiểm tra lỗi.
- Kiểm tra responsive.
- Kiểm tra dark mode.
- Kiểm tra accessibility.
- Refactor code dài.
- Dùng checklist `08-quality-checklist.md`.

---

## Git Workflow

### Branch naming

```
main                  ← Production
develop               ← Development
feature/[name]        ← Feature branch
fix/[name]            ← Bug fix
```

### Commit convention (Conventional Commits)

```
feat: thêm trang báo cáo thống kê
fix: sửa lỗi sort table không đúng ngày
style: chuẩn hóa spacing card dashboard
refactor: tách filter component ra file riêng
chore: cập nhật dependencies
docs: thêm tài liệu template
```

### Commit frequency

- Commit sau mỗi bước hoàn chỉnh (1 module, 1 feature).
- Không commit code lỗi build.
- Message rõ ràng, tiếng Việt hoặc tiếng Anh nhất quán.

---

## Code Comment Convention

> **Rule: All code comments must be written in English.**

This applies to all comment types in TypeScript/TSX/JS files:

| Type | Example |
|------|---------|
| Line comment | `// Reset page when search changes` |
| Block comment | `/* Serialize filters to JSON */` |
| JSDoc comment | `/** Resource name (Doctype) */` |
| JSX comment | `{/* Left group: Toggles & Admin scope */}` |
| Inline comment | `params.limit = 20; // default` |

**Why English?**
- Consistent with industry standards and open-source conventions.
- Readable for all contributors regardless of native language.
- Prevents encoding issues with Vietnamese characters in some editors/tools.
- Keeps the codebase professional and maintainable.

**What stays in Vietnamese?**
- UI strings (labels, placeholders, error messages, button text) — these are **application content**, not comments.
- `.md` documentation files intended for Vietnamese-speaking team members.



## Quy trình làm việc với AI IDE

### Vòng lặp phát triển chuẩn (Flow)


```
Prompt task → AI code → chạy app → review prompt → refactor prompt → build → commit
```

### Các bước thực hiện

1. **Prompt task**: Viết prompt rõ ràng, cung cấp đúng và đủ context (đọc các file liên quan trước).
2. **AI code**: AI thực hiện viết hoặc chỉnh sửa code theo yêu cầu.
3. **Chạy app**: Khởi chạy môi trường local và kiểm tra trực quan trên trình duyệt.
4. **Review prompt**: So sánh kết quả chạy thực tế với yêu cầu đề ra trong prompt.
5. **Refactor prompt**: Điều chỉnh, sửa lỗi hoặc tối ưu hóa code thông qua các prompt bổ sung nếu cần.
6. **Build**: Chạy lệnh build (`npm run build`) để kiểm soát lỗi kiểu dữ liệu (TypeScript) hoặc cấu hình.
7. **Commit**: Sau khi build PASS và chạy đúng, tiến hành commit code theo quy ước.

### Tips bổ sung khi làm việc với AI

- **Làm từng bước nhỏ**: Mỗi prompt = 1 task cụ thể. Không yêu cầu AI làm quá nhiều việc cùng lúc.
- **Dùng context thông minh**: Chỉ cho AI đọc các file liên quan trực tiếp đến task để tránh bị loãng hoặc tràn context.
- **Giữ nhất quán**: Khi AI viết code không đúng pattern hoặc style của dự án, hãy yêu cầu AI refactor lại ngay theo đúng template.
