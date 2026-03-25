export type SettingValue = boolean | string | number | string[];

export interface AccountRow {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SettingRow {
  id: string;
  accountId: string;
  key: string;
  value: SettingValue;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  error: string;
  details?: unknown;
}

// ─── Setting definition types (stored in DB, served to frontend) ──────────────

export type SettingType = 'boolean' | 'text' | 'number' | 'select' | 'multiselect';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SettingDefinition {
  key: string;
  label: string;
  description?: string;
  type: SettingType;
  defaultValue: SettingValue;
  options?: SelectOption[];
  sortOrder?: number;
}
