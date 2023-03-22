import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Button, IconButton, Typography } from '@mui/material';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { useClipboard } from 'use-clipboard-copy';

import { useMetamask } from '@/hooks/useMetamask';
import useOffer from '@/hooks/useOffer';
import { chains, ECurrency, EJobOfferState, EJobOfferType } from '@/types';
import { formatEther, sliceAddress } from '@/utils';

import styles from '../styles/contract-element.module.scss';

export interface IContractElementProps {
  address: string;
  offerType: keyof typeof EJobOfferType;
}

export default function ContractElement({
  address,
  offerType,
}: IContractElementProps) {
  const { offer } = useOffer({
    address,
    eventCallback: () => updateOfferData(),
  });
  const {
    state: { wallet, chainId },
  } = useMetamask();
  const [paymentAmount, setPaymentAmount] = useState<string>('0');
  const [state, setState] = useState<EJobOfferState>();
  const [currency, setCurrency] = useState<string>();
  const [employee, setEmployee] = useState<string>();
  const [employer, setEmployer] = useState<string>();

  const isEmployee = useMemo(
    () => employee?.toLowerCase() === wallet?.toLowerCase(),
    [employee, wallet]
  );

  const clipboard = useClipboard();

  const updateOfferData = useCallback(async () => {
    if (!offer) {
      return;
    }

    const [amount, state, currency, employee, employer] = await Promise.all([
      offer.methods.getPaymentAmount().call(),
      offer.methods.getState().call(),
      offer.methods.getCurrency().call(),
      offer.methods.getEmployeeAddress().call(),
      offer.methods.getEmployerAddress().call(),
    ]);

    setPaymentAmount(formatEther(amount).toString());
    setState(EJobOfferState[state as keyof typeof EJobOfferState]);
    setCurrency(ECurrency[currency]);
    setEmployee(employee);
    setEmployer(employer);
  }, [offer]);

  useEffect(() => {
    updateOfferData();
  }, [offer, updateOfferData]);
  return (
    <div className={styles.contractElement}>
      <div>
        <Typography variant="h6">
          {EJobOfferType[offerType]} Contract
        </Typography>
        <Typography>{state}</Typography>
        <Typography>
          {paymentAmount}{' '}
          {currency === 'ETH'
            ? chainId
              ? chains[parseInt(chainId)].nativeCurrency.symbol
              : ''
            : currency}
        </Typography>
        <Typography className={styles.employee}>
          {isEmployee ? (
            <>Employer : {employer ? sliceAddress(employer) : ''} </>
          ) : (
            <>Employee : {employee ? sliceAddress(employee) : ''} </>
          )}
          <IconButton
            onClick={() => {
              clipboard.copy(isEmployee ? employer : employee);
              toast.success('Copied!');
            }}
          >
            <ContentCopyIcon fontSize="small" />
          </IconButton>
        </Typography>
      </div>
      <div className={styles.buttonWrapper}>
        <Button variant="contained" href={`/contract/${address}`}>
          Open
        </Button>
      </div>
    </div>
  );
}
