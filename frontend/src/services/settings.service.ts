import { api } from '../lib/api';
import type { AccountSetting, ApiResponse, SettingDefinition, SettingsMap } from '../types';

function rowsToMap(rows: AccountSetting[]): SettingsMap {
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}

export const settingsService = {
  async getDefinitions(): Promise<SettingDefinition[]> {
    const { data } = await api.get<ApiResponse<SettingDefinition[]>>('/settings/definitions');
    return data.data;
  },

  async getForAccount(accountId: string): Promise<SettingsMap> {
    const { data } = await api.get<ApiResponse<AccountSetting[]>>(
      `/settings/accounts/${accountId}`,
    );
    return rowsToMap(data.data);
  },

  async saveAll(accountId: string, settings: SettingsMap): Promise<SettingsMap> {
    const payload = {
      settings: Object.entries(settings).map(([key, value]) => ({ key, value })),
    };
    const { data } = await api.put<ApiResponse<AccountSetting[]>>(
      `/settings/accounts/${accountId}`,
      payload,
    );
    return rowsToMap(data.data);
  },
};
