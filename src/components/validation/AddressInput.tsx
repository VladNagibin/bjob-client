import { SxProps, TextField, Theme } from '@mui/material';
import React, { useState } from 'react';

interface IAddressInputProps {
  value: string;
  sx?: SxProps<Theme>;
  setValue: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function AddressInput({
  value,
  setValue,
  sx,
}: IAddressInputProps) {
  const [error, setError] = useState<string | undefined>();

  const handleValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value.match(/^[0][x]+[\w]+$/gim)) {
      setError('Address not valid');
    } else if (e.target.value.length !== 42) {
      setError('Address should be 42 symbols');
    } else {
      setError(undefined);
    }
    setValue(e);
  };
  return (
    <TextField
      sx={sx}
      error={!!error}
      helperText={error}
      id="address"
      variant="outlined"
      name="employeeAddress"
      onChange={handleValue}
      value={value}
      required
      label="Employee address"
    />
  );
}
