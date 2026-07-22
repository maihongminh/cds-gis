# 11 — Sidebar & Mobile Menu Guide (Hướng dẫn Sidebar & Mobile Menu)

Tài liệu này hướng dẫn cách triển khai hệ thống **Sidebar (Thanh điều hướng bên cạnh)** có tính năng thu gọn/mở rộng trên Máy tính (PC), và chuyển đổi thành **Drawer Menu (Menu kéo ra)** trên Điện thoại (Mobile).

Hướng dẫn này chỉ tập trung vào **bố cục (layout)**, **luồng hoạt động (behavior)**, **hiệu ứng chuyển động (transitions)** và **cấu trúc React/Tailwind**, hoàn toàn không sử dụng màu sắc cụ thể (chỉ sử dụng các class cấu trúc và semantic border).

---

## 1. Cơ chế hoạt động (Behavior Overview)

### Trên màn hình Máy tính (PC / Desktop):
* **Sidebar mở rộng (`w-70`):** Hiển thị đầy đủ Logo, Tên dự án, Icon và Tên của các menu item, cùng nút thu nhỏ ở góc.
* **Sidebar thu gọn (`w-16`):** Chỉ hiển thị Icon của menu item và Logo dạng biểu tượng (thu gọn). Ẩn toàn bộ phần chữ.
* **Hoạt động:** Nhấn nút Toggle ở Sidebar hoặc Header để hoán đổi trạng thái thu gọn/mở rộng với hiệu ứng trượt mượt mà (`transition-all duration-300`).

### Trên màn hình Điện thoại (Mobile):
* **Trạng thái mặc định:** Sidebar ẩn hoàn toàn khỏi màn hình (`-translate-x-full`).
* **Kích hoạt:** Nhấn nút Hamburger ở Header để trượt Sidebar ra (`translate-x-0`) từ cạnh trái màn hình, đồng thời hiển thị một lớp nền phủ (overlay/backdrop) mờ phía sau.
* **Đóng menu:** Nhấn nút đóng (hoặc click vào lớp overlay).
* **Đặc thù Mobile:** Phần **User Menu (Menu người dùng)** và **Theme Toggle (Nút chuyển sáng/tối)** được tự động di chuyển vào **bên trong** phần cuối của Mobile Drawer Menu (chứ không hiển thị ngoài Header như ở PC).

---

## 2. Quản lý trạng thái (State Management)

Tạo một `SidebarContext` để chia sẻ trạng thái thu gọn/mở rộng của Sidebar và trạng thái mở của Mobile Menu cho toàn bộ ứng dụng.

```tsx
// src/components/layout/sidebar-context.tsx
'use client';

import React, { createContext, useContext, useState } from 'react';

interface SidebarContextType {
  isCollapsed: boolean;          // Trạng thái thu gọn trên PC
  toggleSidebar: () => void;      // Hàm toggle thu gọn/mở rộng trên PC
  isMobileOpen: boolean;         // Trạng thái mở menu trên Mobile
  setMobileOpen: (open: boolean) => void; // Hàm đóng/mở trên Mobile
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setMobileOpen] = useState(false);

  const toggleSidebar = () => setIsCollapsed((prev) => !prev);

  return (
    <SidebarContext.Provider
      value={{
        isCollapsed,
        toggleSidebar,
        isMobileOpen,
        setMobileOpen,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar phải được sử dụng trong SidebarProvider');
  }
  return context;
}
```

---

## 3. Cấu trúc Layout Tổng thể

Layout lắp ráp các thành phần Sidebar, Header, Mobile Overlay và vùng hiển thị nội dung chính.

```tsx
// src/app/dashboard/layout.tsx
'use client';

import { SidebarProvider, useSidebar } from '@/components/layout/sidebar-context';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed, isMobileOpen, setMobileOpen } = useSidebar();

  return (
    <div className="flex min-h-svh overflow-hidden">
      {/* 1. Lớp phủ mờ (Backdrop overlay) cho Mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden transition-opacity duration-300 opacity-50 pointer-events-auto bg-neutral-950"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* 2. Sidebar Component (Trượt trên Mobile, Thay đổi độ rộng trên PC) */}
      <Sidebar />

      {/* 3. Vùng nội dung chính */}
      <div className="flex-1 flex flex-col min-w-0 h-svh overflow-hidden">
        {/* Header ở trên cùng */}
        <Header />

        {/* Nội dung trang thay đổi bên dưới */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </SidebarProvider>
  );
}
```

