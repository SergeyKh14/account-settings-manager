import type { SettingDefinition, SettingsMap } from '../types';

export function buildDefaultsMap(
  definitions: SettingDefinition[],
  saved: Record<string, unknown> = {},
): SettingsMap {
  return Object.fromEntries(
    definitions.map((def) => [
      def.key,
      def.key in saved ? saved[def.key] : def.defaultValue,
    ]),
  ) as SettingsMap;
}

const AVATAR_COLORS = [
  '#6366f1',
  '#8b5cf6',
  '#ec4899',
  '#f43f5e',
  '#f97316',
  '#14b8a6',
  '#0ea5e9',
];

export function getAvatarColor(name: string): string {
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
}
