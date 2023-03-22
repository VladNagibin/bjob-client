import { LinearProgress, Typography } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';

import ContractList from '@/components/contract/ContractList';
import useFactory from '@/hooks/useFactory';
import { useMetamask } from '@/hooks/useMetamask';
import { EJobOfferType } from '@/types';

export default function Employee() {
  const {
    state: { wallet, chainId },
  } = useMetamask();
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
    const { offers } = await factory.methods.getEmployeeData().call();
    setOffers(offers);
    setLoading(false);
  }, [factory]);
  useEffect(() => {
    fetch();
  }, [wallet, chainId, fetch]);
  return (
    <div>
      <Typography variant="h5">Employee</Typography>
      {loading ? <LinearProgress /> : <ContractList contracts={offers} />}
    </div>
  );
}
