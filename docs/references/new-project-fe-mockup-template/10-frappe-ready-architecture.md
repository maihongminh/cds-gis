# 10 — Frappe-Ready Architecture (Kiến trúc chuẩn bị cho Frappe)

## Chiến lược 2 giai đoạn

### Giai đoạn 1: FE Mockup (Hiện tại)

- Dùng **mock data** import trực tiếp từ `src/data/`.
- Component consume data qua import.
- Dashboard compute từ mock entity data.
- Không cần backend, không cần API.
- Auth guard dùng mock cookie.

### Giai đoạn 2: Tích hợp Backend (Sau này)

- Thay mock data bằng **hooks gọi API**.
- Hooks dùng `@tanstack/react-query` + `axios`.
- API client có CSRF token interceptor.
- Backend: Frappe, REST API, Supabase, hoặc bất kỳ.
- Chỉ sửa hooks + apiClient, giữ nguyên component.

---

## Cấu trúc chuẩn bị sẵn

### `src/lib/apiClient.ts` — Axios Instance

```typescript
import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

let _apiClient: AxiosInstance | null = null;

function getCsrfToken(): string {
  if (typeof document === 'undefined') return '';
  const match = document.cookie.match(/csrf_token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : '';
}

export function createApiClient() {
  _apiClient = axios.create({
    timeout: 15_000,
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    withCredentials: true,  // Send session cookie
  });

  // CSRF token cho mutation (POST, PUT, DELETE)
  _apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const method = config.method?.toUpperCase();
    if (method && method !== 'GET' && method !== 'HEAD') {
      const csrf = getCsrfToken();
      if (csrf) config.headers['X-Frappe-CSRF-Token'] = csrf;
    }
    return config;
  });

  // Error interceptor
  _apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      const message = error.response?.data?.message ?? error.message ?? 'Unknown error';
      return Promise.reject(new Error(message));
    },
  );

  return _apiClient;
}

export function getApiClient(): AxiosInstance {
  if (!_apiClient) throw new Error('ApiClient not initialized. Wrap app with <ApiProvider>.');
  return _apiClient;
}
```

### `src/lib/ApiProvider.tsx` — React Query Provider

```typescript
'use client';

import React, { useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createApiClient } from './apiClient';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30,    // 30 seconds
      retry: 1,
      refetchOnWindowFocus: true,
    },
  },
});

export function ApiProvider({ children }: { children: React.ReactNode }) {
  useMemo(() => { createApiClient(); }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

---

## Hooks chuẩn bị sẵn

### `src/hooks/useGetList.ts` — Lấy danh sách

```typescript
// Frappe pattern: GET /api/resource/{doctype}?filters=...&fields=...&limit=20
export function useGetList<T>(resource: string, args?: GetListArgs<T>, options?) {
  return useQuery({
    queryKey: [resource, 'list', args],
    queryFn: async () => {
      const res = await apiClient.get(`/api/resource/${resource}`, { params });
      return res.data.data ?? res.data;
    },
    ...options,
  });
}
```

### `src/hooks/useGetDoc.ts` — Lấy chi tiết

```typescript
// Frappe pattern: GET /api/resource/{doctype}/{name}
export function useGetDoc<T>(resource: string, name: string, options?) {
  return useQuery({
    queryKey: [resource, 'doc', name],
    queryFn: async () => {
      const res = await apiClient.get(`/api/resource/${resource}/${name}`);
      return res.data.data;
    },
    ...options,
  });
}
```

### `src/hooks/useCreateDoc.ts` — Tạo mới

```typescript
// Frappe pattern: POST /api/resource/{doctype}
export function useCreateDoc<T>(resource: string) {
  return useMutation({
    mutationFn: async (data: Partial<T>) => {
      const res = await apiClient.post(`/api/resource/${resource}`, data);
      return res.data.data;
    },
  });
}
```

### `src/hooks/useUpdateDoc.ts` — Cập nhật

```typescript
// Frappe pattern: PUT /api/resource/{doctype}/{name}
export function useUpdateDoc<T>(resource: string) {
  return useMutation({
    mutationFn: async ({ name, data }: { name: string; data: Partial<T> }) => {
      const res = await apiClient.put(`/api/resource/${resource}/${name}`, data);
      return res.data.data;
    },
  });
}
```

### `src/hooks/useDeleteDoc.ts` — Xóa

```typescript
// Frappe pattern: DELETE /api/resource/{doctype}/{name}
export function useDeleteDoc(resource: string) {
  return useMutation({
    mutationFn: async (name: string) => {
      await apiClient.delete(`/api/resource/${resource}/${name}`);
    },
  });
}
```

### `src/types/hooks.ts` — Hook Types

```typescript
export type Filter = [string, string, string | string[]];

export interface GetListArgs<T = Record<string, unknown>> {
  fields?: (keyof T)[];
  filters?: Filter[];
  orFilters?: Filter[];
  orderBy?: { field: string; order: 'asc' | 'desc' };
  limit?: number;
  limit_start?: number;
  asDict?: boolean;
}
```

---

## Cách mapping Entity → Frappe DocType

| Entity type (FE) | Frappe DocType (tương lai) | Hook sử dụng |
|---|---|---|
| `[MainEntity]` | `[MAIN_ENTITY]` DocType | `useGetList('[MainEntity]')` |
| List page | — | `useGetList` |
| Detail page | — | `useGetDoc` |
| Create form | — | `useCreateDoc` |
| Edit form | — | `useUpdateDoc` |
| Delete action | — | `useDeleteDoc` |

---

## Cách chuyển từ Mock → API

### Trước (Mock):

```tsx
import { mockRecords } from '@/data/mock-[entity]';

export default function ListPage() {
  const records = mockRecords;
  // ...
}
```

### Sau (API):

```tsx
import { useGetList } from '@/hooks';

export default function ListPage() {
  const { data: records, isLoading } = useGetList('[Entity]', {
    fields: ['name', 'code', 'status'],
    filters: [['status', '=', 'active']],
    limit: 20,
  });
  // ...
}
```

---

## Quy tắc

1. **Không cần tích hợp Frappe ngay** — chỉ chuẩn bị hooks structure.
2. **Không viết logic backend giả phức tạp** — mock data đơn giản, import trực tiếp.
3. **Giữ component clean** — component chỉ consume data, không biết source.
4. **Hooks barrel export** — `src/hooks/index.ts` re-export tất cả hooks.
5. **Next.js rewrites** — proxy `/api/*` sang backend khi có:

```typescript
// next.config.ts
async rewrites() {
  return [
    { source: '/api/:path*', destination: `${BACKEND_URL}/api/:path*` },
  ];
},
```
