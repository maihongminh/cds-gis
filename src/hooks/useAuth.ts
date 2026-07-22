'use client';

import { useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getApiClient } from '@/lib/apiClient';

// ── Types ─────────────────────────────────────────────────────────────

export interface FrappeUser {
  name: string;        // username / email, e.g. "Administrator"
  full_name: string;   // Full display name
  user_image?: string; // Avatar URL
  email?: string;
  roles?: string[];
}


interface FrappeLoginResponse {
  message: string;      // "Logged In"
  home_page: string;    // "/"
  full_name: string;    // "Administrator"
}

const AUTH_QUERY_KEY = ['auth', 'currentUser'];

// ── Hook ──────────────────────────────────────────────────────────────

export function useAuth() {
  const queryClient = useQueryClient();
  const apiClient = getApiClient();

  // ── Fetch current user ─────────────────────────────────────────────
  // Frappe endpoint: GET /api/method/frappe.auth.get_logged_user
  // Returns: "Administrator" (string) — not an object
  const {
    data: currentUser,
    isLoading,
    isFetching: isValidating,
    error,
    refetch,
  } = useQuery<string | null, Error>({
    queryKey: AUTH_QUERY_KEY,
    queryFn: async () => {
      try {
        const res = await apiClient.get<{ message: string }>(
          '/api/method/frappe.auth.get_logged_user',
        );
        const user = res.data?.message;
        return user && user !== 'Guest' ? user : null;
      } catch (err: unknown) {
        const status = (err as { response?: { status?: number } }).response?.status;
        // Session expired — redirect to /login, but only when not already on /login
        if ((status === 401 || status === 403) && typeof window !== 'undefined') {
          if (!window.location.pathname.startsWith('/login')) {
            window.location.href = '/login';
          }
        }
        return null;
      }
    },
    staleTime: 1000 * 60 * 5, // cache for 5 minutes
    retry: false,
  });

  // ── Login ──────────────────────────────────────────────────────────
  // POST /api/method/login with { usr, pwd }
  const login = useCallback(
    async (usr: string, pwd: string): Promise<FrappeLoginResponse> => {
      const res = await apiClient.post<FrappeLoginResponse>(
        '/api/method/login',
        { usr, pwd },
      );
      // After a successful login, Frappe sets the "sid" cookie automatically
      // Refetch to get the current user info
      await queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
      return res.data;
    },
    [apiClient, queryClient],
  );

  // ── Logout ─────────────────────────────────────────────────────────
  // POST /api/method/logout — Frappe removes the "sid" cookie automatically
  const logout = useCallback(async () => {
    try {
      await apiClient.post('/api/method/logout');
    } finally {
      queryClient.setQueryData(AUTH_QUERY_KEY, null);
      queryClient.clear();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
  }, [apiClient, queryClient]);

  // ── Update current user (refetch) ─────────────────────────────────
  const updateCurrentUser = useCallback(() => {
    refetch();
  }, [refetch]);

  // ── getUserCookie — reset auth state on 403 ───────────────────────
  const getUserCookie = useCallback(() => {
    queryClient.setQueryData(AUTH_QUERY_KEY, null);
  }, [queryClient]);

  return {
    /** Email/username of the currently logged-in user. null if not logged in. */
    currentUser: currentUser ?? null,
    isLoading,
    isValidating,
    error,
    login,
    logout,
    updateCurrentUser,
    getUserCookie,
  };
}
