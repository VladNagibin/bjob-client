import { useEffect, useState } from 'react';
import { Contract } from 'web3-eth-contract';

import { web3 } from '@/pages/_app';

import contractAddresses from '../../constants/contractAddresses.json';
import abi from '../../constants/factory/abi.json';
import { useMetamask } from './useMetamask';

export default function useFactory() {
  const {
    state: { wallet, chainId },
  } = useMetamask();

  const [factory, setFactory] = useState<Contract>();
  const [address, setAddress] = useState<string>();
  useEffect(() => {
    if (!chainId || !wallet) {
      return;
    }
    const address = (contractAddresses as Record<string, string[]>)[
      parseInt(chainId)
    ]?.[0];
    if (!address) {
      return;
    }
    //eslint-disable-next-line
    //@ts-ignore
    const factory = new web3.eth.Contract(abi, address, {
      from: wallet,
    });
    factory.handleRevert = true;
    setFactory(factory);
    setAddress(address);
  }, [chainId, wallet]);

  return { factory, address };
}
