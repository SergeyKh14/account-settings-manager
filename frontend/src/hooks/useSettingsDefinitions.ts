import { useQuery } from '@tanstack/react-query';
import { settingsService } from '../services/settings.service';
import { queryKeys } from '../lib/query/keys';

export function useSettingsDefinitions() {
  const definitions = useQuery({
    queryKey: queryKeys.settings.definitions(),
    queryFn: settingsService.getDefinitions,
    staleTime: Infinity,
  });

  return { definitions };
}
