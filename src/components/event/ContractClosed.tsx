import { SxProps, Theme, Typography } from '@mui/material';
import moment from 'moment';
import React from 'react';
import { EventData } from 'web3-eth-contract';

import { useMetamask } from '@/hooks/useMetamask';
import { sliceAddress } from '@/utils';

interface IEventProps {
  event: EventData;
  sx?: SxProps<Theme>;
}

export default function ContractClosed({ event, sx }: IEventProps) {
  const {
    state: { wallet },
  } = useMetamask();
  return (
    <Typography sx={sx} color={'gray'}>
      {event.event}
      <br />
      Closed by {sliceAddress(event.returnValues.closedBy)}
      {wallet?.toLowerCase() == event.returnValues.closedBy.toLowerCase()
        ? '(employer)'
        : '(employee)'}
      <br />
      {moment(
        new Date(Number(event.returnValues.timestamp + '000'))
      ).calendar()}
    </Typography>
  );
}
