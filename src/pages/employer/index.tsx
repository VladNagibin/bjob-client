import { Button, LinearProgress, Typography } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';

import ContractList from '@/components/contract/ContractList';
import Fund from '@/components/Fund';
import useFactory from '@/hooks/useFactory';
import { useMetamask } from '@/hooks/useMetamask';
import { chains, EJobOfferType } from '@/types';
import { formatEther } from '@/utils';

export default function Employer() {
  const {
    state: { wallet, chainId },
  } = useMetamask();
  const [balance, setBalance] = useState<string>('0');
  const [offers, setOffers] = useState<
    Array<{ offerAddress: string; offerType: keyof typeof EJobOfferType }>
  >([]);
  const [loading, setLoading] = useState(false);

  const { factory } = useFactory();
  const fetch = useCallback(async () => {
    if (!factory) {
      return;
    }
    setLoading(true);
    const { balance, offers } = await factory.methods.getEmployerData().call();
    setBalance(balance);
    setOffers(offers);
    setLoading(false);
  }, [factory]);
  useEffect(() => {
    fetch();
  }, [wallet, chainId, fetch]);
  return (
    <div>
      <Typography variant="h6">
        Your balance: {formatEther(balance).toString()}{' '}
        {chainId ? chains[parseInt(chainId)].nativeCurrency.symbol : ''}
      </Typography>
      <Fund updateCallback={fetch} />
      <Button
        variant="contained"
        href={'/employer/create'}
        sx={{ m: '10px' }}
        size="large"
        disabled={balance === '0'}
      >
        create
      </Button>
      {loading ? <LinearProgress /> : <ContractList contracts={offers} />}
    </div>
  );
}
