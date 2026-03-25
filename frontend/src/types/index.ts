// ─── Domain types ────────────────────────────────────────────────────────────

export interface Account {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export type SettingValue = boolean | string | number | string[];

export interface AccountSetting {
  id: string;
  accountId: string;
  key: string;
  value: SettingValue;
  createdAt: string;
  updatedAt: string;
}

// ─── Setting definitions (shape mirrors backend SettingDefinition) ────────────

export type SettingType = 'boolean' | 'text' | 'number' | 'select' | 'multiselect';

export interface SelectOption {
  label: string;
  value: string;
}

/**
 * Mirrors backend src/config/settings.config.ts → SettingDefinition.
 * The frontend receives these from GET /api/settings/definitions and uses
 * them only for rendering — it never defines what settings exist.
 */
export interface SettingDefinition {
  key: string;
  label: string;
  description?: string;
  type: SettingType;
  defaultValue: SettingValue;
  options?: SelectOption[];
}

/** Flat map of key → current value for one account */
export type SettingsMap = Record<string, SettingValue>;

// ─── API wrapper types ────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  message?: string;
}