---

## 4. Component Sidebar & Logic Trượt/Thu gọn

Thành phần này chứa menu điều hướng, logo và phần nội dung chân trang (ở Mobile sẽ chứa cả cụm User Menu và Theme Toggle).

```tsx
// src/components/layout/sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebar } from './sidebar-context';
import {
  LayoutDashboard,
  Settings,
  ChevronLeft,
  ChevronRight,
  User,
  Sun,
  Moon,
  LogOut
} from 'lucide-react';

// Danh sách các menu
const menuItems = [
  { label: 'Tổng quan', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Cấu hình', href: '/dashboard/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isCollapsed, toggleSidebar, isMobileOpen, setMobileOpen } = useSidebar();

  return (
    <aside
      className={`
        /* 1. Bố cục cơ bản & Tốc độ chuyển động */
        fixed top-0 bottom-0 left-0 z-50 flex flex-col h-full border-r transition-all duration-300

        /* 2. Responsive PC: thay đổi chiều rộng */
        md:sticky md:z-10 ${isCollapsed ? 'md:w-16' : 'md:w-70'}

        /* 3. Responsive Mobile: ẩn trượt ra ngoài màn hình */
        ${isMobileOpen ? 'translate-x-0 w-70' : '-translate-x-full md:translate-x-0'}
      `}
    >
      {/* --- PHẦN 1: LOGO & HEADER SIDEBAR --- */}
      <div className="flex items-center h-16 px-4 border-b justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          {/* Logo Icon luôn hiển thị */}
          <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center border rounded">
            L
          </div>
          {/* Tên App ẩn khi thu gọn trên PC */}
          <span className={`font-semibold tracking-tight transition-all duration-300 whitespace-nowrap ${
            isCollapsed ? 'md:opacity-0 md:w-0' : 'opacity-100 w-auto'
          }`}>
            My Project
          </span>
        </div>

        {/* Nút đóng Sidebar trên Mobile */}
        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden p-1.5 rounded border"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* --- PHẦN 2: DANH SÁCH MENU ITEM --- */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)} // Tự động đóng menu trên mobile khi click link
              className={`
                flex items-center h-10 px-3 rounded transition-colors duration-200 gap-3
                ${isActive ? 'font-medium border' : ''}
              `}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className={`transition-all duration-300 whitespace-nowrap ${
                isCollapsed ? 'md:opacity-0 md:w-0' : 'opacity-100 w-auto'
              }`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* --- PHẦN 3: MOBILE FOOTER (USER & THEME TOGGLE) --- */}
      {/* Cụm này chỉ hiển thị trên Mobile, ẩn trên PC */}
      <div className="md:hidden p-4 border-t space-y-4">
        {/* Thông tin user trên mobile */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Nguyễn Văn A</p>
            <p className="text-xs truncate">admin@project.com</p>
          </div>
        </div>

        {/* Nút chuyển chế độ sáng tối trên mobile */}
        <div className="flex items-center justify-between border rounded p-2">
          <span className="text-xs">Chế độ tối</span>
          <button className="p-1 rounded">
            {/* Logic switch theme */}
            <Moon className="w-4 h-4" />
          </button>
        </div>

        {/* Nút Đăng xuất trên mobile */}
        <button className="flex items-center gap-2 w-full px-3 py-2 text-sm border rounded">
          <LogOut className="w-4 h-4" />
          <span>Đăng xuất</span>
        </button>
      </div>

      {/* --- PHẦN 4: PC SIDEBAR TOGGLE BUTTON --- */}
      {/* Chỉ hiển thị trên PC ở góc dưới sidebar */}
      <div className="hidden md:flex p-3 border-t justify-center">
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded border flex items-center justify-center w-full"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>
    </aside>
  );
}
```

