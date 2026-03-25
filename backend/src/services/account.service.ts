import { Prisma } from '@prisma/client';
import { accountRepository } from '../repositories/account.repository';
import type { CreateAccountInput, UpdateAccountInput } from '../schemas/account.schema';

function notFound(id: string): never {
  throw Object.assign(new Error(`Account with id "${id}" not found`), { statusCode: 404 });
}

export const accountService = {
  async getAll() {
    return accountRepository.findAll();
  },

  async getById(id: string) {
    const account = await accountRepository.findById(id);
    if (!account) notFound(id);
    return account;
  },

  async create(data: CreateAccountInput) {
    return accountRepository.create(data);
  },

  async update(id: string, data: UpdateAccountInput) {
    try {
      return await accountRepository.update(id, data);
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
        notFound(id);
      }
      throw err;
    }
  },

  async delete(id: string) {
    try {
      return await accountRepository.delete(id);
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
        notFound(id);
      }
      throw err;
    }
  },
};
