import type { FastifyInstance } from 'fastify';
import { accountController } from '../controllers/account.controller';

export async function accountRoutes(fastify: FastifyInstance) {
  fastify.get('/', accountController.getAll);
  fastify.get('/:id', accountController.getById);
  fastify.post('/', accountController.create);
  fastify.patch('/:id', accountController.update);
  fastify.delete('/:id', accountController.delete);
}
