import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Button, IconButton, Typography } from '@mui/material';
import { useMemo } from 'react';
import { toast } from 'react-toastify';
import { useClipboard } from 'use-clipboard-copy';

import InstallMetamask from '@/components/InstallMetamask';
import { Loading } from '@/components/Loading';
import { useMetamask } from '@/hooks/useMetamask';
import styles from '@/styles/main.module.scss';
import { sliceAddress } from '@/utils';

import contractAddresses from '../../constants/contractAddresses.json';

export default function Home() {
  const {
    dispatch,
    state: { status, isMetamaskInstalled, wallet, chainId },
  } = useMetamask();

  const clipboard = useClipboard();

  const showInstallMetamask =
    status !== 'pageNotLoaded' && !isMetamaskInstalled;
  const showConnectButton =
    status !== 'pageNotLoaded' && isMetamaskInstalled && !wallet;

  const handleConnect = async () => {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });

    if (accounts.length > 0) {
      dispatch({ type: 'connect', wallet: accounts[0], chainId });
    }
  };

  const factoryAddress = useMemo(
    () =>
      chainId
        ? (contractAddresses as Record<string, string[]>)[
            parseInt(chainId)
          ]?.[0]
        : '',
    [chainId]
  );

  return (
    <div className={styles.main}>
      {showConnectButton && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography variant="h4" sx={{ m: '40px' }}>
            Connect your wallet to continue
          </Typography>
          <Button variant="contained" component="a" onClick={handleConnect}>
            {status === 'loading' ? <Loading /> : 'Connect Wallet'}
          </Button>
        </div>
      )}

      {showInstallMetamask && <InstallMetamask />}
      {!showConnectButton && !showInstallMetamask && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {factoryAddress ? (
            <Typography variant="h5" sx={{ m: 'auto' }}>
              Factory address: {sliceAddress(factoryAddress)}
              <IconButton
                onClick={() => {
                  clipboard.copy(factoryAddress);
                  toast.success('Copied!');
                }}
              >
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Typography>
          ) : (
            <></>
          )}
          <div>
            <Button sx={{ m: '40px' }} variant="contained" href={'/employee'}>
              <Typography> I am employee</Typography>
            </Button>
            <Button sx={{ m: '40px' }} variant="contained" href={'/employer'}>
              <Typography>I am employer</Typography>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
