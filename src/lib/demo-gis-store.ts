import 'server-only';

import { promises as fs } from 'node:fs';
import path from 'node:path';

import {
  DEMO_GIS_SEED,
  DEMO_GIS_RETIRED_SEED_IDS,
  DEMO_GIS_SEED_VERSION,
} from '@/data/demo-gis-seed';
import { MAP_LAYER_BY_ID } from '@/data/gis-layer-catalog';
import type {
  DemoGisFeature,
  DemoGisFeatureCollection,
  DemoGisProperties,
} from '@/types/demo-gis';

const RUNTIME_DIRECTORY = path.join(process.cwd(), 'data', 'runtime');
const RUNTIME_FILE = path.join(
  RUNTIME_DIRECTORY,
  'demo-gis-features.json',
);

let operationQueue: Promise<unknown> = Promise.resolve();

function cloneSeed(): DemoGisFeatureCollection {
  return structuredClone(DEMO_GIS_SEED);
}

async function writeCollection(collection: DemoGisFeatureCollection) {
  await fs.mkdir(RUNTIME_DIRECTORY, { recursive: true });
  const temporaryFile = `${RUNTIME_FILE}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(
    temporaryFile,
    `${JSON.stringify(collection, null, 2)}\n`,
    'utf8',
  );
  await fs.rename(temporaryFile, RUNTIME_FILE);
}

async function readCollectionUnsafe(): Promise<DemoGisFeatureCollection> {
  try {
    const content = await fs.readFile(RUNTIME_FILE, 'utf8');
    const parsed = JSON.parse(content) as DemoGisFeatureCollection;
    if (parsed.type !== 'FeatureCollection' || !Array.isArray(parsed.features)) {
      throw new Error('File dữ liệu demo không đúng định dạng FeatureCollection.');
    }
    if ((parsed.demoSeedVersion ?? 0) < DEMO_GIS_SEED_VERSION) {
      const retiredSeedIds = new Set<string>(DEMO_GIS_RETIRED_SEED_IDS);
      const retainedFeatures = parsed.features.filter(
        (feature) => !retiredSeedIds.has(String(feature.id)),
      );
      const existingIds = new Set(
        retainedFeatures.map((feature) => String(feature.id)),
      );
      const missingSeedFeatures = DEMO_GIS_SEED.features.filter(
        (feature) => !existingIds.has(String(feature.id)),
      );
      const upgradedCollection: DemoGisFeatureCollection = {
        ...parsed,
        demoSeedVersion: DEMO_GIS_SEED_VERSION,
        features: [
          ...retainedFeatures,
          ...structuredClone(missingSeedFeatures),
        ],
      };
      await writeCollection(upgradedCollection);
      return upgradedCollection;
    }
    return parsed;
  } catch (error) {
    if (
      error instanceof Error &&
      'code' in error &&
      error.code === 'ENOENT'
    ) {
      const seed = cloneSeed();
      await writeCollection(seed);
      return seed;
    }
    throw error;
  }
}

function runExclusive<T>(operation: () => Promise<T>): Promise<T> {
  const result = operationQueue.then(operation, operation);
  operationQueue = result.then(
    () => undefined,
    () => undefined,
  );
  return result;
}

function isCoordinateArray(value: unknown): boolean {
  if (!Array.isArray(value) || value.length === 0) return false;
  if (typeof value[0] === 'number') {
    return (
      value.length >= 2 &&
      value.every((coordinate) => Number.isFinite(coordinate))
    );
  }
  return value.every(isCoordinateArray);
}

export function validateDemoGisFeature(
  value: unknown,
): asserts value is DemoGisFeature {
  if (!value || typeof value !== 'object') {
    throw new Error('Dữ liệu đối tượng không hợp lệ.');
  }
  const feature = value as Partial<DemoGisFeature>;
  if (feature.type !== 'Feature' || !feature.id) {
    throw new Error('Đối tượng phải có type=Feature và id.');
  }
  if (
    !feature.geometry ||
    !('coordinates' in feature.geometry) ||
    !isCoordinateArray(feature.geometry.coordinates)
  ) {
    throw new Error('Geometry hoặc tọa độ không hợp lệ.');
  }
  const properties = feature.properties as Partial<DemoGisProperties> | null;
  if (
    !properties ||
    !properties.layerId ||
    !MAP_LAYER_BY_ID.has(properties.layerId)
  ) {
    throw new Error('layerId không tồn tại trong catalog.');
  }
  if (!properties.name || typeof properties.name !== 'string') {
    throw new Error('Tên đối tượng không được để trống.');
  }
}

export async function getDemoGisFeatures() {
  return runExclusive(readCollectionUnsafe);
}

export async function saveDemoGisFeature(feature: DemoGisFeature) {
  validateDemoGisFeature(feature);
  return runExclusive(async () => {
    const collection = await readCollectionUnsafe();
    const id = String(feature.id);
    const index = collection.features.findIndex(
      (item) => String(item.id) === id,
    );
    const now = new Date().toISOString();
    const normalizedFeature: DemoGisFeature = {
      ...feature,
      id,
      properties: {
        ...feature.properties,
        category:
          MAP_LAYER_BY_ID.get(feature.properties.layerId)?.name ??
          feature.properties.category,
        status: 'saved',
        updatedAt: now,
        createdAt: feature.properties.createdAt || now,
      },
    };

    if (index >= 0) collection.features[index] = normalizedFeature;
    else collection.features.push(normalizedFeature);
    await writeCollection(collection);
    return normalizedFeature;
  });
}

export async function deleteDemoGisFeature(id: string) {
  return runExclusive(async () => {
    const collection = await readCollectionUnsafe();
    const nextFeatures = collection.features.filter(
      (feature) => String(feature.id) !== id,
    );
    if (nextFeatures.length === collection.features.length) return false;
    collection.features = nextFeatures;
    await writeCollection(collection);
    return true;
  });
}

export async function deleteUserDemoGisFeatures() {
  return runExclusive(async () => {
    const collection = await readCollectionUnsafe();
    const deletedCount = collection.features.filter(
      (feature) => feature.properties.source === 'user',
    ).length;
    collection.features = collection.features.filter(
      (feature) => feature.properties.source !== 'user',
    );
    await writeCollection(collection);
    return deletedCount;
  });
}

export async function resetDemoGisFeatures() {
  return runExclusive(async () => {
    const seed = cloneSeed();
    await writeCollection(seed);
    return seed;
  });
}

export async function migrateDemoGisSeed() {
  return runExclusive(async () => {
    const collection = await readCollectionUnsafe();
    const seed = cloneSeed();
    const preservedFeatures = collection.features.filter(
      (feature) => feature.properties.source !== 'seed',
    );
    const seedIds = new Set(
      seed.features.map((feature) => String(feature.id)),
    );
    const preservedWithoutSeedIdCollision = preservedFeatures.filter(
      (feature) => !seedIds.has(String(feature.id)),
    );
    const migratedCollection: DemoGisFeatureCollection = {
      ...seed,
      features: [
        ...seed.features,
        ...preservedWithoutSeedIdCollision,
      ],
    };

    await writeCollection(migratedCollection);
    return {
      collection: migratedCollection,
      replacedSeedCount: seed.features.length,
      preservedFeatureCount: preservedWithoutSeedIdCollision.length,
      skippedIdCollisionCount:
        preservedFeatures.length - preservedWithoutSeedIdCollision.length,
    };
  });
}
