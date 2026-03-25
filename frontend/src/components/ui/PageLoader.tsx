import { Box, CircularProgress, Typography } from '@mui/material';

interface Props {
  label?: string;
}

export function PageLoader({ label }: Props) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap={2}
      minHeight={320}
    >
      <CircularProgress size={40} thickness={4} />
      {label && (
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
      )}
    </Box>
  );
}
