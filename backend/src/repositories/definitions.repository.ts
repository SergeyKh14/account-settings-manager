import { prisma } from '../lib/prisma';
import type { SettingDefinition, SelectOption } from '../types';

function deserializeRow(row: {
  key: string;
  label: string;
  description: string | null;
  type: string;
  defaultValue: string;
  options: string | null;
  sortOrder: number;
}): SettingDefinition {
  return {
    key: row.key,
    label: row.label,
    description: row.description ?? undefined,
    type: row.type as SettingDefinition['type'],
    defaultValue: JSON.parse(row.defaultValue),
    options: row.options ? (JSON.parse(row.options) as SelectOption[]) : undefined,
    sortOrder: row.sortOrder,
  };
}

// In-memory cache for valid keys — setting_definitions changes only via seed or admin.
// Avoids a DB round-trip on every write request.
let cachedKeys: Set<string> | null = null;
let cacheExpiresAt = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export const definitionsRepository = {
  async findAll(): Promise<SettingDefinition[]> {
    const rows = await prisma.settingDefinition.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    return rows.map(deserializeRow);
  },

  async findValidKeys(): Promise<Set<string>> {
    const now = Date.now();
    if (cachedKeys && now < cacheExpiresAt) return cachedKeys;

    const rows = await prisma.settingDefinition.findMany({ select: { key: true } });
    cachedKeys = new Set(rows.map((r) => r.key));
    cacheExpiresAt = now + CACHE_TTL_MS;
    return cachedKeys;
  },

  /** Call after adding or removing definitions to keep the cache consistent. */
  invalidateCache() {
    cachedKeys = null;
    cacheExpiresAt = 0;
  },
};
