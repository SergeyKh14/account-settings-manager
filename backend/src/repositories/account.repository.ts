import { prisma } from '../lib/prisma';
import type { CreateAccountInput, UpdateAccountInput } from '../schemas/account.schema';

export const accountRepository = {
  findAll() {
    return prisma.account.findMany({
      orderBy: { name: 'asc' },
    });
  },

  findById(id: string) {
    return prisma.account.findUnique({ where: { id } });
  },

  create(data: CreateAccountInput) {
    return prisma.account.create({ data });
  },

  update(id: string, data: UpdateAccountInput) {
    return prisma.account.update({ where: { id }, data });
  },

  delete(id: string) {
    return prisma.account.delete({ where: { id } });
  },
};
