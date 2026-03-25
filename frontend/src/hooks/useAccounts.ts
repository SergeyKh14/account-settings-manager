import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { accountsService } from '../services/accounts.service';
import { queryKeys } from '../lib/query/keys';

export function useAccounts(id?: string) {
  const qc = useQueryClient();

  const list = useQuery({
    queryKey: queryKeys.accounts.all(),
    queryFn: accountsService.getAll,
  });

  const single = useQuery({
    queryKey: queryKeys.accounts.detail(id ?? ''),
    queryFn: () => accountsService.getById(id!),
    enabled: Boolean(id),
  });

  const create = useMutation({
    mutationFn: accountsService.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.accounts.all() }),
  });

  const remove = useMutation({
    mutationFn: accountsService.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.accounts.all() }),
  });

  return { list, single, create, remove };
}
