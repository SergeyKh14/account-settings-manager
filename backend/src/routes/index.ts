import type { FastifyInstance } from 'fastify';
import { accountRoutes } from './account.routes';
import { settingsRoutes } from './settings.routes';

export async function registerRoutes(app: FastifyInstance) {
  app.get('/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }));

  await app.register(accountRoutes, { prefix: '/api/accounts' });
  await app.register(settingsRoutes, { prefix: '/api/settings' });
}
