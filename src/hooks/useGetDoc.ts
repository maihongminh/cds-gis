'use client';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getApiClient } from '@/lib/apiClient';

type UseGetDocOptions<T> = Omit<UseQueryOptions<T, Error>, 'queryKey' | 'queryFn'>;

export function useGetDoc<T = Record<string, unknown>>(
  /** Resource name, e.g. 'tasks', 'users', 'boards' */
  resource: string,
  /** Document ID. Pass undefined/null to temporarily disable fetching */
  id: string | undefined | null,
  /** TanStack Query options (staleTime, enabled, ...) */
  options?: UseGetDocOptions<T>,
) {
  const apiClient = getApiClient();

  const query = useQuery<T, Error>({
    queryKey: [resource, id],
    queryFn: async () => {
      const res = await apiClient.get<T>(`/api/resource/${resource}/${id}`);
      // Frappe wraps the response in { data: ... }
      return (res.data as { data?: T }).data ?? res.data;
    },
    // Only fetch when id has a value
    enabled: !!id && options?.enabled !== false,
    ...options,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isValidating: query.isFetching,
    error: query.error,
    mutate: query.refetch,
  };
}
