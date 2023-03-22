import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import { Typography } from '@mui/material';
import React from 'react';

export default function NoEvents() {
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
      <Typography variant="h5">You don&apos;t have any events yet</Typography>
      <SentimentDissatisfiedIcon sx={{ fontSize: '128px', padding: '40px' }} />
    </div>
  );
}
