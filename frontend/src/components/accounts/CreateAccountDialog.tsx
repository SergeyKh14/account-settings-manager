import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createAccountSchema, type CreateAccountValues } from '../../schemas';

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (values: CreateAccountValues) => void;
  isLoading: boolean;
}

export function CreateAccountDialog({ open, onClose, onCreate, isLoading }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateAccountValues>({
    resolver: zodResolver(createAccountSchema),
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Create New Account</DialogTitle>
      <DialogContent>
        <TextField
          {...register('name')}
          label="Account Name"
          fullWidth
          autoFocus
          margin="normal"
          error={Boolean(errors.name)}
          helperText={errors.name?.message}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit(onCreate)}
          loading={isLoading}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
