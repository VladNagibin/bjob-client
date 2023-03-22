import { SxProps, Theme, Typography } from '@mui/material';
import moment from 'moment';
import React from 'react';
import { EventData } from 'web3-eth-contract';

interface IEventProps {
  event: EventData;
  sx?: SxProps<Theme>;
}

export default function ContractSigned({ event, sx }: IEventProps) {
  return (
    <Typography sx={sx} color={'green'}>
      {event.event}
      <br />
      {moment(
        new Date(Number(event.returnValues.timestamp + '000'))
      ).calendar()}
    </Typography>
  );
}
