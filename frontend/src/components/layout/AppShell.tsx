import { Box, Container, Stack, Typography } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { Outlet } from 'react-router-dom';

export function AppShell() {
  return (
    <Box minHeight="100vh" bgcolor="grey.50">
      {/* Top nav */}
      <Box
        component="header"
        bgcolor="white"
        borderBottom={1}
        borderColor="divider"
        px={3}
        py={1.5}
      >
        <Container maxWidth="lg">
          <Stack direction="row" alignItems="center" spacing={1}>
            <SettingsIcon color="primary" />
            <Typography variant="h6" fontWeight={700} color="primary">
              Account Settings
            </Typography>
          </Stack>
        </Container>
      </Box>

      {/* Page content */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
}
