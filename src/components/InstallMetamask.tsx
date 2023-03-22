import { Button, Typography } from '@mui/material';
import React from 'react';

export default function InstallMetamask() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Typography variant="h4" sx={{ m: '40px' }}>
        You need to install metamask to run this app
      </Typography>
      <Button variant="contained" href="https://metamask.io/" target="_blank">
        <Typography> Install metamask</Typography>
      </Button>
    </div>
  );
}
