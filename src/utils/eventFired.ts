import { toast } from 'react-toastify';
import { EventData } from 'web3-eth-contract';

import { EventType } from '@/types';
import { formatEther, sliceAddress } from '@/utils';

export const eventFired = (event: EventData, currencySymbol: string) => {
  switch (event.event) {
    case EventType.SALARY_PAID: {
      toast.success(
        `Paid ${formatEther(
          event.returnValues.ethAmount
        ).toString()} ${currencySymbol} in ${sliceAddress(
          event.address
        )} contract`
      );
      break;
    }
    case EventType.CONTRACT_SIGNED: {
      toast.success(`Contract ${sliceAddress(event.address)} was signed`);
      break;
    }
    case EventType.CONTRACT_NEEDS_TO_BE_FUNDED: {
      toast.warn(
        `Contract ${sliceAddress(
          event.address
        )} needs to be funded by ${formatEther(
          event.returnValues.ethAmount
        ).toString()} ${currencySymbol}`
      );
      break;
    }
    case EventType.CONTRACT_CLOSED: {
      toast.warn(
        `Contract ${sliceAddress(event.address)} was closed by ${sliceAddress(
          event.returnValues.closedBy
        )}`
      );
    }
  }
};
