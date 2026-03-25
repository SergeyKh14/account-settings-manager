import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import type { SettingDefinition } from '../../types';

interface Props {
  definition: SettingDefinition;
}

/**
 * Renders the correct input control for any setting type.
 * The `type` field on `SettingDefinition` drives which control is shown.
 * Adding a new `SettingType` only requires handling it here once.
 */
export function SettingField({ definition }: Props) {
  const { control, formState } = useFormContext();
  const { key, label, description, type, options } = definition;
  const error = formState.errors[key];
  const errorMessage = error?.message as string | undefined;

  return (
    <Box>
      {type === 'boolean' && (
        <Controller
          name={key}
          control={control}
          render={({ field }) => (
            <FormControlLabel
              label={
                <Box>
                  <Typography variant="body1" fontWeight={500}>
                    {label}
                  </Typography>
                  {description && (
                    <Typography variant="body2" color="text.secondary">
                      {description}
                    </Typography>
                  )}
                </Box>
              }
              control={
                <Switch
                  checked={Boolean(field.value)}
                  onChange={(e) => field.onChange(e.target.checked)}
                  
                />
              }
              labelPlacement="start"
              sx={{ ml: 0, mr: 0, justifyContent: 'space-between', width: '100%' }}
            />
          )}
        />
      )}

      {type === 'text' && (
        <Controller
          name={key}
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label={label}
              helperText={errorMessage ?? description}
              error={Boolean(error)}
              fullWidth
              
              value={field.value ?? ''}
            />
          )}
        />
      )}

      {type === 'number' && (
        <Controller
          name={key}
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label={label}
              helperText={errorMessage ?? description}
              error={Boolean(error)}
              fullWidth
              type="number"
              
              value={field.value ?? 0}
              onChange={(e) => field.onChange(Number(e.target.value))}
            />
          )}
        />
      )}

      {type === 'select' && (
        <Controller
          name={key}
          control={control}
          render={({ field }) => (
            <FormControl fullWidth error={Boolean(error)} >
              <InputLabel>{label}</InputLabel>
              <Select {...field} label={label} value={field.value ?? ''}>
                {options?.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
              {(errorMessage ?? description) && (
                <FormHelperText>{errorMessage ?? description}</FormHelperText>
              )}
            </FormControl>
          )}
        />
      )}

      {type === 'multiselect' && (
        <Controller
          name={key}
          control={control}
          render={({ field }) => {
            const selected: string[] = Array.isArray(field.value) ? field.value : [];
            const toggle = (value: string) => {
              const next = selected.includes(value)
                ? selected.filter((v) => v !== value)
                : [...selected, value];
              field.onChange(next);
            };

            return (
              <FormControl component="fieldset" error={Boolean(error)} >
                <Typography variant="body1" fontWeight={500} gutterBottom>
                  {label}
                </Typography>
                {description && (
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {description}
                  </Typography>
                )}
                <FormGroup row>
                  {options?.map((opt) => (
                    <FormControlLabel
                      key={opt.value}
                      label={opt.label}
                      control={
                        <Checkbox
                          checked={selected.includes(opt.value)}
                          onChange={() => toggle(opt.value)}
                        />
                      }
                    />
                  ))}
                </FormGroup>
                {errorMessage && <FormHelperText>{errorMessage}</FormHelperText>}
              </FormControl>
            );
          }}
        />
      )}
    </Box>
  );
}
