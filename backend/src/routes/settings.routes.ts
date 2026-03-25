import type { FastifyInstance } from 'fastify';
import { settingsController } from '../controllers/settings.controller';

export async function settingsRoutes(fastify: FastifyInstance) {
  // Settings definitions — fetched once by the frontend to know what to render
  fastify.get('/definitions', settingsController.getDefinitions);

  // Per-account settings values
  fastify.get('/accounts/:id', settingsController.getForAccount);
  fastify.put('/accounts/:id', settingsController.upsertMany);
  fastify.put('/accounts/:id/:key', settingsController.upsert);
  fastify.delete('/accounts/:id/:key', settingsController.delete);
}
