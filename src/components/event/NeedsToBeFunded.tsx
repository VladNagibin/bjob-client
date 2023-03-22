import { SxProps, Theme, Typography } from '@mui/material';
import React from 'react';
import { EventData } from 'web3-eth-contract';

import { formatEther } from '@/utils';

interface IEventProps {
  event: EventData;
  currencySymbol: string;
  sx?: SxProps<Theme>;
}

export default function NeedsToBeFunded({
  event,
  currencySymbol,
  sx,
}: IEventProps) {
  return (
    <Typography sx={sx} color={'red'}>
      {event.event}
      <br />
      on {formatEther(event.returnValues.ethAmount).toString()} {currencySymbol}
    </Typography>
  );
}
