import type {
  DemoGisFeature,
  DemoGisFeatureCollection,
} from '@/types/demo-gis';

interface ApiError {
  error?: string;
}

async function readResponse<T>(response: Response): Promise<T> {
  const data = (await response.json()) as T & ApiError;
  if (!response.ok) {
    throw new Error(data.error ?? `HTTP ${response.status}`);
  }
  return data;
}

export async function fetchDemoGisFeatures(signal?: AbortSignal) {
  const response = await fetch('/demo-data-api/features', {
    cache: 'no-store',
    signal,
  });
  return readResponse<DemoGisFeatureCollection>(response);
}

export async function saveDemoGisFeature(feature: DemoGisFeature) {
  const response = await fetch(
    `/demo-data-api/features/${encodeURIComponent(String(feature.id))}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/geo+json' },
      body: JSON.stringify(feature),
    },
  );
  return readResponse<DemoGisFeature>(response);
}

export async function deleteDemoGisFeature(id: string) {
  const response = await fetch(
    `/demo-data-api/features/${encodeURIComponent(id)}`,
    { method: 'DELETE' },
  );
  return readResponse<{ deleted: true }>(response);
}

export async function deleteUserDemoGisFeatures() {
  const response = await fetch('/demo-data-api/features', {
    method: 'DELETE',
  });
  return readResponse<{ deletedCount: number }>(response);
}
