import type { FastifyRequest, FastifyReply } from 'fastify';
import { accountService } from '../services/account.service';
import { createAccountSchema, updateAccountSchema, accountIdParamSchema } from '../schemas/account.schema';
import { parseBody, parseParams } from '../middleware/validate';

export const accountController = {
  async getAll(request: FastifyRequest, reply: FastifyReply) {
    const accounts = await accountService.getAll();
    return reply.send({ data: accounts });
  },

  async getById(request: FastifyRequest, reply: FastifyReply) {
    const params = parseParams(accountIdParamSchema, request, reply);
    if (!params) return;
    try {
      const account = await accountService.getById(params.id);
      return reply.send({ data: account });
    } catch (err: unknown) {
      return reply.status(404).send({ error: (err as Error).message });
    }
  },

  async create(request: FastifyRequest, reply: FastifyReply) {
    const body = parseBody(createAccountSchema, request, reply);
    if (!body) return;
    const account = await accountService.create(body);
    return reply.status(201).send({ data: account, message: 'Account created' });
  },

  async update(request: FastifyRequest, reply: FastifyReply) {
    const params = parseParams(accountIdParamSchema, request, reply);
    if (!params) return;
    const body = parseBody(updateAccountSchema, request, reply);
    if (!body) return;
    try {
      const account = await accountService.update(params.id, body);
      return reply.send({ data: account, message: 'Account updated' });
    } catch (err: unknown) {
      return reply.status(404).send({ error: (err as Error).message });
    }
  },

  async delete(request: FastifyRequest, reply: FastifyReply) {
    const params = parseParams(accountIdParamSchema, request, reply);
    if (!params) return;
    try {
      await accountService.delete(params.id);
      return reply.send({ message: 'Account deleted' });
    } catch (err: unknown) {
      return reply.status(404).send({ error: (err as Error).message });
    }
  },
};
