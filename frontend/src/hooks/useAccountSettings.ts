import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsService } from '../services/settings.service';
import { queryKeys } from '../lib/query/keys';
import type { SettingsMap } from '../types';

export function useAccountSettings(accountId: string) {
  const qc = useQueryClient();

  const settings = useQuery({
    queryKey: queryKeys.accounts.settings(accountId),
    queryFn: () => settingsService.getForAccount(accountId),
    enabled: Boolean(accountId),
  });

  const save = useMutation({
    mutationFn: (values: SettingsMap) => settingsService.saveAll(accountId, values),
    onSuccess: (data) => qc.setQueryData(queryKeys.accounts.settings(accountId), data),
  });

  return { settings, save };
}
