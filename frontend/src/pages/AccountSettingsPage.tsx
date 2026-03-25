import { useState } from 'react';
import { Alert, Box, Breadcrumbs, Chip, Link, Stack, Typography } from '@mui/material';
import { Link as RouterLink, useParams } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useAccounts } from '../hooks/useAccounts';
import { useAccountSettings } from '../hooks/useAccountSettings';
import { useSettingsDefinitions } from '../hooks/useSettingsDefinitions';
import { SettingsForm } from '../components/settings/SettingsForm';
import { PageLoader } from '../components/ui/PageLoader';
import type { SettingsMap } from '../types';

export function AccountSettingsPage() {
  const { id = '' } = useParams<{ id: string }>();

  const { single: account } = useAccounts(id);
  const { definitions } = useSettingsDefinitions();
  const { settings, save } = useAccountSettings(id);

  const [savedSuccessfully, setSavedSuccessfully] = useState(false);

  const isPageLoading = account.isLoading || definitions.isLoading || settings.isLoading;

  const handleSave = (values: SettingsMap) => {
    setSavedSuccessfully(false);
    save.mutate(values, {
      onSuccess: () => {
        setSavedSuccessfully(true);
        setTimeout(() => setSavedSuccessfully(false), 3000);
      },
    });
  };

  if (account.error) {
    return (
      <Alert severity="error">{(account.error as Error).message ?? 'Account not found'}</Alert>
    );
  }

  if (isPageLoading) {
    return <PageLoader label="Loading settings…" />;
  }

  return (
    <Box>
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link
          component={RouterLink}
          to="/"
          underline="hover"
          color="inherit"
          sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
        >
          <HomeIcon fontSize="small" />
          Accounts
        </Link>
        <Typography color="text.primary">{account.data?.name}</Typography>
      </Breadcrumbs>

      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            {account.data?.name}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Configure settings for this account. Changes apply immediately after saving.
          </Typography>
        </Box>
        {savedSuccessfully && (
          <Chip
            icon={<CheckCircleIcon />}
            label="Saved successfully"
            color="success"
            variant="outlined"
          />
        )}
      </Stack>

      {save.isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {(save.error as Error).message}
        </Alert>
      )}

      <SettingsForm
        definitions={definitions.data ?? []}
        savedValues={settings.data}
        isLoading={false}
        isSaving={save.isPending}
        saveError={null}
        onSave={handleSave}
      />
    </Box>
  );
}
