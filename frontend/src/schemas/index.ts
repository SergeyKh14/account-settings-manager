import { z } from 'zod';

export const settingValueSchema = z.union([
  z.boolean(),
  z.string(),
  z.number(),
  z.array(z.string()),
]);

export const settingsFormSchema = z.record(z.string(), settingValueSchema);

export const accountSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const createAccountSchema = z.object({
  name: z.string().min(1, 'Account name is required').max(100),
});

export type SettingsFormValues = z.infer<typeof settingsFormSchema>;
export type CreateAccountValues = z.infer<typeof createAccountSchema>;
