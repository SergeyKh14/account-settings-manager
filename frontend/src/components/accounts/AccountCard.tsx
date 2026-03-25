import { Avatar, Box, Card, CardActionArea, CardContent, Typography } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useNavigate } from 'react-router-dom';
import type { Account } from '../../types';
import { getAvatarColor } from '../../lib/helpers';

interface Props {
  account: Account;
}

export function AccountCard({ account }: Props) {
  const navigate = useNavigate();

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 3,
        transition: 'box-shadow 0.2s, border-color 0.2s',
        '&:hover': { boxShadow: 4, borderColor: 'primary.main' },
      }}
    >
      <CardActionArea onClick={() => navigate(`/accounts/${account.id}/settings`)}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar sx={{ bgcolor: getAvatarColor(account.name), width: 44, height: 44 }}>
              <BusinessIcon />
            </Avatar>
            <Box flex={1}>
              <Typography variant="subtitle1" fontWeight={600}>
                {account.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                ID: {account.id}
              </Typography>
            </Box>
            <ChevronRightIcon color="action" />
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
