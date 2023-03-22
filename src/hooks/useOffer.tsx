import { useEffect, useState } from 'react';
import { Contract } from 'web3-eth-contract';
import { EventData } from 'web3-eth-contract';

import { web3 } from '@/pages/_app';
import { EventSubscription } from '@/utils';

import abi from '../../constants/offer/abi.json';
import { useMetamask } from './useMetamask';

interface IUseOfferProps {
  address: string;
  eventCallback?: (error: unknown, event: EventData) => void;
}

export default function useOffer({ address, eventCallback }: IUseOfferProps) {
  const {
    state: { wallet, chainId },
  } = useMetamask();

  const [offer, setOffer] = useState<Contract>();
  const [subscription, setSubscription] = useState<EventSubscription>();
  useEffect(() => {
    if (!chainId || !wallet) {
      return;
    }
    //eslint-disable-next-line
    //@ts-ignore
    const offer = new web3.eth.Contract(abi, address, {
      from: wallet,
    });
    setOffer(offer);
    if (eventCallback) {
      setSubscription(new EventSubscription(offer, eventCallback));
    }
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [chainId, wallet, address]);

  return { offer };
}
