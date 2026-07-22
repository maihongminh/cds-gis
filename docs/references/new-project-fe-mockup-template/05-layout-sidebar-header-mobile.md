# 05 — Layout, Sidebar, Header & Mobile Menu

> **Đây là file quan trọng nhất.** Dự án mới PHẢI tái tạo layout giống source hiện tại nhất có thể. Không tự thiết kế sidebar/header theo style khác.

---

## Tổng quan Layout Dashboard

```
┌─────────────────────────────────────────────────────────┐
│  Sidebar (w-70 expanded / w-16 collapsed)               │
│  ┌─────────────────────────────────────────────────────┐│
│  │ Logo + App Name                                      ││
│  │ ─────────────────────────────────────────────────── ││
│  │ ScrollArea: Navigation Items (Accordion groups)      ││
│  │ ─────────────────────────────────────────────────── ││
│  │ [MOBILE] Search + Tenant Switcher                    ││
│  │ [MOBILE] User Menu + Theme Toggle + Logout           ││
│  │ ─────────────────────────────────────────────────── ││
│  │ Footer: Partner Logo + Version + [MOBILE] ThemeToggle││
│  └─────────────────────────────────────────────────────┘│
│                                                         │
│  Main Area (flex-1)                                     │
│  ┌─────────────────────────────────────────────────────┐│
│  │ Header (h-16, sticky top-0)                          ││
│  │  [Mobile: Logo+Name] [Desktop: SidebarToggle]        ││
│  │  [Desktop: TenantSwitcher]                           ││
│  │  [Desktop XL: Search]                                ││
│  │  [Right: Notifications, ThemeToggle, UserMenu]       ││
│  │  [Mobile: HamburgerBtn]                              ││
│  ├─────────────────────────────────────────────────────┤│
│  │ Content (flex-1, overflow-y-auto, bg-muted/80)       ││
│  │  p-4 md:p-6 xl:p-8                                  ││
│  │  [PageHeader + Breadcrumbs]                          ││
│  │  [Page Content...]                                   ││
│  └─────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

---

## Sidebar — Chi tiết kỹ thuật

### Kích thước & Animation

| Trạng thái | Chiều rộng | Animation |
|---|---|---|
| Expanded (mở rộng) | `w-70` (280px) | `transition-all duration-300` |
| Collapsed (thu gọn) | `w-16` (64px) | `transition-all duration-300` |
| Mobile closed | `-translate-x-full` | Trượt ra ngoài màn hình |
| Mobile open | `translate-x-0 w-70` | Trượt vào từ trái |

### CSS Classes chính

```tsx
<aside className={cn(
  'fixed top-0 bottom-0 left-0 z-50 flex flex-col h-svh bg-sidebar transition-all duration-300',
  'md:sticky md:z-10 shadow-[inset_-1px_0_0_0] shadow-border/80',
  isCollapsed ? 'md:w-16' : 'md:w-70',
  isMobileOpen ? 'translate-x-0 w-70' : '-translate-x-full md:translate-x-0'
)}>
```

### Cấu trúc Sidebar

#### 1. LOGO & APP NAME (h-16)

```
┌──────────────────────────────────┐
│  [Logo img] [App Name Line1]     │
│             [App Name Line2]     │
└──────────────────────────────────┘
```

- Logo: `w-11 h-11 object-contain`, luôn hiển thị.
- App Name: ẩn khi collapsed (`md:opacity-0 md:w-0`), hiện khi expanded.
- Click vào logo/name → navigate về `/dashboard`.
- Có `hover:opacity-85 transition-opacity`.

#### 2. NAVIGATION (ScrollArea, flex-1)

Menu dùng **cấu trúc accordion cấp 2** — không dùng flyout:

##### Menu item dạng `single` (không có submenu):

```
[Icon] [Title]                        ← Expanded
[Icon]                                ← Collapsed (có Tooltip)
```

##### Menu item dạng `group` (có submenu accordion):

```
[GroupIcon] [Group Title] [+/-]       ← Expanded: click toggle
  ├── [ChildIcon] [Child Title]       ← Children hiện bên trong
  ├── [ChildIcon] [Child Title]
  └── [ChildIcon] [Child Title]

[GroupIcon]                           ← Collapsed: click toggle
  ┌─────────────┐
  │ [ChildIcon]  │                    ← Submenu dạng icon-only trong box
  │ [ChildIcon]  │                      có Tooltip cho mỗi child
  │ [ChildIcon]  │
  └─────────────┘
