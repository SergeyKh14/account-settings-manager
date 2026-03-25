import { api } from '../lib/api';
import type { Account, ApiResponse } from '../types';

export const accountsService = {
  async getAll(): Promise<Account[]> {
    const { data } = await api.get<ApiResponse<Account[]>>('/accounts');
    return data.data;
  },

  async getById(id: string): Promise<Account> {
    const { data } = await api.get<ApiResponse<Account>>(`/accounts/${id}`);
    return data.data;
  },

  async create(payload: { name: string }): Promise<Account> {
    const { data } = await api.post<ApiResponse<Account>>('/accounts', payload);
    return data.data;
  },

  async update(id: string, payload: { name: string }): Promise<Account> {
    const { data } = await api.patch<ApiResponse<Account>>(`/accounts/${id}`, payload);
    return data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/accounts/${id}`);
  },
};
