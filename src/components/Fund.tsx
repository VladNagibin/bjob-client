import {
  Backdrop,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

import useFactory from '@/hooks/useFactory';
import { useMetamask } from '@/hooks/useMetamask';
import { chains } from '@/types';
import { parseEther } from '@/utils';
import { errorParser } from '@/utils/errorParser';

interface IFundProps {
  updateCallback?: () => void;
}

export default function Fund({ updateCallback }: IFundProps) {
  const [amount, setAmount] = useState<string>('0');
  const [loading, setLoading] = useState<boolean>(false);
  const {
    state: { chainId },
  } = useMetamask();
  const { factory } = useFactory();

  const handleAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { value } = e.target;
    value = value.replace(/[^\d.]/g, '');
    setAmount(value);
  };

  const fund = async () => {
    if (!factory || !chainId) {
      return;
    }
    setLoading(true);
    try {
      await factory.methods.fund().send({ value: parseEther(amount) });
      toast.success(
        `Contract was funded on ${amount} ${
          chains[parseInt(chainId)].nativeCurrency.symbol
        }`
      );
      if (updateCallback) {
        updateCallback();
      }
    } catch ({ message }) {
      toast.error(errorParser(message as string));
    }
    setLoading(false);
    setAmount('');
  };
  const withdraw = async () => {
    if (!factory) {
      return;
    }
    setLoading(true);
    try {
      await factory.methods.withdraw().send();
      toast.success('Withdraw successful');
      if (updateCallback) {
        updateCallback();
      }
    } catch ({ message }) {
      toast.error(errorParser(message as string));
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '10px' }}>
      <Backdrop
        sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }}
        open={!chainId}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <TextField value={amount} onChange={handleAmount} />
      <Button
        variant="contained"
        onClick={fund}
        disabled={loading}
        size="large"
        sx={{ ml: '10px' }}
      >
        Fund
      </Button>
      <Typography>
        You can withdraw only if all your contracts closed
      </Typography>
      <Button
        variant="contained"
        onClick={withdraw}
        size="large"
        disabled={loading}
      >
        Withdraw
      </Button>
    </div>
  );
}