```

**Accordion behavior:**

- Dùng **custom CollapsiblePanel** (`grid-template-rows` transition), không dùng Shadcn Accordion component.
- Mỗi group có `Plus`/`Minus` icon ở bên phải (expanded) hoặc badge indicator (collapsed).
- Group tự động mở khi chứa active child route.
- User có thể manual open/close (ghi đè auto-open).
- Khi collapsed, group hiện submenu icon-only trong box `bg-muted/40` có border.

**Active state:**

- Single item active: `bg-sidebar-accent border border-sidebar-border font-medium text-primary`.
- Group parent khi có child active: `text-primary border-sidebar-border/60 bg-sidebar-accent/40`.
- Child item active: `bg-sidebar-accent border-sidebar-border font-medium text-primary`.
- Collapsed active: `bg-sidebar-accent border border-sidebar-border text-primary`.
- Collapsed child active: `bg-primary text-primary-foreground`.

**Menu item height:**

- Single item: `h-10`.
- Group trigger: `h-10`.
- Child item: `h-9`.
- Collapsed icon: `size-10` (single/group), `size-8` (child).

**Tooltip khi collapsed:**

- Dùng `<TooltipProvider delayDuration={300}>` bọc toàn sidebar.
- Mỗi item khi collapsed có `<Tooltip>` + `<TooltipContent side="right" sideOffset={8}>`.

#### 3. MOBILE-ONLY FOOTER (md:hidden)

Phần cuối sidebar trên mobile chứa:

- **Search input** + **Tenant Switcher** (Select dropdown).
- **User Menu** (DropdownMenu trigger = avatar + name + email).
- **Theme Toggle** (icon button ở góc phải footer).
- **Partner Logo + Version**.

Trên desktop, những phần này nằm ở **Header** thay vì sidebar.

#### 4. DESKTOP FOOTER

- Partner logo + version text.
- Logo thu nhỏ khi collapsed.

---

## Header — Chi tiết kỹ thuật

### CSS Classes

```tsx
<header className="sticky top-0 z-30 h-16 border-b border-border bg-background/80 backdrop-blur-md px-2.5 md:px-6 xl:px-8 flex items-center justify-between">
```

### Desktop Layout

```
[SidebarToggle] [TenantSwitcher]     ...     [SearchBar(XL)] [Notifications] [ThemeToggle] [UserMenu]
```

| Cụm | Vị trí | Responsive |
|---|---|---|
| Sidebar Toggle (PanelLeftOpen/Close) | Trái | `hidden md:flex` |
| Tenant Switcher | Trái, sau toggle | `hidden md:flex` |
| Search Bar | Giữa | `hidden xl:flex` |
| Notifications | Phải | Luôn hiện |
| Theme Toggle | Phải | `hidden md:inline-flex` |
| User Menu | Phải | `hidden md:block` |

### Mobile Layout

```
[Logo+AppName]                                    [Notifications] [HamburgerBtn]
```

| Cụm | Vị trí | Responsive |
|---|---|---|
| Logo + App Name | Trái | `md:hidden` |
| Notifications | Phải | Luôn hiện |
| Hamburger Menu Button | Phải cuối | `md:hidden` |

### Sidebar Toggle Icons

- Desktop: `PanelLeftOpen` (khi collapsed) / `PanelLeftClose` (khi expanded).
- Dùng `<Button variant="outline" size="icon">`.

---

## Mobile Menu — Chi tiết kỹ thuật

### Khi mở mobile menu

1. **Backdrop overlay** xuất hiện: `fixed inset-0 z-40 md:hidden bg-black/40 dark:bg-black/60 backdrop-blur-xs`.
2. **Sidebar** trượt vào từ trái: `translate-x-0 w-70`.
3. **Nút đóng (X)** xuất hiện góc phải trên: `fixed top-3.5 right-2.5 z-50 md:hidden`.
4. Click overlay hoặc nút X → `setMobileOpen(false)`.
5. Click bất kỳ menu item → tự động `setMobileOpen(false)`.

### Cấu trúc Mobile Drawer

```
┌──────────────────────────────────┐  [X Close Button]
│ Logo + App Name                  │
│ ─────────────────────────────── │
│ Navigation Items (full menu)     │
│ ─────────────────────────────── │
│ Search + Tenant Switcher         │
│ ─────────────────────────────── │
│ User Menu (avatar + dropdown)    │
│ ─────────────────────────────── │
│ Partner Logo + Version           │
│                    [ThemeToggle]  │
└──────────────────────────────────┘
```

---

## State Management

### SidebarContext

```tsx
interface SidebarContextType {
  isCollapsed: boolean;          // Desktop: sidebar thu nhỏ/mở rộng
  toggleSidebar: () => void;      // Toggle collapse/expand
  isMobileOpen: boolean;         // Mobile: sidebar mở/đóng
  setMobileOpen: (open: boolean) => void;
}
```

### Provider Nesting (trong Dashboard layout)

```tsx
<TenantProvider>
  <SidebarProvider>
    <DashboardLayoutContent>{children}</DashboardLayoutContent>
  </SidebarProvider>
</TenantProvider>
```

---

## Menu Items Config

Menu items tách ra file riêng `sidebar-items.ts` với 2 loại:

```tsx
// Single item (không submenu)
type SidebarSingleItem = {
  type: 'single';
  title: string;
  href: string;
  icon: LucideIcon;
  module: AppModule;  // Dùng cho RBAC
};

// Group item (có submenu)
type SidebarGroupItem = {
  type: 'group';
  title: string;
  icon: LucideIcon;
  children: SidebarChildItem[];
};

type SidebarChildItem = {
  title: string;
  href: string;
  icon?: LucideIcon;
  module: AppModule;
};
```

---

## Khi sang dự án mới — Chỉ thay đổi

1. **`sidebar-items.ts`** — thay danh sách menu theo module nghiệp vụ mới.
2. **`app-config.ts`** — thay tên dự án, version.
3. **Logo** — thay file `public/logo.png`.
4. **`tenant-context.tsx`** — thay phân cấp (company/branch thay vì province/ward).
5. **`rbac.ts`** — thay roles và route permissions.

**KHÔNG viết lại layout mới theo ý khác.** Giữ nguyên cấu trúc:
- Sidebar position, width, animation.
- Header height, sticky, backdrop-blur.
- Content area padding, background.
- Mobile overlay + drawer pattern.
- Accordion menu pattern (không đổi sang flyout).
- Tooltip khi collapsed.
