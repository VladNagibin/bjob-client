import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import { Typography } from '@mui/material';
import React from 'react';

export default function NoContractFound() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        padding: '40px',
      }}
    >
      <Typography variant="h3">We didn&apos;t find this contract</Typography>
      <SentimentDissatisfiedIcon sx={{ fontSize: '128px', padding: '40px' }} />
    </div>
  );
}
