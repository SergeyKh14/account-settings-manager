import { ZodSchema, ZodError } from 'zod';
import type { FastifyRequest, FastifyReply } from 'fastify';

export function parseBody<T>(schema: ZodSchema<T>, request: FastifyRequest, reply: FastifyReply): T | null {
  const result = schema.safeParse(request.body);
  if (!result.success) {
    reply.status(400).send({ error: 'Validation error', details: result.error.flatten() });
    return null;
  }
  return result.data;
}

export function parseParams<T>(schema: ZodSchema<T>, request: FastifyRequest, reply: FastifyReply): T | null {
  const result = schema.safeParse(request.params);
  if (!result.success) {
    reply.status(400).send({ error: 'Validation error', details: result.error.flatten() });
    return null;
  }
  return result.data;
}
