import { z } from 'zod';

export const createAccountSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be at most 100 characters'),
});

export const updateAccountSchema = createAccountSchema.partial();

export const accountIdParamSchema = z.object({
  id: z.string().min(1, 'Account ID is required'),
});

export type CreateAccountInput = z.infer<typeof createAccountSchema>;
export type UpdateAccountInput = z.infer<typeof updateAccountSchema>;
