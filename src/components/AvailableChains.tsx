import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import React from 'react';

import { useMetamask } from '@/hooks/useMetamask';
import { chains, devChains } from '@/types';

import contractAddresses from '../../constants/contractAddresses.json';

export default function AvailableChains() {
  const {
    state: { chainId },
    dispatch,
  } = useMetamask();

  if (!chainId) {
    return <div style={{ width: '220px' }} />;
  }
  return (
    <Box sx={{ width: 200, mr: '20px', mt: '30px' }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Network</InputLabel>
        <Select<number>
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="Network"
          value={parseInt(chainId)}
          onChange={event =>
            dispatch({
              type: 'switch',
              chainId: Number(event.target.value),
            })
          }
        >
          {[...Object.keys(contractAddresses)].map((key: string) => (
            <MenuItem key={key} value={parseInt(key)}>
              {chains[parseInt(key)].chainName}
            </MenuItem>
          ))}
          {!Object.keys(contractAddresses).includes(
            parseInt(chainId).toString()
          ) ? (
            <MenuItem key={chainId} value={parseInt(chainId)}>
              Not available chain
            </MenuItem>
          ) : (
            []
          )}
        </Select>
        {devChains.includes(parseInt(chainId)) ? (
          <Typography>
            This is a TEST net. <br /> All funds are NOT real.
          </Typography>
        ) : (
          <></>
        )}
      </FormControl>
    </Box>
  );
}
