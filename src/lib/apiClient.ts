import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

let _apiClient: AxiosInstance | null = null;

/**
 * Read the CSRF token from the cookie (Frappe sends it in the "csrf_token" cookie)
 */
function getCsrfToken(): string {
  if (typeof document === 'undefined') return '';
  const match = document.cookie.match(/csrf_token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : '';
}

export function createApiClient() {
  _apiClient = axios.create({
    // No baseURL set — hooks call /api/... directly, Next.js rewrites forward to Frappe
    timeout: 15_000,
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    // Required to send the session cookie with every request
    withCredentials: true,
  });

  // ── Request Interceptor: CSRF token cho mutation ─────────────────
  _apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const method = config.method?.toUpperCase();
    if (method && method !== 'GET' && method !== 'HEAD') {
      const csrf = getCsrfToken();
      if (csrf) {
        config.headers['X-Frappe-CSRF-Token'] = csrf;
      }
    }
    return config;
  });

  // ── Response Interceptor ─────────────────────────────────────────
  // No auto-redirect here — let each hook handle it (avoids /login redirect loops)
  _apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      const message =
        error.response?.data?.message ??
        error.response?.data?.exception ??
        error.response?.data?._error_message ??
        error.message ??
        'Unknown error';
      return Promise.reject(new Error(message));
    },
  );

  return _apiClient;
}

/** Return the already-initialized AxiosInstance */
export function getApiClient(): AxiosInstance {
  if (!_apiClient) {
    throw new Error(
      'ApiClient has not been initialized. Wrap your app with <ApiProvider>.',
    );
  }
  return _apiClient;
}
