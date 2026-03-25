import { settingsRepository } from '../repositories/settings.repository';
import { definitionsRepository } from '../repositories/definitions.repository';
import { accountRepository } from '../repositories/account.repository';
import type { UpsertManySettingsInput, UpsertSettingInput } from '../schemas/settings.schema';

async function assertValidKeys(keys: string[]): Promise<void> {
  const validKeys = await definitionsRepository.findValidKeys();
  const unknown = keys.filter((k) => !validKeys.has(k));
  if (unknown.length > 0) {
    const label = unknown.map((k) => `"${k}"`).join(', ');
    throw Object.assign(
      new Error(`Unknown setting key${unknown.length > 1 ? 's' : ''}: ${label}`),
      { statusCode: 400 },
    );
  }
}

async function assertAccountExists(accountId: string): Promise<void> {
  const account = await accountRepository.findById(accountId);
  if (!account) {
    throw Object.assign(
      new Error(`Account with id "${accountId}" not found`),
      { statusCode: 404 },
    );
  }
}

export const settingsService = {
  async getDefinitions() {
    return definitionsRepository.findAll();
  },

  async getForAccount(accountId: string) {
    // Validate account existence and fetch settings in parallel
    const [, settings] = await Promise.all([
      assertAccountExists(accountId),
      settingsRepository.findByAccountId(accountId),
    ]);
    return settings;
  },

  async upsert(accountId: string, input: UpsertSettingInput) {
    // Key validation and account existence check are independent — run in parallel
    await Promise.all([
      assertValidKeys([input.key]),
      assertAccountExists(accountId),
    ]);
    return settingsRepository.upsert(accountId, input);
  },

  async upsertMany(accountId: string, input: UpsertManySettingsInput) {
    await Promise.all([
      assertValidKeys(input.settings.map((s) => s.key)),
      assertAccountExists(accountId),
    ]);
    return settingsRepository.upsertMany(accountId, input.settings);
  },

  async delete(accountId: string, key: string) {
    await Promise.all([
      assertValidKeys([key]),
      assertAccountExists(accountId),
    ]);
    return settingsRepository.delete(accountId, key);
  },
};
