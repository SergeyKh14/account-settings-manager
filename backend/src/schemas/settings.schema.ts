import { z } from 'zod';

export const settingValueSchema = z.union([
  z.boolean(),
  z.string(),
  z.number(),
  z.array(z.string()),
]);

export const upsertSettingSchema = z.object({
  key: z.string().min(1, 'Setting key is required'),
  value: settingValueSchema,
});

export const upsertManySettingsSchema = z.object({
  settings: z.array(upsertSettingSchema).min(1, 'At least one setting is required'),
});

export const settingKeyParamSchema = z.object({
  key: z.string().min(1, 'Setting key is required'),
});

export type UpsertSettingInput = z.infer<typeof upsertSettingSchema>;
export type UpsertManySettingsInput = z.infer<typeof upsertManySettingsSchema>;
