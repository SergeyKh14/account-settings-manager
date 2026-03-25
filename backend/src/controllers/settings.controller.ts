import type { FastifyRequest, FastifyReply } from 'fastify';
import { settingsService } from '../services/settings.service';
import {
  upsertSettingSchema,
  upsertManySettingsSchema,
  settingKeyParamSchema,
} from '../schemas/settings.schema';
import { accountIdParamSchema } from '../schemas/account.schema';
import { parseBody, parseParams } from '../middleware/validate';

const accountAndKeyParamSchema = accountIdParamSchema.merge(settingKeyParamSchema);

function errorStatus(err: unknown): number {
  const code = (err as { statusCode?: number }).statusCode;
  if (code) return code;
  return (err as Error).message?.includes('not found') ? 404 : 500;
}

export const settingsController = {
  async getDefinitions(_request: FastifyRequest, reply: FastifyReply) {
    try {
      const definitions = await settingsService.getDefinitions();
      return reply.send({ data: definitions });
    } catch (err: unknown) {
      return reply.status(500).send({ error: (err as Error).message });
    }
  },

  async getForAccount(request: FastifyRequest, reply: FastifyReply) {
    const params = parseParams(accountIdParamSchema, request, reply);
    if (!params) return;
    try {
      const settings = await settingsService.getForAccount(params.id);
      return reply.send({ data: settings });
    } catch (err: unknown) {
      return reply.status(errorStatus(err)).send({ error: (err as Error).message });
    }
  },

  async upsert(request: FastifyRequest, reply: FastifyReply) {
    const params = parseParams(accountIdParamSchema, request, reply);
    if (!params) return;
    const body = parseBody(upsertSettingSchema, request, reply);
    if (!body) return;
    try {
      const setting = await settingsService.upsert(params.id, body);
      return reply.send({ data: setting, message: 'Setting saved' });
    } catch (err: unknown) {
      return reply.status(errorStatus(err)).send({ error: (err as Error).message });
    }
  },

  async upsertMany(request: FastifyRequest, reply: FastifyReply) {
    const params = parseParams(accountIdParamSchema, request, reply);
    if (!params) return;
    const body = parseBody(upsertManySettingsSchema, request, reply);
    if (!body) return;
    try {
      const settings = await settingsService.upsertMany(params.id, body);
      return reply.send({ data: settings, message: 'Settings saved' });
    } catch (err: unknown) {
      return reply.status(errorStatus(err)).send({ error: (err as Error).message });
    }
  },

  async delete(request: FastifyRequest, reply: FastifyReply) {
    const params = parseParams(accountAndKeyParamSchema, request, reply);
    if (!params) return;
    try {
      await settingsService.delete(params.id, params.key);
      return reply.send({ message: 'Setting deleted' });
    } catch (err: unknown) {
      return reply.status(errorStatus(err)).send({ error: (err as Error).message });
    }
  },
};
