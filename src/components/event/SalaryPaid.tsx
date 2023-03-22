import { SxProps, Theme, Typography } from '@mui/material';
import moment from 'moment';
import React from 'react';
import { EventData } from 'web3-eth-contract';

import { formatEther } from '@/utils';

interface IEventProps {
  event: EventData;
  currencySymbol: string;
  sx?: SxProps<Theme>;
}

export default function SalaryPaid({ event, sx, currencySymbol }: IEventProps) {
  return (
    <Typography sx={sx}>
      {event.event}
      <br />
      {formatEther(event.returnValues.ethAmount).toString()} {currencySymbol}
      <br />
      {moment(
        new Date(Number(event.returnValues.timestamp + '000'))
      ).calendar()}
    </Typography>
  );
}
