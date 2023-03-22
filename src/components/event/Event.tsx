import { Typography } from '@mui/material';
import React from 'react';
import { EventData } from 'web3-eth-contract';

import { EventType } from '@/types';

import ContractClosed from './ContractClosed';
import ContractSigned from './ContractSigned';
import NeedsToBeFunded from './NeedsToBeFunded';
import SalaryPaid from './SalaryPaid';

interface IEventProps {
  event: EventData;
  currencySymbol: string;
}

const sx = {
  border: '2px solid blue',
  borderRadius: '20px',
  p: '10px',
  m: '10px 0',
  width: '300px',
};

export default function Event({ event, currencySymbol }: IEventProps) {
  switch (event.event) {
    case EventType.SALARY_PAID: {
      return (
        <SalaryPaid event={event} sx={sx} currencySymbol={currencySymbol} />
      );
    }
    case EventType.CONTRACT_SIGNED: {
      return <ContractSigned event={event} sx={sx} />;
    }
    case EventType.CONTRACT_NEEDS_TO_BE_FUNDED: {
      return (
        <NeedsToBeFunded
          event={event}
          sx={sx}
          currencySymbol={currencySymbol}
        />
      );
    }
    case EventType.CONTRACT_CLOSED: {
      return <ContractClosed event={event} sx={sx} />;
    }
    default: {
      return <Typography>{event.event}</Typography>;
    }
  }
}
