import {
  Backdrop,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Slider,
  TextField,
  Typography,
} from '@mui/material';
import Router from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import AddressInput from '@/components/validation/AddressInput';
import useFactory from '@/hooks/useFactory';
import { useMetamask } from '@/hooks/useMetamask';
import styles from '@/styles/create.module.scss';
import { chains, ECurrency, EJobOfferType } from '@/types';
import { formatEther, parseEther } from '@/utils';
import { errorParser } from '@/utils/errorParser';

import { web3 } from '../_app';

interface IContract {
  contractType: EJobOfferType;
  paymentAmount: string;
  employeeAddress: string;
  paymentRate: number;
  currency: ECurrency;
  keeperCompatible: boolean;
}

export default function Add() {
  const { factory, address } = useFactory();
  const {
    state: { chainId },
  } = useMetamask();

  const [contract, setContract] = useState<IContract>({
    contractType: EJobOfferType.SALARY,
    currency: ECurrency.USD,
    employeeAddress: '',
    paymentAmount: '',
    paymentRate: 7,
    keeperCompatible: false,
  });
  const [balance, setBalance] = useState<string>('0');
  const [requiredAmount, setRequiredAmount] = useState<string>('0');
  const [notEnoughFunded, setNotEnoughFunded] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleContract = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;
    if (name === 'paymentAmount') {
      value = value.replace(/[^\d.]/g, '');
    }
    setContract(prev => ({ ...prev, [name]: value }));
  };
  const handleRate = (event: Event, value: number | number[]) => {
    value = Array.isArray(value) ? value[0] : value;
    setContract(prev => ({ ...prev, paymentRate: value as number }));
  };

  const handleCurrency = (e: SelectChangeEvent<ECurrency>) => {
    setContract(prev => ({ ...prev, currency: e.target.value as ECurrency }));
  };

  const handleType = (e: SelectChangeEvent<EJobOfferType>) => {
    setContract(prev => ({
      ...prev,
      contractType: e.target.value as EJobOfferType,
    }));
  };

  const getBalance = useCallback(async () => {
    if (!factory) {
      return;
    }
    const { balance } = await factory.methods.getEmployerData().call();
    setBalance(balance);
  }, [factory]);

  const countRequiredAmount = useCallback(async () => {
    if (!factory || isNaN(parseFloat(contract.paymentAmount))) {
      return;
    }
    const amount = await web3.eth.call({
      to: address,
      data: factory.methods
        .countRequiredFund(
          parseEther(contract.paymentAmount).toString(),
          contract.currency,
          contract.contractType,
          contract.keeperCompatible
        )
        .encodeABI(),
    });

    if (formatEther(amount).isGreaterThan(formatEther(balance))) {
      setNotEnoughFunded(true);
    } else {
      setNotEnoughFunded(false);
    }
    setRequiredAmount(formatEther(amount).toString());
  }, [
    contract.paymentAmount,
    contract.currency,
    contract.keeperCompatible,
    contract.contractType,
    factory,
    address,
    balance,
  ]);

  const createJobOffer = async () => {
    if (
      !factory ||
      isNaN(parseFloat(contract.paymentAmount)) ||
      notEnoughFunded
    ) {
      return;
    }
    toast.info('Contract is creating');
    setLoading(true);
    try {
      await factory.methods
        .createJobOffer(
          contract.contractType,
          parseEther(contract.paymentAmount).toString(),
          contract.employeeAddress,
          contract.paymentRate * 24 * 60 * 60,
          contract.currency,
          contract.keeperCompatible
        )
        .send();
      toast.success('Contract created');
      Router.push('/employer');
    } catch ({ message }) {
      toast.error(errorParser(message as string));
    }
    setLoading(false);
  };

  useEffect(() => {
    countRequiredAmount();
  }, [
    contract.paymentAmount,
    contract.currency,
    contract.keeperCompatible,
    contract.contractType,
    factory,
    countRequiredAmount,
  ]);

  useEffect(() => {
    getBalance();
  }, [factory, getBalance]);

  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div className={styles.headings}>
        <Typography variant="h4">New contract</Typography>
        <Typography gutterBottom>
          Required amount funded: {requiredAmount}{' '}
          {chainId ? chains[parseInt(chainId)].nativeCurrency.symbol : ''}
        </Typography>
        <Typography gutterBottom>
          Balance: {formatEther(balance).toString()}{' '}
          {chainId ? chains[parseInt(chainId)].nativeCurrency.symbol : ''}
        </Typography>
        {notEnoughFunded && (
          <Typography color={'red'}>
            Not enough{' '}
            {chainId ? chains[parseInt(chainId)].nativeCurrency.symbol : ''}{' '}
            funded
          </Typography>
        )}
      </div>
      <div className={styles.create}>
        <TextField
          id="amount"
          variant="outlined"
          name="paymentAmount"
          onChange={handleContract}
          value={contract.paymentAmount}
          sx={{ minWidth: '50%', m: '10px' }}
          required
          label="Amount"
        />
        <AddressInput
          sx={{ minWidth: '50%', m: '10px' }}
          value={contract.employeeAddress}
          setValue={handleContract}
        />
        <div className={styles.selects}>
          <div className={styles.select}>
            <InputLabel id="currencyLabel">Currency</InputLabel>
            <Select
              labelId="currencyLabel"
              value={contract.currency}
              onChange={handleCurrency}
            >
              <MenuItem value={ECurrency.ETH}>
                {chainId ? chains[parseInt(chainId)].nativeCurrency.symbol : ''}
              </MenuItem>
              <MenuItem value={ECurrency.EUR}>EUR</MenuItem>
              <MenuItem value={ECurrency.USD}>USD</MenuItem>
            </Select>
          </div>
          <div className={styles.select}>
            <InputLabel id="typeLabel">Contract type</InputLabel>
            <Select
              labelId="typeLabel"
              value={contract.contractType}
              onChange={handleType}
            >
              <MenuItem value={EJobOfferType.SALARY}>SALARY</MenuItem>
              <MenuItem value={EJobOfferType.HOURLY}>HOURLY</MenuItem>
            </Select>
          </div>
          <FormControlLabel
            control={
              <Checkbox
                checked={contract.keeperCompatible}
                onChange={e =>
                  setContract(prev => ({
                    ...prev,
                    keeperCompatible: e.target.checked,
                  }))
                }
              />
            }
            label="keeper compatible"
          />
        </div>
        <Typography id="paymentRateLabel" gutterBottom>
          Payment rate (days)
        </Typography>
        <Slider
          aria-labelledby="paymentRateLabel"
          value={contract.paymentRate}
          onChange={handleRate}
          valueLabelDisplay="auto"
          style={{ width: '50%', margin: '0 20px 40px' }}
          min={7}
          max={31}
        />
        <Button variant="contained" onClick={createJobOffer}>
          Create job offer
        </Button>
      </div>
    </>
  );
}
