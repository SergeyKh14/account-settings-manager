import { useState } from 'react';
import { Alert, Box, Button, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { AccountCard } from '../components/accounts/AccountCard';
import { CreateAccountDialog } from '../components/accounts/CreateAccountDialog';
import { PageLoader } from '../components/ui/PageLoader';
import { useAccounts } from '../hooks/useAccounts';
import type { CreateAccountValues } from '../schemas';

export function AccountsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { list, create } = useAccounts();

  const handleCreate = (values: CreateAccountValues) => {
    create.mutate(values, {
      onSuccess: () => setDialogOpen(false),
    });
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Accounts
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Select an account to manage its settings.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialogOpen(true)}
          size="large"
        >
          New Account
        </Button>
      </Stack>

      {list.error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {(list.error as Error).message}
        </Alert>
      )}

      {list.isLoading ? (
        <PageLoader label="Loading accounts…" />
      ) : (
        <Stack spacing={2}>
          {list.data?.map((account) => (
            <AccountCard key={account.id} account={account} />
          ))}

          {list.data?.length === 0 && (
            <Box textAlign="center" py={8}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No accounts yet
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Create your first account to get started.
              </Typography>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => setDialogOpen(true)}
              >
                Create Account
              </Button>
            </Box>
          )}
        </Stack>
      )}

      <CreateAccountDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onCreate={handleCreate}
        isLoading={create.isPending}
      />
    </Box>
  );
}
