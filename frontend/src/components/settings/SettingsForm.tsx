import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Skeleton,
  Stack,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { buildDefaultsMap } from '../../lib/helpers';
import { settingsFormSchema } from '../../schemas';
import { SettingField } from './SettingField';
import type { SettingDefinition, SettingsMap } from '../../types';

interface Props {
  definitions: SettingDefinition[];
  savedValues: SettingsMap | undefined;
  isLoading: boolean;
  isSaving: boolean;
  saveError: string | null;
  onSave: (values: SettingsMap) => void;
}

/**
 * Renders all settings received from the API.
 * This component has no knowledge of what settings exist —
 * it purely maps each definition to the correct input via SettingField.
 */
export function SettingsForm({
  definitions,
  savedValues,
  isLoading,
  isSaving,
  saveError,
  onSave,
}: Props) {
  const methods = useForm<SettingsMap>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: buildDefaultsMap(definitions, savedValues ?? {}),
  });

  useEffect(() => {
    if (savedValues !== undefined && definitions.length > 0) {
      methods.reset(buildDefaultsMap(definitions, savedValues));
    }
  }, [savedValues, definitions, methods]);

  const handleSubmit = methods.handleSubmit((values) => onSave(values));

  if (isLoading) {
    return (
      <Stack spacing={2}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} variant="rounded" height={60} />
        ))}
      </Stack>
    );
  }

  return (
    <FormProvider {...methods}>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Stack spacing={3}>
          {saveError && <Alert severity="error">{saveError}</Alert>}

          {definitions.map((def) => (
            <Paper key={def.key} variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
              <SettingField definition={def} />
            </Paper>
          ))}

          <Box display="flex" justifyContent="flex-end" pt={1}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              startIcon={isSaving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
              disabled={isSaving}
            >
              {isSaving ? 'Saving…' : 'Save Settings'}
            </Button>
          </Box>
        </Stack>
      </Box>
    </FormProvider>
  );
}