---

## 5. Component Header & Nút Hamburger Mobile

Header chứa nút Hamburger trên Mobile, và chứa cụm User Menu + Theme Toggle trên PC (được ẩn đi khi ở Mobile).

```tsx
// src/components/layout/header.tsx
'use client';

import { useSidebar } from './sidebar-context';
import { Menu, User, Sun, Moon } from 'lucide-react';

export function Header() {
  const { toggleSidebar, setMobileOpen } = useSidebar();

  return (
    <header className="h-16 border-b px-4 flex items-center justify-between">
      {/* Cụm trái: Các nút điều khiển mở menu */}
      <div className="flex items-center gap-3">
        {/* 1. Hamburger button cho Mobile (click sẽ trượt mở menu) */}
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded border md:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* 2. Nút toggle nhanh sidebar cho PC */}
        <button
          onClick={toggleSidebar}
          className="hidden md:block p-2 rounded border"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Cụm right: User Info & Theme Switcher (Chỉ hiển thị trên PC, ẩn ở Mobile) */}
      <div className="hidden md:flex items-center gap-4">
        {/* Theme Toggle trên PC */}
        <button className="p-2 rounded border">
          <Sun className="w-4 h-4" />
        </button>

        {/* User avatar & dropdown trên PC */}
        <div className="flex items-center gap-2 border rounded p-1.5">
          <div className="w-6 h-6 rounded-full border flex items-center justify-center">
            <User className="size-4" />
          </div>
          <span className="text-xs">admin@project.com</span>
        </div>
      </div>
    </header>
  );
}
```

---

## 6. Khai báo Icon & Vị trí Bố trí các Button (Icons & Button Placements)

Để triển khai giao diện trực quan và dễ sử dụng, dưới đây là chi tiết các loại icon và vị trí đặt các nút tương tác:

### 6.1. Chi tiết các Icon sử dụng (từ thư viện `lucide-react`)

* **Nút mở Menu trên Mobile (Hamburger):**
  * Icon: `Menu` (dạng 3 gạch ngang song song).
* **Nút đóng Menu trên Mobile:**
  * Icon: `X` (dấu nhân) hoặc `ChevronLeft` (mũi tên chỉ sang trái).
* **Nút Co/Giãn Sidebar trên PC (Desktop):**
  * *Cách 1 (Nếu đặt ở Header):* Cặp icon `PanelLeftClose` (khi đang mở, click để đóng/thu nhỏ) và `PanelLeftOpen` (khi đang thu nhỏ, click để mở rộng).
  * *Cách 2 (Nếu đặt ở chân Sidebar):* Cặp icon `ChevronLeft` (thu nhỏ) và `ChevronRight` (mở rộng).

### 6.2. Vị trí bố trí và Layout lớp phủ của các Button

| Loại Button | Vị trí Bố trí | Bố cục Layout (Tailwind) | Trạng thái hiển thị |
|---|---|---|---|
| **Hamburger Button (Mobile)** | Phía ngoài cùng bên trái trên thanh **Header**. | `flex items-center justify-center p-2 border rounded md:hidden` (hoặc `lg:hidden`) | Chỉ hiển thị trên điện thoại. Ẩn trên máy tính. |
| **Nút đóng Mobile Menu** | Nằm bên phải trong phần Logo Header của **Sidebar** trượt. | `absolute top-4 right-4 md:hidden` | Chỉ hiển thị trên điện thoại khi thanh Sidebar trượt ra. |
| **Toggle Button PC (Cách 1: Ở Header)** | Nằm bên trái thanh **Header** (cạnh khu vực hiển thị tiêu đề hoặc switcher). | `hidden md:flex items-center justify-center p-2 border rounded` | Chỉ hiển thị trên máy tính. Ẩn trên điện thoại. |
| **Toggle Button PC (Cách 2: Chân Sidebar)** | Nằm ở vị trí cuối cùng dưới đáy (footer) của **Sidebar**. | `hidden md:flex p-3 border-t justify-center w-full` | Chỉ hiển thị trên máy tính. Ẩn trên điện thoại. |

---

