import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {
  Backdrop,
  Button,
  CircularProgress,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import moment from 'moment';
import Router from 'next/router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { useClipboard } from 'use-clipboard-copy';
import { EventData } from 'web3-eth-contract';

import { useMetamask } from '@/hooks/useMetamask';
import useOffer from '@/hooks/useOffer';
import { web3 } from '@/pages/_app';
import {
  chains,
  ECurrency,
  EJobOfferState,
  EJobOfferType,
  factoryDeployBlockNumber,
} from '@/types';
import { errorParser, formatEther, parseEther, sliceAddress } from '@/utils';

import Event from '../event/Event';
import NoEvents from '../event/NoEvents';
import styles from '../styles/contract.module.scss';

interface IContractElementProps {
  address: string;
}

interface IContractState {
  paymentAmount: string;
  state: string;
  offerType: string;
  currency: string;
  employee: string;
  employer: string;
  events: EventData[];
  balance: string;
  workedHours: string;
  lastPaymentTimestamp: number;
  paymentRate: number;
}

export default function Contract({ address }: IContractElementProps) {
  const { offer } = useOffer({
    address,
    eventCallback: () => updateOfferData(),
  });
  const {
    state: { wallet, chainId },
  } = useMetamask();

  const [addedWorkedHours, setAddedWorkedHours] = useState<string>();
  const [fundAmount, setFundAmount] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [
    {
      balance,
      state,
      paymentAmount,
      offerType,
      currency,
      employee,
      employer,
      events,
      workedHours,
      lastPaymentTimestamp,
      paymentRate,
    },
    setContract,
  ] = useState<IContractState>({
    balance: '0',
    state: 'UNSIGNED',
    currency: 'ETH',
    employee: '',
    employer: '',
    events: [],
    lastPaymentTimestamp: 0,
    offerType: 'SALARY',
    paymentAmount: '0',
    workedHours: '0',
    paymentRate: 0,
  });
  const clipboard = useClipboard();

  const handleAddedWorkedHours = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let { value } = event.target;
    value = value.replace(/[^\d]/g, '');
    setAddedWorkedHours(value);
  };

  const handleFundAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
    let { value } = event.target;
    value = value.replace(/[^\d.]/g, '');
    setFundAmount(value);
  };

  const updateOfferData = useCallback(async () => {
    if (!offer || !chainId) {
      return;
    }
    setLoading(true);
    try {
      const [
        paymentAmount,
        state,
        currency,
        employee,
        employer,
        events,
        balance,
        lastPaymentTimestamp,
        paymentRate,
        offerType,
        workedHours,
      ] = await Promise.all([
        offer.methods.getPaymentAmount().call(),
        offer.methods.getState().call(),
        offer.methods.getCurrency().call(),
        offer.methods.getEmployeeAddress().call(),
        offer.methods.getEmployerAddress().call(),
        offer.getPastEvents('allEvents', {
          fromBlock: factoryDeployBlockNumber[parseInt(chainId)] || 0,
          toBlock: 'latest',
        }),
        web3.eth.getBalance(address),
        offer.methods.getLastPaymentTimestamp().call(),
        offer.methods.getPaymentRate().call(),
        offer.methods.getOfferType().call(),
        offer.methods.getWorkedHours().call(),
      ]);
      if (
        wallet?.toLowerCase() !== employee.toLowerCase() &&
        wallet?.toLowerCase() !== employer.toLowerCase()
      ) {
        toast.error('You cannot access this contract');
        Router.push('/');
      }
      setContract({
        balance: formatEther(balance).toString(),
        paymentAmount: formatEther(paymentAmount).toString(),
        currency: ECurrency[currency],
        employee,
        employer,
        events,
        lastPaymentTimestamp: lastPaymentTimestamp * 1000,
        offerType: EJobOfferType[offerType],
        paymentRate: paymentRate * 1000,
        state: EJobOfferState[state],
        workedHours,
      });
    } catch (e) {
      toast.error('Invalid contract address');
      console.log(e);
      Router.push('/');
    }
    setLoading(false);
  }, [offer, address, chainId, wallet]);

  const isEmployee = useMemo(
    () => employee?.toLowerCase() === wallet?.toLowerCase(),
    [employee, wallet]
  );

  const confirmationHandler = () => {
    toast.success('transaction successful');
    updateOfferData();
  };

  const blockchainMethodWrapper = async (action: () => Promise<void>) => {
    setLoading(true);
    try {
      await action();
      confirmationHandler();
    } catch ({ message }) {
      toast.error(errorParser(message as string));
    }
    setLoading(false);
  };

  const signContract = async () => {
    if (!offer) {
      return;
    }
    await blockchainMethodWrapper(offer.methods.sign().send);
  };

  const pay = async () => {
    if (!offer) {
      return;
    }
    await blockchainMethodWrapper(offer.methods.payMonthly().send);
  };

  const fund = async () => {
    if (!offer || !fundAmount || isNaN(parseInt(fundAmount))) {
      return;
    }
    setFundAmount('');
    await blockchainMethodWrapper(async () => {
      await web3.eth.sendTransaction({
        from: wallet,
        to: address,
        value: parseEther(fundAmount).toString(),
      });
    });
  };

  const close = async () => {
    if (!offer) {
      return;
    }
    await blockchainMethodWrapper(offer.methods.close().send);
  };

  const withdraw = async () => {
    if (!offer) {
      return;
    }
    await blockchainMethodWrapper(offer.methods.withdraw().send);
  };

  const addWorkedHours = async () => {
    if (!offer) {
      return;
    }
    setAddedWorkedHours('');
    await blockchainMethodWrapper(
      offer.methods.setWorkedHours(addedWorkedHours).send
    );
  };
  const payWorkedHours = async () => {
    if (!offer) {
      return;
    }
    await blockchainMethodWrapper(offer.methods.payWorkedHours().send);
  };
  useEffect(() => {
    updateOfferData();
  }, [offer, updateOfferData]);
  return (
    <div className={styles.contract}>
      <div className={styles.main}>
        <Backdrop
          sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }}
          open={loading || !chainId}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <div>
          <Typography variant="h6">
            {offerType} Contract {sliceAddress(address)}
            <IconButton
              onClick={() => {
                clipboard.copy(address);
                toast.success('Copied!');
              }}
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Typography>
          <Typography>{state}</Typography>
          <Typography>
            Balance: {balance}{' '}
            {chainId ? chains[parseInt(chainId)].nativeCurrency.symbol : ''}
          </Typography>
          <Typography>
            Payment amount: {paymentAmount}{' '}
            {currency === 'ETH'
              ? chainId
                ? chains[parseInt(chainId)].nativeCurrency.symbol
                : ''
              : currency}
          </Typography>
          {offerType === 'HOURLY' ? (
            <Typography>{workedHours} non paid hours</Typography>
          ) : (
            <></>
          )}
          {lastPaymentTimestamp > 0 ? (
            <>
              <Typography>
                Last payment:{' '}
                {moment(new Date(lastPaymentTimestamp)).calendar()}
              </Typography>
              <Typography>
                Next payment available:{' '}
                {moment(
                  new Date(lastPaymentTimestamp + paymentRate)
                ).calendar()}
              </Typography>
            </>
          ) : (
            <></>
          )}
          <Typography className={styles.employee}>
            {isEmployee ? (
              <>Employer : {sliceAddress(employer)} </>
            ) : (
              <>Employee : {sliceAddress(employee)} </>
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
          {isEmployee && state == 'UNSIGNED' ? (
            <Button
              variant="contained"
              onClick={signContract}
              disabled={loading}
            >
              Sign
            </Button>
          ) : (
            <></>
          )}

          {isEmployee || state !== 'ACTIVE' ? (
            <></>
          ) : (
            <Button
              variant="contained"
              onClick={pay}
              disabled={
                lastPaymentTimestamp + paymentRate > Date.now() || loading
              }
            >
              Pay
            </Button>
          )}
          {state !== 'CLOSED' ? (
            <Button variant="contained" onClick={close} disabled={loading}>
              Close
            </Button>
          ) : (
            <></>
          )}
          {!isEmployee &&
          state === 'CLOSED' &&
          (offerType !== 'HOURLY' || workedHours === '0') ? (
            <Button variant="contained" onClick={withdraw} disabled={loading}>
              Withdraw
            </Button>
          ) : (
            <></>
          )}
          {isEmployee && state === 'ACTIVE' && offerType == 'HOURLY' ? (
            <>
              <TextField
                id="amount"
                variant="outlined"
                name="Worked hours"
                onChange={handleAddedWorkedHours}
                value={addedWorkedHours}
                sx={{ minWidth: '50%', m: '10px' }}
                required
                label="Worked hours"
              />
              <Button
                variant="contained"
                onClick={addWorkedHours}
                disabled={loading}
              >
                Add worked hours
              </Button>
            </>
          ) : (
            <></>
          )}
          {isEmployee &&
          ['ACTIVE', 'CLOSED'].includes(state) &&
          workedHours !== '0' &&
          offerType == 'HOURLY' ? (
            <Button
              variant="contained"
              onClick={payWorkedHours}
              disabled={
                lastPaymentTimestamp + paymentRate > Date.now() || loading
              }
            >
              Pay worked hours
            </Button>
          ) : (
            <></>
          )}
          {!isEmployee && ['ACTIVE', 'CLOSED'].includes(state) ? (
            <>
              <TextField
                id="amount"
                variant="outlined"
                name="Fund amount"
                onChange={handleFundAmount}
                value={fundAmount}
                sx={{ minWidth: '50%', m: '10px' }}
                required
                label="Fund amount"
              />
              <Button variant="contained" onClick={fund} disabled={loading}>
                Fund
              </Button>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
      <div className={styles.events}>
        {events.length ? (
          <>
            <Typography variant="h6">Events</Typography>
            {events
              .sort((a, b) => b.blockNumber - a.blockNumber)
              .map(event => (
                <Event
                  key={
                    event.blockNumber + event.logIndex + event.transactionIndex
                  }
                  event={event}
                  currencySymbol={
                    chainId
                      ? chains[parseInt(chainId)].nativeCurrency.symbol
                      : ''
                  }
                />
              ))}
          </>
        ) : (
          <NoEvents />
        )}
      </div>
    </div>
  );
}
