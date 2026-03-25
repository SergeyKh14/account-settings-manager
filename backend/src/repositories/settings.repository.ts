import { prisma } from '../lib/prisma';
import type { UpsertSettingInput } from '../schemas/settings.schema';
import type { SettingValue } from '../types';

function serialize(value: SettingValue): string {
  return JSON.stringify(value);
}

function deserialize(raw: string): SettingValue {
  return JSON.parse(raw) as SettingValue;
}

function deserializeRow<T extends { value: string }>(row: T): Omit<T, 'value'> & { value: SettingValue } {
  return { ...row, value: deserialize(row.value) };
}

export const settingsRepository = {
  async findByAccountId(accountId: string) {
    const rows = await prisma.accountSetting.findMany({ where: { accountId } });
    return rows.map(deserializeRow);
  },

  async findByAccountIdAndKey(accountId: string, key: string) {
    const row = await prisma.accountSetting.findUnique({
      where: { accountId_key: { accountId, key } },
    });
    return row ? deserializeRow(row) : null;
  },

  async upsert(accountId: string, input: UpsertSettingInput) {
    const serialized = serialize(input.value as SettingValue);
    const row = await prisma.accountSetting.upsert({
      where: { accountId_key: { accountId, key: input.key } },
      create: { accountId, key: input.key, value: serialized },
      update: { value: serialized },
    });
    return deserializeRow(row);
  },

  async upsertMany(accountId: string, settings: UpsertSettingInput[]) {
    const rows = await prisma.$transaction(
      settings.map((s) => {
        const serialized = serialize(s.value as SettingValue);
        return prisma.accountSetting.upsert({
          where: { accountId_key: { accountId, key: s.key } },
          create: { accountId, key: s.key, value: serialized },
          update: { value: serialized },
        });
      }),
    );
    return rows.map(deserializeRow);
  },

  delete(accountId: string, key: string) {
    return prisma.accountSetting.delete({
      where: { accountId_key: { accountId, key } },
    });
  },
};
